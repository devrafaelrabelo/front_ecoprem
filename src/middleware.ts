// ✅ middleware.ts - Com status de autenticação
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { config as appConfig } from "@/config"

const publicRoutes = ["/login", "/forgot-password", "/register", "/test"]
const apiRoutes = ["/api"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Debug: Log da requisição
  console.log(`🔍 Middleware: ${pathname}`)

  // Ignorar rotas da API
  if (apiRoutes.some((route) => pathname.startsWith(route))) {
    console.log(`📡 API route ignored: ${pathname}`)
    return NextResponse.next()
  }

  // Ignorar arquivos estáticos e sistema
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/.well-known/") ||
    pathname.includes("/favicon") ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot|json|xml|txt|map)$/)
  ) {
    return NextResponse.next()
  }

  // Verificar todos os cookies da requisição (incluindo HttpOnly)
  const allCookies = request.headers.get("cookie") || ""
  console.log(`🍪 Todos os cookies da requisição:`, allCookies)

  // Verificar especificamente os cookies de auth que esperamos
  const authCookieNames = ["ecoprem_auth_token", "ecoprem_refresh_token", "JSESSIONID", "SESSION"]
  const foundAuthCookies = authCookieNames.filter((name) => allCookies.includes(`${name}=`))

  console.log(`🔐 Cookies de auth encontrados:`, foundAuthCookies)

  let isAuthenticated = false
  let userInfo = null

  // Se há cookies, tentar validar (cookies HttpOnly são enviados automaticamente)
  if (allCookies.length > 0) {
    try {
      const validateUrl = `${appConfig.api.baseUrl}/api/auth/session`
      console.log(`🔐 Validando em: ${validateUrl}`)
      console.log(`📤 Enviando cookies:`, allCookies.substring(0, 100) + "...")

      const res = await fetch(validateUrl, {
        method: "GET",
        headers: {
          // Enviar TODOS os cookies para o backend
          cookie: allCookies,
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": "NextJS-Middleware/1.0",
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(8000),
      })

      console.log(`📊 Status validação: ${res.status}`)

      if (res.ok) {
        const responseData = await res.text()
        console.log(`✅ Validação bem-sucedida:`, responseData.substring(0, 100))
        isAuthenticated = true

        // Tentar extrair informações do usuário se disponível
        try {
          userInfo = JSON.parse(responseData)
        } catch {
          // Se não for JSON, manter como null
        }
      } else {
        const errorText = await res.text().catch(() => "No response body")
        console.log(`❌ Erro validação (${res.status}):`, errorText.substring(0, 200))
        isAuthenticated = false
      }
    } catch (err: any) {
      console.error(`💥 Erro na validação:`, err.message)
      if (err.name === "TimeoutError") {
        console.error(`⏱️ Timeout na validação - backend pode estar lento`)
      }
      isAuthenticated = false
    }
  } else {
    console.log(`🚫 Nenhum cookie encontrado na requisição`)
  }

  console.log(`🔒 Autenticado: ${isAuthenticated}`)

  // Função para criar resposta com status de auth
  const createResponseWithAuthStatus = (response: NextResponse) => {
    // ✅ Cookie não-HttpOnly que o JavaScript pode ler
    response.cookies.set("auth_status", isAuthenticated ? "authenticated" : "unauthenticated", {
      httpOnly: false, // Permite acesso via JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60, // 1 minuto de cache
      path: "/",
    })

    // ✅ Header adicional para verificação
    response.headers.set("X-Auth-Status", isAuthenticated ? "authenticated" : "unauthenticated")

    // ✅ Se há informações do usuário, adicionar como header (dados básicos apenas)
    if (userInfo && typeof userInfo === "object") {
      const basicUserInfo = {
        id: userInfo.id,
        name: userInfo.name || userInfo.username,
        email: userInfo.email,
      }
      response.headers.set("X-User-Info", JSON.stringify(basicUserInfo))
    }

    return response
  }

  // Lógica de redirecionamento para rota raiz
  if (pathname === "/") {
    if (isAuthenticated) {
      const redirectCookie = request.cookies.get("redirect_after_login")?.value
      const destination = redirectCookie || "/system-selection"
      console.log(`🏠 Redirecionando autenticado para: ${destination}`)
      const response = NextResponse.redirect(new URL(destination, request.url))
      if (redirectCookie) response.cookies.delete("redirect_after_login")
      return createResponseWithAuthStatus(response)
    } else {
      console.log(`🏠 Redirecionando não autenticado para: /login`)
      const response = NextResponse.redirect(new URL("/login", request.url))
      return createResponseWithAuthStatus(response)
    }
  }

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
  console.log(`🌐 Rota pública: ${isPublicRoute}`)

  // Bloquear acesso a rotas protegidas se não autenticado
  if (!isPublicRoute && !isAuthenticated) {
    console.log(`🚫 Bloqueando acesso não autenticado a: ${pathname}`)
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.set("redirect_after_login", pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 300,
      path: "/",
    })
    return createResponseWithAuthStatus(response)
  }

  // Redirecionar usuários autenticados da página de login
  if (pathname === "/login" && isAuthenticated) {
    const redirectCookie = request.cookies.get("redirect_after_login")?.value
    const destination = redirectCookie || "/system-selection"
    console.log(`🔄 Redirecionando usuário autenticado do login para: ${destination}`)
    const response = NextResponse.redirect(new URL(destination, request.url))
    response.cookies.delete("redirect_after_login")
    return createResponseWithAuthStatus(response)
  }

  // Redirecionar usuários autenticados de outras rotas públicas (exceto logout)
  if (isPublicRoute && isAuthenticated && pathname !== "/logout" && pathname !== "/test") {
    console.log(`🔄 Redirecionando usuário autenticado de rota pública: ${pathname}`)
    const response = NextResponse.redirect(new URL("/system-selection", request.url))
    return createResponseWithAuthStatus(response)
  }

  console.log(`✅ Permitindo acesso a: ${pathname}`)
  const response = NextResponse.next()
  return createResponseWithAuthStatus(response)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|fonts|examples).*)"],
}
