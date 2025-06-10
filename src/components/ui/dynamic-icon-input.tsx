"use client"

import * as React from "react"
import { Mail, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface DynamicIconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: boolean
  errorMessage?: string
}

const DynamicIconInput = React.forwardRef<HTMLInputElement, DynamicIconInputProps>(
  ({ className, label, error, errorMessage, value, id, ...props }, ref) => {
    // Detectar se é email baseado na presença de @
    const isEmail = typeof value === "string" && value.includes("@")

    return (
      <div className="space-y-2">
        <Label htmlFor={id} className={error ? "text-red-500" : ""}>
          {label}
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200">
            {isEmail ? <Mail className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <Input
            id={id}
            value={value}
            className={cn("pl-10", error && "border-red-500 focus-visible:ring-red-500", className)}
            ref={ref}
            {...props}
          />
        </div>
        {error && errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>
    )
  },
)
DynamicIconInput.displayName = "DynamicIconInput"

export { DynamicIconInput }
