const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetchWithValidation(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
  })

  if (response.status === 401 || response.status === 403) {
    // Tenta validar sessão
    const validate = await fetch(`${API_BASE_URL}/api/auth/session`, { method: "GET", credentials: "include" })
    if (validate.ok) {
      // Se a sessão ainda estiver válida (renovada), tenta novamente
      return fetch(input, {
        ...init,
        credentials: "include",
      })
    }

    // Caso contrário, redireciona
    window.location.href = "/login"
    throw new Error("Sessão expirada. Redirecionando para login...")
  }

  return response
}

export default fetchWithValidation