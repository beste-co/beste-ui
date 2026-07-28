"use client";

import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Browser10Props {
  message?: string;
  rejectLabel?: string;
  acceptLabel?: string;
  tone?: Tone;
  className?: string;
}

const acceptClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-foreground/90",
  violet: "bg-violet-500 text-white hover:bg-violet-500/90",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-500/90",
  sky: "bg-sky-500 text-white hover:bg-sky-500/90",
  amber: "bg-amber-500 text-white hover:bg-amber-500/90",
  rose: "bg-rose-500 text-white hover:bg-rose-500/90",
};

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const browser10Demo: Browser10Props = {
  message: "We use cookies to measure traffic and improve your experience.",
  rejectLabel: "Reject",
  acceptLabel: "Accept",
  tone: "primary",
};

export function Browser10({
  message = "This site uses cookies.",
  rejectLabel = "Reject",
  acceptLabel = "Accept",
  tone = "primary",
  className,
}: Browser10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-md">
        <Cookie
          className={cn("mt-0.5 size-5 shrink-0", iconClasses[tone])}
          aria-hidden="true"
        />
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs leading-snug text-card-foreground">
            {message}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className={cn(
                "rounded-md px-2 py-1 text-xs font-semibold transition-colors",
                acceptClasses[tone]
              )}
            >
              {acceptLabel}
            </button>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
            >
              {rejectLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
