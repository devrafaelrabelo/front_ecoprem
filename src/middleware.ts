// ✅ middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { config as appConfig } from "@/config"

const publicRoutes = ["/login", "/forgot-password", "/register"]
const apiRoutes = ["/api"]

const AUTH_COOKIE_NAME = "ecoprem_auth_token"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorar rotas da API
  if (apiRoutes.some((route) => pathname.startsWith(route))) return NextResponse.next()

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

  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value
  let isAuthenticated = false

  if (authToken) {
    try {
      const validateUrl = `${appConfig.api.baseUrl}/api/auth/validate`
      const res = await fetch(validateUrl, {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") || "",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        signal: AbortSignal.timeout(3000),
      })
      isAuthenticated = res.ok
    } catch (err) {
      isAuthenticated = false
    }
  }

  if (pathname === "/") {
    if (isAuthenticated) {
      const redirectCookie = request.cookies.get("redirect_after_login")?.value
      const destination = redirectCookie || "/system-selection"
      const response = NextResponse.redirect(new URL(destination, request.url))
      if (redirectCookie) response.cookies.delete("redirect_after_login")
      return response
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (!isPublicRoute && !isAuthenticated) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.set("redirect_after_login", pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 300,
      path: "/",
    })
    return response
  }

  if (pathname === "/login" && isAuthenticated) {
    const redirectCookie = request.cookies.get("redirect_after_login")?.value
    const destination = redirectCookie || "/system-selection"
    const response = NextResponse.redirect(new URL(destination, request.url))
    response.cookies.delete("redirect_after_login")
    return response
  }

  if (isPublicRoute && isAuthenticated && pathname !== "/logout") {
    return NextResponse.redirect(new URL("/system-selection", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|fonts|examples).*)"],
}