"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser21Props {
  favicon?: string;
  title?: string;
  url?: string;
  time?: string;
  className?: string;
}

export const browser21Demo: Browser21Props = {
  title: "React Server Components Explained",
  url: "dev.to/reactjs/react-server-components-explained",
  time: "12 min ago",
};

export function Browser21({
  title = "Page title",
  url = "example.com",
  time,
  className,
}: Browser21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-start gap-3 rounded-md border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Globe className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-card-foreground">
            {title}
          </span>
          <span className="truncate font-mono text-xs text-muted-foreground">
            {url}
          </span>
        </div>
        {time && (
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {time}
          </span>
        )}
      </div>
    </div>
  );
}
