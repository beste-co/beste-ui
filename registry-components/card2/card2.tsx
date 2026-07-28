"use client";

import { Check } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "dark";

interface Card2Props {
  /** Plan name (e.g. "Pro") */
  plan: string;
  /** Price (e.g. "$19") */
  price: string;
  /** Muted text after the price (e.g. "/month") */
  period?: string;
  /** Short plan description under the price */
  description?: string;
  /** Feature list, one line each */
  features: string[];
  /** CTA label */
  cta: string;
  /** If set, the CTA renders as a link to this href */
  href?: string;
  /** CTA click handler (used when there is no href) */
  onSelect?: React.MouseEventHandler<HTMLButtonElement>;
  /** Emphasize this plan: accent border plus the floating badge */
  highlighted?: boolean;
  /** Floating badge text shown when highlighted (defaults to "Most popular") */
  badge?: string;
  /** Muted line under the CTA (e.g. "No credit card required") */
  footnote?: string;
  /** CTA tone */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  dark: "bg-foreground text-background hover:bg-foreground/90",
};

export const card2Demo: Card2Props = {
  plan: "Pro",
  price: "$19",
  period: "/month",
  description: "For freelancers shipping client sites.",
  features: [
    "Unlimited projects",
    "1,400+ blocks and components",
    "Lifetime updates",
    "Priority support",
  ],
  cta: "Get started",
  highlighted: true,
  footnote: "No credit card required",
};

/**
 * A complete pricing card: plan, price, feature list, CTA, and an optional
 * highlighted state with a floating badge for the recommended plan.
 */
export function Card2({
  plan,
  price,
  period,
  description,
  features,
  cta,
  href,
  onSelect,
  highlighted = false,
  badge = "Most popular",
  footnote,
  tone = "primary",
  className,
}: Card2Props) {
  const ctaClasses = cn(
    "mt-6 flex w-full cursor-pointer items-center justify-center rounded-lg px-4 py-2.5 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    toneStyles[tone]
  );

  return (
    <div
      className={cn(
        "relative w-full max-w-sm rounded-2xl border bg-card p-6",
        highlighted && "border-primary shadow-sm ring-1 ring-primary",
        className
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-0.5 text-sm font-semibold text-primary-foreground">
          {badge}
        </span>
      )}

      <h3 className="text-base font-semibold text-card-foreground">{plan}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-card-foreground">{price}</span>
        {period && <span className="text-sm text-muted-foreground">{period}</span>}
      </div>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}

      <ul className="mt-6 space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-base text-card-foreground">
            <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
            {feature}
          </li>
        ))}
      </ul>

      {href ? (
        <a href={href} className={ctaClasses}>
          {cta}
        </a>
      ) : (
        <button type="button" onClick={onSelect} className={ctaClasses}>
          {cta}
        </button>
      )}
      {footnote && (
        <p className="mt-3 text-center text-sm text-muted-foreground">{footnote}</p>
      )}
    </div>
  );
}
