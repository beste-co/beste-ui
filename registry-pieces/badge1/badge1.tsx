"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "success"
  | "warning"
  | "info"
  | "muted";

interface Tag {
  label: string;
  tone?: Tone;
}

interface Badge1Props {
  tags?: Tag[];
  removable?: boolean;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground border-primary",
  foreground: "bg-foreground text-background border-foreground",
  success:
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  info: "bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-400",
  muted: "bg-muted text-muted-foreground border-border",
};

export const badge1Demo: Badge1Props = {
  tags: [
    { label: "design", tone: "primary" },
    { label: "shipped", tone: "success" },
    { label: "needs review", tone: "warning" },
    { label: "archived", tone: "muted" },
  ],
  removable: true,
};

export function Badge1({
  tags = [],
  removable = false,
  className,
}: Badge1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
              toneClasses[tag.tone ?? "muted"]
            )}
          >
            {tag.label}
            {removable && (
              <button
                type="button"
                className="flex size-3.5 items-center justify-center rounded-full transition-colors hover:bg-current/20"
                aria-label={`Remove ${tag.label}`}
              >
                <X className="size-2.5" aria-hidden="true" />
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
