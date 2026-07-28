"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Ai17Props {
  title?: string;
  bullets?: string[];
  source?: string;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const ai17Demo: Ai17Props = {
  title: "Weekly summary",
  bullets: [
    "Onboarding ships to GA on Tuesday",
    "Pricing experiment lifts conversion by 14%",
    "Two critical bugs filed, one already patched",
  ],
  source: "Synthesized from 3 documents",
  tone: "violet",
};

export function Ai17({
  title = "Summary",
  bullets = [],
  source,
  tone = "violet",
  className,
}: Ai17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card px-3 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Sparkles
            className={cn("size-3.5", iconClasses[tone])}
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm leading-snug text-card-foreground"
            >
              <span
                className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground"
                aria-hidden="true"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {source && (
          <span className="border-t border-border pt-2 text-xs text-muted-foreground">
            {source}
          </span>
        )}
      </div>
    </div>
  );
}
