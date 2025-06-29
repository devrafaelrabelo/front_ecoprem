"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Users, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  items?: SubMenuItem[]
}

interface SubMenuItem {
  id: string
  label: string
  href: string
}

interface SystemSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const menuItems: MenuItem[] = [
  {
    id: "users",
    label: "Usuários",
    icon: Users,
    items: [
      {
        id: "request-user",
        label: "Solicitar Usuário",
        href: "/comercial/solicitar-usuario",
      },
    ],
  },
]

export function SystemSidebar({ isCollapsed, onToggle }: SystemSidebarProps) {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const router = useRouter()

  const handleMenuClick = (menuId: string) => {
    if (isCollapsed) {
      // Se está colapsado, limpa o hover e expande a sidebar
      setHoveredMenu(null)
      onToggle()
      setExpandedMenu(menuId)
    } else {
      // Se já está expandido, apenas toggle do menu
      if (expandedMenu === menuId) {
        setExpandedMenu(null)
      } else {
        setExpandedMenu(menuId)
      }
    }
  }

  const handleSubMenuClick = (href: string) => {
    router.push(href)
    setExpandedMenu(null)
    setHoveredMenu(null)
  }

  const handleMenuHoverEnter = (menuId: string) => {
    // Só permite hover quando está colapsado
    if (isCollapsed) {
      setHoveredMenu(menuId)
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
            {menuItems.map((item) => (
              <li key={item.id}>
                {/* Container que engloba ícone + menu flutuante + ponte invisível */}
                <div
                  className="relative"
                  onMouseEnter={() => handleMenuHoverEnter(item.id)}
                  onMouseLeave={handleMenuHoverLeave}
                >
                  {/* Menu Principal */}
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      "group relative",
                      expandedMenu === item.id && !isCollapsed && "bg-accent text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />

                    {/* Nome do menu - visível quando expandido */}
                    {!isCollapsed && <span className="font-medium transition-all duration-200">{item.label}</span>}

                    {/* Seta para indicar submenu - apenas quando expandido */}
                    {item.items && !isCollapsed && (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 ml-auto transition-transform duration-200",
                          expandedMenu === item.id && "rotate-90",
                        )}
                      />
                    )}
                  </button>

                  {/* Ponte invisível para conectar ícone ao menu flutuante */}
                  {isCollapsed && hoveredMenu === item.id && item.items && (
                    <div className="absolute left-full top-0 w-4 h-full z-40" />
                  )}

                  {/* Menu Flutuante (Hover) - apenas quando colapsado E com hover ativo */}
                  {isCollapsed && hoveredMenu === item.id && item.items && (
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
                            <item.icon className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-foreground">{item.label}</h3>
                          </div>
                        </div>

                        {/* Conteúdo scrollável */}
                        <div className="flex-1 overflow-y-auto p-3">
                          <ul className="space-y-1">
                            {item.items.map((subItem) => (
                              <li key={subItem.id}>
                                <button
                                  onClick={() => handleSubMenuClick(subItem.href)}
                                  className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{subItem.label}</span>
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
                  {!isCollapsed && item.items && expandedMenu === item.id && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-border pl-4 animate-in slide-in-from-top-2 duration-200">
                      {item.items.map((subItem) => (
                        <li key={subItem.id}>
                          <button
                            onClick={() => handleSubMenuClick(subItem.href)}
                            className="w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            {subItem.label}
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
