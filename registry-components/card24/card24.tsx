import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "muted" | "dark" | "primary";

interface Card24Props {
  /** Small eyebrow above the title */
  eyebrow?: string;
  /** Card title */
  title: string;
  /** Supporting text under the title */
  description?: string;
  /** Main button label */
  cta: string;
  /** Main button link */
  href: string;
  /** Optional secondary link label */
  secondaryCta?: string;
  /** Secondary link */
  secondaryHref?: string;
  /** Surface tone */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<
  Tone,
  { root: string; muted: string; button: string; secondary: string }
> = {
  muted: {
    root: "border bg-muted",
    muted: "text-muted-foreground",
    button: "bg-foreground text-background hover:bg-foreground/90",
    secondary: "text-foreground",
  },
  dark: {
    root: "bg-foreground text-background",
    muted: "text-background/70",
    button: "bg-background text-foreground hover:bg-background/90",
    secondary: "text-background",
  },
  primary: {
    root: "bg-primary text-primary-foreground",
    muted: "text-primary-foreground/75",
    button: "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
    secondary: "text-primary-foreground",
  },
};

export const card24Demo: Card24Props = {
  eyebrow: "Ready when you are",
  title: "Start building today",
  description: "Copy your first block in under a minute. No account needed.",
  cta: "Browse blocks",
  href: "#",
  secondaryCta: "See pricing",
  secondaryHref: "#",
};

/** A call to action card: eyebrow, title, description, and one or two actions. */
export function Card24({
  eyebrow,
  title,
  description,
  cta,
  href,
  secondaryCta,
  secondaryHref,
  tone = "muted",
  className,
}: Card24Props) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col items-start rounded-2xl p-8",
        styles.root,
        className
      )}
    >
      {eyebrow && (
        <p className={cn("text-sm font-semibold uppercase tracking-widest", styles.muted)}>
          {eyebrow}
        </p>
      )}
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className={cn("mt-2 text-base leading-relaxed", styles.muted)}>{description}</p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <a
          href={href}
          className={cn(
            "group/card24 inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            styles.button
          )}
        >
          {cta}
          <ArrowRight className="size-4 transition-transform duration-300 ease-out motion-safe:group-hover/card24:translate-x-1" />
        </a>
        {secondaryCta && secondaryHref && (
          <a
            href={secondaryHref}
            className={cn(
              "rounded-sm text-base font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              styles.secondary
            )}
          >
            {secondaryCta}
          </a>
        )}
      </div>
    </div>
  );
}
