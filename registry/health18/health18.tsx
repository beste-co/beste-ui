"use client";

import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { Badge23 } from "@/components/beste/component/badge23";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface ActionLink {
  label: string;
  href: string;
}

interface Program {
  name: string;
  meta: string;
  description: string;
  includes?: string[];
  link: ActionLink;
}

interface Health18Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  items?: Program[];
  footnote?: string;
  className?: string;
}

export const health18Demo: Health18Props = {
  badge: { label: "Programmes" },
  heading: "Care that runs on a plan, not on a reminder",
  description:
    "Each programme is a template your team can start from, then bend to the member in front of them without breaking the reporting.",
  items: [
    {
      name: "First year of parenthood",
      meta: "12 weeks · weekly sessions",
      description:
        "A structured start for new families, with room to slow down when a week goes badly and catch up when it does not.",
      includes: [
        "Fortnightly clinician review",
        "Shared plan the whole household can read",
        "Between-session messaging",
      ],
      link: { label: "See the programme", href: "https://beste.co" },
    },
    {
      name: "Long-term condition care",
      meta: "Ongoing · monthly reviews",
      description:
        "Steady, low-friction follow-up for members who will be with you for years rather than weeks, with escalation built in.",
      includes: [
        "Monthly check-in with the same clinician",
        "Automatic recall before the plan lapses",
        "Escalation route that skips the queue",
      ],
      link: { label: "See the programme", href: "https://beste.co" },
    },
    {
      name: "Return to work",
      meta: "8 weeks · fortnightly sessions",
      description:
        "A short programme built with employers in mind, producing the paperwork they need without turning care into admin.",
      includes: [
        "Employer-ready progress summaries",
        "Adjustable pacing per member",
        "Handover note at discharge",
      ],
      link: { label: "See the programme", href: "https://beste.co" },
    },
  ],
  footnote: "Every programme can be renamed, reshaped, or retired by your team without our help.",
};

export function Health18({
  badge,
  heading,
  description,
  items = [],
  footnote,
  className,
}: Health18Props) {
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

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col rounded-md border border-border p-6 transition-colors hover:border-foreground/40 md:p-8"
            >
              <p className="text-xl font-light tracking-tight text-foreground md:text-2xl">
                {item.name}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{item.meta}</p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              {item.includes && item.includes.length > 0 && (
                <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-border pt-6">
                  {item.includes.map((entry, entryIndex) => (
                    <li key={entryIndex} className="flex items-start gap-3 text-base text-foreground">
                      <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                      {entry}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={item.link.href}
                className="group/health18 mt-6 inline-flex items-center gap-2 text-base text-foreground transition-colors hover:text-primary"
              >
                {item.link.label}
                <ArrowUpRight
                  className="size-4 transition-transform motion-safe:group-hover/health18:translate-x-0.5 motion-safe:group-hover/health18:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          ))}
        </div>

        {footnote && <p className="mt-8 text-sm text-muted-foreground">{footnote}</p>}
      </div>
    </section>
  );
}
