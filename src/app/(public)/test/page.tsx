"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TestTube, CheckCircle, XCircle, Info } from "lucide-react"
import { TwoFactorModal } from "@/features/auth/components/two-factor-modal"

export default function TestPage() {
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const handleTwoFactorSubmit = async (code: string) => {
    console.log("Código 2FA inserido:", code)

    // Simular validação
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)

    // Simular sucesso/erro baseado no código
    if (code === "123456") {
      setTestResult("success")
      setShowTwoFactorModal(false)
      return true
    } else {
      setTestResult("error")
      return false
    }
  }

  const handleTwoFactorClose = () => {
    setShowTwoFactorModal(false)
    setTestResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TestTube className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-2xl">Página de Teste</CardTitle>
            </div>
            <CardDescription>Página livre para testar componentes e funcionalidades</CardDescription>
          </CardHeader>
        </Card>

        {/* Teste do Modal 2FA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Teste do Modal 2FA
            </CardTitle>
            <CardDescription>Teste o modal de autenticação de dois fatores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-center">
              <Button onClick={() => setShowTwoFactorModal(true)} className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Testar Modal 2FA
              </Button>

              {testResult === "success" && (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Sucesso!
                </Badge>
              )}

              {testResult === "error" && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Erro!
                </Badge>
              )}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Dica:</strong> Use o código <code className="bg-gray-100 px-1 rounded">123456</code> para
                simular sucesso, qualquer outro código simulará erro.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Teste de Componentes UI */}
        <Card>
          <CardHeader>
            <CardTitle>Componentes UI</CardTitle>
            <CardDescription>Teste diferentes componentes e estados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Botões */}
            <div className="space-y-2">
              <Label>Botões</Label>
              <div className="flex gap-2 flex-wrap">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-2">
              <Label>Badges</Label>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <Label htmlFor="test-input">Input de Teste</Label>
              <Input id="test-input" placeholder="Digite algo aqui..." className="max-w-sm" />
            </div>

            {/* Alerts */}
            <div className="space-y-2">
              <Label>Alerts</Label>
              <div className="space-y-2 max-w-md">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>Este é um alert informativo.</AlertDescription>
                </Alert>

                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Operação realizada com sucesso!</AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>Ocorreu um erro durante a operação.</AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
            <CardDescription>Variáveis de ambiente e configurações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-semibold">App Name:</Label>
                <p className="text-muted-foreground">{process.env.NEXT_PUBLIC_APP_NAME || "N/A"}</p>
              </div>
              <div>
                <Label className="font-semibold">App Version:</Label>
                <p className="text-muted-foreground">{process.env.NEXT_PUBLIC_APP_VERSION || "N/A"}</p>
              </div>
              <div>
                <Label className="font-semibold">Environment:</Label>
                <p className="text-muted-foreground">{process.env.NEXT_PUBLIC_APP_ENV || "development"}</p>
              </div>
              <div>
                <Label className="font-semibold">API URL:</Label>
                <p className="text-muted-foreground">{process.env.NEXT_PUBLIC_API_BASE_URL || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal 2FA */}
      <TwoFactorModal
        isOpen={showTwoFactorModal}
        onClose={handleTwoFactorClose}
        onSubmit={handleTwoFactorSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
