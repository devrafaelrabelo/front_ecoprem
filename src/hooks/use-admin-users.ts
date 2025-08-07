"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type { AdminUser } from "@/types/admin-user"

interface AdminUserFilters {
  search: string
  status: string
  role: string
  department: string
  emailVerified: string
  twoFactorEnabled: string
  dateRange: {
    from: Date | null
    to: Date | null
  }
}

interface AdminUserStats {
  total: number
  active: number
  inactive: number
  suspended: number
  pending: number
  blocked: number
  twoFactorEnabled: number
  emailVerified: number
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<AdminUserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    pending: 0,
    blocked: 0,
    twoFactorEnabled: 0,
    emailVerified: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<AdminUserFilters>({
    search: "",
    status: "all",
    role: "all",
    department: "all",
    emailVerified: "all",
    twoFactorEnabled: "all",
    dateRange: {
      from: null,
      to: null,
    },
  })

  const { toast } = useToast()

  // Fetch users from API
  const fetchUsers = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }

    try {
      const response = await fetchWithValidation(ApiEndpoints.backend.adminUsers, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setUsers(data.users || [])
      
      if (!showLoading) {
        toast({
          title: "Dados atualizados!",
          description: "A lista de usuários foi atualizada com sucesso.",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao carregar usuários"
      
      toast({
        title: "Erro ao carregar usuários",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [toast])

  // Calculate statistics
  const calculateStats = useCallback((userList: AdminUser[]) => {
    const stats: AdminUserStats = {
      total: userList.length,
      active: 0,
      inactive: 0,
      suspended: 0,
      pending: 0,
      blocked: 0,
      twoFactorEnabled: 0,
      emailVerified: 0,
    }

    userList.forEach(user => {
      switch (user.status?.toLowerCase()) {
        case 'active':
          stats.active++
          break
        case 'inactive':
          stats.inactive++
          break
        case 'suspended':
          stats.suspended++
          break
        case 'pending':
          stats.pending++
          break
        case 'blocked':
          stats.blocked++
          break
      }

      if (user.twoFactorEnabled) {
        stats.twoFactorEnabled++
      }

      if (user.emailVerified) {
        stats.emailVerified++
      }
    })

    return stats
  }, [])

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...users]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(user =>
        user.fullName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.username?.toLowerCase().includes(searchLower) ||
        user.cpf?.includes(filters.search)
      )
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(user => user.status?.toLowerCase() === filters.status)
    }

    // Role filter
    if (filters.role !== "all") {
      filtered = filtered.filter(user => 
        user.roles?.some(role => role.name?.toLowerCase() === filters.role)
      )
    }

    // Department filter
    if (filters.department !== "all") {
      filtered = filtered.filter(user =>
        user.departments?.some(dept => dept.name?.toLowerCase() === filters.department)
      )
    }

    // Email verified filter
    if (filters.emailVerified !== "all") {
      const isVerified = filters.emailVerified === "true"
      filtered = filtered.filter(user => user.emailVerified === isVerified)
    }

    // Two factor enabled filter
    if (filters.twoFactorEnabled !== "all") {
      const isEnabled = filters.twoFactorEnabled === "true"
      filtered = filtered.filter(user => user.twoFactorEnabled === isEnabled)
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(user => {
        if (!user.createdAt) return false
        
        const userDate = new Date(user.createdAt)
        const fromDate = filters.dateRange.from
        const toDate = filters.dateRange.to

        if (fromDate && userDate < fromDate) return false
        if (toDate && userDate > toDate) return false
        
        return true
      })
    }

    setFilteredUsers(filtered)
    setStats(calculateStats(filtered))
  }, [users, filters, calculateStats])

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<AdminUserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      role: "all",
      department: "all",
      emailVerified: "all",
      twoFactorEnabled: "all",
      dateRange: {
        from: null,
        to: null,
      },
    })
  }, [])

  // Export users to CSV
  const exportUsers = useCallback(async () => {
    setIsExporting(true)
    
    try {
      const dataToExport = selectedUsers.size > 0 
        ? filteredUsers.filter(user => selectedUsers.has(user.id))
        : filteredUsers

      const csvContent = [
        // Header
        [
          "ID",
          "Nome Completo",
          "Email",
          "Username",
          "CPF",
          "Status",
          "Email Verificado",
          "2FA Habilitado",
          "Último Login",
          "Data de Criação",
          "Roles",
          "Departamentos"
        ].join(","),
        // Data
        ...dataToExport.map(user => [
          user.id,
          `"${user.fullName || ''}"`,
          user.email || '',
          user.username || '',
          user.cpf || '',
          user.status || '',
          user.emailVerified ? 'Sim' : 'Não',
          user.twoFactorEnabled ? 'Sim' : 'Não',
          user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('pt-BR') : '',
          user.createdAt ? new Date(user.createdAt).toLocaleString('pt-BR') : '',
          `"${user.roles?.map(r => r.name).join(', ') || ''}"`,
          `"${user.departments?.map(d => d.name).join(', ') || ''}"`
        ].join(","))
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `usuarios_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      toast({
        title: "Exportação concluída!",
        description: `${dataToExport.length} usuários exportados com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados dos usuários.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [filteredUsers, selectedUsers, toast])

  // User actions
  const lockUser = useCallback(async (userId: string) => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsers}/${userId}/lock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      await fetchUsers(false)
      
      toast({
        title: "Usuário bloqueado!",
        description: "O usuário foi bloqueado com sucesso.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao bloquear usuário"
      
      toast({
        title: "Erro ao bloquear usuário",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [fetchUsers, toast])

  const unlockUser = useCallback(async (userId: string) => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsers}/${userId}/unlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      await fetchUsers(false)
      
      toast({
        title: "Usuário desbloqueado!",
        description: "O usuário foi desbloqueado com sucesso.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao desbloquear usuário"
      
      toast({
        title: "Erro ao desbloquear usuário",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [fetchUsers, toast])

  const resetPassword = useCallback(async (userId: string) => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.adminUsers}/${userId}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      toast({
        title: "Senha redefinida!",
        description: result.message || "A senha do usuário foi redefinida com sucesso.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao redefinir senha"
      
      toast({
        title: "Erro ao redefinir senha",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [toast])

  // Selection management
  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }, [])

  const selectAllUsers = useCallback(() => {
    setSelectedUsers(new Set(filteredUsers.map(user => user.id)))
  }, [filteredUsers])

  const clearSelection = useCallback(() => {
    setSelectedUsers(new Set())
  }, [])

  // Effects
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  return {
    // Data
    users: filteredUsers,
    stats,
    selectedUsers,
    filters,
    
    // States
    isLoading,
    isRefreshing,
    isExporting,
    
    // Actions
    fetchUsers,
    updateFilters,
    resetFilters,
    exportUsers,
    lockUser,
    unlockUser,
    resetPassword,
    
    // Selection
    toggleUserSelection,
    selectAllUsers,
    clearSelection,
  }
}
