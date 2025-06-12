import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Module1Page() {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Módulo 1</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-muted-foreground">Conteúdo de exemplo para o Módulo 1.</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Aqui você pode adicionar funcionalidades específicas para este módulo.
        </p>
      </CardContent>
    </Card>
  )
}
