"use client";

import { cn } from "@/lib/utils";

type MoveKey = "W" | "A" | "S" | "D";

interface Keyboard15Props {
  active?: MoveKey | null;
  caption?: string;
  className?: string;
}

export const keyboard15Demo: Keyboard15Props = {
  active: "W",
  caption: "Move",
};

function MoveCap({
  label,
  active,
}: {
  label: MoveKey;
  active: boolean;
}) {
  return (
    <kbd
      className={cn(
        "flex size-10 items-center justify-center rounded-md border font-mono text-sm font-semibold shadow-sm",
        active
          ? "border-primary bg-primary text-primary-foreground border-b-2 shadow-inner"
          : "border-border border-b-2 bg-gradient-to-b from-card to-muted text-card-foreground"
      )}
    >
      {label}
    </kbd>
  );
}

export function Keyboard15({
  active = null,
  caption,
  className,
}: Keyboard15Props) {
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
          <MoveCap label="W" active={active === "W"} />
          <span aria-hidden="true" />
          <MoveCap label="A" active={active === "A"} />
          <MoveCap label="S" active={active === "S"} />
          <MoveCap label="D" active={active === "D"} />
        </div>
        {caption && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
