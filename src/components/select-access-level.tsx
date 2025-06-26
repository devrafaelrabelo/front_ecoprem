"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const accessLevelOptions = [
  { value: "1", label: "Nível 1 (Básico)" },
  { value: "2", label: "Nível 2 (Intermediário)" },
  { value: "3", label: "Nível 3 (Avançado)" },
  // Add more access levels as needed
]

interface SelectAccessLevelProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function SelectAccessLevel({ value, onChange, disabled }: SelectAccessLevelProps) {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="accessLevel">Nível de Acesso</Label>
      <Select onValueChange={onChange} value={value} disabled={disabled}>
        <SelectTrigger id="accessLevel">
          <SelectValue placeholder="Selecione um nível de acesso" />
        </SelectTrigger>
        <SelectContent>
          {accessLevelOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
