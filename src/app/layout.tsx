import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"
import { BackendStatusIndicator } from "@/components/backend-status-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema EcoPrem",
  description: "Sistema de gestão EcoPrem",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientProviders>
          {children}
          <BackendStatusIndicator />
        </ClientProviders>
      </body>
    </html>
  )
}
