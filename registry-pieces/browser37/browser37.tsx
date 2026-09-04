"use client";

import { useEffect, useState } from "react";
import { Lock, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser37Props {
  url?: string;
  heading?: string;
  body?: string;
  loadMs?: number;
  holdMs?: number;
  className?: string;
}

export const browser37Demo: Browser37Props = {
  url: "beste.co/changelog",
  heading: "Shipped this week",
  body: "Faster previews, a rebuilt search index, and twenty new pieces for your media slots.",
};

export function Browser37({
  url = "example.com",
  heading = "Page title",
  body = "",
  loadMs = 1800,
  holdMs = 2600,
  className,
}: Browser37Props) {
  const [ratio, setRatio] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      const id = setTimeout(() => {
        setReady(false);
        setRatio(0);
      }, holdMs);
      return () => clearTimeout(id);
    }
    const steps = 20;
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      setRatio(step / steps);
      if (step >= steps) {
        clearInterval(id);
        setReady(true);
      }
    }, loadMs / steps);
    return () => clearInterval(id);
  }, [ready, loadMs, holdMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes browser37-in { from { opacity: 0; transform: translateY(0.375rem); } to { opacity: 1; transform: none; } }
@keyframes browser37-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`}</style>

      <div className="w-full max-w-80 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border p-2.5">
          <span className="flex gap-1" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-muted" />
            <span className="size-2.5 rounded-full bg-muted" />
            <span className="size-2.5 rounded-full bg-muted" />
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            <Lock className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{url}</span>
          </span>
          <RotateCw
            className="size-3.5 shrink-0 text-muted-foreground"
            style={
              ready
                ? undefined
                : { animation: "browser37-spin 900ms linear infinite" }
            }
            aria-hidden="true"
          />
        </div>

        <div className="h-0.5 bg-muted" aria-hidden="true">
          <span
            className="block h-full bg-sky-500 transition-all duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${ratio * 100}%`, opacity: ready ? 0 : 1 }}
          />
        </div>

        <div className="flex flex-col gap-3 p-4">
          {ready ? (
            <div
              className="flex flex-col gap-2"
              style={{ animation: "browser37-in 450ms ease-out" }}
            >
              <p className="text-sm font-medium text-card-foreground">
                {heading}
              </p>
              <p className="text-sm leading-snug text-muted-foreground">
                {body}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2" aria-hidden="true">
              <span className="h-3.5 w-2/5 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
              <span className="h-3 w-full animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
              <span className="h-3 w-4/5 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
            </div>
          )}

          <div className="flex gap-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-12 flex-1 rounded-lg transition-colors duration-500 motion-reduce:transition-none",
                  ready ? "bg-muted" : "animate-pulse bg-muted motion-reduce:animate-none"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
