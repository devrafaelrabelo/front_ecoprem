"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit3, Trash2, Eye } from "lucide-react"
// Removed date-fns imports as createdAt is no longer in the User model

export interface User {
  id: string
  username: string
  email: string
  fullName: string | null // fullName can be null based on your example
  // Removed roles, status, createdAt, avatar as per new JSON model
}

interface TiUserTableProps {
  users: User[]
  selectedUserIds: Set<string>
  onSelectedUserIdsChange: (ids: Set<string>) => void
  onEditUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

// Helper to get initials from fullName
const getInitials = (fullName: string | null) => {
  if (!fullName) return ""
  const parts = fullName.split(" ")
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() || ""
  }
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase()
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
            <TableHead className="min-w-[180px]">Nome Completo</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            {/* Removed Roles, Status, Criado em columns */}
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
                  aria-label={`Selecionar ${user.fullName || user.username}`}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    {/* AvatarImage src removed as avatar field is no longer in User model */}
                    <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.fullName || <span className="text-muted-foreground">(Nome não informado)</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">@{user.username}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{user.username}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
              {/* Removed Roles, Status, Criado em cells */}
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
