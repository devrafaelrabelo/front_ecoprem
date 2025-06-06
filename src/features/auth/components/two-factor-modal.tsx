"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TwoFactorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (code: string) => Promise<boolean>
  isLoading?: boolean
}

export function TwoFactorModal({ isOpen, onClose, onSubmit }: TwoFactorModalProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code || code.length < 6) {
      setError("Por favor, insira um código válido.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const success = await onSubmit(code)
      if (!success) {
        setError("Código inválido. Por favor, tente novamente.")
      }
    } catch (err) {
      setError("Ocorreu um erro ao verificar o código. Por favor, tente novamente.")
      console.error("Erro na verificação 2FA:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Autenticação de dois fatores</DialogTitle>
          <DialogDescription>Por favor, insira o código de verificação enviado para seu dispositivo.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              id="twoFactorCode"
              placeholder="Código de verificação"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-lg tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
            />
            <p className="text-sm text-muted-foreground text-center">
              O código de 6 dígitos foi enviado para seu dispositivo registrado.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || code.length < 6}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verificar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
