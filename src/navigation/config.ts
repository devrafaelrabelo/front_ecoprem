import { HelpCircle, Home } from "lucide-react"

// Define system types
export type SystemType = string

// Interface for navigation items
export interface NavItem {
  title: string
  path: string
  icon: any
  children?: NavItem[]
  description?: string
}

// Interface for system information
export interface SystemInfo {
  id: SystemType
  name: string
  color: string
  bgColor: string
  icon: any
  description: string
  homePath: string
  items: NavItem[]
}

// Main navigation configuration with generic systems
export const SYSTEMS_CONFIG: Record<string, SystemInfo> = {
  none: {
    id: "none",
    name: "Sistema",
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-800/30",
    icon: Home,
    description: "Sistema principal",
    homePath: "/system-selection",
    items: [
      {
        title: "Seleção de Sistema",
        path: "/system-selection",
        icon: Home,
        description: "Escolha um sistema",
      },
      {
        title: "Ajuda",
        path: "/help",
        icon: HelpCircle,
        description: "Suporte e documentação",
      },
    ],
  },
}

// Common navigation items that appear in all systems
export const COMMON_NAV_ITEMS: NavItem[] = [
  {
    title: "Ajuda",
    path: "/help",
    icon: HelpCircle,
    description: "Suporte e documentação",
  },
]

// Get all systems for selection
export const AVAILABLE_SYSTEMS = [] // Não há mais sistemas disponíveis para seleção

// Function to get current system based on path
export function getSystemFromPath(path: string): SystemInfo {
  // Agora que removemos admin e data, todas as rotas usam o sistema none
  return SYSTEMS_CONFIG.none
}

// Function to get breadcrumb items based on current path
export function getBreadcrumbItems(path: string): { title: string; path: string }[] {
  const system = getSystemFromPath(path)

  if (system.id === "none") {
    return [{ title: "Início", path: "/system-selection" }]
  }

  const breadcrumbs = [
    { title: "Início", path: "/system-selection" },
    { title: system.name, path: system.homePath },
  ]

  // Find the current page in the navigation items
  const findInItems = (items: NavItem[], currentPath: string): NavItem | undefined => {
    for (const item of items) {
      if (item.path === currentPath) {
        return item
      }
      if (item.children) {
        const found = findInItems(item.children, currentPath)
        if (found) {
          breadcrumbs.push({ title: item.title, path: item.path })
          return found
        }
      }
    }
    return undefined
  }

  const currentItem = findInItems(system.items, path)
  if (currentItem) {
    breadcrumbs.push({ title: currentItem.title, path: currentItem.path })
  }

  return breadcrumbs
}
