"use client"
import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService, type User } from "@/features/auth/services/auth-service"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
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
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const lastActivityRef = useRef(Date.now())

  useEffect(() => {
    setMounted(true)
  }, [])

  const checkAuthentication = useCallback(async () => {
    if (!mounted) return

    setIsLoading(true)

    try {
      const currentUser = await authService.getCurrentUser()

      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
        sessionStorage.setItem("user_data", JSON.stringify(currentUser))
        console.log("✅ Sessão válida.")
      } else {
        setUser(null)
        setIsAuthenticated(false)
        sessionStorage.removeItem("user_data")
        console.log("🚫 Sessão inválida.")
      }
    } catch (error) {
      console.error("❌ Erro ao verificar autenticação:", error)
      setUser(null)
      setIsAuthenticated(false)
      sessionStorage.removeItem("user_data")
    } finally {
      setIsLoading(false)
    }
  }, [mounted])

  useEffect(() => {
    checkAuthentication()
  }, [checkAuthentication])

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    try {
      const response = await authService.login(email, password, rememberMe)

      if (response.success) {
        console.log("✅ Login bem-sucedido.")
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Só redirecionar se estivermos na página de login
        // O middleware vai gerenciar o redirecionamento baseado nos cookies HttpOnly
        if (window.location.pathname === "/login") {
          console.log("🔀 Login bem-sucedido na página de login, redirecionando...")
          window.location.href = "/"
        } else {
          // Se não estivermos na página de login, apenas atualizar o estado
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
      console.log("✅ Logout concluído.")
      window.location.replace("/login")
    } catch (error) {
      console.error("❌ Erro durante logout:", error)
      setUser(null)
      setIsAuthenticated(false)
      sessionStorage.removeItem("user_data")
      window.location.replace("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshAuth = async () => {
    await checkAuthentication()
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user_data", JSON.stringify(updatedUser))
      }
    }
  }

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: mounted ? isLoading : true,
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
