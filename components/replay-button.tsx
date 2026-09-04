"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplayButtonProps {
  onClick: () => void;
  /** Show the word next to the icon (detail pages); cards keep the icon alone */
  label?: string;
  className?: string;
}

/**
 * The replay control for components flagged `isAnimated` in their meta: the
 * showcase remounts the demo on click, so a one-shot entrance plays again.
 */
export function ReplayButton({ onClick, label, className }: ReplayButtonProps) {
  return (
    <button
      type="button"
      aria-label={label ?? "Replay animation"}
      title={label ?? "Replay animation"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border bg-background px-2 text-sm text-foreground transition-colors hover:bg-muted",
        !label && "w-8 justify-center px-0",
        className
      )}
    >
      <RotateCcw className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
