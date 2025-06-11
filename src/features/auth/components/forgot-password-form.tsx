"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { DynamicIconInput } from "@/components/ui/dynamic-icon-input"
import { useToast } from "@/components/ui/use-toast"

export function ForgotPasswordForm() {
  const [identifier, setIdentifier] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [identifierError, setIdentifierError] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Regex para validar email do domínio bemprotege.com.br
  const emailRegex = /^[a-zA-Z0-9._%+-]+@bemprotege\.com\.br$/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica - não pode estar vazio
    if (!identifier || identifier.trim() === "") {
      setIdentifierError(true)
      setIsSubmitting(false)
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, informe seu nome de usuário ou email.",
      })
      return
    }

    // Verificar se é email
    const isEmail = identifier.includes("@")

    // Se for email, validar com regex
    if (isEmail && !emailRegex.test(identifier)) {
      setIsSubmitting(false)
      toast({
        variant: "destructive",
        title: "Erro no envio",
        description: "Não foi possível processar sua solicitação. Verifique os dados informados.",
      })
      return
    }

    try {
      // Simulação de envio
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Solicitação enviada",
        description: "Instruções de recuperação foram enviadas para o email cadastrado.",
        variant: "success",
      })

      // Redirecionar para login após alguns segundos
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value)
    if (identifierError) setIdentifierError(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DynamicIconInput
        id="identifier"
        name="identifier"
        label="Usuário ou Email"
        placeholder="Digite seu usuário ou email"
        value={identifier}
        onChange={handleChange}
        error={identifierError}
        errorMessage="Por favor, informe seu nome de usuário ou email."
        required
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Recuperar acesso"}
      </Button>
    </form>
  )
}
