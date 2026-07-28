"use client";

import { cn } from "@/lib/utils";

interface Shapes40Props {
  className?: string;
}

export const shapes40Demo: Shapes40Props = {};

export function Shapes40({ className }: Shapes40Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-44 flex-col gap-1.5" aria-hidden="true">
        <div className="flex w-fit flex-col gap-1 rounded-lg rounded-bl-sm bg-muted px-3 py-2">
          <span className="h-1 w-12 rounded-full bg-muted-foreground/40" />
          <span className="h-1 w-16 rounded-full bg-muted-foreground/40" />
        </div>
        <div className="ml-auto flex w-fit flex-col gap-1 rounded-lg rounded-br-sm bg-foreground px-3 py-2">
          <span className="h-1 w-20 rounded-full bg-background/40" />
        </div>
        <div className="flex w-fit flex-col gap-1 rounded-lg rounded-bl-sm bg-muted px-3 py-2">
          <span className="h-1 w-10 rounded-full bg-muted-foreground/40" />
        </div>
      </div>
    </div>
  );
}
