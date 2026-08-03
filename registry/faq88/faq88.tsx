"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Badge {
  label: string;
}

interface ActionLink {
  label: string;
  href: string;
}

interface FitColumn {
  title: string;
  description: string;
  items: string[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface Faq88Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  fit?: FitColumn;
  notFit?: FitColumn;
  items?: FaqItem[];
  closingLabel?: string;
  button?: ActionLink;
  className?: string;
}

export const faq88Demo: Faq88Props = {
  badge: { label: "Honest answers" },
  heading: "Whether this is for you, before you spend an hour finding out",
  description:
    "We would rather lose the call early than lose it in month three. Here is the shape of practice Sirius suits, and the shape it does not.",
  fit: {
    title: "A good fit if",
    description: "These are the practices where the product earns its place in the first fortnight.",
    items: [
      "You run between one and twenty clinical rooms",
      "Scheduling, records, and billing are three systems today",
      "Somebody spends their morning reconciling those three",
      "You want a named engineer rather than an account manager",
      "You are willing to move one clinic first and judge from that",
    ],
  },
  notFit: {
    title: "Probably not if",
    description: "We will say so on the first call rather than sell into the gap.",
    items: [
      "You need inpatient or ward management",
      "Your rota is built around shift patterns rather than appointments",
      "You require an on-premise deployment",
      "Procurement needs a five-year fixed contract",
      "You want the product bent to match your current process exactly",
    ],
  },
  items: [
    {
      question: "What if we are close to the second list?",
      answer:
        "Tell us which line and we will give you a straight yes or no on the call. Twice a year that answer is yes and we build the thing; more often it is no and we say so.",
    },
    {
      question: "Do you ever turn practices away?",
      answer:
        "Four times last year. Two needed inpatient management, one wanted on-premise, and one was three weeks from a merger and should not have been changing systems at all.",
    },
    {
      question: "Will you tell us if we should stay where we are?",
      answer:
        "Yes. If the reconciliation problem you have is a process problem rather than a software problem, replacing the software will not fix it and we will explain why.",
    },
  ],
  closingLabel: "Not sure which list you are on?",
  button: { label: "Ask before you book", href: "https://beste.co" },
};

export function Faq88({
  badge,
  heading,
  description,
  fit,
  notFit,
  items = [],
  closingLabel,
  button,
  className,
}: Faq88Props) {
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

        <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-2">
          {[
            { column: fit, positive: true },
            { column: notFit, positive: false },
          ].map((entry, index) =>
            entry.column ? (
              <div
                key={index}
                className={cn(
                  "flex flex-col rounded-md border p-8 md:p-10",
                  entry.positive ? "border-primary bg-card" : "border-border bg-muted"
                )}
              >
                <h3 className="text-2xl font-light tracking-tight text-foreground md:text-3xl">
                  {entry.column.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {entry.column.description}
                </p>
                <ul className="mt-6">
                  {entry.column.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-3 border-t border-border py-3 text-base text-foreground"
                    >
                      {entry.positive ? (
                        <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                      ) : (
                        <X
                          className="mt-1 size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </div>

        <div className="mt-12">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid gap-2 border-t border-border py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-12"
            >
              <h3 className="text-lg font-medium text-foreground">{item.question}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          {closingLabel && <p className="text-base text-foreground">{closingLabel}</p>}
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
