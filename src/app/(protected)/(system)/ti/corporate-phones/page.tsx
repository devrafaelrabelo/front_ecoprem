"use client"

import { useState, useEffect, useCallback } from "react"
import { Phone, Plus, Users, MessageCircle, Shield, RefreshCw, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CorporatePhoneFilters } from "@/components/corporate-phone-filters"
import { CorporatePhoneTable } from "@/components/corporate-phone-table"
import { CreateCorporatePhoneModal } from "@/components/create-corporate-phone-modal"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type {
  CorporatePhone,
  CreateCorporatePhoneRequest,
  UpdateCorporatePhoneRequest,
  CorporatePhoneFilters as Filters,
} from "@/types/corporate-phone"

export default function CorporatePhonesPage() {
  const { toast } = useToast()

  // Estados - inicializando corporatePhones como array vazio para evitar o erro
  const [corporatePhones, setCorporatePhones] = useState<CorporatePhone[]>([])
  const [filteredPhones, setFilteredPhones] = useState<CorporatePhone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({})

  // Função para buscar telefones corporativos
  const fetchCorporatePhones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchWithValidation(ApiEndpoints.backend.resourceCorporatePhoneList, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Falha ao carregar telefones corporativos")
      }

      const data = await response.json()
      // Garantindo que sempre seja um array
      const phones = Array.isArray(data) ? data : data.data && Array.isArray(data.data) ? data.data : []
      setCorporatePhones(phones)
    } catch (err) {
      console.error("Erro ao buscar telefones corporativos:", err)
      setError("Falha ao carregar telefones corporativos. Tente novamente.")
      setCorporatePhones([]) // Garantindo que seja array mesmo em caso de erro
      toast({
        title: "Erro",
        description: "Falha ao carregar telefones corporativos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Função para criar telefone corporativo
  const createCorporatePhone = async (data: CreateCorporatePhoneRequest): Promise<CorporatePhone> => {
    try {
      const response = await fetchWithValidation(ApiEndpoints.backend.resourceCorporatePhoneCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar telefone corporativo")
      }

      const newPhone = await response.json()
      setCorporatePhones((prev) => [...prev, newPhone])

      toast({
        title: "Sucesso!",
        description: "Telefone corporativo criado com sucesso.",
      })

      return newPhone
    } catch (error) {
      console.error("Erro ao criar telefone corporativo:", error)
      toast({
        title: "Erro",
        description: "Falha ao criar telefone corporativo.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Função para atualizar telefone corporativo
  const updateCorporatePhone = async (data: UpdateCorporatePhoneRequest): Promise<CorporatePhone> => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceCorporatePhoneIdAlter}/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar telefone corporativo")
      }

      const updatedPhone = await response.json()
      setCorporatePhones((prev) => prev.map((phone) => (phone.id === data.id ? updatedPhone : phone)))

      toast({
        title: "Sucesso!",
        description: "Telefone corporativo atualizado com sucesso.",
      })

      return updatedPhone
    } catch (error) {
      console.error("Erro ao atualizar telefone corporativo:", error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar telefone corporativo.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Função para excluir telefone corporativo
  const deleteCorporatePhone = async (id: number): Promise<void> => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceCorporatePhoneIdDelete}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir telefone corporativo")
      }

      setCorporatePhones((prev) => prev.filter((phone) => phone.id !== id))

      toast({
        title: "Sucesso!",
        description: "Telefone corporativo excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir telefone corporativo:", error)
      toast({
        title: "Erro",
        description: "Falha ao excluir telefone corporativo.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Aplicar filtros
  useEffect(() => {
    // Garantindo que corporatePhones seja sempre um array antes de filtrar
    if (!Array.isArray(corporatePhones)) {
      setFilteredPhones([])
      return
    }

    let filtered = corporatePhones

    if (filters.search) {
      filtered = filtered.filter((phone) => phone.number.toLowerCase().includes(filters.search!.toLowerCase()))
    }

    if (filters.carrier) {
      filtered = filtered.filter((phone) => phone.carrier === filters.carrier)
    }

    if (filters.planType) {
      filtered = filtered.filter((phone) => phone.planType === filters.planType)
    }

    if (filters.status) {
      filtered = filtered.filter((phone) => phone.status === filters.status)
    }

    if (filters.whatsappBlock !== undefined) {
      filtered = filtered.filter((phone) => phone.whatsappBlock === filters.whatsappBlock)
    }

    if (filters.companyId) {
      filtered = filtered.filter((phone) => phone.companyId === filters.companyId)
    }

    if (filters.currentUserId) {
      filtered = filtered.filter((phone) => phone.currentUserId === filters.currentUserId)
    }

    setFilteredPhones(filtered)
  }, [corporatePhones, filters])

  // Carregar dados iniciais
  useEffect(() => {
    fetchCorporatePhones()
  }, [fetchCorporatePhones])

  // Calcular estatísticas - garantindo que corporatePhones seja array
  const stats = {
    total: Array.isArray(corporatePhones) ? corporatePhones.length : 0,
    active: Array.isArray(corporatePhones) ? corporatePhones.filter((phone) => phone.status === "ACTIVE").length : 0,
    assigned: Array.isArray(corporatePhones)
      ? corporatePhones.filter((phone) => phone.currentUserId !== null).length
      : 0,
    whatsappBlocked: Array.isArray(corporatePhones)
      ? corporatePhones.filter((phone) => phone.whatsappBlock === true).length
      : 0,
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
  }

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Phone className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar telefones</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchCorporatePhones}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Phone className="h-8 w-8" />
            Telefones Corporativos
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie os telefones corporativos da empresa</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Telefone
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Telefones</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">telefones cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">telefones ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atribuídos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
            <p className="text-xs text-muted-foreground">em uso por usuários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Bloqueado</CardTitle>
            <MessageCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.whatsappBlocked}</div>
            <p className="text-xs text-muted-foreground">com WhatsApp bloqueado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <CorporatePhoneFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Lista de Telefones Corporativos
            {!loading && (
              <span className="text-sm font-normal text-muted-foreground">
                ({filteredPhones.length} {filteredPhones.length === 1 ? "item" : "itens"})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando telefones...</p>
              </div>
            </div>
          ) : (
            <CorporatePhoneTable
              corporatePhones={Array.isArray(filteredPhones) ? filteredPhones : []}
              onUpdate={updateCorporatePhone}
              onDelete={deleteCorporatePhone}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de criação */}
      <CreateCorporatePhoneModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={createCorporatePhone}
        onSuccess={handleCreateSuccess}
        loading={loading}
      />
    </div>
  )
}
