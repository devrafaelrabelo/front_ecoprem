"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo } from "react"
import * as LucideIcons from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/features/auth/context/auth-context"
import { SYSTEMS_CONFIG, AVAILABLE_SYSTEMS, getBreadcrumbItems, getSystemFromPath } from "@/navigation/config"
import { cn } from "@/lib/utils"
import { useToast } from "./ui/use-toast"
import { useSessionStorage } from "@/hooks/use-session-storage"

interface SystemHeaderProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

export function SystemHeader({ isSidebarOpen, setIsSidebarOpen }: SystemHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [, setSelectedSystemId] = useSessionStorage<string | null>("selectedSystem", null)

  // Memoize expensive calculations
  const currentSystem = useMemo(() => getSystemFromPath(pathname), [pathname])
  const breadcrumbs = useMemo(() => getBreadcrumbItems(pathname), [pathname])

  const userAvailableSystems = useMemo(
    () =>
      AVAILABLE_SYSTEMS.filter((system) =>
        user?.departments?.some((dep) => dep.toUpperCase() === system.id.toUpperCase()),
      ),
    [user?.departments],
  )

  const handleSystemChange = (systemId: string) => {
    const system = SYSTEMS_CONFIG[systemId as keyof typeof SYSTEMS_CONFIG]
    if (system) {
      setSelectedSystemId(system.id)
      router.push(system.homePath)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setSelectedSystemId(null)
      toast({
        variant: "default",
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

  const getInitials = (name: string | undefined) => {
    if (!name) return "U"
    const names = name.split(" ")
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const SystemIcon = currentSystem.icon ? (LucideIcons[currentSystem.icon] as LucideIcons.LucideIcon) : LucideIcons.Home
  const ToggleIcon = isSidebarOpen ? LucideIcons.PanelLeftClose : LucideIcons.PanelLeftOpen

  return (
    <TooltipProvider delayDuration={300}>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <ToggleIcon className="h-4 w-4" />
                <span className="sr-only">{isSidebarOpen ? "Fechar menu" : "Abrir menu"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{isSidebarOpen ? "Fechar menu" : "Abrir menu"}</TooltipContent>
          </Tooltip>

          <Link href={currentSystem.homePath} className="flex items-center gap-2 font-semibold">
            <SystemIcon className={cn("h-6 w-6", currentSystem.color)} />
            <span className="hidden sm:inline-block">{currentSystem.name}</span>
          </Link>

          {breadcrumbs.length > 1 && (
            <nav aria-label="breadcrumb" className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href || index} className="flex items-center gap-1">
                  {index > 0 && <LucideIcons.ChevronRight className="h-3 w-3" />}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-foreground">{crumb.title}</span>
                  ) : (
                    <Link href={crumb.href || "#"} className="hover:text-foreground">
                      {crumb.title}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <LucideIcons.AppWindow className="h-4 w-4" />
                    <span className="sr-only">Selecionar Sistema</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Módulos Disponíveis</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userAvailableSystems.length > 0 ? (
                    userAvailableSystems.map((sys) => {
                      const IconComponent = sys.icon
                        ? (LucideIcons[sys.icon] as LucideIcons.LucideIcon)
                        : LucideIcons.Circle
                      return (
                        <DropdownMenuItem
                          key={sys.id}
                          onClick={() => handleSystemChange(sys.id)}
                          className={cn(currentSystem.id === sys.id && "bg-accent")}
                        >
                          <IconComponent className={cn("mr-2 h-4 w-4", sys.color)} />
                          <span>{sys.name}</span>
                          {currentSystem.id === sys.id && <LucideIcons.Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                      )
                    })
                  ) : (
                    <DropdownMenuItem disabled>Nenhum módulo atribuído</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/modules")}>
                    <LucideIcons.LayoutGrid className="mr-2 h-4 w-4" />
                    Ver todos os módulos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="bottom">Selecionar Sistema</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.push("/user/settings")}>
                <LucideIcons.Settings className="h-4 w-4" />
                <span className="sr-only">Configurações</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Configurações</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.push("/help")}>
                <LucideIcons.HelpCircle className="h-4 w-4" />
                <span className="sr-only">Ajuda</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Ajuda</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.fullName || "Usuário"} />
                  <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName || "Usuário"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <LucideIcons.User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/user/settings")}>
                <LucideIcons.Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LucideIcons.LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  )
}
