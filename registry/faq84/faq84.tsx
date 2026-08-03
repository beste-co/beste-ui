"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Badge {
  label: string;
}

interface LedgerEntry {
  question: string;
  answer: string;
}

interface LedgerGroup {
  label: string;
  entries: LedgerEntry[];
}

interface Faq84Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  groups?: LedgerGroup[];
  footerLabel?: string;
  footerLink?: { label: string; href: string };
  className?: string;
}

export const faq84Demo: Faq84Props = {
  badge: { label: "Short answers" },
  heading: "The quick ones, without an accordion in the way",
  description:
    "Everything here fits in two lines, so nothing is hidden behind a click. The longer answers live in the help centre.",
  groups: [
    {
      label: "Getting started",
      entries: [
        {
          question: "Is there a free tier?",
          answer: "Yes, free while you are running a single clinic, with no card and no time limit.",
        },
        {
          question: "How long is setup?",
          answer: "An afternoon for one clinic, a fortnight for a group moving off another system.",
        },
        {
          question: "Do we need training?",
          answer:
            "No formal training. We stay on the call until your first real booking goes through.",
        },
      ],
    },
    {
      label: "Day to day",
      entries: [
        {
          question: "Does it work on a phone?",
          answer: "Yes, and members get a link rather than an app they have to install.",
        },
        {
          question: "Can we run several sites?",
          answer:
            "Yes, on every plan. Sites share capacity and a waiting list but keep their own rules.",
        },
        {
          question: "Is there an API?",
          answer: "Read and write access to appointments and invoices, shipping shortly after launch.",
        },
      ],
    },
    {
      label: "Money and exit",
      entries: [
        {
          question: "How are we billed?",
          answer: "Monthly in arrears, per seat, prorated in both directions when the team changes.",
        },
        {
          question: "Any setup fees?",
          answer: "None. Migration, mapping, and the first go-live are part of the subscription.",
        },
        {
          question: "What if we leave?",
          answer:
            "Thirty days' notice, no penalty, and a full export that stays available for ninety days.",
        },
      ],
    },
  ],
  footerLabel: "Longer questions, longer answers",
  footerLink: { label: "Open the help centre", href: "https://beste.co" },
};

export function Faq84({
  badge,
  heading,
  description,
  groups = [],
  footerLabel,
  footerLink,
  className,
}: Faq84Props) {
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
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-10 last:mb-0">
              <h3 className="text-sm text-muted-foreground">
                {group.label}
              </h3>
              <dl className="mt-4">
                {group.entries.map((entry, index) => (
                  <div
                    key={index}
                    className="grid gap-2 border-t border-border py-4 last:border-b md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-12"
                  >
                    <dt className="text-base font-medium text-foreground">{entry.question}</dt>
                    <dd className="text-base leading-relaxed text-muted-foreground">
                      {entry.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        {footerLabel && footerLink && (
          <p className="mt-4 text-base text-muted-foreground">
            {footerLabel}{" "}
            <Link
              href={footerLink.href}
              className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              {footerLink.label}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
