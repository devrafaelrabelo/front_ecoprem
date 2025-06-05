import { CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeSelector } from "@/components/theme-selector"
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 sm:py-16">
      {/* Theme button - repositioned for better responsiveness */}
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeSelector />
      </div>

      <div className="w-full max-w-md">
        <Card className="border-custom-primary/20 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-bold sm:text-2xl">Esqueci minha senha</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Informe seu nome de usuário para recuperar o acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
          <CardFooter className="flex justify-center border-t px-6 py-4">
            <Link
              href="/login"
              className="flex items-center text-sm text-custom-secondary hover:text-custom-secondary/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
