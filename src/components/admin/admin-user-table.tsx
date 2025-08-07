"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Lock,
  Unlock,
  RotateCcw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Mail,
  Key,
} from "lucide-react"
import type { AdminUser, AdminUserFiltersType } from "@/types/admin-user"

interface AdminUserTableProps {
  users: AdminUser[]
  selectedIds: Set<string>
  onSelectionChange: (selectedIds: Set<string>) => void
  onViewUser: (user: AdminUser) => void
  onEditUser: (userId: string) => void
  onToggleLock: (userId: string, lock: boolean) => void
  onResetPassword: (userId: string) => void
  filters: AdminUserFiltersType
  onSortChange: (field: string) => void
}

export function AdminUserTable({
  users,
  selectedIds,
  onSelectionChange,
  onViewUser,
  onEditUser,
  onToggleLock,
  onResetPassword,
  filters,
  onSortChange,
}: AdminUserTableProps) {
  const [lockDialogOpen, setLockDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(users.map((user) => user.id)))
    } else {
      onSelectionChange(new Set())
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds)
    if (checked) {
      newSelectedIds.add(userId)
    } else {
      newSelectedIds.delete(userId)
    }
    onSelectionChange(newSelectedIds)
  }

  const handleLockUser = (user: AdminUser) => {
    setSelectedUser(user)
    setLockDialogOpen(true)
  }

  const handleResetPassword = (user: AdminUser) => {
    setSelectedUser(user)
    setResetPasswordDialogOpen(true)
  }

  const confirmLockUser = () => {
    if (selectedUser) {
      onToggleLock(selectedUser.id, !selectedUser.locked)
      setLockDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const confirmResetPassword = () => {
    if (selectedUser) {
      onResetPassword(selectedUser.id)
      setResetPasswordDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const getStatusBadge = (status: AdminUser["status"]) => {
    const statusMap = {
      active: { label: "Ativo", variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      inactive: { label: "Inativo", variant: "secondary" as const, icon: XCircle, color: "text-gray-600" },
      suspended: { label: "Suspenso", variant: "destructive" as const, icon: AlertTriangle, color: "text-red-600" },
      pending: { label: "Pendente", variant: "outline" as const, icon: Clock, color: "text-yellow-600" },
    }
    const config = statusMap[status]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getRoleBadge = (role: AdminUser["mainRole"]) => {
    const roleMap = {
      admin: { label: "Admin", variant: "default" as const, color: "bg-red-100 text-red-800" },
      manager: { label: "Gerente", variant: "secondary" as const, color: "bg-blue-100 text-blue-800" },
      analyst: { label: "Analista", variant: "outline" as const, color: "bg-green-100 text-green-800" },
      user: { label: "Usuário", variant: "outline" as const, color: "bg-gray-100 text-gray-800" },
    }
    const config = roleMap[role]
    return (
      <Badge variant={config.variant} className={config.color}>
        <Shield className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getDepartmentBadge = (department: string) => {
    const departmentMap = {
      ti: { label: "TI", color: "bg-purple-100 text-purple-800" },
      rh: { label: "RH", color: "bg-pink-100 text-pink-800" },
      comercial: { label: "Comercial", color: "bg-orange-100 text-orange-800" },
      financeiro: { label: "Financeiro", color: "bg-yellow-100 text-yellow-800" },
      operacional: { label: "Operacional", color: "bg-cyan-100 text-cyan-800" },
    }
    const config = departmentMap[department as keyof typeof departmentMap] || {
      label: department,
      color: "bg-gray-100 text-gray-800",
    }
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getSortIcon = (field: string) => {
    if (filters.sort !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return filters.direction === "asc" ? (
      <ArrowUp className="h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="h-4 w-4 text-primary" />
    )
  }

  const BooleanIcon = ({
    value,
    trueIcon: TrueIcon,
    falseIcon: FalseIcon,
    trueColor = "text-green-600",
    falseColor = "text-red-600",
  }: {
    value: boolean
    trueIcon: any
    falseIcon: any
    trueColor?: string
    falseColor?: string
  }) => {
    const Icon = value ? TrueIcon : FalseIcon
    const color = value ? trueColor : falseColor
    return <Icon className={`h-4 w-4 ${color}`} />
  }

  const allSelected = users.length > 0 && selectedIds.size === users.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < users.length

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSortChange("fullName")}>
                <div className="flex items-center gap-2">
                  Nome Completo
                  {getSortIcon("fullName")}
                </div>
              </TableHead>
              <TableHead>Username</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Papel Principal</TableHead>
              <TableHead>Departamento Principal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Lock className="h-4 w-4 mx-auto" />
                  </TooltipTrigger>
                  <TooltipContent>Bloqueado</TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead className="text-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Key className="h-4 w-4 mx-auto" />
                  </TooltipTrigger>
                  <TooltipContent>2FA Habilitado</TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead className="text-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Mail className="h-4 w-4 mx-auto" />
                  </TooltipTrigger>
                  <TooltipContent>E-mail Verificado</TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead className="text-center">
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-4 w-4 mx-auto" />
                  </TooltipTrigger>
                  <TooltipContent>Senha Comprometida</TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSortChange("createdAt")}>
                <div className="flex items-center gap-2">
                  Criado em
                  {getSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSortChange("lastLogin")}>
                <div className="flex items-center gap-2">
                  Último Login
                  {getSortIcon("lastLogin")}
                </div>
              </TableHead>
              <TableHead className="w-12">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                      <AvatarFallback>
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-muted-foreground">{user.position}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.mainRole)}</TableCell>
                <TableCell>{getDepartmentBadge(user.mainDepartment)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-center">
                  <BooleanIcon value={user.locked} trueIcon={Lock} falseIcon={Unlock} />
                </TableCell>
                <TableCell className="text-center">
                  <BooleanIcon value={user.twoFactorEnabled} trueIcon={Key} falseIcon={XCircle} />
                </TableCell>
                <TableCell className="text-center">
                  <BooleanIcon value={user.emailVerified} trueIcon={CheckCircle} falseIcon={XCircle} />
                </TableCell>
                <TableCell className="text-center">
                  <BooleanIcon
                    value={user.passwordCompromised}
                    trueIcon={AlertTriangle}
                    falseIcon={CheckCircle}
                    trueColor="text-red-600"
                    falseColor="text-green-600"
                  />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("pt-BR") : "Nunca"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewUser(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditUser(user.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleLockUser(user)}>
                        {user.locked ? (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Desbloquear
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Bloquear
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Resetar senha
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de confirmação para bloquear/desbloquear usuário */}
      <AlertDialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedUser?.locked ? "Desbloquear" : "Bloquear"} Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {selectedUser?.locked ? "desbloquear" : "bloquear"} o usuário{" "}
              <strong>{selectedUser?.fullName}</strong>?
              {!selectedUser?.locked && (
                <span className="block mt-2 text-sm text-muted-foreground">
                  O usuário não poderá fazer login até ser desbloqueado.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLockUser}>
              {selectedUser?.locked ? "Desbloquear" : "Bloquear"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmação para resetar senha */}
      <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resetar Senha</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja resetar a senha do usuário <strong>{selectedUser?.fullName}</strong>?
              <span className="block mt-2 text-sm text-muted-foreground">
                Uma nova senha temporária será enviada por e-mail e o usuário será obrigado a alterá-la no próximo
                login.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPassword}>Resetar Senha</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
