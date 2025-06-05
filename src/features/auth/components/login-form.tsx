"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "../context/auth-context"
import { authService } from "../services/auth-service"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  })

  const [shake, setShake] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)

  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }))
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, remember: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setLoginSuccess(false)

    try {
      // Verificar backend primeiro
      const connectionStatus = await authService.checkBackendConnection()
      if (!connectionStatus.isOnline) {
        setError("Não foi possível conectar ao servidor.")
        setIsLoading(false)
        return
      }

      console.log("🔐 LoginForm: Iniciando login...")
      const result = await login(formData.email, formData.password, formData.remember)

      if (result.success) {
        console.log("✅ LoginForm: Login bem-sucedido!")
        setLoginSuccess(true)

        // ✅ REDIRECIONAMENTO MAIS RÁPIDO E LIMPO
        setTimeout(() => {
          // O middleware detectará os cookies e redirecionará automaticamente
          // para o destino correto (salvo no cookie ou padrão)
          window.location.href = "/system-selection"
        }, 800)
      } else {
        console.log("❌ LoginForm: Login falhou:", result.message)
        setFormData((prev) => ({ ...prev, password: "" }))
        setFieldErrors({ email: true, password: true })

        setShake(true)
        setTimeout(() => setShake(false), 500)

        setError(result.message || "Credenciais inválidas")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("❌ LoginForm: Erro:", error)
      setError("Erro inesperado. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${shake ? "animate-shake" : ""}`} autoComplete="on">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loginSuccess && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <AlertDescription>Acesso autorizado! Redirecionando...</AlertDescription>
          </div>
        </Alert>
      )}

      <div className="space-y-4">
        <FloatingLabelInput
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          icon={<Mail className="h-4 w-4" />}
          required
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          disabled={isLoading || loginSuccess}
        />

        <FloatingLabelInput
          id="password"
          name="password"
          type="password"
          label="Senha"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          icon={<Lock className="h-4 w-4" />}
          showPasswordToggle
          required
          autoComplete="current-password"
          disabled={isLoading || loginSuccess}
        />
      </div>

      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={formData.remember}
            onCheckedChange={handleCheckboxChange}
            disabled={isLoading || loginSuccess}
          />
          <Label htmlFor="remember" className="text-sm cursor-pointer">
            Lembrar de mim
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className={`text-sm text-primary hover:underline ${isLoading || loginSuccess ? "pointer-events-none opacity-50" : ""}`}
        >
          Esqueci a senha
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || loginSuccess}>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Verificando credenciais...</span>
          </div>
        ) : loginSuccess ? (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Redirecionando...</span>
          </div>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  )
}
