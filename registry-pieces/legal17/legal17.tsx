"use client";

import { cn } from "@/lib/utils";

interface Milestone {
  label: string;
  date: string;
  status: "past" | "current" | "future";
}

interface Legal17Props {
  heading?: string;
  milestones?: Milestone[];
  bordered?: boolean;
  className?: string;
}

export const legal17Demo: Legal17Props = {
  milestones: [
    { label: "Effective date", date: "May 1, 2026", status: "past" },
    { label: "First renewal", date: "May 1, 2027", status: "current" },
    { label: "Term end", date: "May 1, 2029", status: "future" },
  ],
  bordered: false,
};

const statusClasses: Record<Milestone["status"], string> = {
  past: "bg-emerald-500",
  current: "bg-primary ring-4 ring-primary/20",
  future: "bg-muted border border-border",
};

export function Legal17({
  heading,
  milestones = [],
  bordered = false,
  className,
}: Legal17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {heading && (
          <span className="text-xs font-semibold text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="relative flex items-start justify-between">
          <span
            className="absolute left-2 right-2 top-2 h-px bg-border"
            aria-hidden="true"
          />
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="relative flex flex-1 flex-col items-center gap-1"
            >
              <span
                className={cn(
                  "size-4 shrink-0 rounded-full",
                  statusClasses[m.status]
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "text-center text-xs font-semibold",
                  m.status === "current"
                    ? "text-primary"
                    : "text-card-foreground"
                )}
              >
                {m.label}
              </span>
              <span className="text-center text-xs text-muted-foreground">
                {m.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
