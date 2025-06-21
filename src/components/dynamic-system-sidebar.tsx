"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as LucideIcons from "lucide-react"

import { cn } from "@/lib/utils"
import { useUserPermissions } from "@/features/auth/hooks/use-user-permissions"
import type { MenuItemWithPermissions } from "@/features/auth/types/menu"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, RefreshCw } from "lucide-react"

// --- Constants ---
const ICON_COLUMN_WIDTH_CLASS = "w-16" // Corresponde a 4rem ou 64px
const TOTAL_EXPANDED_WIDTH_CLASS = "w-64" // Corresponde a 16rem ou 256px
const ANIMATION_DURATION = "duration-300"
const EASING_CURVE = "ease-in-out"
const HEADER_HEIGHT_CLASS = "pt-16" // Altura do header (h-16)

interface DynamicSystemSidebarProps {
  isOpen: boolean
}

interface MenuItemProps {
  item: MenuItemWithPermissions
  isContentVisible: boolean
  openItems: string[]
  toggleItem: (path: string) => void
  level: number
  currentPathname: string // Passar pathname como prop para otimizar useMemo
}

const MenuItemRow = React.memo(function MenuItemRow({
  item,
  isContentVisible,
  openItems,
  toggleItem,
  level,
  currentPathname,
}: MenuItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const isCurrentlyOpen = openItems.includes(item.path)

  const isActive = useMemo(() => {
    if (hasChildren || !item.path) return false
    return currentPathname === item.path
  }, [currentPathname, item.path, hasChildren])

  const hasActiveChild = useMemo(() => {
    if (!hasChildren || !item.children || !currentPathname) return false
    const checkActive = (items: MenuItemWithPermissions[]): boolean => {
      return items.some((child) => {
        if (child.path && currentPathname === child.path) return true
        if (child.children && child.children.length > 0) {
          return checkActive(child.children)
        }
        return false
      })
    }
    return checkActive(item.children)
  }, [currentPathname, item.children, hasChildren])

  const IconComponent = useMemo(
    () =>
      item.icon && (LucideIcons as any)[item.icon]
        ? ((LucideIcons as any)[item.icon] as LucideIcons.LucideIcon)
        : LucideIcons.Circle,
    [item.icon],
  )

  const indentationClass = useMemo(() => {
    if (!isContentVisible || level === 0) return ""
    return `pl-${Math.min(level * 2 + 4, 12)}` // Ajustado para recuo mais sutil: pl-4, pl-6, pl-8...
  }, [level, isContentVisible])

  const ItemContent = (
    <>
      <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
        <IconComponent
          className={cn(
            "h-5 w-5 transition-colors",
            isActive ? "text-white" : hasActiveChild ? "text-purple-600" : "text-gray-600",
          )}
        />
      </div>
      {isContentVisible && (
        <div className="flex-1 min-w-0 ml-3">
          <span
            className={cn(
              "text-sm font-medium truncate block transition-colors",
              isActive ? "text-white" : hasActiveChild ? "text-purple-600" : "text-gray-700",
            )}
          >
            {item.label}
          </span>
        </div>
      )}
    </>
  )

  if (hasChildren) {
    const triggerClasses = cn(
      "flex items-center w-full h-10 rounded-lg transition-all",
      ANIMATION_DURATION,
      "hover:bg-gray-100 group cursor-pointer",
      indentationClass,
      hasActiveChild && !isActive && "bg-purple-50", // Destaque sutil se filho ativo, mas não o próprio item
    )

    return (
      <div className="space-y-1">
        <Collapsible
          open={isCurrentlyOpen && isContentVisible}
          onOpenChange={() => {
            // Só chamar toggleItem se a sidebar estiver expandida
            // e o item tiver um path (evitar erro se path for undefined)
            if (isContentVisible && item.path) {
              toggleItem(item.path)
            }
          }}
        >
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <CollapsibleTrigger className={triggerClasses} aria-label={item.label}>
                  {ItemContent}
                  {isContentVisible && (
                    <LucideIcons.ChevronRight
                      className={cn(
                        "h-4 w-4 mr-2 flex-shrink-0 transition-transform",
                        ANIMATION_DURATION,
                        isCurrentlyOpen && "rotate-90",
                        hasActiveChild ? "text-purple-600" : "text-gray-400",
                      )}
                    />
                  )}
                </CollapsibleTrigger>
              </TooltipTrigger>
              {!isContentVisible && item.label && (
                <TooltipContent side="right" sideOffset={8}>
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <CollapsibleContent className="overflow-hidden transition-all duration-200 ease-in-out">
            {isContentVisible &&
              isCurrentlyOpen && ( // Renderizar filhos apenas se aberto e visível
                <div className="space-y-1 mt-1">
                  {item.children?.map((subItem) => (
                    <MenuItemRow
                      key={subItem.path || subItem.label} // Usar label como fallback se path não existir
                      item={subItem}
                      isContentVisible={isContentVisible}
                      openItems={openItems}
                      toggleItem={toggleItem}
                      level={level + 1}
                      currentPathname={currentPathname}
                    />
                  ))}
                </div>
              )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }

  const linkClasses = cn(
    "flex items-center w-full h-10 rounded-lg transition-all",
    ANIMATION_DURATION,
    "hover:bg-gray-100 group",
    indentationClass,
    isActive && "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md",
  )

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={item.path || "#"} className={linkClasses} tabIndex={isContentVisible || level === 0 ? 0 : -1}>
            {ItemContent}
          </Link>
        </TooltipTrigger>
        {!isContentVisible && item.label && (
          <TooltipContent side="right" sideOffset={8}>
            <p>{item.label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
})
MenuItemRow.displayName = "MenuItemRow"

export const DynamicSystemSidebar = React.memo(function DynamicSystemSidebar({ isOpen }: DynamicSystemSidebarProps) {
  const currentPathname = usePathname() // Renomeado para clareza
  const { systemMenus, isLoading, error, refreshPermissions } = useUserPermissions()
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = useCallback((path: string) => {
    setOpenItems((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]))
  }, [])

  useEffect(() => {
    if (systemMenus.length > 0 && currentPathname) {
      const newOpenPaths = new Set<string>()
      const findAndOpenActivePaths = (items: MenuItemWithPermissions[], path: string): boolean => {
        let isActiveBranch = false
        for (const item of items) {
          if (!item.path) continue // Pular itens sem path

          let currentItemIsActive = false
          if (item.children && item.children.length > 0) {
            // Se tem filhos, verifica se algum filho está ativo
            if (findAndOpenActivePaths(item.children, path)) {
              newOpenPaths.add(item.path) // Adiciona o pai à lista para abrir
              isActiveBranch = true
              currentItemIsActive = true // Considera o branch ativo
            }
          } else if (item.path === path) {
            // Se é um item final e corresponde ao path, marca como ativo
            isActiveBranch = true
            currentItemIsActive = true
          }
        }
        return isActiveBranch
      }

      findAndOpenActivePaths(systemMenus, currentPathname)

      // Compara o novo set com o estado atual para evitar re-renderizações desnecessárias
      setOpenItems((prevOpenItems) => {
        const newOpenItemsArray = Array.from(newOpenPaths)
        if (
          newOpenItemsArray.length !== prevOpenItems.length ||
          !newOpenItemsArray.every((path) => prevOpenItems.includes(path))
        ) {
          return newOpenItemsArray
        }
        return prevOpenItems
      })
    }
  }, [currentPathname, systemMenus])

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col",
        "bg-white border-r border-gray-200 shadow-sm",
        HEADER_HEIGHT_CLASS, // Adiciona padding-top para descer o menu
        "hidden sm:flex", // Esconde em telas pequenas, mostra em sm+
        "transition-[width]",
        ANIMATION_DURATION,
        EASING_CURVE,
        isOpen ? TOTAL_EXPANDED_WIDTH_CLASS : ICON_COLUMN_WIDTH_CLASS,
      )}
    >
      <ScrollArea className="flex-1">
        {" "}
        {/* ScrollArea deve ocupar o espaço restante */}
        <nav className="p-3 space-y-1">
          {isLoading && (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center h-10 px-2">
                  <Skeleton className="h-6 w-6 rounded-md flex-shrink-0" />
                  {isOpen && <Skeleton className="ml-3 h-4 w-32 rounded" />}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              {isOpen && <p className="text-sm text-gray-600">Erro ao carregar menu</p>}
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={refreshPermissions} className="h-8 w-8 p-0">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tentar Novamente</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {!isLoading &&
            !error &&
            systemMenus.map((item) => (
              <MenuItemRow
                key={item.path || item.label} // Usar label como fallback se path não existir
                item={item}
                isContentVisible={isOpen}
                openItems={openItems}
                toggleItem={toggleItem}
                level={0}
                currentPathname={currentPathname} // Passar pathname
              />
            ))}
        </nav>
      </ScrollArea>
    </aside>
  )
})
DynamicSystemSidebar.displayName = "DynamicSystemSidebar"
