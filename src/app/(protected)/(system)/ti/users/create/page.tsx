"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CreateUserForm } from "@/components/create-user-form"
import { UserRequestTable, type UserRequest } from "@/components/user-request-table"
import { UserPlus, ListTodo } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock data for user creation requests
const initialMockRequests: UserRequest[] = [
  {
    id: "req-001",
    requesterName: "Carlos Silva",
    requesterEmail: "carlos.silva@company.com",
    requestedFirstName: "Fernanda",
    requestedLastName: "Costa",
    requestedEmail: "fernanda.costa@newhire.com",
    department: "Comercial",
    justification: "Nova consultora de vendas, início em 01/08.",
    requestDate: new Date("2023-07-25T10:00:00Z").toISOString(),
    status: "Pending",
  },
  {
    id: "req-002",
    requesterName: "Ana Pereira",
    requesterEmail: "ana.pereira@company.com",
    requestedFirstName: "Ricardo",
    requestedLastName: "Mendes",
    requestedEmail: "ricardo.mendes@newhire.com",
    department: "TI",
    justification: "Novo analista de sistemas júnior.",
    requestDate: new Date("2023-07-24T15:20:00Z").toISOString(),
    status: "Pending",
  },
  {
    id: "req-003",
    requesterName: "Juliana Lima",
    requesterEmail: "juliana.lima@company.com",
    requestedFirstName: "Mariana",
    requestedLastName: "Alves",
    requestedEmail: "mariana.alves@newhire.com",
    department: "RH",
    justification: "Analista de RH para a nova filial.",
    requestDate: new Date("2023-07-22T09:05:00Z").toISOString(),
    status: "Completed",
  },
]

export default function TiUserRequestsPage() {
  const [requests, setRequests] = useState<UserRequest[]>(initialMockRequests)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null)
  const { toast } = useToast()

  const handleInitiateCreation = (request: UserRequest) => {
    setSelectedRequest(request)
    setIsCreateModalOpen(true)
  }

  const handleApproveRequest = (requestId: string) => {
    setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "Approved" } : r)))
    toast({ title: "Solicitação Aprovada", description: "Aguardando criação do usuário." })
  }

  const handleRejectRequest = (requestId: string) => {
    setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "Rejected" } : r)))
    toast({ title: "Solicitação Rejeitada", variant: "destructive" })
  }

  const handleUserCreated = (createdUserData: any) => {
    if (selectedRequest) {
      setRequests((prev) => prev.map((r) => (r.id === selectedRequest.id ? { ...r, status: "Completed" } : r)))
      toast({
        title: "Usuário Criado com Sucesso!",
        description: `O usuário para ${createdUserData.firstName} foi criado a partir da solicitação.`,
      })
    }
    setIsCreateModalOpen(false)
    setSelectedRequest(null)
  }

  // Map request data to the format CreateUserForm expects
  const initialDataForForm = selectedRequest
    ? {
        firstName: selectedRequest.requestedFirstName,
        lastName: selectedRequest.requestedLastName,
        email: selectedRequest.requestedEmail,
        // You can pre-fill other fields here if the request contains them
      }
    : {}

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListTodo className="h-6 w-6" />
            <CardTitle className="text-2xl font-bold">Solicitações de Criação de Usuário</CardTitle>
          </div>
          <CardDescription>Aprove, rejeite ou crie usuários a partir das solicitações pendentes.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserRequestTable
            requests={requests}
            onInitiateCreation={handleInitiateCreation}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
          />
        </CardContent>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus />
              Criar Usuário a partir da Solicitação
            </DialogTitle>
            <DialogDescription>
              Confirme e complete os dados para criar o usuário para{" "}
              <strong>
                {selectedRequest?.requestedFirstName} {selectedRequest?.requestedLastName}
              </strong>
              .
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm compact initialData={initialDataForForm} onSuccess={handleUserCreated} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
