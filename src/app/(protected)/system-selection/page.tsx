"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, LogOut } from "lucide-react"
import { useEffect } from "react"
import { APP_NAME } from "@/config"

export default function SystemSelectionPage() {
  const router = useRouter()
  const { isAuthenticated, logout, user, isLoading } = useAuth()

  // Este useEffect garante que, se o componente terminar de carregar
  // e o usuário não estiver autenticado, ele será redirecionado.
  // Isso atua como um fallback robusto caso o middleware não redirecione
  // por alguma razão (ex: navegação client-side, race condition).
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("SystemSelectionPage: Não autenticado após carregamento, redirecionando para login.")
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Mostrar loading enquanto verifica autenticação
  // Se isLoading for true, sempre mostra o spinner.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se chegamos aqui, isLoading é false.
  // Se !isAuthenticated, o useEffect acima já disparou (ou vai disparar imediatamente) o redirecionamento.
  // Portanto, podemos retornar null aqui, pois a página será substituída em breve.
  if (!isAuthenticated) {
    return null
  }

  // Se chegamos aqui, significa que isLoading é false E isAuthenticated é true.
  // Agora podemos renderizar o conteúdo da página.

  // Função para navegar para a página de ajuda
  const goToHelp = () => {
    window.open("http://localhost:8080/swagger-ui/index.html#/", "_blank");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Conteúdo principal - Agora com classes responsivas */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-[95%] sm:max-w-md md:max-w-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl">Bem-vindo ao {APP_NAME}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {user?.name ? `Olá, ${user.name}!` : "Olá!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm sm:text-base text-muted-foreground">
              Esta é a base para seus projetos futuros. Atualmente, o sistema está em modo simplificado sem módulos
              adicionais.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
              Consulte a documentação para aprender como expandir este projeto com novos módulos e funcionalidades.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
            <Button className="w-full sm:w-auto" variant="outline" onClick={goToHelp}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Documentação
            </Button>
            <Button className="w-full sm:w-auto" variant="default" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
