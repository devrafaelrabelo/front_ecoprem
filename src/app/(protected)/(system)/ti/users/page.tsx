"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AdminUserTable } from "@/components/admin/admin-user-table"
import { AdminUserFilters } from "@/components/admin/admin-user-filters"
import { ViewAdminUserModal } from "@/components/admin/view-admin-user-modal"
import { CreateUserModal } from "@/components/create-user-modal"
import { useAdminUsers } from "@/hooks/use-admin-users"
import { Users, UserCheck, UserX, UserMinus, Clock, Shield, ShieldCheck, MailCheck, Plus, RefreshCw, Download, Trash2 } from 'lucide-react'
import type { AdminUser } from "@/types/admin-user"

export default function AdminUsersPage() {
  const {
    users,
    stats,
    selectedUsers,
    filters,
    isLoading,
    isRefreshing,
    isExporting,
    fetchUsers,
    updateFilters,
    resetFilters,
    exportUsers,
    lockUser,
    unlockUser,
    resetPassword,
    toggleUserSelection,
    selectAllUsers,
    clearSelection,
  } = useAdminUsers()

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleEditUser = (user: AdminUser) => {
    // TODO: Implementar modal de edição
    console.log("Editar usuário:", user)
  }

  const handleCreateSuccess = () => {
    fetchUsers(false)
  }

  const statsCards = [
    {
      title: "Total de Usuários",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Usuários Ativos",
      value: stats.active,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Usuários Inativos",
      value: stats.inactive,
      icon: UserX,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "Usuários Suspensos",
      value: stats.suspended,
      icon: UserMinus,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Usuários Pendentes",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Usuários Bloqueados",
      value: stats.blocked,
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "2FA Habilitado",
      value: stats.twoFactorEnabled,
      icon: ShieldCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Email Verificado",
      value: stats.emailVerified,
      icon: MailCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, permissões e configurações do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => fetchUsers(false)}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            variant="outline"
            onClick={exportUsers}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exportando..." : "Exportar"}
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.value === 1 ? "usuário" : "usuários"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar usuários específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminUserFilters
            filters={filters}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
          />
        </CardContent>
      </Card>

      {/* Selection Actions */}
      {selectedUsers.size > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedUsers.size} usuário(s) selecionado(s)
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                >
                  Limpar Seleção
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportUsers}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Selecionados
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    // TODO: Implementar ação em lote
                    console.log("Ação em lote para:", selectedUsers)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Ações em Lote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {users.length} usuário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminUserTable
            users={users}
            selectedUsers={selectedUsers}
            isLoading={isLoading}
            onUserSelect={toggleUserSelection}
            onSelectAll={selectAllUsers}
            onClearSelection={clearSelection}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onLockUser={lockUser}
            onUnlockUser={unlockUser}
            onResetPassword={resetPassword}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewAdminUserModal
        user={selectedUser}
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
      />

      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}

