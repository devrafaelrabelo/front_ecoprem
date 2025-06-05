/**
 * Configurações da aplicação
 * Este arquivo centraliza todas as configurações da aplicação
 */

// Determinar o ambiente atual
const isProduction = process.env.NODE_ENV === "production"
const isTest = process.env.NODE_ENV === "test"
const isDevelopment = process.env.NODE_ENV === "development"

// Nome do sistema obtido da variável de ambiente
const systemName = process.env.NEXT_PUBLIC_SYSTEM_NAME || "ProjectBasePronto"

// Logo URL obtida da variável de ambiente
const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "/placeholder.svg?height=40&width=40&text=Logo"

// Determinar a URL base da API com base no ambiente
let apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// Se não estiver definido explicitamente, usar os valores padrão com base no ambiente
if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  if (isProduction) {
    apiBaseUrl = "http://localhost:8080"
  } else if (isTest) {
    apiBaseUrl = "http://localhost:8080"
  }
}

export const config = {
  // Configurações gerais
  app: {
    name: systemName,
    logoUrl: logoUrl,
    version: "1.0.0",
    isDevelopment,
    isProduction,
    isTest,
  },

  // Configurações de API
  api: {
    // URL base da API - obtida das variáveis de ambiente ou valores padrão
    baseUrl: apiBaseUrl,
    // Timeout das requisições em milissegundos
    timeout: 10000,
  },

  // Configurações de tema
  theme: {
    // Tema padrão
    default: "system",
    // Temas disponíveis
    available: ["light", "dark", "system"],
  },
}

// Exportar constantes individuais para facilitar o uso
export const API_URL = config.api.baseUrl
export const APP_NAME = config.app.name
export const APP_VERSION = config.app.version
export const IS_DEVELOPMENT = config.app.isDevelopment
export const IS_PRODUCTION = config.app.isProduction
export const IS_TEST = config.app.isTest
export const LOGO_URL = config.app.logoUrl
