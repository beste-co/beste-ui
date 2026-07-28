"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TabContent {
  title: string;
  description?: string;
  href?: string;
}

interface TabItem {
  label: string;
  content: TabContent[];
}

interface ButtonItem {
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

interface Feature112Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  tabs?: TabItem[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature112Demo: Feature112Props = {
  badge: { label: "Solutions", variant: "default" },
  heading: "Solutions for every team",
  description: "Discover how different teams use our platform.",
  tabs: [
    {
      label: "Marketing",
      content: [
        {
          title: "Campaign Management",
          description: "Plan and execute marketing campaigns efficiently.",
          href: "https://beste.co",
        },
        {
          title: "Analytics Dashboard",
          description: "Track performance with detailed insights.",
          href: "https://beste.co",
        },
        {
          title: "Content Calendar",
          description: "Schedule and manage content across channels.",
          href: "https://beste.co",
        },
      ],
    },
    {
      label: "Sales",
      content: [
        {
          title: "Lead Tracking",
          description: "Monitor and nurture leads through the pipeline.",
          href: "https://beste.co",
        },
        {
          title: "Deal Management",
          description: "Close deals faster with organized workflows.",
          href: "https://beste.co",
        },
        {
          title: "Revenue Forecasting",
          description: "Predict future revenue with accuracy.",
          href: "https://beste.co",
        },
      ],
    },
    {
      label: "Engineering",
      content: [
        {
          title: "Sprint Planning",
          description: "Organize work into manageable sprints.",
          href: "https://beste.co",
        },
        {
          title: "Issue Tracking",
          description: "Track bugs and feature requests effectively.",
          href: "https://beste.co",
        },
        {
          title: "Code Reviews",
          description: "Streamline your code review process.",
          href: "https://beste.co",
        },
      ],
    },
  ],
  buttons: [],
};

export function Feature112({
  badge,
  heading,
  description,
  tabs = [],
  buttons = [],
  className,
}: Feature112Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeContent = tabs[activeIndex]?.content ?? [];

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold md:text-5xl">{heading}</h2>
            )}
            {description && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {tabs.map((tab, index) => (
            <Button
              key={index}
              variant={activeIndex === index ? "default" : "outline"}
              onClick={() => setActiveIndex(index)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
          {activeContent.map((item, index) => {
            const CardContent = (
              <>
                <h3 className="font-semibold">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </>
            );

            return item.href ? (
              <Link
                key={index}
                href={item.href}
                className="group/feature112 rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                {CardContent}
              </Link>
            ) : (
              <div key={index} className="rounded-xl border bg-card p-6">
                {CardContent}
              </div>
            );
          })}
        </div>

        {buttons.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {buttons.map((button, index) => (
              <Button key={index} variant={button.variant ?? "default"} asChild>
                <Link href={button.href ?? "#"}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
