"use client"

import { useState, useEffect, useCallback } from "react"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type { Resource, ResourceFilters, ResourceStatus, ResourceType } from "@/types/resource"
import { useToast } from "@/components/ui/use-toast"

export function useResources(filters: ResourceFilters = {}) {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchResources = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()

      if (filters.search) searchParams.append("search", filters.search)
      if (filters.brand) searchParams.append("brand", filters.brand)
      if (filters.statusId) searchParams.append("statusId", filters.statusId)
      if (filters.resourceTypeId) searchParams.append("resourceTypeId", filters.resourceTypeId)
      if (filters.availableForUse !== null && filters.availableForUse !== undefined) {
        searchParams.append("availableForUse", filters.availableForUse.toString())
      }
      if (filters.purchaseDateFrom) searchParams.append("purchaseDateFrom", filters.purchaseDateFrom)
      if (filters.purchaseDateTo) searchParams.append("purchaseDateTo", filters.purchaseDateTo)
      if (filters.priceMin) searchParams.append("priceMin", filters.priceMin.toString())
      if (filters.priceMax) searchParams.append("priceMax", filters.priceMax.toString())

      const url = `${ApiEndpoints.backend.resourcesList}`

      const response = await fetchWithValidation(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar recursos: ${response.status}`)
      }

      const data = await response.json()
      const resourcesData = Array.isArray(data) ? data : data.data || []
      setResources(resourcesData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar recursos"
      setError(errorMessage)
      setResources([])
      toast({
        title: "Erro ao carregar recursos",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, toast])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  return {
    resources,
    isLoading,
    error,
    refetch: fetchResources,
  }
}

export function useResourceStatuses() {
  const [statuses, setStatuses] = useState<ResourceStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetchWithValidation(ApiEndpoints.backend.resourceStatusesList, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Erro ao buscar status: ${response.status}`)
        }

        const data = await response.json()
        const statusesData = Array.isArray(data) ? data : data.data || []
        setStatuses(statusesData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar status"
        setError(errorMessage)
        setStatuses([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatuses()
  }, [])

  return { statuses, isLoading, error }
}

export function useResourceTypes() {
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetchWithValidation(ApiEndpoints.backend.resourceTypesList, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Erro ao buscar tipos de recurso: ${response.status}`)
        }

        const data = await response.json()
        const typesData = Array.isArray(data) ? data : data.data || []
        setResourceTypes(typesData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar tipos de recurso"
        setError(errorMessage)
        setResourceTypes([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResourceTypes()
  }, [])

  return { resourceTypes, isLoading, error }
}
