"use client"
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService, type User } from "@/features/auth/services/auth-service"
import { useSessionValidation } from "@/features/auth/hooks/use-session-validation"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const { validateSession, clearSession, isValidating } = useSessionValidation()

  useEffect(() => {
    setMounted(true)
  }, [])

  const checkAuthentication = useCallback(async () => {
    if (!mounted) return

    setIsLoading(true)

    try {
      console.log("🔍 Verificando autenticação...")

      // Primeiro, verificar cookie de status rápido
      const authStatusCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_status="))
        ?.split("=")[1]

      if (authStatusCookie === "unauthenticated") {
        console.log("🚫 Cookie indica usuário não autenticado")
        setUser(null)
        setIsAuthenticated(false)
        sessionStorage.removeItem("user_data")
        setIsLoading(false)
        setIsInitialLoading(false)
        return
      }

      // Validar sessão com o backend
      const sessionResult = await validateSession()

      if (sessionResult.isValid && sessionResult.user) {
        const currentUser = await authService.getCurrentUser()

        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
          sessionStorage.setItem("user_data", JSON.stringify(currentUser))
          console.log("✅ Autenticação válida")
        } else {
          throw new Error("Falha ao obter dados do usuário")
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
        sessionStorage.removeItem("user_data")
        console.log("🚫 Sessão inválida")
      }
    } catch (error) {
      console.error("❌ Erro na verificação de autenticação:", error)
      setUser(null)
      setIsAuthenticated(false)
      sessionStorage.removeItem("user_data")
      clearSession()
    } finally {
      setIsLoading(false)
      setIsInitialLoading(false)
    }
  }, [mounted, validateSession, clearSession])

  useEffect(() => {
    checkAuthentication()
  }, [checkAuthentication])

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    try {
      const response = await authService.login(email, password, rememberMe)

      if (response.success) {
        console.log("✅ Login bem-sucedido")

        // Aguardar um pouco para o backend processar
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Limpar cache de sessão para forçar nova validação
        clearSession()

        if (window.location.pathname === "/login") {
          window.location.href = "/"
        } else {
          await checkAuthentication()
        }

        return { success: true }
      } else {
        console.log("❌ Falha no login:", response.message)
        return { success: false, message: response.message || "Erro na autenticação" }
      }
    } catch (error) {
      console.error("❌ Erro no login:", error)
      return { success: false, message: "Erro inesperado durante o login" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
      sessionStorage.removeItem("user_data")
      clearSession()
      console.log("✅ Logout concluído")
      window.location.replace("/login")
    } catch (error) {
      console.error("❌ Erro durante logout:", error)
      // Mesmo com erro, limpar estado local
      setUser(null)
      setIsAuthenticated(false)
      sessionStorage.removeItem("user_data")
      clearSession()
      window.location.replace("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshAuth = async () => {
    clearSession() // Limpar cache para forçar nova validação
    await checkAuthentication()
  }

  const updateUser = useCallback(
    (userData: Partial<User>) => {
      if (user) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        if (typeof window !== "undefined") {
          sessionStorage.setItem("user_data", JSON.stringify(updatedUser))
        }
      }
    },
    [user],
  )

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: mounted ? isLoading || isValidating : true,
    isInitialLoading: mounted ? isInitialLoading : true,
    login,
    logout,
    refreshAuth,
    updateUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
