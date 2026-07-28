"use client";

import { X } from "lucide-react";

import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "dark";

interface Card28Props {
  /** Square image on the left */
  src: string;
  /** Banner title */
  title: string;
  /** Supporting text under the title */
  description?: string;
  /** Bold highlight line (e.g. "Only 25 seats") */
  highlight?: string;
  /** Muted note under the highlight (e.g. a deadline) */
  note?: string;
  /** Pill button label */
  cta: string;
  /** If set, the button renders as a link to this href */
  href?: string;
  /** Button click handler (used when there is no href) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Hide the dismiss button */
  permanent?: boolean;
  /** Called when the card is dismissed */
  onDismiss?: () => void;
  /** CTA color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  dark: "bg-foreground text-background hover:bg-foreground/90",
};

export const card28Demo: Card28Props = {
  src: "https://images.unsplash.com/photo-1782898623031-fb7cc9245c24?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  title: "Join the beta program",
  description:
    "We are opening a short testing window for the new builder. Help shape it before launch.",
  highlight: "Only 25 seats",
  note: "Applications close Jul 18.",
  cta: "Request access",
  href: "#",
};

/**
 * A dismissible promo card: image up top, pitch and deadline in the
 * middle, a full width pill CTA at the bottom, and a corner close button that hides the
 * card and reports the dismissal.
 */
export function Card28({
  src,
  title,
  description,
  highlight,
  note,
  cta,
  href,
  onClick,
  permanent = false,
  onDismiss,
  tone = "primary",
  className,
}: Card28Props) {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  const pillClasses = cn(
    "w-full shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-center text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    toneStyles[tone]
  );

  return (
    <div
      className={cn(
        "relative flex w-full max-w-sm flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm",
        className
      )}
    >
      {!permanent && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
          className="absolute right-3 top-3 z-10 flex size-7 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" />
        </button>
      )}

      <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl">
        <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
      </div>

      <div className="min-w-0 pr-8">
        <h3 className="text-lg font-semibold tracking-tight text-card-foreground">{title}</h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-base text-muted-foreground">{description}</p>
        )}
        {(highlight || note) && (
          <div className="mt-2.5">
            {highlight && (
              <p className="text-base font-semibold text-card-foreground">{highlight}</p>
            )}
            {note && <p className="text-sm text-muted-foreground">{note}</p>}
          </div>
        )}
      </div>

      {href ? (
        <a href={href} className={pillClasses}>
          {cta}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={pillClasses}>
          {cta}
        </button>
      )}
    </div>
  );
}
