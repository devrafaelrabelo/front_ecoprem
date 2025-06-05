import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { config as appConfig } from "@/config"

// Rotas públicas que não exigem autenticação
const publicRoutes = ["/login", "/forgot-password", "/register"]

// Rotas da API que devem ser ignoradas pelo middleware
const apiRoutes = ["/api"]

// ✅ NOMES DOS COOKIES HTTPONLY (GERENCIADOS PELO BACKEND)
const AUTH_COOKIE_NAME = "ecoprem_auth_token"
const REFRESH_COOKIE_NAME = "ecoprem_refresh_token"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log("🛡️ Middleware executando para:", pathname)

  // 1. Ignorar rotas da API
  if (apiRoutes.some((route) => pathname.startsWith(route))) {
    console.log("➡️ Middleware: Ignorando rota da API.")
    return NextResponse.next()
  }

  // 2. Ignorar assets estáticos (imagens, SVGs, etc.)
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes("/favicon") ||
    pathname.includes("/placeholder.svg") ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/)
  ) {
    console.log("➡️ Middleware: Ignorando asset estático.")
    return NextResponse.next()
  }

  // 3. Tratar a rota raiz (/) separadamente
  if (pathname === "/") {
    console.log("🏠 Middleware: Rota raiz detectada, redirecionando para login.")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // ✅ COOKIES HTTPONLY SÃO ACESSÍVEIS NO SERVIDOR (MIDDLEWARE)
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value

  console.log(
    `🍪 Middleware: Verificando cookies HttpOnly - Auth: ${authToken ? "presente" : "ausente"}, Refresh: ${refreshToken ? "presente" : "ausente"}`,
  )

  let isAuthenticated = false

  // ✅ VALIDAÇÃO REAL COM BACKEND - ÚNICA FORMA SEGURA
  if (authToken || refreshToken) {
    try {
      const validateUrl = `${appConfig.api.baseUrl}/api/auth/validate`
      console.log(`🔍 Middleware: Validando cookies HttpOnly com backend`)

      const res = await fetch(validateUrl, {
        method: "GET",
        headers: {
          // ✅ PASSAR TODOS OS COOKIES VIA HEADER (INCLUINDO HTTPONLY)
          cookie: request.headers.get("cookie") || "",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
          "User-Agent": "NextJS-Middleware/1.0",
        },
        // ✅ NÃO USAR credentials: "include" NO MIDDLEWARE
        signal: AbortSignal.timeout(3000),
      })

      if (res.ok) {
        const data = await res.json()
        isAuthenticated = data?.valid === true || data?.authenticated === true || !!data?.user
        console.log(`✅ Middleware: Cookies HttpOnly validados. Autenticado: ${isAuthenticated}`)
      } else if (res.status === 401 || res.status === 403) {
        console.log(`🚫 Middleware: Cookies HttpOnly inválidos/expirados. Status: ${res.status}`)
        isAuthenticated = false
      } else {
        console.warn(`⚠️ Middleware: Erro inesperado na validação. Status: ${res.status}`)
        isAuthenticated = false
      }
    } catch (err) {
      console.error("❌ Middleware: Erro ao validar cookies HttpOnly:", err)
      isAuthenticated = false
    }
  } else {
    console.log("🚫 Middleware: Nenhum cookie HttpOnly encontrado.")
    isAuthenticated = false
  }

  // 5. Lógica de redirecionamento baseada na validação real
  if (!isPublicRoute && !isAuthenticated) {
    // Criar cookie temporário com destino
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.set("redirect_after_login", pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutos
      path: "/",
    })
    console.log("🔒 Middleware: Redirecionando para login - salvando destino:", pathname)
    return response
  }

  // Verificar se usuário autenticado está tentando acessar login
  if (pathname === "/login" && isAuthenticated) {
    const redirectCookie = request.cookies.get("redirect_after_login")?.value
    const destination = redirectCookie || "/system-selection"

    // Limpar cookie de redirecionamento
    const response = NextResponse.redirect(new URL(destination, request.url))
    response.cookies.delete("redirect_after_login")

    console.log("✅ Middleware: Usuário já autenticado, redirecionando para:", destination)
    return response
  }

  if (isPublicRoute && isAuthenticated && pathname !== "/logout") {
    console.log("✅ Middleware: Redirecionando para dashboard - já autenticado.")
    return NextResponse.redirect(new URL("/system-selection", request.url))
  }

  console.log("➡️ Middleware: Permitindo acesso à rota.")
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|fonts|examples).*)"],
}
