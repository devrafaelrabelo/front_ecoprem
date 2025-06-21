import type * as LucideIcons from "lucide-react"

// Define system types
export type SystemId = "COMERCIAL" | "RH" | "TI" | "none"

// Interface for navigation items
export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof LucideIcons
  label?: string
  description?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithProps extends NavItem {
  items: NavItem[]
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export interface SystemConfig {
  id: SystemId
  name: string
  description: string
  homePath: string
  icon?: keyof typeof LucideIcons
  color?: string // Tailwind text color class
  bgColor?: string // Tailwind background color class
  items: NavItemWithChildren[]
}

// Main navigation configuration with detailed system structures
export const SYSTEMS_CONFIG: Record<SystemId, SystemConfig> = {
  none: {
    id: "none",
    name: "Nenhum Sistema",
    description: "Selecione um sistema para começar.",
    homePath: "/modules",
    items: [],
  },
  COMERCIAL: {
    id: "COMERCIAL",
    name: "Sistema Comercial",
    description: "Gerencie vendas, clientes e produtos.",
    homePath: "/comercial",
    icon: "ShoppingCart",
    color: "text-blue-800",
    bgColor: "bg-blue-50",
    items: [
      {
        title: "Dashboard",
        href: "/comercial",
        icon: "LayoutDashboard",
        description: "Visão geral do sistema comercial",
        items: [],
      },
      {
        title: "Vendas",
        href: "/comercial/vendas",
        icon: "DollarSign",
        description: "Gestão de vendas e pedidos",
        items: [
          {
            title: "Nova Venda",
            href: "/comercial/vendas/nova",
            icon: "Plus",
            description: "Criar uma nova venda",
            items: [],
          },
          {
            title: "Listar Vendas",
            href: "/comercial/vendas/lista",
            icon: "List",
            description: "Ver todas as vendas",
            items: [],
          },
          {
            title: "Relatórios",
            href: "/comercial/vendas/relatorios",
            icon: "BarChart3",
            description: "Relatórios de vendas",
            items: [],
          },
        ],
      },
      {
        title: "Clientes",
        href: "/comercial/clientes",
        icon: "Users",
        description: "Gestão de clientes",
        items: [
          {
            title: "Novo Cliente",
            href: "/comercial/clientes/novo",
            icon: "UserPlus",
            description: "Cadastrar novo cliente",
            items: [],
          },
          {
            title: "Listar Clientes",
            href: "/comercial/clientes/lista",
            icon: "Users",
            description: "Ver todos os clientes",
            items: [],
          },
        ],
      },
      {
        title: "Produtos",
        href: "/comercial/produtos",
        icon: "Package",
        description: "Gestão de produtos",
        items: [
          {
            title: "Novo Produto",
            href: "/comercial/produtos/novo",
            icon: "PackagePlus",
            description: "Cadastrar novo produto",
            items: [],
          },
          {
            title: "Listar Produtos",
            href: "/comercial/produtos/lista",
            icon: "Package",
            description: "Ver todos os produtos",
            items: [],
          },
          {
            title: "Categorias",
            href: "/comercial/produtos/categorias",
            icon: "Tags",
            description: "Gerenciar categorias",
            items: [],
          },
        ],
      },
    ],
  },
  RH: {
    id: "RH",
    name: "Sistema RH",
    description: "Gerencie funcionários, folha de pagamento e benefícios.",
    homePath: "/rh",
    icon: "Briefcase",
    color: "text-green-800",
    bgColor: "bg-green-50",
    items: [
      {
        title: "Dashboard",
        href: "/rh",
        icon: "LayoutDashboard",
        description: "Visão geral do RH",
        items: [],
      },
      {
        title: "Funcionários",
        href: "/rh/funcionarios",
        icon: "Users",
        description: "Gestão de funcionários",
        items: [
          {
            title: "Novo Funcionário",
            href: "/rh/funcionarios/novo",
            icon: "UserPlus",
            description: "Cadastrar funcionário",
            items: [],
          },
          {
            title: "Listar Funcionários",
            href: "/rh/funcionarios/lista",
            icon: "Users",
            description: "Ver funcionários",
            items: [],
          },
          {
            title: "Avaliações",
            href: "/rh/funcionarios/avaliacoes",
            icon: "Star",
            description: "Avaliações de desempenho",
            items: [],
          },
        ],
      },
      {
        title: "Folha de Pagamento",
        href: "/rh/folha",
        icon: "Wallet",
        description: "Gestão da folha de pagamento",
        items: [
          {
            title: "Processar Folha",
            href: "/rh/folha/processar",
            icon: "Calculator",
            description: "Processar folha mensal",
            items: [],
          },
          {
            title: "Histórico",
            href: "/rh/folha/historico",
            icon: "History",
            description: "Histórico de folhas",
            items: [],
          },
        ],
      },
      {
        title: "Benefícios",
        href: "/rh/beneficios",
        icon: "Gift",
        description: "Gestão de benefícios",
        items: [
          {
            title: "Planos de Saúde",
            href: "/rh/beneficios/saude",
            icon: "Heart",
            description: "Planos de saúde",
            items: [],
          },
          {
            title: "Vale Refeição",
            href: "/rh/beneficios/refeicao",
            icon: "Utensils",
            description: "Vale refeição",
            items: [],
          },
        ],
      },
    ],
  },
  TI: {
    id: "TI",
    name: "Sistema TI",
    description: "Gerencie infraestrutura, suporte e projetos de TI.",
    homePath: "/ti",
    icon: "Laptop",
    color: "text-purple-800",
    bgColor: "bg-purple-50",
    items: [
      {
        title: "Dashboard",
        href: "/ti",
        icon: "LayoutDashboard",
        description: "Visão geral da TI",
        items: [],
      },
      {
        title: "Chamados",
        href: "/ti/chamados",
        icon: "LifeBuoy",
        description: "Sistema de chamados",
        items: [
          {
            title: "Abrir Chamado",
            href: "/ti/chamados/novo",
            icon: "Plus",
            description: "Abrir novo chamado",
            items: [],
          },
          {
            title: "Meus Chamados",
            href: "/ti/chamados/meus",
            icon: "User",
            description: "Meus chamados",
            items: [],
          },
          {
            title: "Todos os Chamados",
            href: "/ti/chamados/todos",
            icon: "List",
            description: "Todos os chamados",
            items: [],
          },
        ],
      },
      {
        title: "Inventário",
        href: "/ti/inventario",
        icon: "HardDrive",
        description: "Inventário de equipamentos",
        items: [
          {
            title: "Equipamentos",
            href: "/ti/inventario/equipamentos",
            icon: "Monitor",
            description: "Gerenciar equipamentos",
            items: [],
          },
          {
            title: "Software",
            href: "/ti/inventario/software",
            icon: "Code",
            description: "Licenças de software",
            items: [],
          },
        ],
      },
      {
        title: "Usuários",
        href: "/ti/usuarios",
        icon: "Users",
        description: "Gestão de usuários do sistema",
        items: [
          {
            title: "Criar Usuário",
            href: "/ti/usuarios/novo",
            icon: "UserPlus",
            description: "Criar novo usuário",
            items: [],
          },
          {
            title: "Listar Usuários",
            href: "/ti/usuarios/lista",
            icon: "Users",
            description: "Ver todos os usuários",
            items: [],
          },
          {
            title: "Permissões",
            href: "/ti/usuarios/permissoes",
            icon: "Shield",
            description: "Gerenciar permissões",
            items: [],
          },
        ],
      },
    ],
  },
}

// Common navigation items that appear in all systems
export const COMMON_NAV_ITEMS: NavItem[] = [
  {
    title: "Ajuda",
    href: "/help",
    icon: "HelpCircle",
    description: "Suporte e documentação",
  },
]

// Get all systems for selection
export const AVAILABLE_SYSTEMS: SystemConfig[] = Object.values(SYSTEMS_CONFIG).filter((system) => system.id !== "none")

// Function to get current system based on path
export function getSystemFromPath(path: string): SystemConfig {
  // Sort systems by homePath length in descending order to find the most specific match first
  const sortedSystems = [...AVAILABLE_SYSTEMS].sort((a, b) => b.homePath.length - a.homePath.length)

  const systemId = sortedSystems.find((system) => path.startsWith(system.homePath))?.id || "none"
  return SYSTEMS_CONFIG[systemId]
}

// Function to get breadcrumb items based on current path
export function getBreadcrumbItems(path: string): NavItem[] {
  const system = getSystemFromPath(path)
  const breadcrumbs: NavItem[] = []

  if (system.id !== "none") {
    breadcrumbs.push({ title: system.name, href: system.homePath })

    // Find matching item in system's navigation
    const findItemInNav = (items: NavItemWithChildren[], currentPath: string): NavItem | null => {
      for (const item of items) {
        if (item.href && currentPath.startsWith(item.href)) {
          // If it's a direct match or a parent of the current path
          if (currentPath === item.href || currentPath.startsWith(`${item.href}/`)) {
            return item
          }
        }
        if (item.items) {
          const found = findItemInNav(item.items, currentPath)
          if (found) return found
        }
      }
      return null
    }

    const currentNavItem = findItemInNav(system.items, path)

    if (currentNavItem && currentNavItem.href !== system.homePath) {
      // Add parent items if applicable (simple example, can be expanded for deeper nesting)
      const pathSegments = path.replace(system.homePath, "").split("/").filter(Boolean)
      let currentHref = system.homePath
      for (const segment of pathSegments) {
        currentHref = `${currentHref}/${segment}`
        const segmentItem = findItemInNav(system.items, currentHref)
        if (segmentItem) {
          breadcrumbs.push({ title: segmentItem.title, href: segmentItem.href })
        } else {
          // Fallback for dynamic segments or non-configured paths
          breadcrumbs.push({ title: segment.charAt(0).toUpperCase() + segment.slice(1), href: currentHref })
        }
      }
    }
  }

  return breadcrumbs
}

// Function to get all routes from SYSTEMS_CONFIG
export function getAllSystemRoutes(): string[] {
  const routes: string[] = []

  const extractRoutes = (items: NavItemWithChildren[]) => {
    items.forEach((item) => {
      if (item.href) {
        routes.push(item.href)
      }
      if (item.items && item.items.length > 0) {
        extractRoutes(item.items)
      }
    })
  }

  AVAILABLE_SYSTEMS.forEach((system) => {
    extractRoutes(system.items)
  })

  return routes
}

// Function to find navigation item by path
export function findNavItemByPath(path: string): NavItemWithChildren | null {
  const system = getSystemFromPath(path)

  const findItem = (items: NavItemWithChildren[], targetPath: string): NavItemWithChildren | null => {
    for (const item of items) {
      if (item.href === targetPath) {
        return item
      }
      if (item.items && item.items.length > 0) {
        const found = findItem(item.items, targetPath)
        if (found) return found
      }
    }
    return null
  }

  return findItem(system.items, path)
}
