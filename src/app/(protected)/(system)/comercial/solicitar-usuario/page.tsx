"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { UserRequestForm } from "@/components/user-request-form"
import { UserRequestTable } from "@/components/user-request-table"
import { UserRequestFiltersComponent } from "@/components/user-request-filters"
import { UserRequestDetailsModal } from "@/components/user-request-details-modal"
import { PlusCircle, AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import type {
  ApiListedUserRequest,
  MappedUserRequest,
  UserFormData,
  UserRequestFilters,
  BatchDeletePayload,
  ApiDetailedUserRequest,
} from "@/types/user-request"
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

const initialFilters: UserRequestFilters = {
  status: "",
  searchTerm: "",
  dateFrom: "",
  dateTo: "",
}

export default function GerenciarSolicitacoesUsuarioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedRequestForDetails, setSelectedRequestForDetails] = useState<ApiDetailedUserRequest | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  const [requests, setRequests] = useState<MappedUserRequest[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [errorList, setErrorList] = useState<string | null>(null)
  const [filters, setFilters] = useState<UserRequestFilters>(initialFilters)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)

  // Novos estados para o modal de confirmação de cancelamento
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
  const [requestToCancelId, setRequestToCancelId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false) // Estado para o loading do cancelamento

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

  // Filtrar solicitações baseado nos filtros aplicados
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      // Filtro por status
      if (filters.status && request.status !== filters.status) {
        return false
      }

      // Filtro por termo de busca (nome ou CPF)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesName = request.fullName.toLowerCase().includes(searchLower)
        const matchesCpf = request.cpf.replace(/\D/g, "").includes(filters.searchTerm.replace(/\D/g, ""))
        if (!matchesName && !matchesCpf) {
          return false
        }
      }

      // Filtro por data inicial
      if (filters.dateFrom) {
        const requestDate = new Date(request.requestDate)
        const fromDate = new Date(filters.dateFrom)
        if (requestDate < fromDate) {
          return false
        }
      }

      // Filtro por data final
      if (filters.dateTo) {
        const requestDate = new Date(request.requestDate)
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // Incluir todo o dia final
        if (requestDate > toDate) {
          return false
        }
      }

      return true
    })
  }, [requests, filters])

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

  const handleViewDetails = useCallback(
    async (request: MappedUserRequest) => {
      if (!API_BASE_URL) {
        toast({ title: "Erro de Configuração", description: "URL da API não configurada.", variant: "destructive" })
        return
      }

      setIsLoadingDetails(true)
      setErrorDetails(null)
      setSelectedRequestForDetails(null) // Limpa o anterior enquanto carrega
      setIsDetailsModalOpen(true) // Abre o modal para mostrar o loading

      try {
        const response = await fetch(`${API_BASE_URL}/api/user/request/${request.id}`, {
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
            `Erro ao buscar detalhes: ${response.status} ${response.statusText} - ${errorData.message || ""}`,
          )
        }

        const detailedData: ApiDetailedUserRequest = await response.json()
        setSelectedRequestForDetails(detailedData)
      } catch (err) {
        console.error("Erro ao buscar detalhes da solicitação:", err)
        const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
        setErrorDetails(errorMessage)
        toast({
          title: "Erro ao Carregar Detalhes",
          description: errorMessage,
          variant: "destructive",
        })
        setIsDetailsModalOpen(false) // Fecha o modal se houver erro grave
      } finally {
        setIsLoadingDetails(false)
      }
    },
    [toast],
  )

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedRequestForDetails(null)
    setErrorDetails(null) // Limpa o erro ao fechar
  }

  // Função que abre o AlertDialog de confirmação de cancelamento
  const handleCancelRequest = (requestId: string) => {
    setRequestToCancelId(requestId)
    setIsCancelConfirmOpen(true)
  }

  // Função que executa o cancelamento após a confirmação no AlertDialog
  const confirmCancelRequest = useCallback(async () => {
    if (!requestToCancelId) return // Não deve acontecer se o botão estiver desabilitado corretamente

    if (!API_BASE_URL) {
      toast({ title: "Erro de Configuração", description: "URL da API não configurada.", variant: "destructive" })
      return
    }

    setIsCancelling(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/request/${requestToCancelId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
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

      console.log("Cancelar solicitação (simulado):", requestToCancelId)
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
    } finally {
      setIsCancelling(false)
      setIsCancelConfirmOpen(false) // Fecha o modal de confirmação
      setRequestToCancelId(null) // Limpa o ID
    }
  }, [requestToCancelId, API_BASE_URL, toast, fetchUserRequests])

  const handleBatchDelete = async () => {
    if (!API_BASE_URL) {
      toast({ title: "Erro de Configuração", description: "URL da API não configurada.", variant: "destructive" })
      return
    }

    if (selectedIds.size === 0) {
      toast({
        title: "Nenhum item selecionado",
        description: "Selecione pelo menos uma solicitação para excluir.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)
    try {
      const payload: BatchDeletePayload = {
        requestIds: Array.from(selectedIds),
      }

      const response = await fetch(`${API_BASE_URL}/api/user/request/batch`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000), // Timeout de 10 segundos
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Erro ao excluir solicitações: ${response.status} ${response.statusText} - ${errorData.message || ""}`,
        )
      }

      toast({
        title: "Solicitações Excluídas",
        description: `${selectedIds.size} solicitação(ões) foram excluídas com sucesso.`,
      })

      setSelectedIds(new Set()) // Limpar seleção
      fetchUserRequests() // Recarregar lista
    } catch (error) {
      console.error("Erro ao excluir solicitações:", error)
      toast({
        title: "Erro ao Excluir",
        description: error instanceof Error ? error.message : "Não foi possível excluir as solicitações.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFiltersChange = (newFilters: UserRequestFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  const handleSelectionChange = (newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds)
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Filtros */}
      <UserRequestFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Minhas Solicitações de Usuário</CardTitle>
            <CardDescription>
              Visualize e gerencie suas solicitações de criação de usuário.
              {filteredRequests.length !== requests.length && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({filteredRequests.length} de {requests.length} solicitações)
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {selectedIds.size > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Selecionadas ({selectedIds.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir {selectedIds.size} solicitação(ões) selecionada(s)? Esta ação não
                      pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBatchDelete} disabled={isDeleting}>
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Excluindo...
                        </>
                      ) : (
                        "Excluir"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
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
          </div>
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
          ) : filteredRequests.length > 0 ? (
            <UserRequestTable
              requests={filteredRequests}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
              onViewDetails={handleViewDetails}
              onCancelRequest={handleCancelRequest} // Passa a nova função para a tabela
            />
          ) : requests.length > 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Nenhuma solicitação encontrada com os filtros aplicados.</p>
              <Button onClick={handleClearFilters} className="mt-4">
                Limpar Filtros
              </Button>
            </div>
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

      {/* Modal de Detalhes */}
      <UserRequestDetailsModal
        request={selectedRequestForDetails}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />
      {isLoadingDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex items-center text-white text-lg">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            Carregando detalhes...
          </div>
        </div>
      )}
      {errorDetails && !isLoadingDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-600" />
            <p className="mt-4 text-lg font-medium">Erro ao carregar detalhes</p>
            <p className="text-sm text-red-500">{errorDetails}</p>
            <Button onClick={handleCloseDetailsModal} className="mt-4">
              Fechar
            </Button>
          </div>
        </div>
      )}

      {/* AlertDialog de Confirmação de Cancelamento */}
      <AlertDialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta solicitação? Esta ação pode não ser reversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Não</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelRequest} disabled={isCancelling}>
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                "Sim, Cancelar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
