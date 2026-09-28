"use client";

import { Type } from "lucide-react";

import { cn } from "@/lib/utils";

interface DemoContentSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

/** Stage control for background components: lays the demo content over the surface or takes it away. */
export function DemoContentSwitch({ checked, onCheckedChange, className }: DemoContentSwitchProps) {
  const label = checked ? "Hide demo content" : "Show demo content";
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={label}
      title={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-muted transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        checked ? "text-foreground" : "text-foreground/40 hover:text-foreground/70",
        className,
      )}
    >
      <Type className="size-3.5" aria-hidden="true" />
      {/* A slash through the letter while the content is off */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute h-px w-4 rotate-45 bg-current transition-opacity duration-200",
          checked ? "opacity-0" : "opacity-100",
        )}
      />
    </button>
  );
}
