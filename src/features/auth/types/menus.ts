export interface Permission {
  entity: string
  action: string
}

export interface MenuAction {
  entity: string
  action: string
}

// Este é um item de menu individual, que pode ter ações
export interface SubMenuItem {
  label: string
  icon: string // Ícone específico para este item de submenu
  path: string
  requiredPermissions: string[]
  actions: string[] // Ações que podem se tornar sub-submenus
  // Campos opcionais que já tínhamos
  order?: number
  badge?: string | number
  description?: string
}

// Novo: Representa um grupo de menu principal
export interface MenuGroup {
  title: string // Ex: "Usuários", "Recursos"
  icon: string // Ícone para o grupo principal. Ex: "Users", "Package"
  submenu: SubMenuItem[] // Array de itens de menu dentro deste grupo
  section?: string // Opcional: se ainda quisermos filtrar por seção/sistema no frontend
}

export interface UserMenuData {
  permissions: string[]
  menus: MenuGroup[] // Agora é um array de MenuGroup
}

// MenuItemWithPermissions permanece similar, mas agora será gerado a partir de MenuGroup e SubMenuItem
export interface MenuItemWithPermissions {
  label: string // Virá do MenuGroup.title ou SubMenuItem.label
  icon: string // Virá do MenuGroup.icon ou SubMenuItem.icon
  path?: string // Opcional para grupos, obrigatório para itens finais
  requiredPermissions: string[]
  actions?: string[] // Ações do SubMenuItem
  section: string // Pode ser derivado do MenuGroup.title ou uma seção padrão

  hasAccess: boolean
  availableActions?: string[]
  children?: MenuItemWithPermissions[] // Gerado a partir de submenu ou actions

  // Estados de UI e propriedades de grupo
  isGroup?: boolean
  isCollapsible?: boolean
  defaultExpanded?: boolean
  isActive?: boolean
  isExpanded?: boolean
  level?: number
  badge?: string | number
  description?: string
  order?: number
}

export interface MenuState {
  expandedItems: Set<string>
  activeItem: string | null
}
