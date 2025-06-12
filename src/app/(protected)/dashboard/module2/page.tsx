import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Module2Page() {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Módulo 2</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-muted-foreground">Conteúdo de exemplo para o Módulo 2.</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Este módulo pode conter outras funcionalidades e informações.
        </p>
      </CardContent>
    </Card>
  )
}
