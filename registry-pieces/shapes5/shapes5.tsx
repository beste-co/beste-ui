"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes5Props {
  bordered?: boolean;
  className?: string;
}

export const shapes5Demo: Shapes5Props = {
  bordered: false,
};

export function Shapes5({ bordered = false, className }: Shapes5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className={cn("size-10 rounded-md", bordered ? "border border-border bg-background" : "bg-card")} />
        <ArrowRight className="size-4 text-muted-foreground" />
        <span className="size-10 rounded-md bg-muted-foreground" />
        <ArrowRight className="size-4 text-muted-foreground" />
        <span className="size-10 rounded-md bg-foreground" />
      </div>
    </div>
  );
}
