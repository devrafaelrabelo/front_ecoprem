import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"
import { APP_NAME } from "@/config"
import { BackendStatusIndicator } from "@/components/backend-status-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: APP_NAME,
  description: `Sistema de autenticação - ${APP_NAME}`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ClientProviders>
          {children}
          <BackendStatusIndicator />
        </ClientProviders>
      </body>
    </html>
  )
}
