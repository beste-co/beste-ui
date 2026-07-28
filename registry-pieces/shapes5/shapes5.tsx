"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes5Props {
  className?: string;
}

export const shapes5Demo: Shapes5Props = {};

export function Shapes5({ className }: Shapes5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="size-10 rounded-md border border-border bg-background" />
        <ArrowRight className="size-4 text-muted-foreground" />
        <span className="size-10 rounded-md bg-amber-100" />
        <ArrowRight className="size-4 text-muted-foreground" />
        <span className="size-10 rounded-md bg-foreground" />
      </div>
    </div>
  );
}
