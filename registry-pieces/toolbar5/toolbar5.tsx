"use client";

import {
  Columns3,
  Merge,
  Rows3,
  Split,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Toolbar5Props {
  className?: string;
}

const groups: {
  items: { Icon: typeof Rows3; label: string; destructive?: boolean }[];
}[] = [
  {
    items: [
      { Icon: Rows3, label: "Add row" },
      { Icon: Columns3, label: "Add column" },
    ],
  },
  {
    items: [
      { Icon: Merge, label: "Merge cells" },
      { Icon: Split, label: "Split cells" },
    ],
  },
  {
    items: [{ Icon: Trash2, label: "Delete row", destructive: true }],
  },
];

export const toolbar5Demo: Toolbar5Props = {};

export function Toolbar5({ className }: Toolbar5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center rounded-lg border border-border bg-card p-1 shadow-sm">
        {groups.map((g, gi) => (
          <div key={gi} className="flex items-center">
            {gi > 0 && (
              <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
            )}
            <div className="flex items-center gap-0.5">
              {g.items.map(({ Icon, label, destructive }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md transition-colors",
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
        ))}
      </div>
    </div>
  );
}
