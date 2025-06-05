"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica de email
    if (!email || !email.includes("@")) {
      setEmailError(true)
      setIsSubmitting(false)
      return
    }

    try {
      // Simulação de envio de email
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Email enviado",
        description: "Instruções de recuperação foram enviadas para seu email.",
        variant: "default",
      })

      // Redirecionar para login após alguns segundos
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de recuperação. Tente novamente.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) setEmailError(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
        <p className="text-sm">
          <strong>Aviso:</strong> Este é um formulário de demonstração. A recuperação de senha real precisa ser
          implementada.
        </p>
      </div>

      <div className="space-y-4">
        <FloatingLabelInput
          id="email"
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={handleChange}
          error={emailError}
          icon={<Mail className="h-4 w-4" />}
          required
          autoComplete="email"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar instruções"}
      </Button>

      <div className="text-center">
        <Link href="/login" className="inline-flex items-center text-sm text-custom-secondary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para o login
        </Link>
      </div>
    </form>
  )
}
