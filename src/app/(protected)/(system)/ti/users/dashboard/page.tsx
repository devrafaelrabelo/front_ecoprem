"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { CreateUserForm } from "@/components/create-user-form" // Assuming this is the correct path
import { TiUserTable, type User } from "@/components/ti-user-table"
import { PlusCircle, Trash2, Users, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

// Mock data for users - replace with actual data fetching
const initialMockUsers: User[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Smith",
    username: "asmith",
    email: "alice.smith@example.com",
    roles: ["admin", "user"],
    status: "Active",
    createdAt: new Date("2023-01-15T10:00:00Z").toISOString(),
    avatar: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Johnson",
    username: "bjohnson",
    email: "bob.johnson@example.com",
    roles: ["user"],
    status: "Inactive",
    createdAt: new Date("2023-02-20T14:30:00Z").toISOString(),
    avatar: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "3",
    firstName: "Carol",
    lastName: "Williams",
    username: "cwilliams",
    email: "carol.williams@example.com",
    roles: ["supervisor"],
    status: "Active",
    createdAt: new Date("2023-03-10T09:15:00Z").toISOString(),
    avatar: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Brown",
    username: "dbrown",
    email: "david.brown@example.com",
    roles: ["gestor", "user"],
    status: "Pending",
    createdAt: new Date("2023-04-05T11:00:00Z").toISOString(),
    avatar: "/placeholder.svg?width=40&height=40",
  },
]

// Role options for filtering - ensure these match roles in CreateUserForm or your system
const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "supervisor", label: "Supervisor" },
  { value: "gestor", label: "Gestor" },
  { value: "user", label: "User" },
]

const statusOptions = [
  { value: "Active", label: "Ativo" },
  { value: "Inactive", label: "Inativo" },
  { value: "Pending", label: "Pendente" },
]

export default function TiUserDashboardPage() {
  const [users, setUsers] = useState<User[]>(initialMockUsers)
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set())
  const [roleFilters, setRoleFilters] = useState<Set<string>>(new Set())

  const { toast } = useToast()

  const handleUserCreated = (createdUserData: User) => {
    setUsers((prevUsers) => [createdUserData, ...prevUsers])
    setIsCreateModalOpen(false)
    toast({
      title: "Usuário Criado",
      description: `${createdUserData.firstName} ${createdUserData.lastName} foi adicionado com sucesso.`,
    })
  }

  // In a real app, CreateUserForm would call this prop on successful submission
  // For now, we simulate it by closing the modal and adding a mock user
  // The CreateUserForm itself shows a toast, so we might not need another one here
  // or we can pass a callback to CreateUserForm to handle post-creation logic.

  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(userId)
      return newSet
    })
    toast({
      title: "Usuário Excluído",
      description: "O usuário foi removido.",
      variant: "destructive",
    })
  }

  const handleEditUser = (userId: string) => {
    // Placeholder for edit functionality
    // Typically, this would open a modal with the user's data pre-filled
    // For now, we'll just log it and show a toast
    const userToEdit = users.find((u) => u.id === userId)
    console.log("Edit user:", userId)
    toast({
      title: "Editar Usuário (Em Breve)",
      description: `Funcionalidade de editar ${userToEdit?.firstName} ${userToEdit?.lastName} ainda não implementada.`,
    })
  }

  const handleDeleteSelectedUsers = () => {
    if (selectedUserIds.size === 0) {
      toast({
        title: "Nenhum usuário selecionado",
        description: "Por favor, selecione usuários para excluir.",
        variant: "destructive",
      })
      return
    }
    setUsers((prevUsers) => prevUsers.filter((user) => !selectedUserIds.has(user.id)))
    setSelectedUserIds(new Set())
    toast({
      title: "Usuários Excluídos",
      description: `${selectedUserIds.size} usuários foram removidos.`,
      variant: "destructive",
    })
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearchTerm =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilters.size === 0 || statusFilters.has(user.status)
      const matchesRoles = roleFilters.size === 0 || user.roles.some((role) => roleFilters.has(role))

      return matchesSearchTerm && matchesStatus && matchesRoles
    })
  }, [users, searchTerm, statusFilters, roleFilters])

  const toggleFilter = (
    filterSet: Set<string>,
    setFilterSet: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string,
  ) => {
    const newSet = new Set(filterSet)
    if (newSet.has(value)) {
      newSet.delete(value)
    } else {
      newSet.add(value)
    }
    setFilterSet(newSet)
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6" />
                Gerenciamento de Usuários TI
              </CardTitle>
              <CardDescription>Visualize, crie, edite e exclua usuários do sistema.</CardDescription>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Preencha o formulário abaixo para adicionar um novo usuário ao sistema.
                  </DialogDescription>
                </DialogHeader>
                {/* 
                  Pass a callback to CreateUserForm if it supports one for post-creation actions.
                  Example: <CreateUserForm compact onUserCreated={handleUserCreated} />
                  For now, CreateUserForm handles its own toast and reset.
                  We'll manually close the modal and update the list in this parent component.
                  The `handleUserCreated` function is a placeholder for this logic.
                  If CreateUserForm can take an `onSuccess` prop:
                */}
                <CreateUserForm compact onSuccess={handleUserCreated} />
                {/* 
                  To make this truly work, CreateUserForm would need an onSuccess prop:
                  <CreateUserForm compact onSuccess={(newUserData) => {
                    handleUserCreated(newUserData); // Your logic to add user to list
                    setIsCreateModalOpen(false); // Close modal
                  }} />
                  For now, the form will show its own toast. We'll close the modal via onOpenChange.
                  The user list won't auto-update without a more direct integration or event system.
                */}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Pesquisar usuários (nome, email, username)..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="shrink-0">
                    <Filter className="mr-2 h-4 w-4" /> Filtros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px]">
                  <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {statusOptions.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={statusFilters.has(option.value)}
                      onCheckedChange={() => toggleFilter(statusFilters, setStatusFilters, option.value)}
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filtrar por Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {roleOptions.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={roleFilters.has(option.value)}
                      onCheckedChange={() => toggleFilter(roleFilters, setRoleFilters, option.value)}
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {selectedUserIds.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelectedUsers}
                disabled={selectedUserIds.size === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Excluir Selecionados ({selectedUserIds.size})
              </Button>
            )}
          </div>

          <TiUserTable
            users={filteredUsers}
            selectedUserIds={selectedUserIds}
            onSelectedUserIdsChange={setSelectedUserIds}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
          {filteredUsers.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-4">Nenhum usuário encontrado.</p>
              <p className="text-sm">Tente ajustar seus filtros ou termo de pesquisa.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
