"use client"

import { useSessionStorage } from "@/hooks/use-session-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardHomePage() {
  const [selectedSystem] = useSessionStorage<string | null>("selectedSystem", null)

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Página Inicial do Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-muted-foreground">
          Bem-vindo ao sistema <span className="font-semibold text-primary">{selectedSystem || "selecionado"}</span>!
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Esta é a página inicial do seu dashboard. Use os links no cabeçalho para navegar entre os módulos.
        </p>
      </CardContent>
    </Card>
  )
}
