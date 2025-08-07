"use client"

import { useState, useEffect, useCallback } from "react"
import { ApiEndpoints } from "@/lib/api-endpoints"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import type { UserInterface } from "@/components/ti-user-table"
import { useToast } from "@/components/ui/use-toast"

interface UserFilters {
  search?: string
  profile?: string
  status?: string
  department?: string
  accessLevel?: string
  page?: number
  size?: number
}

interface UseUsersReturn {
  users: UserInterface[]
  filters: UserFilters
  pagination: {
    totalElements: number
    totalPages: number
    currentPage: number
    size: number
    first: boolean
    last: boolean
  }
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateFilters: (newFilters: Partial<UserFilters>) => void
  changePage: (page: number) => void
  changePageSize: (size: number) => void
  createUser: (userData: Partial<UserInterface>) => Promise<void>
  updateUser: (id: string, userData: Partial<UserInterface>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  getUserById: (id: string) => Promise<UserInterface | null>
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [filters, setFilters] = useState<UserFilters>({
    page: 0,
    size: 20,
  })
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 20,
    first: true,
    last: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Normalizar dados do usuário vindos da API
  const normalizeUser = (user: any): UserInterface => {
    return {
      id: user.id || "",
      fullName: user.fullName || user.name || null,
      email: user.email || "",
      username: user.username || "",
      role: user.role || "user",
      isActive: user.isActive !== undefined ? user.isActive : true,
      department: user.department || "",
      accessLevel: user.accessLevel || undefined,
      lastLogin: user.lastLogin || null,
      createdAt: user.createdAt || new Date().toISOString(),
    }
  }

  // Buscar todos os usuários
  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()

      if (filters.search) searchParams.append("search", filters.search)
      if (filters.profile) searchParams.append("profile", filters.profile)
      if (filters.status) searchParams.append("status", filters.status)
      if (filters.department) searchParams.append("department", filters.department)
      if (filters.accessLevel) searchParams.append("accessLevel", filters.accessLevel)
      if (filters.page !== undefined) searchParams.append("page", filters.page.toString())
      if (filters.size !== undefined) searchParams.append("size", filters.size.toString())

      const url = `${ApiEndpoints.backend.adminUsersList}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`

      const response = await fetchWithValidation(url, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`)
      }

      const data = await response.json()

      // Verifica se a resposta tem a estrutura do Spring Boot
      if (data.content && Array.isArray(data.content)) {
        const normalizedUsers = data.content.map(normalizeUser)
        setUsers(normalizedUsers)
        setPagination({
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          currentPage: data.number,
          size: data.size,
          first: data.first,
          last: data.last,
        })
      } else {
        // Fallback para estrutura simples
        const normalizedUsers = Array.isArray(data)
          ? data.map(normalizeUser)
          : Array.isArray(data.users)
            ? data.users.map(normalizeUser)
            : []
        setUsers(normalizedUsers)
        setPagination({
          totalElements: normalizedUsers.length,
          totalPages: 1,
          currentPage: 0,
          size: normalizedUsers.length,
          first: true,
          last: true,
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar usuários"
      setError(errorMessage)
      console.error("Erro ao buscar usuários:", err)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset page when filters change (except when only page changes)
      page: newFilters.page !== undefined ? newFilters.page : 0,
    }))
  }, [])

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const changePageSize = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }))
  }, [])

  // Buscar usuário por ID
  const getUserById = useCallback(async (id: string): Promise<UserInterface | null> => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsersId}${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuário: ${response.status}`)
      }

      const data = await response.json()
      return normalizeUser(data)
    } catch (err) {
      console.error("Erro ao buscar usuário por ID:", err)
      return null
    }
  }, [])

  // Criar novo usuário
  const createUser = useCallback(
    async (userData: Partial<UserInterface>) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchWithValidation(ApiEndpoints.backend.adminUsersCreate, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: userData.fullName,
            email: userData.email,
            username: userData.username,
            role: userData.role || "user",
            isActive: userData.isActive !== undefined ? userData.isActive : true,
            department: userData.department,
            accessLevel: userData.accessLevel,
          }),
        })

        if (!response.ok) {
          throw new Error(`Erro ao criar usuário: ${response.status}`)
        }

        toast({
          title: "Usuário criado",
          description: "O usuário foi criado com sucesso.",
        })

        // Recarregar a lista após criar
        await fetchUsers()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao criar usuário"
        setError(errorMessage)
        toast({
          title: "Erro ao criar usuário",
          description: errorMessage,
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUsers, toast],
  )

  // Atualizar usuário
  const updateUser = useCallback(
    async (id: string, userData: Partial<UserInterface>) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsersIdAlter}${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: userData.fullName,
            email: userData.email,
            username: userData.username,
            role: userData.role,
            isActive: userData.isActive,
            department: userData.department,
            accessLevel: userData.accessLevel,
          }),
        })

        if (!response.ok) {
          throw new Error(`Erro ao atualizar usuário: ${response.status}`)
        }

        toast({
          title: "Usuário atualizado",
          description: "O usuário foi atualizado com sucesso.",
        })

        // Recarregar a lista após atualizar
        await fetchUsers()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar usuário"
        setError(errorMessage)
        toast({
          title: "Erro ao atualizar usuário",
          description: errorMessage,
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUsers, toast],
  )

  // Excluir usuário
  const deleteUser = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsersIdDelete}${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error(`Erro ao excluir usuário: ${response.status}`)
        }

        toast({
          title: "Usuário excluído",
          description: "O usuário foi excluído com sucesso.",
        })

        // Recarregar a lista após excluir
        await fetchUsers()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao excluir usuário"
        setError(errorMessage)
        toast({
          title: "Erro ao excluir usuário",
          description: errorMessage,
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUsers, toast],
  )

  // Carregar usuários na inicialização
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    filters,
    pagination,
    isLoading,
    error,
    refetch: fetchUsers,
    updateFilters,
    changePage,
    changePageSize,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  }
}
