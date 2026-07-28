"use client";

import {
  Copy,
  MoreHorizontal,
  Reply,
  Smile,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat28Props {
  className?: string;
}

const actions = [
  { Icon: Smile, label: "Add reaction" },
  { Icon: Reply, label: "Reply" },
  { Icon: Copy, label: "Copy" },
  { Icon: Trash2, label: "Delete", destructive: true },
  { Icon: MoreHorizontal, label: "More" },
];

export const chat28Demo: Chat28Props = {};

export function Chat28({ className }: Chat28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-1 shadow-md">
        {actions.map(({ Icon, label, destructive }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-colors",
              destructive
                ? "text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950"
                : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
