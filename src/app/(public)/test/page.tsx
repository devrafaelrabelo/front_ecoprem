"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TwoFactorModal } from "@/features/auth/components/two-factor-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTheme } from "@/hooks/use-theme"
import { BackendStatusIndicator } from "@/components/backend-status-indicator"
import {
  Loader2,
  TestTube,
  CheckCircle,
  XCircle,
  Info,
  Moon,
  Sun,
  Bell,
  TableIcon,
  Layers,
  MessageSquare,
  Settings,
  User,
  Mail,
  Minus,
  PanelLeft,
  ScrollText,
  AlertTriangle,
} from "lucide-react"

export default function TestPage() {
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const { theme, toggleTheme, isDark, mounted } = useTheme()
  const { toast } = useToast()

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

  const showToast = (type: "default" | "success" | "error" | "warning" | "info") => {
    const toastConfig = {
      default: {
        title: "Notificação",
        description: "Esta é uma notificação padrão",
        variant: "default" as const,
      },
      success: {
        title: "Sucesso!",
        description: "Operação realizada com sucesso",
        variant: "success" as const,
      },
      error: {
        title: "Erro!",
        description: "Ocorreu um erro na operação",
        variant: "destructive" as const,
      },
      warning: {
        title: "Atenção!",
        description: "Verifique os dados informados",
        variant: "warning" as const,
      },
      info: {
        title: "Informação",
        description: "Esta é uma informação importante",
        variant: "info" as const,
      },
    }[type]

    toast({
      ...toastConfig,
      duration: 3000,
    })
  }

  // Dados de exemplo para tabela
  const exampleData = [
    { id: 1, name: "João Silva", email: "joao@exemplo.com", status: "Ativo" },
    { id: 2, name: "Maria Santos", email: "maria@exemplo.com", status: "Inativo" },
    { id: 3, name: "Pedro Alves", email: "pedro@exemplo.com", status: "Pendente" },
  ]

  // Não renderizar o toggle até que o tema esteja montado
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TestTube className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-2xl">Página de Teste</CardTitle>
              </div>
              <CardDescription>Carregando tema...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TestTube className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-2xl">Página de Teste</CardTitle>
            </div>
            <CardDescription>Página livre para testar componentes e funcionalidades</CardDescription>

            <div className="flex items-center justify-center mt-4 gap-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="Toggle theme" />
              <Moon className="h-4 w-4" />
              <span className="text-sm ml-2">{isDark ? "Tema Escuro" : "Tema Claro"}</span>
            </div>
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
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100"
                >
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
                <strong>Dica:</strong> Use o código{" "}
                <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">123456</code> para simular sucesso, qualquer
                outro código simulará erro.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Tabs de Navegação */}
        <Card>
          <CardHeader>
            <CardTitle>Componentes Avançados</CardTitle>
            <CardDescription>Teste diferentes componentes interativos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="notifications" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="notifications" className="flex items-center gap-1">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notificações</span>
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-1">
                  <TableIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Tabela</span>
                </TabsTrigger>
                <TabsTrigger value="dialogs" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Diálogos</span>
                </TabsTrigger>
                <TabsTrigger value="forms" className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Formulários</span>
                </TabsTrigger>
                <TabsTrigger value="extras" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Extras</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab de Notificações */}
              <TabsContent value="notifications" className="space-y-4">
                <h3 className="text-lg font-medium">Teste de Notificações</h3>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => showToast("default")} variant="outline">
                    Notificação Padrão
                  </Button>
                  <Button
                    onClick={() => showToast("success")}
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Sucesso
                  </Button>
                  <Button
                    onClick={() => showToast("error")}
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Erro
                  </Button>
                  <Button
                    onClick={() => showToast("warning")}
                    variant="outline"
                    className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Aviso
                  </Button>
                  <Button
                    onClick={() => showToast("info")}
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Informação
                  </Button>
                </div>
              </TabsContent>

              {/* Tab de Tabela */}
              <TabsContent value="table">
                <h3 className="text-lg font-medium mb-4">Tabela de Usuários</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exampleData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                row.status === "Ativo" ? "default" : row.status === "Inativo" ? "secondary" : "outline"
                              }
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Tab de Diálogos */}
              <TabsContent value="dialogs" className="space-y-4">
                <h3 className="text-lg font-medium">Diálogos e Popovers</h3>
                <div className="flex flex-wrap gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Abrir Diálogo</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Exemplo de Diálogo</DialogTitle>
                        <DialogDescription>
                          Este é um exemplo de diálogo modal que pode ser usado para confirmações, formulários ou exibir
                          informações.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p>Conteúdo do diálogo vai aqui.</p>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline">
                          Cancelar
                        </Button>
                        <Button type="button">Confirmar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Abrir Popover</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Popover de Exemplo</h4>
                        <p className="text-sm text-muted-foreground">
                          Popovers são úteis para exibir informações adicionais ou controles sem interromper o fluxo da
                          interface.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Alert Dialog
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso irá deletar permanentemente o item selecionado.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction>Deletar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TabsContent>

              {/* Tab de Formulários */}
              <TabsContent value="forms" className="space-y-4">
                <h3 className="text-lg font-medium">Componentes de Formulário</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-checkbox">Checkbox</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="test-checkbox" />
                      <label
                        htmlFor="test-checkbox"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Aceitar termos e condições
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Radio Group</Label>
                    <RadioGroup defaultValue="option-one">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Opção 1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">Opção 2</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-select">Select</Label>
                    <Select>
                      <SelectTrigger id="test-select">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Opção 1</SelectItem>
                        <SelectItem value="option2">Opção 2</SelectItem>
                        <SelectItem value="option3">Opção 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-input-form">Input</Label>
                    <Input id="test-input-form" placeholder="Digite algo aqui..." />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Floating Label Inputs</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingLabelInput
                        id="floating-email"
                        type="email"
                        label="Email"
                        placeholder="Digite seu email"
                      />
                      <FloatingLabelInput
                        id="floating-password"
                        type="password"
                        label="Senha"
                        placeholder="Digite sua senha"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tab de Extras */}
              <TabsContent value="extras" className="space-y-6">
                <h3 className="text-lg font-medium">Componentes Extras</h3>

                {/* Avatar */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Avatar
                  </h4>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Avatar" />
                      <AvatarFallback>CD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>EF</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Separator */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Minus className="h-4 w-4" />
                    Separator
                  </h4>
                  <div>
                    <p>Conteúdo acima</p>
                    <Separator className="my-4" />
                    <p>Conteúdo abaixo</p>
                  </div>
                  <div className="flex h-5 items-center space-x-4 text-sm">
                    <div>Blog</div>
                    <Separator orientation="vertical" />
                    <div>Docs</div>
                    <Separator orientation="vertical" />
                    <div>Source</div>
                  </div>
                </div>

                {/* Sheet */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <PanelLeft className="h-4 w-4" />
                    Sheet (Drawer)
                  </h4>
                  <div className="flex gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">Abrir da Direita</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Título do Sheet</SheetTitle>
                          <SheetDescription>Descrição do conteúdo do sheet.</SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                          <p>Conteúdo do sheet aqui...</p>
                        </div>
                      </SheetContent>
                    </Sheet>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">Abrir da Esquerda</Button>
                      </SheetTrigger>
                      <SheetContent side="left">
                        <SheetHeader>
                          <SheetTitle>Sheet Esquerdo</SheetTitle>
                          <SheetDescription>Sheet que abre do lado esquerdo.</SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                {/* Scroll Area */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <ScrollText className="h-4 w-4" />
                    Scroll Area
                  </h4>
                  <ScrollArea className="h-72 w-full rounded-md border p-4">
                    <div className="space-y-4">
                      {Array.from({ length: 50 }, (_, i) => (
                        <div key={i} className="text-sm">
                          Item {i + 1} - Este é um item de exemplo em uma área com scroll. Lorem ipsum dolor sit amet,
                          consectetur adipiscing elit.
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Botões */}
        <Card>
          <CardHeader>
            <CardTitle>Botões</CardTitle>
            <CardDescription>Diferentes variantes de botões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading
              </Button>
              <Button variant="outline" size="sm">
                Small
              </Button>
              <Button variant="outline" size="lg">
                Large
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="default" className="gap-2">
                <User className="h-4 w-4" />
                <span>Com Ícone</span>
              </Button>
              <Button variant="secondary" className="gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
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

        {/* Status do Backend */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Backend</CardTitle>
            <CardDescription>Monitoramento da conexão com o servidor</CardDescription>
          </CardHeader>
          <CardContent>
            <BackendStatusIndicator />
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

      {/* Toaster para notificações */}
      <Toaster />
    </div>
  )
}
