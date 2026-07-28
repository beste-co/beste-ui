"use client";

import {
  ChevronsUpDown,
  CreditCard,
  LogOut,
  type LucideIcon,
  Settings,
  User,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface UserMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  shortcut?: string;
  /** Renders in destructive red and gets a separator above it */
  destructive?: boolean;
}

interface UserMenuUser {
  name: string;
  email?: string;
  avatar?: string;
}

interface UserMenuProps {
  user: UserMenuUser;
  items: UserMenuItem[];
  onSelect?: (id: string) => void;
  align?: "start" | "center" | "end";
  /** Hide the name/email column and show only the avatar (for dense topbars) */
  compact?: boolean;
  className?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const userMenuDemo: UserMenuProps = {
  user: {
    name: "Jordan Ellis",
    email: "jordan@acme.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop",
  },
  items: [
    { id: "profile", label: "Profile", icon: User, shortcut: "⇧⌘P" },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings, shortcut: "⌘S" },
    { id: "logout", label: "Log out", icon: LogOut, destructive: true },
  ],
};

export function UserMenu({
  user,
  items,
  onSelect,
  align = "end",
  compact = false,
  className,
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            !compact && "pr-2",
            className
          )}
        >
          <Avatar className="size-8">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          {!compact && (
            <span className="grid min-w-0 leading-tight">
              <span className="truncate text-sm font-medium text-foreground">
                {user.name}
              </span>
              {user.email && (
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              )}
            </span>
          )}
          {!compact && (
            <ChevronsUpDown className="ml-1 size-4 shrink-0 text-muted-foreground" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel className="grid gap-0.5">
          <span className="truncate text-sm font-medium">{user.name}</span>
          {user.email && (
            <span className="truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item, index) => {
          const Icon = item.icon;
          const prev = items[index - 1];
          const needsSeparator = item.destructive && prev && !prev.destructive;
          return (
            <div key={item.id}>
              {needsSeparator && <DropdownMenuSeparator />}
              <DropdownMenuItem
                variant={item.destructive ? "destructive" : "default"}
                onSelect={() => onSelect?.(item.id)}
                className="cursor-pointer"
              >
                {Icon && <Icon className="size-4" />}
                {item.label}
                {item.shortcut && (
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
