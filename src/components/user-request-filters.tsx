"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { UserRequestFilters } from "@/types/user-request"

interface UserRequestFiltersProps {
  filters: UserRequestFilters
  onFiltersChange: (filters: UserRequestFilters) => void
  onClearFilters: () => void
}

export function UserRequestFiltersComponent({ filters, onFiltersChange, onClearFilters }: UserRequestFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: keyof UserRequestFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const hasActiveFilters =
    filters.status !== "" || filters.searchTerm !== "" || filters.dateFrom !== "" || filters.dateTo !== ""

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center justify-between p-0 h-auto">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-4 w-4" />
                Filtros
                {hasActiveFilters && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Ativo</span>
                )}
              </CardTitle>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Busca por nome/CPF */}
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nome ou CPF..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Filtro por status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="APPROVED">Aprovado</SelectItem>
                    <SelectItem value="REJECTED">Rejeitado</SelectItem>
                    <SelectItem value="COMPLETED">Concluído</SelectItem>
                    <SelectItem value="CANCELED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data inicial */}
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Data inicial</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                />
              </div>

              {/* Data final */}
              <div className="space-y-2">
                <Label htmlFor="dateTo">Data final</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>

            {/* Botão para limpar filtros */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={onClearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
