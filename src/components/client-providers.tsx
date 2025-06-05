"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/features/auth/context/auth-context"
import { Toaster } from "@/components/ui/toaster"

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="theme">
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
