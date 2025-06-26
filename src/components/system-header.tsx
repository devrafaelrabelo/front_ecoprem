"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { getSystemFromPath } from "@/navigation/config"
import { useAuth } from "@/features/auth/context/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings, Home } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeSelector } from "./theme-selector"
import { BackendStatusIndicator } from "./backend-status-indicator"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"

// Header simplificado sem toggle de sidebar
export function SystemHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const currentSystem = getSystemFromPath(pathname)

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        variant: "success",
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
      })
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="/modules" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Home className="h-6 w-6" />
          <span className="sr-only">Início</span>
        </Link>
        <h1 className="text-lg font-semibold">{currentSystem.name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <BackendStatusIndicator />
        <ThemeSelector />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
              <Avatar>
                <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/user/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
