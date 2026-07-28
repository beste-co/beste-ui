"use client";

import {
  Bell,
  CheckCheck,
  CreditCard,
  type LucideIcon,
  MessageSquare,
  TriangleAlert,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: LucideIcon;
  unread?: boolean;
}

interface NotificationsMenuProps {
  notifications: NotificationItem[];
  onSelect?: (id: string) => void;
  onMarkAllRead?: () => void;
  align?: "start" | "center" | "end";
  className?: string;
}

export const notificationsMenuDemo: NotificationsMenuProps = {
  notifications: [
    {
      id: "1",
      title: "New customer signed up",
      description: "Amara Okafor joined the Scale plan.",
      time: "2m ago",
      icon: UserPlus,
      unread: true,
    },
    {
      id: "2",
      title: "Payment received",
      description: "$639 from Aurora — invoice #3417.",
      time: "1h ago",
      icon: CreditCard,
      unread: true,
    },
    {
      id: "3",
      title: "Usage limit warning",
      description: "Workspace API is at 82% of its monthly quota.",
      time: "3h ago",
      icon: TriangleAlert,
      unread: true,
    },
    {
      id: "4",
      title: "New comment",
      description: "Diego replied on the Q1 report thread.",
      time: "Yesterday",
      icon: MessageSquare,
    },
  ],
};

export function NotificationsMenu({
  notifications,
  onSelect,
  onMarkAllRead,
  align = "end",
  className,
}: NotificationsMenuProps) {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter((item) => item.unread).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
    onMarkAllRead?.();
  };

  const handleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
    onSelect?.(id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("relative size-9 cursor-pointer", className)}
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex cursor-pointer items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>
        <Separator />
        {/*
          The bound goes on the viewport, not on the ScrollArea itself. Radix's
          root is only `position: relative` — it never clips — and its viewport is
          `height: 100%`, which against an auto-height root resolves to the
          content's own height. A `max-h` on the root then clamped nothing that
          could scroll: the list simply grew past it and painted over the footer.
          Bounding the viewport makes it the scroll container, and the root stays
          as tall as whatever fits.
        */}
        <ScrollArea className="[&>[data-slot=scroll-area-viewport]]:max-h-80 [&>[data-slot=scroll-area-viewport]]:min-h-32">
          <div className="divide-y">
            {items.map((item) => {
              const Icon = item.icon ?? Bell;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      {item.unread && (
                        <span className="size-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </span>
                    {item.description && (
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
        <Separator />
        <button
          type="button"
          className="w-full cursor-pointer px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          View all notifications
        </button>
      </PopoverContent>
    </Popover>
  );
}
