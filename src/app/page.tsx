import { redirect } from "next/navigation"

export default function HomePage() {
  // Com middleware configurado, esta página nunca deveria ser acessada
  // O middleware já redireciona "/" para "/login" ou "/system-selection"
  // Mantemos apenas como fallback de segurança
  redirect("/login")
}
