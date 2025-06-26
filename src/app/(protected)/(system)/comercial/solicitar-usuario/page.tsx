"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { UserRequestForm } from "@/components/user-request-form"
import { UserRequestTable } from "@/components/user-request-table"
import { PlusCircle, AlertTriangle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ApiListedUserRequest, MappedUserRequest, UserFormData } from "@/types/user-request"
import { useToast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Função para formatar CPF (exemplo, pode ser mais robusta)
const formatCpfDisplay = (cpf: string): string => {
  if (!cpf) return ""
  const cleaned = cpf.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }
  return cpf // Retorna original se não for um CPF de 11 dígitos
}

export default function GerenciarSolicitacoesUsuarioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requests, setRequests] = useState<MappedUserRequest[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [errorList, setErrorList] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUserRequests = useCallback(async () => {
    if (!API_BASE_URL) {
      setErrorList("URL base da API não configurada. Verifique as variáveis de ambiente.")
      setIsLoadingList(false)
      toast({
        title: "Erro de Configuração",
        description: "URL base da API não configurada.",
        variant: "destructive",
      })
      return
    }

    setIsLoadingList(true)
    setErrorList(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/request`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",          
        },
        signal: AbortSignal.timeout(8000), // Timeout de 8 segundos
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Erro ao buscar solicitações: ${response.status} ${response.statusText} - ${errorData.message || ""}`,
        )
      }
      const data: ApiListedUserRequest[] = await response.json()

      const mappedData: MappedUserRequest[] = data.map((req) => ({
        id: req.id,
        fullName: `${req.firstName} ${req.lastName}`,
        cpf: formatCpfDisplay(req.cpf),
        status: req.status.toUpperCase() as MappedUserRequest["status"],
        requestDate: req.requestedAt,
        originalData: req,
      }))
      setRequests(mappedData)
    } catch (err) {
      console.error("Erro ao buscar solicitações:", err)
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
      setErrorList(errorMessage)
      toast({
        title: "Erro ao Carregar Solicitações",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoadingList(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUserRequests()
  }, [fetchUserRequests])

  const handleNewRequestSuccess = (newRequestData: UserFormData) => {
    console.log("Nova solicitação enviada (dados do form):", newRequestData)
    setIsModalOpen(false)
    fetchUserRequests() // Atualiza a lista após o sucesso
    toast({
      title: "Solicitação Criada!",
      description: "Sua nova solicitação de usuário foi enviada com sucesso.",
    })
  }

  const handleFormCancel = () => {
    setIsModalOpen(false)
  }

  const handleViewDetails = (request: MappedUserRequest) => {
    console.log("Ver detalhes:", request)
    alert(
      `Detalhes da Solicitação:\nID: ${request.id}\nNome: ${request.fullName}\nCPF: ${request.cpf}\nStatus: ${request.status}\nData: ${new Date(request.requestDate).toLocaleDateString("pt-BR")}`,
    )
  }

  const handleCancelRequest = async (requestId: string) => {
    if (!API_BASE_URL) {
      toast({ title: "Erro de Configuração", description: "URL da API não configurada.", variant: "destructive" })
      return
    }
    if (!window.confirm("Tem certeza que deseja cancelar esta solicitação?")) return

    try {      
      const response = await fetch(`${API_BASE_URL}/api/user/request/${requestId}`, {
       method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (!response.ok) {
        throw new Error('Falha ao cancelar solicitação');
      }
      console.log("Cancelar solicitação (simulado):", requestId)
      toast({
        title: "Solicitação Cancelada",
        description: "A solicitação foi marcada como cancelada (simulado).",
      })
      fetchUserRequests() // Recarrega a lista
    } catch (error) {
      console.error("Erro ao cancelar solicitação:", error)
      toast({
        title: "Erro ao Cancelar",
        description: error instanceof Error ? error.message : "Não foi possível cancelar a solicitação.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Minhas Solicitações de Usuário</CardTitle>
            <CardDescription>Visualize e gerencie suas solicitações de criação de usuário.</CardDescription>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Solicitação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Solicitação de Usuário</DialogTitle>
                <DialogDescription>
                  Preencha os dados abaixo para solicitar a criação de um novo usuário.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <UserRequestForm onSubmissionSuccess={handleNewRequestSuccess} onCancel={handleFormCancel} />
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoadingList ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Carregando solicitações...</p>
            </div>
          ) : errorList ? (
            <div className="text-center py-12 text-red-600">
              <AlertTriangle className="mx-auto h-12 w-12" />
              <p className="mt-4 text-lg font-medium">Erro ao carregar dados</p>
              <p className="text-sm text-red-500">{errorList}</p>
              <Button onClick={fetchUserRequests} className="mt-4">
                Tentar Novamente
              </Button>
            </div>
          ) : requests.length > 0 ? (
            <UserRequestTable
              requests={requests}
              onViewDetails={handleViewDetails}
              onCancelRequest={handleCancelRequest}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Nenhuma solicitação encontrada.</p>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Criar Primeira Solicitação
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Nova Solicitação de Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados abaixo para solicitar a criação de um novo usuário.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <UserRequestForm onSubmissionSuccess={handleNewRequestSuccess} onCancel={handleFormCancel} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
