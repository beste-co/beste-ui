"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Step {
  label: string;
  date: string;
  status: "done" | "current" | "upcoming";
}

interface Realestate10Props {
  title?: string;
  steps?: Step[];
  tone?: Tone;
  className?: string;
}

const doneClasses: Record<Tone, string> = {
  primary: "border-primary bg-primary text-primary-foreground",
  foreground: "border-foreground bg-foreground text-background",
  sky: "border-sky-500 bg-sky-500 text-white",
  emerald: "border-emerald-500 bg-emerald-500 text-white",
  violet: "border-violet-500 bg-violet-500 text-white",
  amber: "border-amber-500 bg-amber-500 text-white",
  rose: "border-rose-500 bg-rose-500 text-white",
};

const currentClasses: Record<Tone, string> = {
  primary: "border-primary bg-primary/15",
  foreground: "border-foreground bg-foreground/10",
  sky: "border-sky-500 bg-sky-500/15",
  emerald: "border-emerald-500 bg-emerald-500/15",
  violet: "border-violet-500 bg-violet-500/15",
  amber: "border-amber-500 bg-amber-500/15",
  rose: "border-rose-500 bg-rose-500/15",
};

const currentDotClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const connectorDoneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const realestate10Demo: Realestate10Props = {
  title: "Closing timeline",
  steps: [
    { label: "Offer accepted", date: "Apr 20", status: "done" },
    { label: "Inspection", date: "Apr 29", status: "current" },
    { label: "Appraisal", date: "May 6", status: "upcoming" },
    { label: "Closing", date: "May 22", status: "upcoming" },
  ],
  tone: "primary",
};

export function Realestate10({
  title,
  steps = [],
  tone = "primary",
  className,
}: Realestate10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {title && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
        )}
        <div className="flex flex-col">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="relative flex items-center gap-3 pb-3 last:pb-0"
            >
              {idx < steps.length - 1 && (
                <span
                  className={cn(
                    "absolute bottom-0 left-2.5 top-6 w-px",
                    s.status === "done"
                      ? connectorDoneClasses[tone]
                      : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                  s.status === "done" && doneClasses[tone],
                  s.status === "current" && currentClasses[tone],
                  s.status === "upcoming" &&
                    "border-border bg-card text-muted-foreground"
                )}
              >
                {s.status === "done" && (
                  <span
                    className="size-2 rounded-full bg-current"
                    aria-hidden="true"
                  />
                )}
                {s.status === "current" && (
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      currentDotClasses[tone]
                    )}
                    aria-hidden="true"
                  />
                )}
              </span>
              <div className="flex flex-1 items-center justify-between gap-2 text-sm">
                <span
                  className={cn(
                    "font-medium",
                    s.status === "upcoming"
                      ? "text-muted-foreground"
                      : "text-card-foreground"
                  )}
                >
                  {s.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {s.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
