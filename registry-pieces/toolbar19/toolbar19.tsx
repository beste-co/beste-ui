"use client";

import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActionId = "like" | "comment" | "share" | "bookmark";

interface Toolbar19Props {
  items?: ActionId[];
  active?: ActionId[];
  className?: string;
}

const iconMap: Record<ActionId, typeof Heart> = {
  like: Heart,
  comment: MessageCircle,
  share: Share2,
  bookmark: Bookmark,
};

const labelMap: Record<ActionId, string> = {
  like: "Like",
  comment: "Comment",
  share: "Share",
  bookmark: "Save",
};

export const toolbar19Demo: Toolbar19Props = {
  items: ["like", "comment", "share", "bookmark"],
  active: ["like"],
};

export function Toolbar19({
  items = ["like", "comment", "share", "bookmark"],
  active = [],
  className,
}: Toolbar19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
        {items.map((id) => {
          const Icon = iconMap[id];
          const isActive = active.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-label={labelMap[id]}
              aria-pressed={isActive}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                isActive
                  ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
              )}
            >
              <Icon
                className={cn("size-4", isActive && "fill-current")}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
