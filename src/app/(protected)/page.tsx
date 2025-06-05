"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to system selection
    router.push("/system-selection")
  }, [router])

  return null
}
