"use client";

import { Link2, Linkedin, Mail, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toolbar10Props {
  bordered?: boolean;
  className?: string;
}

const shares = [
  { Icon: Link2, label: "Copy link" },
  { Icon: Twitter, label: "Share on X" },
  { Icon: Linkedin, label: "Share on LinkedIn" },
  { Icon: Mail, label: "Share via email" },
];

export const toolbar10Demo: Toolbar10Props = {
  bordered: false,
};

export function Toolbar10({ bordered = false, className }: Toolbar10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-1 rounded-full bg-card p-1 shadow-sm", bordered && "border border-border")}>
        {shares.map(({ Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
