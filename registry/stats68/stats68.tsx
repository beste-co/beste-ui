"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Badge {
  label: string;
}

interface ActionLink {
  label: string;
  href: string;
}

interface Segment {
  label: string;
  value: string;
  percent: number;
  description: string;
}

interface Stats68Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  totalValue?: string;
  totalLabel?: string;
  segments?: Segment[];
  footnote?: string;
  button?: ActionLink;
  className?: string;
}

const segmentFills = ["bg-primary", "bg-primary/70", "bg-primary/45", "bg-primary/25"];

export const stats68Demo: Stats68Props = {
  badge: { label: "Where the hours go" },
  heading: "Ninety-six clinical hours, split four ways",
  description:
    "One week at a four-site group, counted from the rota rather than estimated afterwards. The fourth segment is the one everybody is trying to shrink.",
  totalValue: "96",
  totalLabel: "clinical hours booked last week",
  segments: [
    {
      label: "Consultations",
      value: "40 hrs",
      percent: 42,
      description: "First appointments and the longer reviews that follow a referral.",
    },
    {
      label: "Follow-ups",
      value: "27 hrs",
      percent: 28,
      description: "Repeat visits inside an existing care plan, mostly half-hour slots.",
    },
    {
      label: "Assessments",
      value: "18 hrs",
      percent: 19,
      description: "Structured assessments that need a room, a clinician, and a full hour.",
    },
    {
      label: "Admin held in clinical rooms",
      value: "11 hrs",
      percent: 11,
      description:
        "Time a room was blocked for paperwork. Down from 23 hours before the switch, and still falling.",
    },
  ],
  footnote:
    "Percentages are rounded to the nearest whole number, so they do not always total exactly one hundred.",
  button: { label: "See your own breakdown", href: "https://beste.co" },
};

export function Stats68({
  badge,
  heading,
  description,
  totalValue,
  totalLabel,
  segments = [],
  footnote,
  button,
  className,
}: Stats68Props) {
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

        <div className="mt-12 md:mt-16">
          <div className="flex flex-wrap items-baseline gap-x-4">
            {totalValue && (
              <p className="text-4xl font-light tracking-tight tabular-nums text-foreground md:text-6xl">
                {totalValue}
              </p>
            )}
            {totalLabel && <p className="text-base text-muted-foreground">{totalLabel}</p>}
          </div>

          {segments.length > 0 && (
            <div className="mt-6 flex h-4 w-full gap-1 overflow-hidden" aria-hidden="true">
              {segments.map((segment, index) => (
                <span
                  key={index}
                  className={cn(
                    "rounded-sm",
                    segmentFills[index % segmentFills.length]
                  )}
                  style={{ width: `${segment.percent}%` }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="grid gap-3 border-t border-border py-5 md:grid-cols-[minmax(0,1fr)_6rem_5rem_minmax(0,1.6fr)] md:items-baseline md:gap-8"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "size-3 shrink-0 rounded-sm",
                    segmentFills[index % segmentFills.length]
                  )}
                  aria-hidden="true"
                />
                <p className="text-lg font-medium text-foreground">{segment.label}</p>
              </div>

              <p className="text-lg tabular-nums text-foreground">{segment.value}</p>
              <p className="text-lg tabular-nums text-muted-foreground">{segment.percent}%</p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {segment.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          {footnote && (
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{footnote}</p>
          )}
          {button && (
            <Button21 asChild label={button.label} tone="outline">
              <Link href={button.href} />
            </Button21>
          )}
        </div>
      </div>
    </section>
  );
}
