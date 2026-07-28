"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge7 } from "@/components/beste/component/badge7";
import { Button12 } from "@/components/beste/component/button12";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FaqItem {
  index: string;
  question: string;
  answer: string;
}

interface Badge {
  label: string;
}

interface ActionButton {
  label: string;
  href: string;
}

interface Faq77Labels {
  note?: string;
}

interface Faq77Props {
  badge?: Badge;
  heading?: string;
  labels?: Faq77Labels;
  button?: ActionButton;
  items?: FaqItem[];
  className?: string;
}

export const faq77Demo: Faq77Props = {
  badge: { label: "Before you ask" },
  heading: "Straight answers, no runaround.",
  labels: {
    note: "Still circling something specific? Send us the messy version — we read every line and reply like humans.",
  },
  button: {
    label: "Ask us anything",
    href: "https://beste.co",
  },
  items: [
    {
      index: "01",
      question: "How long before we see something real?",
      answer:
        "First moodboards land inside ten days. We don't disappear for a month and reveal a finished thing — you watch the work take shape week by week, and you steer it while it's still soft.",
    },
    {
      index: "02",
      question: "Do you work in fixed packages or by the hour?",
      answer:
        "Neither, mostly. We scope the whole engagement up front as a flat figure tied to outcomes, so nobody is watching a clock or padding a deliverables list to hit a tier.",
    },
    {
      index: "03",
      question: "Who actually touches the work?",
      answer:
        "The two people you meet on the intro call are the two people designing it. No account layer, no junior hand-off — the studio is small on purpose and stays that way.",
    },
    {
      index: "04",
      question: "What if we already have a brand we like?",
      answer:
        "Then we don't burn it down. We audit what's earning its keep, retire what isn't, and build a system around the parts that already feel like you.",
    },
    {
      index: "05",
      question: "Can you build it, or just design it?",
      answer:
        "Both. Design and front-end live under one roof here, so what we draw is what ships — no translation loss between a pretty file and a live site.",
    },
    {
      index: "06",
      question: "What happens after launch?",
      answer:
        "You keep the source files, the system, and a short retainer if you want us close. Most clients take the keys and run; the door stays open either way.",
    },
  ],
};

export function Faq77({ badge, heading, labels = {}, button, items = [], className }: Faq77Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left rail */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {badge && <Badge7 label={badge.label} />}
            {heading && (
              <h2 className="mt-6 text-balance text-3xl font-bold leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl [&>strong]:font-bold [&>strong]:text-muted-foreground">
                {heading}
              </h2>
            )}
            {labels.note && (
              <p className="mt-6 max-w-md text-lg text-muted-foreground md:text-xl">
                {labels.note}
              </p>
            )}
            {button && (
              <Button12 asChild label={button.label} tone="outline" className="mt-8">
                <Link href={button.href} />
              </Button12>
            )}
          </div>

          {/* Numbered accordion */}
          {items.length > 0 && (
            <Accordion type="single" collapsible className="w-full border-t">
              {items.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`faq77-${index}`}
                  className="group/faq77 border-b border-t-0"
                >
                  <AccordionTrigger className="cursor-pointer gap-6 py-7 text-left hover:no-underline md:py-8 [&>svg]:mt-2 [&>svg]:size-5">
                    <span className="flex flex-1 items-baseline gap-5 md:gap-7">
                      <span className="text-xl font-semibold tabular-nums tracking-tight text-muted-foreground transition-colors group-hover/faq77:text-foreground md:text-2xl">
                        {item.index}
                      </span>
                      <span className="text-xl font-semibold leading-snug text-foreground md:text-2xl">
                        {item.question}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 pl-9 md:pl-[3.75rem]">
                    <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </section>
  );
}
