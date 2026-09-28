"use client";

import Link from "next/link";
import { Button23 } from "@/components/beste/component/button23";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { typography } from "@/lib/typography";

/*
 * The home page's closing sections, drawn from feature230, faq77 and cta69 but
 * owned by the site: the blocks are read-only and carry their own larger scale
 * and the Button12 seal, and the site uses a compact scale with Button23.
 */

interface Action {
  label: string;
  href: string;
}

const heading2 = cn(typography.h2, "text-balance text-foreground");

interface HomeStepsProps {
  heading: string;
  /** Second half of the heading, set in the muted tone. */
  headingMuted?: string;
  button?: Action;
  items: { title: string; description: string; image: { src: string; alt: string } }[];
  className?: string;
}

export function HomeSteps({ heading, headingMuted, button, items, className }: HomeStepsProps) {
  return (
    <section className={cn("w-full py-12 md:py-16", className)}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className={heading2}>
            {heading}
            {headingMuted && <span className="text-muted-foreground"> {headingMuted}</span>}
          </h2>
        </div>
        {button && (
          <Button23 size="sm" tone="dark" asChild label={button.label} className="shrink-0">
            <Link href={button.href} />
          </Button23>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:mt-12 md:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.title} className="flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="absolute inset-0 size-full object-cover" src={item.image.src} alt={item.image.alt} />
            </div>
            <span className="mt-5 text-sm font-medium tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className={cn(typography.h3, "mt-2 text-foreground")}>{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface HomeFaqProps {
  heading: string;
  note?: string;
  button?: Action;
  items: { question: string; answer: string }[];
  /** Every answer starts open (they can still be folded). */
  expanded?: boolean;
  className?: string;
}

export function HomeFaq({ heading, note, button, items, expanded = false, className }: HomeFaqProps) {
  const accordion = expanded
    ? ({ type: "multiple", defaultValue: items.map((_, index) => `faq-${index}`) } as const)
    : ({ type: "single", collapsible: true } as const);

  return (
    <section className={cn("w-full py-12 md:py-16", className)}>
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className={heading2}>{heading}</h2>
          {note && <p className="mt-4 max-w-md text-base text-muted-foreground">{note}</p>}
          {button && (
            <Button23 size="sm" tone="outline" asChild label={button.label} className="mt-6">
              <Link href={button.href} />
            </Button23>
          )}
        </div>

        <Accordion {...accordion} className="w-full border-t">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`} className="group/faq border-t-0 border-b">
              <AccordionTrigger className="cursor-pointer gap-6 py-5 text-left hover:no-underline [&>svg]:mt-1 [&>svg]:size-4">
                <span className="flex flex-1 items-baseline gap-4 md:gap-6">
                  <span className="text-base font-medium tabular-nums text-muted-foreground transition-colors group-hover/faq:text-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base font-medium leading-snug text-foreground md:text-lg">
                    {item.question}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pl-9 md:pl-12">
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

interface HomeCtaProps {
  heading: string;
  button: Action;
  /** Phrase that scrolls large behind the statement. */
  marquee?: string;
  note?: string;
  footnote?: string;
  className?: string;
}

const REPEATS = 8;

export function HomeCta({ heading, button, marquee, note, footnote, className }: HomeCtaProps) {
  const line = marquee ? `${marquee} · `.repeat(REPEATS) : "";

  return (
    <section className={cn("relative w-full overflow-hidden bg-background py-16 md:py-20", className)}>
      {marquee && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none">
          <div className="flex w-max shrink-0 animate-[home-cta-marquee_40s_linear_infinite] whitespace-nowrap text-foreground/[0.06] motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <span key={copy} className="text-[18vw] font-medium leading-none tracking-tighter md:text-[12vw]">
                {line}
              </span>
            ))}
          </div>
        </div>
      )}
      <style>{"@keyframes home-cta-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}"}</style>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 text-center md:px-6">
        <h2 className="text-balance text-3xl font-medium leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {heading}
        </h2>
        {note && <p className={cn(typography.lead, "mt-4 max-w-xl text-balance")}>{note}</p>}
        <Button23 size="sm" tone="dark" asChild label={button.label} className="mt-8">
          <Link href={button.href} />
        </Button23>
        {footnote && <p className="mt-6 text-sm text-muted-foreground">{footnote}</p>}
      </div>
    </section>
  );
}
