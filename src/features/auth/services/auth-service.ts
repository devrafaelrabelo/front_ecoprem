import { config } from "@/config"
import { checkBackendHealth, getBackendStatusMessage } from "../utils/backend-health"

// Tipos para autenticação
export interface User {
  id?: string
  username: string
  fullName?: string
  email?: string
  roles?: string[]
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
  backendStatus?: string
}
// Função auxiliar para analisar os dados do usuário
const parseUser = (data: any): User => {
  const userData = data.user || data
  return {
    id: userData.id || userData.userId,
    username: userData.username || userData.login,
    fullName: userData.fullName || userData.nome || userData.name,
    email: userData.email,
    roles: userData.roles || userData.authorities || [],
  }
}

// Função auxiliar para verificar se estamos em ambiente de cliente (browser)
const isClient = typeof window !== "undefined"

// Serviço de autenticação para backend Java Spring com cookies HttpOnly
export const authService = {
  /**
   * Verifica se o backend está online e acessível
   */
  checkBackendConnection: async (): Promise<{ isOnline: boolean; message: string }> => {
    const health = await checkBackendHealth()
    const message = await getBackendStatusMessage()

    return {
      isOnline: health.isOnline,
      message,
    }
  },

  /**
   * Realiza o login do usuário no backend Spring Boot.
   * O backend deve definir os cookies HttpOnly na resposta.
   */
  login: async (email: string, password: string, rememberMe = false): Promise<AuthResponse> => {
    try {
      console.log("🔐 Iniciando login para:", email)

      // Verificar conectividade primeiro
      const backendStatus = await authService.checkBackendConnection()
      if (!backendStatus.isOnline) {
        return {
          success: false,
          message: backendStatus.message,
          backendStatus: backendStatus.message,
        }
      }

      const response = await fetch(`${config.api.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
        credentials: "include", // Essencial para receber cookies HttpOnly
        signal: AbortSignal.timeout(10000),
      })

      console.log("📡 Status da resposta Spring:", response.status)

      if (response.ok) {
        let userData: any = {}
        try {
          const responseText = await response.text()
          if (responseText.trim()) {
            userData = JSON.parse(responseText)
          }
        } catch (parseError) {
          console.warn("⚠️ Resposta sem JSON, mas cookies podem ter sido definidos.")
        }

        // Aguardar processamento dos cookies HttpOnly pelo navegador
        await new Promise((resolve) => setTimeout(resolve, 500))

        const user: User = {
          id: userData.id || userData.userId,
          username: userData.username || userData.login || email.split("@")[0],
          fullName: userData.fullName || userData.nome || userData.name,
          email: userData.email || email,
          roles: userData.roles || userData.authorities || [],
        }

        return {
          success: true,
          user: user,
          backendStatus: "✅ Conectado",
        }
      }

      // Tratar erros
      let errorMessage = "Erro ao realizar login"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {
        switch (response.status) {
          case 401:
            errorMessage = "Email ou senha incorretos"
            break
          case 403:
            errorMessage = "Acesso negado"
            break
          default:
            errorMessage = `Erro HTTP ${response.status}`
        }
      }

      return {
        success: false,
        message: errorMessage,
        backendStatus: `⚠️ Erro ${response.status}`,
      }
    } catch (error: any) {
      console.error("❌ Erro na requisição de login:", error)

      if (error.name === "TimeoutError") {
        return {
          success: false,
          message: "Timeout: O servidor demorou muito para responder.",
        }
      }

      return {
        success: false,
        message: "Erro de conexão com o servidor.",
      }
    }
  },

  /**
   * Obtém o perfil do usuário atual validando os cookies HttpOnly com o backend.
   * Esta é a ÚNICA forma segura de verificar autenticação com cookies HttpOnly.
   */
  getCurrentUser: async (): Promise<User | null> => {
  if (!isClient) return null

  // 🔍 Verifica o cookie auth_status antes de chamar o backend
  const authStatusCookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith("auth_status="))
    ?.split("=")[1]

  if (authStatusCookie === "unauthenticated") {
    console.log("⛔ auth_status indica que usuário não está autenticado — ignorando chamada")
    return null
  }

  try {
    console.log("🔄 Verificando usuário atual com backend...")

    const response = await fetch(`${config.api.baseUrl}/api/auth/validate`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": navigator.userAgent,
      },
      credentials: "include",
      signal: AbortSignal.timeout(5000),
    })

    if (response.ok) {
      const data = await response.json()
      console.log("✅ Usuário validado com sucesso")
      return parseUser(data)
    }

    if (response.status === 401 || response.status === 400) {
      console.log("🔁 Token expirado. Tentando refresh...")

      const refreshResponse = await fetch(`${config.api.baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": navigator.userAgent,
        },
        credentials: "include",
        signal: AbortSignal.timeout(5000),
      })

      if (refreshResponse.ok) {
        console.log("✅ Refresh token aceito. Revalidando...")

        await new Promise((resolve) => setTimeout(resolve, 200))

        const retry = await fetch(`${config.api.baseUrl}/api/auth/me`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "include",
          signal: AbortSignal.timeout(5000),
        })

        if (retry.ok) {
          const data = await retry.json()
          console.log("✅ Revalidação após refresh bem-sucedida")

          if (window.location.pathname === "/login") {
            window.location.reload()
            return null
          }

          return parseUser(data)
        }
      }

      console.warn("🚫 Refresh falhou. Usuário não autenticado.")
      return null
    }

    console.warn("🚫 Validação falhou. Status:", response.status)
    return null
  } catch (error) {
    console.error("❌ Erro ao validar usuário:", error)
    return null
  }
},

  /**
   * Realiza o logout no backend Spring Boot.
   * O backend deve invalidar/remover os cookies HttpOnly.
   */
  logout: async (): Promise<void> => {
    if (!isClient) return

    console.log("🚪 Iniciando logout...")

    try {
      const response = await fetch(`${config.api.baseUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include", // Envia cookies para invalidação
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        console.log("✅ Logout realizado com sucesso.")
      } else {
        console.warn("⚠️ Logout falhou no backend, mas dados locais serão limpos.")
      }
    } catch (error: any) {
      console.error("❌ Erro ao fazer logout:", error)
    }
  },
}
