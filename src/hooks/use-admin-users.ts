"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ApiEndpoints } from "@/lib/api-endpoints"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import type { AdminUser, AdminUserFiltersType, AdminUserPagination, ApiAdminUser } from "@/types/admin-user"

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filters, setFilters] = useState<AdminUserFiltersType>({
    page: 0,
    size: 10,
    sort: "fullName",
    direction: "asc",
  })
  const [pagination, setPagination] = useState<AdminUserPagination>({
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
    size: 10,
    first: true,
    last: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()

  // Função para normalizar dados do usuário vindos da API
  const normalizeUser = useCallback((apiUser: ApiAdminUser): AdminUser => {
    const getMainRole = (roles: string[]): AdminUser["mainRole"] => {
      if (!roles) return "user"
      if (roles.some((role) => role.toUpperCase() === "ROLE_ADMIN")) return "admin"
      if (roles.some((role) => role.toUpperCase() === "ROLE_MANAGER")) return "manager"
      if (roles.some((role) => role.toUpperCase() === "ROLE_ANALYST")) return "analyst"
      return "user"
    }

    const getStatus = (status: ApiAdminUser["status"]): AdminUser["status"] => {
      if (!status) return "pending"
      return status.toLowerCase() as AdminUser["status"]
    }

    return {
      id: apiUser.id,
      fullName: apiUser.fullName,
      username: apiUser.username,
      email: apiUser.email,
      position: apiUser.position || "Não informado",
      departments: apiUser.departments || [],
      mainDepartment: (apiUser.departments && apiUser.departments[0]) || "Não informado",
      roles: apiUser.roles || [],
      mainRole: getMainRole(apiUser.roles),
      status: getStatus(apiUser.status),
      locked: apiUser.locked,
      emailVerified: apiUser.emailVerified,
      twoFactorEnabled: apiUser.twoFactorEnabled,
      passwordCompromised: apiUser.passwordCompromised,
      createdAt: apiUser.createdAt,
      updatedAt: apiUser.createdAt, // fallback since not provided
      lastLogin: apiUser.lastLogin || undefined,
      avatar: undefined, // not provided in new api
    }
  }, [])

  // Função para construir query parameters
  const buildQueryParams = useCallback((currentFilters: AdminUserFiltersType) => {
    const params = new URLSearchParams()

    // Filtros básicos
    if (currentFilters.nameOrEmail) {
      params.append("nameOrEmail", currentFilters.nameOrEmail)
    }
    if (currentFilters.status) {
      params.append("status", currentFilters.status.toUpperCase())
    }
    if (currentFilters.role) {
      params.append("role", currentFilters.role)
    }
    if (currentFilters.department) {
      params.append("department", currentFilters.department)
    }
    if (currentFilters.position) {
      params.append("position", currentFilters.position)
    }

    // Filtros booleanos
    if (currentFilters.locked !== undefined) {
      params.append("locked", currentFilters.locked.toString())
    }
    if (currentFilters.emailVerified !== undefined) {
      params.append("emailVerified", currentFilters.emailVerified.toString())
    }
    if (currentFilters.twoFactorEnabled !== undefined) {
      params.append("twoFactorEnabled", currentFilters.twoFactorEnabled.toString())
    }
    if (currentFilters.passwordCompromised !== undefined) {
      params.append("passwordCompromised", currentFilters.passwordCompromised.toString())
    }

    // Filtros de data
    if (currentFilters.createdFrom) {
      params.append("createdFrom", currentFilters.createdFrom)
    }
    if (currentFilters.createdTo) {
      params.append("createdTo", currentFilters.createdTo)
    }
    if (currentFilters.lastLoginFrom) {
      params.append("lastLoginFrom", currentFilters.lastLoginFrom)
    }
    if (currentFilters.lastLoginTo) {
      params.append("lastLoginTo", currentFilters.lastLoginTo)
    }

    // Paginação e ordenação
    params.append("page", (currentFilters.page || 0).toString())
    params.append("size", (currentFilters.size || 10).toString())
    if (currentFilters.sort) {
      params.append("sort", currentFilters.sort)
    }
    if (currentFilters.direction) {
      params.append("direction", currentFilters.direction)
    }

    return params
  }, [])

  // Carregar usuários do endpoint
  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const queryParams = buildQueryParams(filters)
      const url = `${ApiEndpoints.backend.adminUsersList}?${queryParams.toString()}`

      console.log("Fazendo requisição para:", url) // Debug

      const response = await fetchWithValidation(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Dados recebidos da API:", data) // Debug

      // Verificar se a resposta tem estrutura paginada do Spring Boot
      if (data.content && Array.isArray(data.content)) {
        // Resposta paginada do Spring Boot
        const normalizedUsers = data.content.map(normalizeUser)
        setUsers(normalizedUsers)
        setPagination({
          currentPage: data.number || 0,
          totalPages: data.totalPages || 1,
          totalElements: data.totalElements || 0,
          size: data.size || 10,
          first: data.first || true,
          last: data.last || true,
        })
      } else if (Array.isArray(data)) {
        // Resposta simples (array)
        const normalizedUsers = data.map(normalizeUser)
        setUsers(normalizedUsers)
        setPagination({
          currentPage: 0,
          totalPages: 1,
          totalElements: normalizedUsers.length,
          size: normalizedUsers.length,
          first: true,
          last: true,
        })
      } else if (data.users && Array.isArray(data.users)) {
        // Resposta customizada com propriedade 'users'
        const normalizedUsers = data.users.map(normalizeUser)
        setUsers(normalizedUsers)
        setPagination(
          data.pagination || {
            currentPage: 0,
            totalPages: 1,
            totalElements: normalizedUsers.length,
            size: normalizedUsers.length,
            first: true,
            last: true,
          },
        )
      } else {
        throw new Error("Formato de resposta inválido. Esperado 'content', 'users' ou um array de usuários.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar usuários"
      setError(errorMessage)
      console.error("Erro ao buscar usuários:", err)

      toast({
        title: "Erro ao Carregar Usuários",
        description: errorMessage,
        variant: "destructive",
      })

      // Limpar dados em caso de erro
      setUsers([])
      setPagination({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        size: filters.size || 10,
        first: true,
        last: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, buildQueryParams, normalizeUser, toast])

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<AdminUserFiltersType>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset page when filters change (except when only page changes)
      page: newFilters.page !== undefined ? newFilters.page : 0,
    }))
  }, [])

  // Mudar página
  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  // Mudar tamanho da página
  const changePageSize = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }))
  }, [])

  // Ordenar por campo
  const changeSort = useCallback((field: string) => {
    setFilters((prev) => ({
      ...prev,
      sort: field,
      direction: prev.sort === field && prev.direction === "asc" ? "desc" : "asc",
      page: 0,
    }))
  }, [])

  // Recarregar dados
  const refetch = useCallback(() => {
    return loadUsers()
  }, [loadUsers])

  // Buscar usuário por ID
  const getUserById = useCallback(
    async (userId: string): Promise<AdminUser | null> => {
      try {
        const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsersId}${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }

        const data = await response.json()
        return normalizeUser(data)
      } catch (err) {
        console.error("Erro ao buscar usuário por ID:", err)
        return null
      }
    },
    [normalizeUser],
  )

  // Bloquear/desbloquear usuário
  const toggleUserLock = useCallback(
    async (userId: string, lock: boolean) => {
      try {
        setIsLoading(true)

        const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsersIdAlter}${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ locked: lock }),
        })

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }

        toast({
          title: "Sucesso",
          description: `Usuário ${lock ? "bloqueado" : "desbloqueado"} com sucesso.`,
        })

        // Recarregar dados
        await refetch()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
        toast({
          title: "Erro",
          description: `Não foi possível ${lock ? "bloquear" : "desbloquear"} o usuário. ${errorMessage}`,
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [toast, refetch],
  )

  // Resetar senha
  const resetUserPassword = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true)

        const response = await fetchWithValidation(
          `${ApiEndpoints.backend.adminUsersIdAlter}${userId}/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        )

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }

        toast({
          title: "Senha Resetada",
          description: "Uma nova senha temporária foi enviada por e-mail ao usuário.",
        })

        // Recarregar dados para atualizar status
        await refetch()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
        toast({
          title: "Erro",
          description: `Não foi possível resetar a senha do usuário. ${errorMessage}`,
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [toast, refetch],
  )

  // Exportar para CSV
  const exportToCsv = useCallback(async () => {
    try {
      setIsLoading(true)

      const queryParams = buildQueryParams(filters)
      // Remove paginação para exportar todos os dados
      queryParams.delete("page")
      queryParams.delete("size")

      const url = `${ApiEndpoints.backend.adminUsersList}/export?${queryParams.toString()}`

      const response = await fetchWithValidation(url, {
        method: "GET",
        headers: {
          Accept: "text/csv",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      // Criar download do arquivo CSV
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `usuarios_${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      toast({
        title: "Exportação Concluída",
        description: "O arquivo CSV foi gerado e o download iniciará em breve.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      toast({
        title: "Erro na Exportação",
        description: `Não foi possível gerar o arquivo CSV. ${errorMessage}`,
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [filters, buildQueryParams, toast])

  // Carregar dados quando os filtros mudarem
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  return {
    users,
    filters,
    pagination,
    isLoading,
    error,
    refetch,
    updateFilters,
    changePage,
    changePageSize,
    changeSort,
    toggleUserLock,
    resetUserPassword,
    getUserById,
    exportToCsv,
  }
}
