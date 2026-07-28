"use client";

import { ImageIcon, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai28Props {
  filename?: string;
  dimensions?: string;
  objects?: string[];
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary ring-primary/30",
  foreground: "bg-foreground/10 text-foreground ring-foreground/20",
  violet:
    "bg-violet-500/15 text-violet-600 ring-violet-500/30 dark:text-violet-400",
  emerald:
    "bg-emerald-500/15 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400",
  sky: "bg-sky-500/15 text-sky-600 ring-sky-500/30 dark:text-sky-400",
  amber:
    "bg-amber-500/15 text-amber-600 ring-amber-500/30 dark:text-amber-400",
};

const scanClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const ai28Demo: Ai28Props = {
  filename: "whiteboard.jpg",
  dimensions: "1920×1080",
  objects: ["diagram", "text", "arrows"],
  tone: "violet",
};

export function Ai28({
  filename = "image.png",
  dimensions,
  objects = [],
  tone = "violet",
  className,
}: Ai28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes ai28-scan { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2.75rem); } }`}</style>
      <div className="flex w-full max-w-80 gap-2.5 rounded-md border border-border bg-card p-2.5 shadow-sm">
        <div
          className={cn(
            "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-sm ring-1 ring-inset",
            tileClasses[tone]
          )}
          aria-hidden="true"
        >
          <ImageIcon className="size-5" />
          <span
            className={cn(
              "absolute inset-x-0 top-0 h-0.5 opacity-80",
              scanClasses[tone]
            )}
            style={{
              animation: "ai28-scan 2.2s ease-in-out infinite",
            }}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-xs text-card-foreground">
              {filename}
            </span>
            {dimensions && (
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {dimensions}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ScanLine className="size-3" aria-hidden="true" />
            <span>Analyzing</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {objects.map((o) => (
              <span
                key={o}
                className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-card-foreground"
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
