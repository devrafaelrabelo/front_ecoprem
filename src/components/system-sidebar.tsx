"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getSystemFromPath, type NavItemWithChildren } from "@/navigation/config"
import { useState } from "react"

interface SystemSidebarProps {
  isOpen: boolean
}

export function SystemSidebar({ isOpen }: SystemSidebarProps) {
  const pathname = usePathname()
  const currentSystem = getSystemFromPath(pathname)
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (href: string) => {
    setOpenItems((prev) => (prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]))
  }

  const renderNavItem = (item: NavItemWithChildren, level = 0) => {
    const hasChildren = item.items && item.items.length > 0
    const isActive = pathname === item.href
    const isOpen = item.href ? openItems.includes(item.href) : false
    const IconComponent = item.icon ? (LucideIcons[item.icon] as LucideIcons.LucideIcon) : null

    if (hasChildren) {
      return (
        <Collapsible
          key={item.href || item.title}
          open={isOpen}
          onOpenChange={() => item.href && toggleItem(item.href)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 h-9",
                level > 0 && "ml-4",
                isActive && "bg-accent text-accent-foreground",
              )}
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
              <span className="flex-1 text-left">{item.title}</span>
              <LucideIcons.ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.items.map((subItem) => renderNavItem(subItem, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Button
        key={item.href || item.title}
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 h-9",
          level > 0 && "ml-4",
          isActive && "bg-accent text-accent-foreground",
        )}
        asChild
      >
        <Link href={item.href || "#"}>
          {IconComponent && <IconComponent className="h-4 w-4" />}
          <span>{item.title}</span>
        </Link>
      </Button>
    )
  }

  if (!isOpen) return null

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-64 flex-col border-r bg-background pt-16 hidden sm:flex">
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">{currentSystem.name}</h2>
          </div>
          <nav className="space-y-1">{currentSystem.items.map((item) => renderNavItem(item))}</nav>
        </div>
      </ScrollArea>
    </aside>
  )
}
