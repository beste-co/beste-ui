"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface Badge {
  label: string;
}

interface ActionLink {
  label: string;
  href: string;
}

interface Term {
  term: string;
  definition: string;
}

interface Faq89Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  allLabel?: string;
  terms?: Term[];
  emptyLabel?: string;
  closing?: string;
  button?: ActionLink;
  className?: string;
}

export const faq89Demo: Faq89Props = {
  badge: { label: "Plain English" },
  heading: "The words we use, and what we actually mean by them",
  description:
    "Clinical software collects vocabulary. Here is ours, defined by someone who has to explain it on calls.",
  allLabel: "All",
  terms: [
    {
      term: "Backfill",
      definition:
        "When a cancelled slot is offered to the waiting list automatically and taken by whoever confirms first. Nobody rings round.",
    },
    {
      term: "Capacity",
      definition:
        "Rooms multiplied by opening hours, minus what is already booked. It is measured against rooms rather than clinicians, because rooms are the thing you cannot add on a Tuesday.",
    },
    {
      term: "Care plan",
      definition:
        "A repeating series of appointments attached to one member, billed as a block rather than one visit at a time.",
    },
    {
      term: "Dry run",
      definition:
        "Your real data loaded into a private workspace nobody outside your practice can reach, so your team can break it without consequence.",
    },
    {
      term: "Field mapping",
      definition:
        "Agreeing what each column in your old export becomes in the new record. One hour, once, with your practice lead.",
    },
    {
      term: "Member",
      definition:
        "The person receiving care. We avoid 'patient' because half the practices on the platform do not use it.",
    },
    {
      term: "Role",
      definition:
        "A named job with an access level attached, like Reception or Locum. There are six and none of them are a checkbox grid.",
    },
    {
      term: "Seat",
      definition:
        "One person with a login. Seats move up and down mid-month and we prorate both directions.",
    },
    {
      term: "Site",
      definition:
        "One physical clinic. Sites share a waiting list and capacity but keep their own rooms, hours, and rules.",
    },
    {
      term: "Utilisation",
      definition:
        "The share of available room hours that were actually booked. The number most practices are trying to move.",
    },
  ],
  emptyLabel: "Nothing filed under that letter.",
  closing: "Missing a word you keep having to explain to us? Tell us and it goes on the list.",
  button: { label: "Suggest a term", href: "https://beste.co" },
};

export function Faq89({
  badge,
  heading,
  description,
  allLabel = "All",
  terms = [],
  emptyLabel,
  closing,
  button,
  className,
}: Faq89Props) {
  const [letter, setLetter] = useState<string | null>(null);

  const letters = Array.from(new Set(terms.map((term) => term.term.charAt(0).toUpperCase()))).sort();
  const visible = letter
    ? terms.filter((term) => term.term.charAt(0).toUpperCase() === letter)
    : terms;

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
          <button
            type="button"
            onClick={() => setLetter(null)}
            aria-pressed={letter === null}
            className={cn(
              "cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors",
              letter === null
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {allLabel}
          </button>
          {letters.map((entry, index) => {
            const isActive = letter === entry;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setLetter(entry)}
                aria-pressed={isActive}
                className={cn(
                  "size-9 cursor-pointer rounded-md border text-sm transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {entry}
              </button>
            );
          })}
        </div>

        <dl className="mt-10">
          {visible.map((term, index) => (
            <div
              key={index}
              className="grid gap-2 border-t border-border py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-12"
            >
              <dt className="text-lg font-medium text-foreground">{term.term}</dt>
              <dd className="text-base leading-relaxed text-muted-foreground">
                {term.definition}
              </dd>
            </div>
          ))}
        </dl>

        {visible.length === 0 && emptyLabel && (
          <p className="border-t border-border py-6 text-base text-muted-foreground">
            {emptyLabel}
          </p>
        )}

        <div className="mt-8 flex flex-col items-start gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          {closing && <p className="text-base text-muted-foreground">{closing}</p>}
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
