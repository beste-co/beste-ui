"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface Badge {
  label: string;
}

interface Announcement {
  kind: string;
  date: string;
  title: string;
  summary: string;
  href: string;
}

interface News37Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  allLabel?: string;
  items?: Announcement[];
  emptyLabel?: string;
  className?: string;
}

export const news37Demo: News37Props = {
  badge: { label: "Newsroom" },
  heading: "Everything we have announced, in the order it happened",
  description:
    "Product releases, company news, and the incident write-ups. All of it stays up, including the parts that did not go to plan.",
  allLabel: "Everything",
  items: [
    {
      kind: "Product",
      date: "14 May 2026",
      title: "Multi-site capacity sharing is out of testing",
      summary:
        "Four clinics can now share one waiting list while keeping their own rooms, hours, and rules. Three practices ran it for eleven weeks first.",
      href: "https://beste.co",
    },
    {
      kind: "Company",
      date: "02 May 2026",
      title: "We are profitable, and staying at eighteen people",
      summary:
        "No raise, no growth targets we do not believe, and no plan to add a sales team. The full note explains what that costs us.",
      href: "https://beste.co",
    },
    {
      kind: "Incident",
      date: "24 April 2026",
      title: "Forty-one minutes of slow booking pages",
      summary:
        "A deploy at 06:40 degraded the booking service for one region. Root cause, timeline, and the four things we changed afterwards.",
      href: "https://beste.co",
    },
    {
      kind: "Product",
      date: "11 April 2026",
      title: "Insurer reconciliation on the same ledger as self-pay",
      summary:
        "Billing no longer splits at the point an insurer is involved, which was the single most requested change of the last year.",
      href: "https://beste.co",
    },
    {
      kind: "Company",
      date: "28 March 2026",
      title: "Our sub-processor register is now public",
      summary:
        "Every company that touches your data, why, and where. Changes are published thirty days before they take effect.",
      href: "https://beste.co",
    },
    {
      kind: "Product",
      date: "09 March 2026",
      title: "Roles rewritten in plain language",
      summary:
        "Forty checkboxes became six named roles. We deleted more permission settings than we added, which is the point.",
      href: "https://beste.co",
    },
    {
      kind: "Incident",
      date: "17 February 2026",
      title: "Reminders sent twice to 214 members",
      summary:
        "A retry loop double-sent one evening's reminders. Nobody was double-booked, everybody was mildly annoyed, and here is the fix.",
      href: "https://beste.co",
    },
  ],
  emptyLabel: "Nothing filed under that yet.",
};

export function News37({
  badge,
  heading,
  description,
  allLabel = "All",
  items = [],
  emptyLabel,
  className,
}: News37Props) {
  const [kind, setKind] = useState<string | null>(null);

  const kinds = Array.from(new Set(items.map((item) => item.kind)));
  const visible = kind ? items.filter((item) => item.kind === kind) : items;

  const filters = [
    { label: allLabel, value: null, count: items.length },
    ...kinds.map((name) => ({
      label: name,
      value: name,
      count: items.filter((item) => item.kind === name).length,
    })),
  ];

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

        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((filter, index) => {
            const isActive = kind === filter.value;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setKind(filter.value)}
                aria-pressed={isActive}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.label}
                <span className="ml-2 tabular-nums opacity-60">{filter.count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          {visible.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="grid gap-3 border-t border-border py-6 transition-colors hover:bg-muted md:grid-cols-[8rem_9rem_minmax(0,1fr)] md:gap-8 md:px-4"
            >
              <span className="text-base text-muted-foreground">{item.kind}</span>
              <span className="text-base text-muted-foreground">{item.date}</span>
              <span>
                <span className="block text-xl font-medium text-foreground">{item.title}</span>
                <span className="mt-2 block max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {item.summary}
                </span>
              </span>
            </Link>
          ))}
        </div>

        {visible.length === 0 && emptyLabel && (
          <p className="border-t border-border py-6 text-base text-muted-foreground">
            {emptyLabel}
          </p>
        )}
      </div>
    </section>
  );
}
