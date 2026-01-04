"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComparisonItem {
  id: string;
  text: string;
}

interface ComparisonColumn {
  id: string;
  label: string;
  highlighted?: boolean;
  items: ComparisonItem[];
}

interface ButtonItem {
  id: string;
  label: string;
  href?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
}

interface Feature30Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  firstColumn?: ComparisonColumn;
  secondColumn?: ComparisonColumn;
  buttons?: ButtonItem[];
  className?: string;
}

export const feature30Demo: Feature30Props = {
  badge: { label: "Compare", variant: "secondary" },
  heading: "The difference is clear",
  description:
    "See how your workflow transforms when you switch from scattered tools to a unified platform.",
  firstColumn: {
    id: "before",
    label: "Before",
    items: [
      { id: "b1", text: "Manual data entry across multiple tools" },
      { id: "b2", text: "Hours spent searching for information" },
      { id: "b3", text: "Inconsistent formatting and branding" },
      { id: "b4", text: "No visibility into team progress" },
      { id: "b5", text: "Scattered feedback in emails and chats" },
    ],
  },
  secondColumn: {
    id: "after",
    label: "After",
    highlighted: true,
    items: [
      { id: "a1", text: "Single source of truth, auto-synced" },
      { id: "a2", text: "Instant search with smart filters" },
      { id: "a3", text: "Templates enforce brand consistency" },
      { id: "a4", text: "Real-time dashboards and notifications" },
      { id: "a5", text: "Contextual comments right where you work" },
    ],
  },
  buttons: [
    { id: "btn-1", label: "Start free trial", href: "https://beste.co" },
    {
      id: "btn-2",
      label: "See demo",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
};

export function Feature30({
  badge,
  heading,
  description,
  firstColumn,
  secondColumn,
  buttons = [],
  className,
}: Feature30Props) {
  const hasColumns = firstColumn || secondColumn;

  const renderColumn = (column: ComparisonColumn) => (
    <div className="rounded-lg border shadow-sm p-8 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <h3 className="text-xl font-bold mb-6">{column.label}</h3>
      <ul className="space-y-2">
        {column.items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
            <span className="leading-relaxed text-sm text-muted-foreground">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-5 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold md:text-5xl text-balance">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base md:text-lg text-balance text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        {hasColumns && (
          <div className="grid gap-4 md:grid-cols-2 sm:gap-8">
            {firstColumn && renderColumn(firstColumn)}
            {secondColumn && renderColumn(secondColumn)}
          </div>
        )}

        {buttons.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {buttons.map((button) => (
              <Button
                key={button.id}
                variant={button.variant ?? "default"}
                asChild
              >
                <Link href={button.href ?? "#"}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
