"use client"
import { useState, useEffect } from "react"
import { ChevronRight, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { DynamicIcon } from "@/components/dynamic-icon"
import { useMenuData } from "@/hooks/use-menu-data"
import type { MenuItem, SubMenuItem } from "@/types/menu"

interface SystemSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function SystemSidebar({ isCollapsed, onToggle }: SystemSidebarProps) {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const { menuData, isLoading, error } = useMenuData()
  const router = useRouter()

  const handleMenuClick = (menuTitle: string) => {
    if (isCollapsed) {
      // Se está colapsado, limpa o hover e expande a sidebar
      setHoveredMenu(null)
      onToggle()
      setExpandedMenu(menuTitle)
    } else {
      // Se já está expandido, apenas toggle do menu
      if (expandedMenu === menuTitle) {
        setExpandedMenu(null)
      } else {
        setExpandedMenu(menuTitle)
      }
    }
  }

  const handleSubMenuClick = (path: string) => {
    router.push(path)
    setExpandedMenu(null)
    setHoveredMenu(null)
  }

  const handleMenuHoverEnter = (menuTitle: string) => {
    // Só permite hover quando está colapsado
    if (isCollapsed) {
      setHoveredMenu(menuTitle)
    }
  }

  const handleMenuHoverLeave = () => {
    // Só limpa hover quando está colapsado
    if (isCollapsed) {
      setHoveredMenu(null)
    }
  }

  // Efeito para limpar estados quando a sidebar muda de estado
  useEffect(() => {
    if (isCollapsed) {
      // Quando colapsa, limpa o menu expandido
      setExpandedMenu(null)
    } else {
      // Quando expande, limpa o menu hover imediatamente
      setHoveredMenu(null)
    }
  }, [isCollapsed])

  // Efeito adicional para garantir limpeza do hover quando não está colapsado
  useEffect(() => {
    if (!isCollapsed && hoveredMenu) {
      setHoveredMenu(null)
    }
  }, [isCollapsed, hoveredMenu])

  // Renderiza loading
  if (isLoading) {
    return (
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border z-20 transition-all duration-300 ease-in-out",
          "flex flex-col items-center justify-center",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        {!isCollapsed && <p className="mt-2 text-sm text-muted-foreground">Carregando menu...</p>}
      </div>
    )
  }

  // Renderiza erro
  if (error) {
    return (
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border z-20 transition-all duration-300 ease-in-out",
          "flex flex-col items-center justify-center p-4",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <AlertCircle className="h-6 w-6 text-destructive" />
        {!isCollapsed && <p className="mt-2 text-sm text-muted-foreground text-center">Erro ao carregar menu</p>}
      </div>
    )
  }

  // Renderiza menu vazio se não há dados
  if (!menuData || menuData.menus.length === 0) {
    return (
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border z-20 transition-all duration-300 ease-in-out",
          "flex flex-col items-center justify-center p-4",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <AlertCircle className="h-6 w-6 text-muted-foreground" />
        {!isCollapsed && <p className="mt-2 text-sm text-muted-foreground text-center">Nenhum menu disponível</p>}
      </div>
    )
  }

  return (
    <>
      {/* Overlay para fechar o menu em dispositivos móveis */}
      {!isCollapsed && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border z-20 transition-all duration-300 ease-in-out",
          "flex flex-col",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Menu Items */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-2">
            {menuData.menus.map((item: MenuItem) => (
              <li key={item.title}>
                {/* Container que engloba ícone + menu flutuante + ponte invisível */}
                <div
                  className="relative"
                  onMouseEnter={() => handleMenuHoverEnter(item.title)}
                  onMouseLeave={handleMenuHoverLeave}
                >
                  {/* Menu Principal */}
                  <button
                    onClick={() => handleMenuClick(item.title)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      "group relative",
                      expandedMenu === item.title && !isCollapsed && "bg-accent text-accent-foreground",
                    )}
                  >
                    <DynamicIcon name={item.icon} className="h-5 w-5 flex-shrink-0" />

                    {/* Nome do menu - visível quando expandido */}
                    {!isCollapsed && <span className="font-medium transition-all duration-200">{item.title}</span>}

                    {/* Seta para indicar submenu - apenas quando expandido */}
                    {item.submenu.length > 0 && !isCollapsed && (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 ml-auto transition-transform duration-200",
                          expandedMenu === item.title && "rotate-90",
                        )}
                      />
                    )}
                  </button>

                  {/* Ponte invisível para conectar ícone ao menu flutuante */}
                  {isCollapsed && hoveredMenu === item.title && item.submenu.length > 0 && (
                    <div className="absolute left-full top-0 w-4 h-full z-40" />
                  )}

                  {/* Menu Flutuante (Hover) - apenas quando colapsado E com hover ativo */}
                  {isCollapsed && hoveredMenu === item.title && item.submenu.length > 0 && (
                    <div className="absolute left-full top-0 ml-4 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-200">
                      <div
                        className="bg-popover text-popover-foreground rounded-xl shadow-2xl border border-border/50 backdrop-blur-sm"
                        style={{
                          height: "calc(90vh - 8rem)", // 90% da altura da viewport menos header e padding
                          minWidth: "280px",
                          maxWidth: "320px",
                        }}
                      >
                        {/* Header do menu flutuante */}
                        <div className="px-4 py-3 border-b border-border/50 bg-muted/30 rounded-t-xl">
                          <div className="flex items-center gap-3">
                            <DynamicIcon name={item.icon} className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                          </div>
                        </div>

                        {/* Conteúdo scrollável */}
                        <div className="flex-1 overflow-y-auto p-3">
                          <ul className="space-y-1">
                            {item.submenu.map((subItem: SubMenuItem) => (
                              <li key={subItem.label}>
                                <button
                                  onClick={() => handleSubMenuClick(subItem.path)}
                                  className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group"
                                >
                                  <div className="flex items-center gap-3">
                                    <DynamicIcon name={subItem.icon} className="h-4 w-4 flex-shrink-0" />
                                    <div className="flex-1">
                                      <span className="font-medium">{subItem.label}</span>
                                      {subItem.availableActions.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {subItem.availableActions
                                            .filter((action) => action.hasPermission)
                                            .map((action) => (
                                              <span
                                                key={action.action}
                                                className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded"
                                              >
                                                {action.action.split(":")[1]}
                                              </span>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Footer do menu flutuante */}
                        <div className="px-4 py-3 border-t border-border/50 bg-muted/20 rounded-b-xl">
                          <p className="text-xs text-muted-foreground text-center">Clique para fixar o menu</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submenu Fixo - apenas quando expandido */}
                  {!isCollapsed && item.submenu.length > 0 && expandedMenu === item.title && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-border pl-4 animate-in slide-in-from-top-2 duration-200">
                      {item.submenu.map((subItem: SubMenuItem) => (
                        <li key={subItem.label}>
                          <button
                            onClick={() => handleSubMenuClick(subItem.path)}
                            className="w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <div className="flex items-center gap-2">
                              <DynamicIcon name={subItem.icon} className="h-4 w-4 flex-shrink-0" />
                              <span>{subItem.label}</span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-2">
          <div
            className={cn(
              "text-xs text-muted-foreground text-center transition-opacity duration-200",
              !isCollapsed ? "opacity-100" : "opacity-0",
            )}
          >
            {!isCollapsed && "v1.0.0"}
          </div>
        </div>
      </div>
    </>
  )
}
