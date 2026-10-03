"use client";

import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Commerce22Step {
  label: string;
  time?: string;
  status: "done" | "active" | "pending";
}

interface Commerce22Props {
  trackingId?: string;
  steps?: Commerce22Step[];
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const activeDot: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-violet-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  amber: "bg-amber-500 text-white",
};

const lineColor: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const commerce22Demo: Commerce22Props = {
  tone: "foreground",
  steps: [
    { label: "Order placed", status: "done" },
    { label: "Packed", status: "done" },
    { label: "Shipped", time: "Apr 21, 4:30pm", status: "active" },
    { label: "Delivered", time: "Estimated Apr 22", status: "pending" },
  ],
  bordered: false,
};

export function Commerce22({
  trackingId,
  steps = [],
  tone = "foreground",
  bordered = false,
  className,
}: Commerce22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            Tracking
          </span>
          {trackingId && (
            <span className="text-xs text-muted-foreground">
              {trackingId}
            </span>
          )}
        </div>
        <ol className="flex flex-col">
          {steps.map((s, i) => {
            const isLast = i === steps.length - 1;
            const done = s.status === "done";
            const active = s.status === "active";
            return (
              <li key={s.label} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full",
                      done || active
                        ? activeDot[tone]
                        : "bg-muted text-muted-foreground"
                    )}
                    aria-hidden="true"
                  >
                    {done ? (
                      <Check className="size-2.5" strokeWidth={3} />
                    ) : active ? (
                      <Loader2 className="size-2.5 animate-spin" />
                    ) : (
                      <span className="size-1 rounded-full bg-current" />
                    )}
                  </span>
                  {!isLast && (
                    <span
                      className={cn(
                        "my-0.5 w-0.5 flex-1",
                        done ? lineColor[tone] : "bg-muted"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col pb-2">
                  <span
                    className={cn(
                      "text-sm",
                      active
                        ? "font-semibold text-card-foreground"
                        : done
                          ? "text-card-foreground"
                          : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                  {s.time && (
                    <span className="text-xs text-muted-foreground">
                      {s.time}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
