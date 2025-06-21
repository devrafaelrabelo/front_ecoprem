"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { config } from "@/config"

interface SessionValidationResult {
  isValid: boolean
  user: any | null
  error: string | null
}

interface UseSessionValidationReturn {
  isValidating: boolean
  sessionData: SessionValidationResult | null
  validateSession: () => Promise<SessionValidationResult>
  clearSession: () => void
}

export function useSessionValidation(): UseSessionValidationReturn {
  const [isValidating, setIsValidating] = useState(false)
  const [sessionData, setSessionData] = useState<SessionValidationResult | null>(null)
  const lastValidationRef = useRef<number>(0)
  const cacheTimeoutRef = useRef<NodeJS.Timeout>()

  // Cache TTL de 30 segundos
  const CACHE_TTL = 30 * 1000

  const validateSession = useCallback(async (): Promise<SessionValidationResult> => {
    const now = Date.now()

    // Verificar cache
    if (sessionData && now - lastValidationRef.current < CACHE_TTL) {
      console.log("🔄 Usando cache da validação de sessão")
      return sessionData
    }

    setIsValidating(true)
    console.log("🔍 Validando sessão com backend...")

    try {
      // Usar a URL base do seu backend configurado
      const response = await fetch(`${config.api.baseUrl}/api/auth/session`, {
        method: "GET",
        credentials: "include", // Importante para enviar cookies HttpOnly
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // Header para identificar requisições AJAX
        },
        signal: AbortSignal.timeout(5000), // Timeout de 5 segundos
      })

      console.log(`📡 Resposta do backend /api/auth/session: ${response.status}`)

      if (response.ok) {
        const userData = await response.json()
        const result: SessionValidationResult = {
          isValid: true,
          user: userData,
          error: null,
        }

        setSessionData(result)
        lastValidationRef.current = now
        console.log("✅ Sessão válida no backend:", userData)
        return result
      } else {
        let errorMessage = `Erro ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          errorMessage = await response.text().catch(() => errorMessage)
        }

        const result: SessionValidationResult = {
          isValid: false,
          user: null,
          error: errorMessage,
        }

        setSessionData(result)
        lastValidationRef.current = now
        console.log("❌ Sessão inválida no backend:", errorMessage)
        return result
      }
    } catch (error: any) {
      let errorMessage = "Erro de conexão com o backend"

      if (error.name === "TimeoutError") {
        errorMessage = "Timeout: Backend demorou muito para responder"
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      const result: SessionValidationResult = {
        isValid: false,
        user: null,
        error: errorMessage,
      }

      setSessionData(result)
      lastValidationRef.current = now
      console.error("💥 Erro na validação de sessão com backend:", errorMessage)
      return result
    } finally {
      setIsValidating(false)
    }
  }, [sessionData])

  const clearSession = useCallback(() => {
    setSessionData(null)
    lastValidationRef.current = 0
    if (cacheTimeoutRef.current) {
      clearTimeout(cacheTimeoutRef.current)
    }
    console.log("🧹 Cache de sessão limpo")
  }, [])

  // Limpar cache automaticamente após TTL
  useEffect(() => {
    if (sessionData) {
      cacheTimeoutRef.current = setTimeout(() => {
        console.log("⏰ Cache de sessão expirado")
        setSessionData(null)
      }, CACHE_TTL)
    }

    return () => {
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current)
      }
    }
  }, [sessionData])

  return {
    isValidating,
    sessionData,
    validateSession,
    clearSession,
  }
}
