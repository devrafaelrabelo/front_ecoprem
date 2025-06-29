"use client"

import { useState, useEffect } from "react"
import type { MenuData, ProcessedMenuData } from "@/types/menu"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { processMenuData } from "@/app/utils/menu-permissions"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function useMenuData() {
  const [menuData, setMenuData] = useState<ProcessedMenuData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMenuData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchWithValidation(`${API_BASE_URL}/api/user/permissions`)  

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do menu: ${response.status}`)
      }

      const rawMenuData: MenuData = await response.json()
      const processedData = processMenuData(rawMenuData)

      setMenuData(processedData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar menu"
      setError(errorMessage)
      console.error("Erro ao buscar dados do menu:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuData()
  }, [])

  return { menuData, isLoading, error, refetch: fetchMenuData }
}
