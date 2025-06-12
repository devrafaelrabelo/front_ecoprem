"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSessionStorage } from "@/hooks/use-session-storage"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/features/auth/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { logout } = useAuth()
  const { toast } = useToast()
  const [selectedSystem, setSelectedSystem] = useSessionStorage<string | null>("selectedSystem", null)

  useEffect(() => {
    if (!selectedSystem) {
      router.replace("/system-selection")
    }
  }, [selectedSystem, router])

  const handleLogout = async () => {
    try {
      await logout()
      setSelectedSystem(null) // Limpa o sistema selecionado ao fazer logout
      toast({
        variant: "success",
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
      })
    }
  }

  if (!selectedSystem) {
    return null // Redirecionado pelo useEffect
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {selectedSystem && (
            <span className="text-lg text-muted-foreground">
              Sistema: <span className="font-semibold text-primary">{selectedSystem}</span>
            </span>
          )}
        </div>
        <nav className="flex gap-4">
          <Link href="/dashboard" passHref>
            <Button variant="ghost">Página Inicial</Button>
          </Link>
          <Link href="/dashboard/module1" passHref>
            <Button variant="ghost">Módulo 1</Button>
          </Link>
          <Link href="/dashboard/module2" passHref>
            <Button variant="ghost">Módulo 2</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
