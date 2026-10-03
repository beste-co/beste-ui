"use client";

import { cn } from "@/lib/utils";

interface Nav17Props {
  bordered?: boolean;
  className?: string;
}

export const nav17Demo: Nav17Props = {
  bordered: false,
};

export function Nav17({ bordered = false, className }: Nav17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("relative flex w-52 flex-col gap-0.5 rounded-lg bg-card/95 p-1 shadow-xl backdrop-blur", bordered && "border border-border")}>
        <span
          className="absolute -left-2 -top-1 size-2 rotate-45 border-l border-t border-border bg-card"
          aria-hidden="true"
        />
        <button
          type="button"
          className="flex items-center rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          Copy
        </button>
        <button
          type="button"
          className="flex items-center rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          Cut
        </button>
        <button
          type="button"
          className="flex items-center rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          Copy link
        </button>
        <button
          type="button"
          className="flex items-center rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          Share…
        </button>
      </div>
    </div>
  );
}
