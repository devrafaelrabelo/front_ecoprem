"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const userGroupOptions: Record<string, { value: string; label: string }[]> = {
  Comercial: [
    { value: "consultor_comercial", label: "Consultor Comercial" },
    { value: "gestor_comercial", label: "Gestor Comercial" },
    { value: "supervisor_comercial", label: "Supervisor Comercial" },
  ],
  RH: [
    { value: "analista_rh", label: "Analista RH" },
    { value: "gestor_rh", label: "Gestor RH" },
    { value: "supervisor_rh", label: "Supervisor RH" },
  ],
  TI: [
    { value: "analista_ti", label: "Analista TI" },
    { value: "desenvolvedor_ti", label: "Desenvolvedor TI" },
    { value: "gestor_ti", label: "Gestor TI" },
    { value: "supervisor_ti", label: "Supervisor TI" },
  ],
  // Add more user groups per department as needed
}

interface SelectUserGroupProps {
  value: string
  onChange: (value: string) => void
  departmentId: string | undefined
  disabled?: boolean
}

export function SelectUserGroup({ value, onChange, departmentId, disabled }: SelectUserGroupProps) {
  const currentGroupOptions = departmentId ? userGroupOptions[departmentId] || [] : []

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="userGroup">Grupo de Usuário</Label>
      <Select
        onValueChange={onChange}
        value={value}
        disabled={disabled || !departmentId || currentGroupOptions.length === 0}
      >
        <SelectTrigger id="userGroup">
          <SelectValue placeholder={!departmentId ? "Selecione um departamento primeiro" : "Selecione um grupo"} />
        </SelectTrigger>
        <SelectContent>
          {currentGroupOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
