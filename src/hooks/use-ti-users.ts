"use client"

import { useState, useEffect, useCallback } from "react"
import { ApiEndpoints } from "@/lib/api-endpoints"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import type { UserInterface } from "@/components/ti-user-table"

interface UseUsersReturn {
  users: UserInterface[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  createUser: (userData: Partial<UserInterface>) => Promise<void>
  updateUser: (id: string, userData: Partial<UserInterface>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  getUserById: (id: string) => Promise<UserInterface | null>
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      const response = await fetchWithValidation(ApiEndpoints.backend.adminUsersList, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`)
      }
     
      const data = await response.json()
      console.log("Dados recebidos:", data)
      const normalizedUsers = Array.isArray(data)
        ? data.map(normalizeUser)
        : Array.isArray(data.users)
          ? data.users.map(normalizeUser)
          : []

      setUsers(normalizedUsers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar usuários"
      setError(errorMessage)
      console.error("Erro ao buscar usuários:", err)
    } finally {
      setIsLoading(false)
    }
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

        // Recarregar a lista após criar
        await fetchUsers()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao criar usuário"
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUsers],
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

        // Recarregar a lista após atualizar
        await fetchUsers()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar usuário"
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUsers],
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

        // Recarregar a lista após excluir
        await fetchUsers()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao excluir usuário"
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUsers],
  )

  // Carregar usuários na inicialização
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  }
}
