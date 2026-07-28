"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ArrowDirection = "up" | "down" | "left" | "right" | null;

interface Keyboard6Props {
  active?: ArrowDirection;
  label?: string;
  className?: string;
}

export const keyboard6Demo: Keyboard6Props = {
  active: "up",
  label: "Navigate",
};

function ArrowKey({
  icon: Icon,
  active,
}: {
  icon: typeof ArrowUp;
  active: boolean;
}) {
  return (
    <kbd
      className={cn(
        "flex size-9 items-center justify-center rounded-md border border-border font-mono text-sm transition-colors",
        active
          ? "border-b-2 border-primary bg-primary text-primary-foreground shadow-inner"
          : "border-b-2 bg-muted text-card-foreground"
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </kbd>
  );
}

export function Keyboard6({
  active = null,
  label,
  className,
}: Keyboard6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="grid grid-cols-3 gap-1">
          <span aria-hidden="true" />
          <ArrowKey icon={ArrowUp} active={active === "up"} />
          <span aria-hidden="true" />
          <ArrowKey icon={ArrowLeft} active={active === "left"} />
          <ArrowKey icon={ArrowDown} active={active === "down"} />
          <ArrowKey icon={ArrowRight} active={active === "right"} />
        </div>
        {label && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
