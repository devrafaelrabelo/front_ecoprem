import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"

export default function TiPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
            <Home className="h-8 w-8" />
            Sistema TI
          </CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-muted-foreground">
          <p>Bem-vindo ao módulo de Tecnologia da Informação. Gerencie infraestrutura, suporte e segurança.</p>
          <p className="mt-4">Funcionalidades em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  )
}
