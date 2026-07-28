"use client";

import { TrendingUp } from "lucide-react";
import { Badge23 } from "@/components/beste/component/badge23";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface Metric {
  value: string;
  label: string;
  description: string;
  delta?: string;
}

interface Stats66Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  items?: Metric[];
  footnote?: string;
  className?: string;
}

export const stats66Demo: Stats66Props = {
  badge: { label: "Outcomes" },
  heading: "What changes in the first quarter",
  description:
    "Measured across the practices that finished onboarding in 2025, compared against their own numbers from the quarter before.",
  items: [
    {
      value: "31%",
      label: "Fewer no-shows",
      description:
        "Reminders go out on the member's own channel, and a cancelled slot reopens to the waitlist before anyone at the desk notices it.",
      delta: "up from 24% last year",
    },
    {
      value: "6.5h",
      label: "Given back to each clinician, weekly",
      description:
        "Notes, plans, and coverage checks live on the same record, so the evening admin block quietly disappears.",
      delta: "up from 4h last year",
    },
    {
      value: "4 days",
      label: "Faster to get paid",
      description:
        "Claims leave the same day the appointment closes and reconcile themselves against incoming payments.",
    },
    {
      value: "96%",
      label: "Of practices still here after a year",
      description:
        "Teams stay because the workflow bends to how they already work, not the other way around.",
      delta: "up from 92% last year",
    },
  ],
  footnote: "Averages across 240 practices, measured over the first 90 days after go-live.",
};

export function Stats66({
  badge,
  heading,
  description,
  items = [],
  footnote,
  className,
}: Stats66Props) {
  return (
    <section className={cn("bg-background py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {badge && <Badge23 label={badge.label} />}

        <div className="mt-6 border-t border-border pt-8 md:pt-10">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            {heading && (
              <h2 className="text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <div className="flex md:justify-end">
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-border md:mt-16">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid gap-3 border-b border-border py-8 md:grid-cols-[minmax(0,14rem)_1fr_auto] md:items-baseline md:gap-10 md:py-10"
            >
              <p className="text-4xl font-light tracking-tight text-foreground md:text-6xl">
                {item.value}
              </p>
              <div>
                <p className="text-lg font-medium text-foreground">{item.label}</p>
                <p className="mt-2 max-w-lg text-base leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
              {item.delta && (
                <p className="flex items-center gap-2 text-sm text-primary md:justify-end">
                  <TrendingUp className="size-4 shrink-0" aria-hidden="true" />
                  {item.delta}
                </p>
              )}
            </div>
          ))}
        </div>

        {footnote && <p className="mt-8 text-sm text-muted-foreground">{footnote}</p>}
      </div>
    </section>
  );
}
