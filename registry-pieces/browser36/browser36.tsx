"use client";

import { useEffect, useState } from "react";
import { Lock, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "loading" | "ready";

interface Browser36Props {
  url?: string;
  heading?: string;
  body?: string;
  action?: string;
  loadMs?: number;
  holdMs?: number;
  className?: string;
}

export const browser36Demo: Browser36Props = {
  url: "app.beste.co/dashboard",
  heading: "Welcome back, Nina",
  body: "Three releases shipped this week and every check is green. Your next review is on Thursday.",
  action: "Open workspace",
};

export function Browser36({
  url = "example.com",
  heading = "Page title",
  body = "",
  action = "Continue",
  loadMs = 1400,
  holdMs = 2600,
  className,
}: Browser36Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (phase === "loading") {
      const id = setTimeout(() => setPhase("ready"), loadMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setCycle((c) => c + 1);
      setPhase("loading");
    }, holdMs);
    return () => clearTimeout(id);
  }, [phase, loadMs, holdMs]);

  const loading = phase === "loading";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes browser36-bar { from { width: 0%; } 60% { width: 72%; } to { width: 100%; } } @keyframes browser36-shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } } @keyframes browser36-in { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="w-full max-w-72 overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="flex h-9 items-center gap-2 border-b border-border bg-muted px-3">
          <span className="flex gap-1" aria-hidden="true">
            <span className="size-2 rounded-full bg-muted-foreground/30" />
            <span className="size-2 rounded-full bg-muted-foreground/30" />
            <span className="size-2 rounded-full bg-muted-foreground/30" />
          </span>
          <span className="flex h-5 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-border bg-background px-2 text-xs text-muted-foreground">
            <Lock className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{url}</span>
          </span>
          <RotateCw
            className={cn(
              "size-3 shrink-0 text-muted-foreground",
              loading && "animate-spin motion-reduce:animate-none"
            )}
            aria-hidden="true"
          />
        </div>

        <div className="relative h-0.5" aria-hidden="true">
          <span
            key={cycle}
            className={cn(
              "absolute inset-y-0 left-0 bg-primary transition-opacity duration-300",
              loading ? "opacity-100" : "opacity-0"
            )}
            style={{ animation: `browser36-bar ${loadMs}ms ease-out forwards` }}
          />
        </div>

        <div className="grid p-4">
          <div
            className={cn(
              "col-start-1 row-start-1 flex flex-col transition-opacity duration-300 motion-reduce:transition-none",
              loading ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
          >
            {[
              { row: "h-6 w-40", bar: "h-4" },
              { row: "mt-2 h-5 w-full", bar: "h-3" },
              { row: "h-5 w-48", bar: "h-3" },
              { row: "mt-3 h-8 w-28", bar: "h-8" },
            ].map((block, i) => (
              <span key={i} className={cn("flex items-center", block.row)}>
                <span className={cn("relative w-full overflow-hidden rounded bg-muted", block.bar)}>
                  {loading && (
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-background/70 to-transparent"
                      style={{
                        animation: "browser36-shimmer 1200ms ease-in-out infinite",
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  )}
                </span>
              </span>
            ))}
          </div>

          <div
            key={cycle}
            className={cn("col-start-1 row-start-1 flex flex-col", loading && "invisible")}
            style={loading ? undefined : { animation: "browser36-in 500ms ease-out" }}
          >
            <span className="h-6 truncate text-base font-semibold leading-6 text-card-foreground">
              {heading}
            </span>
            <p className="mt-2 line-clamp-2 h-10 text-sm leading-5 text-muted-foreground">
              {body}
            </p>
            <span className="mt-3 inline-flex h-8 w-28 items-center justify-center rounded-md bg-primary text-xs font-medium text-primary-foreground">
              {action}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
