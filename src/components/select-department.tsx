"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const departmentOptions = [
  { value: "Comercial", label: "Comercial" },
  { value: "RH", label: "RH" },
  { value: "TI", label: "TI" },
  // Add more departments as needed
]

interface SelectDepartmentProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function SelectDepartment({ value, onChange, disabled }: SelectDepartmentProps) {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="department">Departamento</Label>
      <Select onValueChange={onChange} value={value} disabled={disabled}>
        <SelectTrigger id="department">
          <SelectValue placeholder="Selecione um departamento" />
        </SelectTrigger>
        <SelectContent>
          {departmentOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
