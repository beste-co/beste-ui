"use client";

import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LifeBuoy,
  type LucideIcon,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  /** Stable id used for active state and the onNavigate callback */
  id: string;
  label: string;
  /** Lucide icon component (optional) */
  icon?: LucideIcon;
  /** Small trailing count/label (e.g. unread count) */
  badge?: string | number;
  /** Optional link target; renders an <a> instead of a <button> */
  href?: string;
}

export interface SidebarNavGroup {
  /** Muted uppercase group heading (hidden when collapsed) */
  label?: string;
  items: SidebarNavItem[];
}

interface SidebarNavProps {
  brand?: { name: string; icon?: LucideIcon };
  groups: SidebarNavGroup[];
  /** Controlled active item id; omit to let the component track it */
  activeId?: string;
  defaultActiveId?: string;
  onNavigate?: (id: string) => void;
  /**
   * Collapsed (icon-rail) state. The collapse toggle lives in the shell's
   * topbar, not inside the sidebar — pass this from the shell. Falls back to
   * `defaultCollapsed` when omitted.
   */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

export const sidebarNavDemo: SidebarNavProps = {
  brand: { name: "Acme Inc", icon: Boxes },
  defaultActiveId: "dashboard",
  groups: [
    {
      label: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "customers", label: "Customers", icon: Users, badge: 24 },
        { id: "orders", label: "Orders", icon: ShoppingCart, badge: 3 },
      ],
    },
    {
      label: "Workspace",
      items: [
        { id: "settings", label: "Settings", icon: Settings },
        { id: "support", label: "Support", icon: LifeBuoy },
      ],
    },
  ],
};

export function SidebarNav({
  brand,
  groups,
  activeId,
  defaultActiveId,
  onNavigate,
  collapsed,
  defaultCollapsed = false,
  className,
}: SidebarNavProps) {
  const [internalActive, setInternalActive] = useState(defaultActiveId ?? "");

  const isCollapsed = collapsed ?? defaultCollapsed;
  const active = activeId ?? internalActive;

  const BrandIcon = brand?.icon;

  const handleNavigate = (id: string) => {
    setInternalActive(id);
    onNavigate?.(id);
  };

  return (
    <nav
      data-collapsed={isCollapsed}
      className={cn(
        "flex h-full flex-col border-r bg-card transition-[width] duration-200",
        isCollapsed ? "w-[68px]" : "w-64",
        className
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b px-4">
        {BrandIcon && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BrandIcon className="size-4" />
          </span>
        )}
        {!isCollapsed && brand && (
          <span className="truncate text-sm font-semibold text-foreground">
            {brand.name}
          </span>
        )}
      </div>

      {/* Groups */}
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {groups.map((group, groupIndex) => (
          <div key={group.label ?? groupIndex} className="space-y-1">
            {group.label && !isCollapsed && (
              <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              const content = (
                <>
                  {Icon && (
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    />
                  )}
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {!isCollapsed && item.badge != null && (
                    <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </>
              );
              const classes = cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isCollapsed && "justify-center",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              );
              return item.href ? (
                <a
                  key={item.id}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handleNavigate(item.id)}
                  className={classes}
                >
                  {content}
                </a>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  title={isCollapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handleNavigate(item.id)}
                  className={classes}
                >
                  {content}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
