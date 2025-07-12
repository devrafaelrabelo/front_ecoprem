"use client"
import { useState, useMemo, useEffect, useCallback } from "react"
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
import { CreateUserForm } from "@/components/create-user-form"
import { TiUserTable, type User } from "@/components/ti-user-table" // User interface now comes from ti-user-table
import { PlusCircle, Trash2, Users, Search } from "lucide-react" // Removed Filter icon as role/status filters are gone
import { Input } from "@/components/ui/input"
// Removed DropdownMenu imports as role/status filters are gone
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"

// Removed roleOptions and statusOptions as they are no longer applicable with the new User model

export default function TiUserDashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  // Removed statusFilters and roleFilters as they are no longer applicable
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUserDetails}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Falha ao carregar usuários.")
      }
      const data: User[] = await response.json()
      setUsers(data)
    } catch (err: any) {
      console.error("Erro ao buscar usuários:", err)
      setError(err.message || "Ocorreu um erro ao carregar os usuários.")
      toast({
        title: "Erro",
        description: err.message || "Não foi possível carregar os usuários.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleUserCreated = (createdUserData: User) => {
    // // Assuming CreateUserForm will eventually return data in the new User format
    // setIsCreateModalOpen(false)
    // toast({
    //   title: "Usuário Criado",
    //   description: `${createdUserData.fullName || createdUserData.username} foi adicionado com sucesso.`,
    // })
    // fetchUsers() // Re-fetch users after creation
  }

  const handleDeleteUser = async (userId: string) => {
    // try {
    //   const response = await fetchWithValidation(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}`, {
    //     method: "DELETE",
    //   })
    //   if (!response.ok) {
    //     const errorData = await response.json()
    //     throw new Error(errorData.message || "Falha ao excluir usuário.")
    //   }
    //   toast({
    //     title: "Usuário Excluído",
    //     description: "O usuário foi removido com sucesso.",
    //   })
    //   fetchUsers() // Re-fetch users after deletion
    // } catch (err: any) {
    //   console.error("Erro ao excluir usuário:", err)
    //   toast({
    //     title: "Erro ao Excluir",
    //     description: err.message || "Não foi possível excluir o usuário.",
    //     variant: "destructive",
    //   })
    // }
  }

  const handleEditUser = (userId: string) => {
    // const userToEdit = users.find((u) => u.id === userId)
    // console.log("Edit user:", userId)
    // toast({
    //   title: "Editar Usuário (Em Breve)",
    //   description: `Funcionalidade de editar ${userToEdit?.fullName || userToEdit?.username} ainda não implementada.`,
    // })
  }

  const handleDeleteSelectedUsers = async () => {
    // if (selectedUserIds.size === 0) {
    //   toast({
    //     title: "Nenhum usuário selecionado",
    //     description: "Por favor, selecione usuários para excluir.",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // try {
    //   const deletePromises = Array.from(selectedUserIds).map((userId) =>
    //     fetchWithValidation(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}`, {
    //       method: "DELETE",
    //     }).then((res) => {
    //       if (!res.ok) throw new Error(`Falha ao excluir usuário ${userId}`)
    //       return res
    //     }),
    //   )

    //   await Promise.all(deletePromises)

    //   setSelectedUserIds(new Set())
    //   toast({
    //     title: "Usuários Excluídos",
    //     description: `${selectedUserIds.size} usuários foram removidos com sucesso.`,
    //   })
    //   fetchUsers() // Re-fetch users after batch deletion
    // } catch (err: any) {
    //   console.error("Erro ao excluir usuários selecionados:", err)
    //   toast({
    //     title: "Erro ao Excluir Selecionados",
    //     description: err.message || "Não foi possível excluir todos os usuários selecionados.",
    //     variant: "destructive",
    //   })
    // }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearchTerm =
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false || // Check fullName
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      // Removed status and role filtering as these fields are no longer in the User model
      return matchesSearchTerm
    })
  }, [users, searchTerm])

  // Removed toggleFilter function as it's no longer needed for status/role filters

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
                {/* Assuming CreateUserForm will be updated to match the new User model or its output is transformed by the backend */}
                <CreateUserForm compact onSuccess={handleUserCreated} />
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
              {/* Removed DropdownMenu for filters as role/status filters are no longer applicable */}
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

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p className="text-lg font-semibold">Erro ao carregar usuários:</p>
              <p className="mt-2">{error}</p>
              <Button onClick={fetchUsers} className="mt-4">
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <>
              <TiUserTable
                users={filteredUsers}
                selectedUserIds={selectedUserIds}
                onSelectedUserIdsChange={setSelectedUserIds}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
              {filteredUsers.length === 0 && users.length > 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <Search className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-4">Nenhum usuário corresponde aos seus filtros.</p>
                  <p className="text-sm">Tente ajustar seu termo de pesquisa.</p>
                </div>
              )}
              {users.length === 0 && !isLoading && !error && (
                <div className="text-center py-10 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-4">Nenhum usuário cadastrado ainda.</p>
                  <p className="text-sm">Clique em "Criar Novo Usuário" para começar.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
