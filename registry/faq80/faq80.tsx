"use client";

import Link from "next/link";
import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface ActionLink {
  label: string;
  href: string;
  tone?: "primary" | "neutral" | "outline";
}

interface FaqItem {
  question: string;
  answer: string;
}

interface Support {
  title: string;
  description: string;
  buttons?: ActionLink[];
}

interface Faq80Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  items?: FaqItem[];
  support?: Support;
  className?: string;
}

export const faq80Demo: Faq80Props = {
  badge: { label: "Answers" },
  heading: "Everything teams ask before they move",
  description:
    "No sales call required. The details that usually decide it are written down here, in plain language.",
  items: [
    {
      question: "How long does a migration actually take?",
      answer:
        "Most practices are running live within a week. You import members and appointments from a spreadsheet or a direct export, connect billing, then invite the team from a guided checklist.",
    },
    {
      question: "Who owns the data we bring in?",
      answer:
        "You do, always. Every record stays yours and can be exported in full at any time, in an open format, with no request queue and no exit fee.",
    },
    {
      question: "Can each site keep its own workflow?",
      answer:
        "Yes. Locations share one member directory but keep their own calendars, rooms, and templates, so a group rollout never forces a single way of working.",
    },
    {
      question: "What happens when a member cancels late?",
      answer:
        "Your cancellation window and fee are set once per service. The slot reopens automatically, the waitlist is notified, and the fee lands on the next invoice.",
    },
    {
      question: "Does it handle claims and insurers?",
      answer:
        "Claims are raised from the same record as the appointment, submitted in batches, and reconciled against payments so nothing sits unmatched at month end.",
    },
    {
      question: "How is access controlled across the team?",
      answer:
        "Roles scope what each person can open, from front desk to clinician to finance. Every view and edit on a record is logged and searchable.",
    },
    {
      question: "Is there a limit on members or appointments?",
      answer:
        "No. Plans are priced on seats, not on volume, so a busy month never turns into a surprise line on your bill.",
    },
    {
      question: "What does support look like after launch?",
      answer:
        "Guided setup is included on every plan, and larger groups get a named contact who stays with you through rollout and training.",
    },
  ],
  support: {
    title: "Still weighing something up?",
    description:
      "Send us the question and a real person on the product team answers, usually the same working day.",
    buttons: [
      { label: "Talk to the team", href: "https://beste.co" },
      { label: "Read the docs", href: "https://beste.co", tone: "outline" },
    ],
  },
};

export function Faq80({ badge, heading, description, items = [], support, className }: Faq80Props) {
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

        <div className="mt-12 grid gap-x-12 md:mt-16 md:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="border-t border-border py-6 md:py-8">
              <span className="text-sm text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-medium text-foreground">
                {item.question}
              </h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        {support && (
          <div className="mt-12 flex flex-col gap-6 rounded-md bg-muted p-8 md:mt-16 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-md">
              <p className="text-xl font-light tracking-tight text-foreground md:text-2xl">
                {support.title}
              </p>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {support.description}
              </p>
            </div>
            {support.buttons && support.buttons.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {support.buttons.map((button, index) => (
                  <Button21 key={index} asChild label={button.label} tone={button.tone}>
                    <Link href={button.href} />
                  </Button21>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
