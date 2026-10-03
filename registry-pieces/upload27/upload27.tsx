"use client";

import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Folder {
  name: string;
  count: number;
}

interface Upload27Props {
  heading?: string;
  folders?: Folder[];
  bordered?: boolean;
  className?: string;
}

export const upload27Demo: Upload27Props = {
  folders: [
    { name: "Brand assets", count: 124 },
    { name: "Press kit 2026", count: 38 },
    { name: "Product screenshots", count: 212 },
  ],
  bordered: false,
};

export function Upload27({
  heading,
  folders = [],
  bordered = false,
  className,
}: Upload27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-2 shadow-sm", bordered && "border border-border")}>
        {heading && (
          <span className="px-2 pt-1 text-xs font-semibold text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex flex-col gap-0.5">
          {folders.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
            >
              <GripVertical
                className="size-3.5 shrink-0 text-muted-foreground/60"
                aria-hidden="true"
              />
              <span className="flex-1 truncate text-sm text-card-foreground">
                {f.name}
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {f.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
