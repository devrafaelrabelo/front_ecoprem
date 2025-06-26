"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react" // Ícones para novas ações
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { MappedUserRequest } from "@/types/user-request" // Importar o tipo

interface UserRequestTableProps {
  requests: MappedUserRequest[]
  onViewDetails?: (request: MappedUserRequest) => void
  onEditRequest?: (request: MappedUserRequest) => void // Se edição for permitida
  onCancelRequest?: (requestId: string) => void // Se cancelamento for permitido
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  COMPLETED: "default", // Verde (shadcn default é azulado, pode customizar)
  PENDING: "outline", // Amarelo/Laranja
  APPROVED: "default", // Verde
  REJECTED: "destructive", // Vermelho
  CANCELED: "secondary", // Cinza
}

const statusLabelMap: { [key: string]: string } = {
  COMPLETED: "Concluído",
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CANCELED: "Cancelado",
}

export function UserRequestTable({ requests, onViewDetails, onEditRequest, onCancelRequest }: UserRequestTableProps) {
  const getStatusVariant = (
    status: MappedUserRequest["status"],
  ): "default" | "secondary" | "destructive" | "outline" => {
    return statusVariantMap[status.toUpperCase() as keyof typeof statusVariantMap] || "outline"
  }

  const getStatusLabel = (status: MappedUserRequest["status"]): string => {
    return statusLabelMap[status.toUpperCase() as keyof typeof statusLabelMap] || status
  }

  return (
    <TooltipProvider>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="min-w-[250px]">Nome Completo</TableHead>
              <TableHead className="min-w-[150px]">CPF</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma solicitação encontrada.
                </TableCell>
              </TableRow>
            )}
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="font-medium">{request.fullName}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">{request.cpf}</div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{format(new Date(request.requestDate), "dd/MM/yyyy")}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{format(new Date(request.requestDate), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(request.status)} className="text-xs capitalize">
                    {getStatusLabel(request.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      {onViewDetails && (
                        <DropdownMenuItem onClick={() => onViewDetails(request)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                        </DropdownMenuItem>
                      )}
                      {/* Adicionar lógica para permitir edição/cancelamento baseado no status */}
                      {onEditRequest && (request.status === "PENDING" || request.status === "REJECTED") && (
                        <DropdownMenuItem onClick={() => onEditRequest(request)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                      )}
                      {onCancelRequest && request.status === "PENDING" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onCancelRequest(request.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Cancelar Solicitação
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
