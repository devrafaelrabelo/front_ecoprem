import type React from "react"
import { SessionTimeoutModal } from "@/components/session-timeout-modal"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SessionTimeoutModal />
      <main className="container mx-auto py-6">{children}</main>
    </div>
  )
}
