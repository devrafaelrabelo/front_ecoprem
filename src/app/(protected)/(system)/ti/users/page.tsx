"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Users,
  UserPlus,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Mail,
  Key,
} from "lucide-react"
import { AdminUserTable } from "@/components/admin/admin-user-table"
import { AdminUserFilters } from "@/components/admin/admin-user-filters"
import { ViewAdminUserModal } from "@/components/admin/view-admin-user-modal"
import { Pagination } from "@/components/common/pagination"
import { useAdminUsers } from "@/hooks/use-admin-users"
import type { AdminUser } from "@/types/admin-user"

export default function TiUsersPage() {
  const {
    users,
    filters,
    pagination,
    isLoading,
    error,
    refetch,
    updateFilters,
    changePage,
    changePageSize,
    sortBy,
    lockUser,
    resetPassword,
    getUserById,
    exportToCsv,
  } = useAdminUsers()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Estados para o modal de visualização
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  const { toast } = useToast()

  // Calcular estatísticas dos usuários
  const stats = useMemo(() => {
    const total = pagination.totalElements
    const active = users.filter((u) => u.status === "active").length
    const inactive = users.filter((u) => u.status === "inactive").length
    const suspended = users.filter((u) => u.status === "suspended").length
    const pending = users.filter((u) => u.status === "pending").length
    const locked = users.filter((u) => u.locked).length
    const emailVerified = users.filter((u) => u.emailVerified).length
    const twoFactorEnabled = users.filter((u) => u.twoFactorEnabled).length
    const passwordCompromised = users.filter((u) => u.passwordCompromised).length

    return {
      total,
      active,
      inactive,
      suspended,
      pending,
      locked,
      emailVerified,
      twoFactorEnabled,
      passwordCompromised,
    }
  }, [users, pagination.totalElements])

  // Handlers para filtros
  const handleFiltersChange = (newFilters: any) => {
    updateFilters(newFilters)
    setSelectedIds(new Set())
  }

  const handleClearFilters = () => {
    updateFilters({
      nameOrEmail: "",
      cpf: "",
      status: "",
      role: "",
      department: "",
      position: "",
      preferredLanguage: "",
      interfaceTheme: "",
      locked: undefined,
      emailVerified: undefined,
      twoFactorEnabled: undefined,
      firstLogin: undefined,
      passwordCompromised: undefined,
      createdFrom: "",
      createdTo: "",
      lastLoginFrom: "",
      lastLoginTo: "",
    })
  }

  const handleSelectionChange = (newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds)
  }

  // Handlers para ações da tabela
  const handleViewUser = async (user: AdminUser) => {
    try {
      const updatedUser = await getUserById(user.id)
      setSelectedUser(updatedUser || user)
      setViewModalOpen(true)
    } catch (err) {
      setSelectedUser(user)
      setViewModalOpen(true)
    }
  }

  const handleEditUser = (userId: string) => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: `Editar usuário ${userId} será implementado em breve.`,
    })
  }

  const handleLockUser = async (userId: string, lock: boolean) => {
    try {
      await lockUser(userId, lock)
    } catch (err) {
      // Error is handled in the hook
    }
  }

  const handleResetPassword = async (userId: string) => {
    try {
      await resetPassword(userId)
    } catch (err) {
      // Error is handled in the hook
    }
  }

  const handleRefresh = async () => {
    try {
      await refetch()
      toast({
        title: "Dados Atualizados",
        description: "Lista de usuários atualizada com sucesso.",
      })
    } catch (err) {
      toast({
        title: "Erro ao Atualizar",
        description: "Não foi possível atualizar a lista de usuários.",
        variant: "destructive",
      })
    }
  }

  const handleExportCsv = async () => {
    try {
      await exportToCsv()
    } catch (err) {
      // Error is handled in the hook
    }
  }

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo de Usuários</h1>
          </div>
          <p className="text-muted-foreground">Gerencie usuários, perfis, permissões e configurações do sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
          <Badge variant="secondary">Sistema TI</Badge>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">usuários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">inativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspensos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
            <p className="text-xs text-muted-foreground">suspensos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
            <Lock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.locked}</div>
            <p className="text-xs text-muted-foreground">bloqueados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-mail ✓</CardTitle>
            <Mail className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.emailVerified}</div>
            <p className="text-xs text-muted-foreground">verificados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2FA</CardTitle>
            <Key className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.twoFactorEnabled}</div>
            <p className="text-xs text-muted-foreground">com 2FA</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <AdminUserFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuários
          </CardTitle>
          <CardDescription>
            Gerencie usuários do sistema, seus perfis e permissões
            {pagination.totalElements > 0 && (
              <span className="text-sm text-muted-foreground ml-2">• {pagination.totalElements} usuários no total</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Carregando usuários...</p>
                  <p className="text-sm text-muted-foreground">Por favor, aguarde</p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-destructive">Erro ao carregar dados</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
                </div>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : users.length > 0 ? (
            <>
              <AdminUserTable
                users={users}
                selectedIds={selectedIds}
                onSelectionChange={handleSelectionChange}
                onViewUser={handleViewUser}
                onEditUser={handleEditUser}
                onLockUser={handleLockUser}
                onResetPassword={handleResetPassword}
                filters={filters}
                onSort={sortBy}
              />
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalElements={pagination.totalElements}
                pageSize={pagination.size}
                onPageChange={changePage}
                onPageSizeChange={changePageSize}
                isLoading={isLoading}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Nenhum usuário encontrado</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Não há usuários que correspondam aos filtros aplicados. Tente ajustar os filtros ou criar um novo
                    usuário.
                  </p>
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Novo Usuário
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Visualização */}
      <ViewAdminUserModal user={selectedUser} open={viewModalOpen} onOpenChange={setViewModalOpen} />

      <Toaster />
    </div>
  )
}
