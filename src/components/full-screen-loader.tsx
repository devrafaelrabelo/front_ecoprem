import { Loader2 } from "lucide-react"

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner simples e neutro */}
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />

        {/* Texto minimalista */}
        <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    </div>
  )
}
