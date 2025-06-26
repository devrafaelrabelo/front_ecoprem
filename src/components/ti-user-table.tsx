"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit3, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  roles: string[]
  status: "Active" | "Inactive" | "Pending"
  createdAt: string // ISO date string
  avatar?: string
}

interface TiUserTableProps {
  users: User[]
  selectedUserIds: Set<string>
  onSelectedUserIdsChange: (ids: Set<string>) => void
  onEditUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

// Helper to get initials for AvatarFallback
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase()
}

// Role display mapping (optional, for better labels)
const roleDisplayNames: { [key: string]: string } = {
  admin: "Admin",
  user: "Usuário",
  supervisor: "Supervisor",
  gestor: "Gestor",
}

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Active: "default",
  Inactive: "secondary",
  Pending: "outline",
}

const statusLabel: { [key: string]: string } = {
  Active: "Ativo",
  Inactive: "Inativo",
  Pending: "Pendente",
}

export function TiUserTable({
  users,
  selectedUserIds,
  onSelectedUserIdsChange,
  onEditUser,
  onDeleteUser,
}: TiUserTableProps) {
  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      onSelectedUserIdsChange(new Set(users.map((user) => user.id)))
    } else {
      onSelectedUserIdsChange(new Set())
    }
  }

  const handleSelectRow = (userId: string, checked: boolean) => {
    const newSelectedUserIds = new Set(selectedUserIds)
    if (checked) {
      newSelectedUserIds.add(userId)
    } else {
      newSelectedUserIds.delete(userId)
    }
    onSelectedUserIdsChange(newSelectedUserIds)
  }

  const isAllSelected = users.length > 0 && selectedUserIds.size === users.length
  const isIndeterminate = selectedUserIds.size > 0 && selectedUserIds.size < users.length

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[50px] px-4">
              <Checkbox
                checked={isAllSelected || isIndeterminate}
                onCheckedChange={handleSelectAll}
                aria-label="Selecionar todos"
                className={isIndeterminate ? "data-[state=checked]:bg-primary/50" : ""}
              />
            </TableHead>
            <TableHead className="min-w-[180px]">Usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="w-[80px] text-right pr-4">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} data-state={selectedUserIds.has(user.id) ? "selected" : ""}>
              <TableCell className="px-4">
                <Checkbox
                  checked={selectedUserIds.has(user.id)}
                  onCheckedChange={(checked) => handleSelectRow(user.id, !!checked)}
                  aria-label={`Selecionar ${user.firstName} ${user.lastName}`}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">@{user.username}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {roleDisplayNames[role] || role}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[user.status] || "outline"} className="text-xs capitalize">
                  {statusLabel[user.status] || user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(user.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Mais ações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEditUser(user.id)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("View user:", user.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDeleteUser(user.id)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
