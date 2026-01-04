"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface Health6Props {
  eyebrow?: string;
  heading?: string;
  lead?: string;
  /** Rich text content - supports HTML tags like <p>, <strong>, <em>, <a> */
  content?: string;
  highlights?: string[];
  buttons?: ButtonItem[];
  className?: string;
}

export const health6Demo: Health6Props = {
  eyebrow: "The Healing Path",
  heading: "Your journey to wellness begins with a single breath",
  lead: "We believe that true healing happens when we slow down, listen to our bodies, and create space for transformation. This is not a quick fix, it's a lifelong practice.",
  content: `<p>For over a decade, we have guided <strong>thousands of individuals</strong> through their personal healing journeys. From those recovering from burnout to those seeking deeper connection with themselves, our approach remains the same: <em>meet yourself where you are</em>.</p>
<p>Our methodology draws from ancient wisdom traditions like yoga, meditation, and breathwork, while honoring the realities of modern life. We don't ask you to escape your world; we help you find peace within it.</p>`,
  highlights: [
    "Personalized programs designed around your unique needs",
    "Evidence-based practices with roots in ancient traditions",
    "A supportive community of fellow seekers",
  ],
  buttons: [
    { id: "btn-1", label: "Schedule a consultation", href: "https://beste.co" },
  ],
};

export function Health6({
  eyebrow,
  heading,
  lead,
  content,
  highlights = [],
  buttons = [],
  className,
}: Health6Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        {/* Header */}
        <header className="text-center">
          {eyebrow && (
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h1 className="mt-4 text-3xl font-light tracking-tight md:text-5xl lg:text-6xl text-balance">
              {heading}
            </h1>
          )}
        </header>

        {/* Lead paragraph */}
        {lead && (
          <p className="mt-10 text-xl leading-relaxed text-muted-foreground md:text-2xl text-center">
            {lead}
          </p>
        )}

        {/* Divider */}
        <div className="my-12 flex justify-center">
          <div className="h-px w-16 bg-border" />
        </div>

        {/* Body content */}
        {content && (
          <div
            className="prose prose-lg prose-neutral dark:prose-invert max-w-none text-muted-foreground [&>p]:leading-relaxed [&>p+p]:mt-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <ul className="mt-10 space-y-2">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-baseline gap-2 text-base">
                <span className="relative -top-1 size-1.5 shrink-0 rounded-full bg-foreground" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        {buttons.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {buttons.map((button) => (
              <Button
                key={button.id}
                size="lg"
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
