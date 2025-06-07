import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"
import { BackendStatusIndicator } from "@/components/backend-status-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "App",
  description: "Sistema de autenticação",
}

function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            var theme = localStorage.getItem('theme')
            var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            var resolvedTheme = theme === 'system' || !theme ? systemTheme : theme
            
            if (resolvedTheme === 'dark') {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          } catch (e) {}
        `,
      }}
    />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientProviders>
            {children}
           <BackendStatusIndicator />
        </ClientProviders>
      </body>
    </html>
  )
}
