"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Users, UserPlus, Shield, RefreshCw, Loader2, AlertTriangle, Eye } from "lucide-react"
import { TiUserTable, type UserInterface } from "@/components/ti-user-table"
import { TiUserFilters, type TiUserFilters as TiUserFiltersType } from "@/components/ti-user-filters"
import { ViewUserModal } from "@/components/view-user-modal"
import { useUsers } from "@/hooks/use-ti-users"

const initialFilters: TiUserFiltersType = {
  search: "",
  profile: "",
  status: "",
  department: "",
  accessLevel: "",
}

export default function TiUsersPage() {
  const { users, isLoading, error, refetch, deleteUser, getUserById } = useUsers()

  const [filters, setFilters] = useState<TiUserFiltersType>(initialFilters)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Estados para o modal de visualização
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null)

  const { toast } = useToast()

  // Aplicar filtros
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filtro por busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesName = user.fullName?.toLowerCase().includes(searchLower)
        const matchesEmail = user.email.toLowerCase().includes(searchLower)
        const matchesUsername = user.username.toLowerCase().includes(searchLower)
        if (!matchesName && !matchesEmail && !matchesUsername) {
          return false
        }
      }

      // Filtro por perfil
      if (filters.profile && filters.profile !== "" && user.role !== filters.profile) {
        return false
      }

      // Filtro por status
      if (filters.status && filters.status !== "") {
        if (filters.status === "active" && user.isActive !== true) return false
        if (filters.status === "inactive" && user.isActive !== false) return false
        if (filters.status === "pending" && user.lastLogin) return false
      }

      // Filtro por departamento
      if (filters.department && filters.department !== "" && user.department !== filters.department) {
        return false
      }

      // Filtro por nível de acesso
      if (filters.accessLevel && filters.accessLevel !== "" && user.accessLevel?.toString() !== filters.accessLevel) {
        return false
      }

      return true
    })
  }, [users, filters])

  // Calcular estatísticas dos usuários
  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((u) => u.isActive === true).length
    const inactive = users.filter((u) => u.isActive === false).length
    const suspended = users.filter((u) => u.isActive === false && u.role === "user").length
    const pending = users.filter((u) => !u.lastLogin).length

    return { total, active, inactive, suspended, pending }
  }, [users])

  // Handlers para filtros
  const handleFiltersChange = (newFilters: TiUserFiltersType) => {
    setFilters(newFilters)
    // Limpar seleções quando filtros mudarem
    setSelectedIds(new Set())
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  const handleSelectionChange = (newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds)
  }

  // Handlers para ações da tabela
  const handleViewUser = async (user: UserInterface) => {
    try {
      // Buscar dados atualizados do usuário
      const updatedUser = await getUserById(user.id)
      setSelectedUser(updatedUser || user)
      setViewModalOpen(true)
    } catch (err) {
      // Se falhar, usar os dados que já temos
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

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast({
        title: "Usuário Excluído",
        description: "O usuário foi excluído com sucesso.",
      })
    } catch (err) {
      toast({
        title: "Erro ao Excluir Usuário",
        description: err instanceof Error ? err.message : "Erro desconhecido",
        variant: "destructive",
      })
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

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Usuários do Sistema</h1>
          </div>
          <p className="text-muted-foreground">Gerencie usuários, perfis e permissões do sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
          <Badge variant="secondary">Sistema TI</Badge>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {filteredUsers.length !== stats.total && <span>({filteredUsers.length} filtrados)</span>}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Usuários ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <Shield className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Usuários inativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspensos</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
            <p className="text-xs text-muted-foreground">Usuários suspensos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Shield className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <TiUserFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuários
          </CardTitle>
          <CardDescription>
            Gerencie usuários do sistema, seus perfis e permissões
            {filteredUsers.length !== users.length && (
              <span className="text-sm text-muted-foreground ml-2">
                • {filteredUsers.length} de {users.length} usuários exibidos
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          ) : filteredUsers.length > 0 ? (
            <TiUserTable
              users={filteredUsers}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
              onViewUser={handleViewUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          ) : users.length > 0 ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <Eye className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Nenhum usuário encontrado</p>
                  <p className="text-sm text-muted-foreground">Nenhum usuário corresponde aos filtros aplicados</p>
                </div>
                <Button onClick={handleClearFilters} variant="outline">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Nenhum usuário cadastrado</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Não há usuários cadastrados no sistema. Clique em "Novo Usuário" para começar.
                  </p>
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Primeiro Usuário
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Visualização */}
      <ViewUserModal user={selectedUser} open={viewModalOpen} onOpenChange={setViewModalOpen} />

      <Toaster />
    </div>
  )
}
