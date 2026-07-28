import { ArrowRight, Gem, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "aurora";

interface Card9Props {
  /** Icon in the leading tile (defaults to Gem) */
  icon?: LucideIcon;
  /** Small chip above the title (e.g. "Featured") */
  badge?: string;
  /** Card title */
  title: string;
  /** Card body text */
  description: string;
  /** If set, the whole card links to this href and shows the link row */
  href?: string;
  /** Link row label (defaults to "Learn more") */
  linkLabel?: string;
  /** Beam colors: primary sweep (default) or an aurora mix */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const beamStyles: Record<Tone, string> = {
  primary:
    "conic-gradient(from 0deg, transparent 0deg 300deg, var(--primary) 330deg, transparent 360deg)",
  aurora:
    "conic-gradient(from 0deg, transparent 0deg 280deg, #8b5cf6 310deg, #ec4899 330deg, #38bdf8 350deg, transparent 360deg)",
};

export const card9Demo: Card9Props = {
  badge: "Featured",
  title: "Pro blocks drop monthly",
  description: "A new themed set of sections lands every month, with free updates forever.",
  href: "#",
};

/**
 * A featured callout wrapped in an animated border: a gradient beam orbits
 * the card edge on a faint static ring. The orbit pauses under reduced
 * motion, leaving the beam as a fixed accent.
 */
export function Card9({
  icon: Icon = Gem,
  badge,
  title,
  description,
  href,
  linkLabel = "Learn more",
  tone = "primary",
  className,
}: Card9Props) {
  return (
    <div className={cn("relative w-full max-w-sm rounded-xl bg-card", className)}>
      {/* Border ring: a mask keeps only a 1px rounded outline visible, so the
          orbiting beam follows the corner radius instead of being clipped.
          The ring's own bg-border stays as a faint static outline. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-border"
        style={{
          padding: 1,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
        }}
      >
        {/* Oversized spinning layer so the beam covers every edge */}
        <span
          className="absolute inset-[-100%] motion-safe:animate-[spin_4s_linear_infinite]"
          style={{ background: beamStyles[tone] }}
        />
      </span>

      <div className="group/card9 relative rounded-xl p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="flex size-11 items-center justify-center rounded-lg bg-muted">
            <Icon aria-hidden="true" className="size-5 text-foreground" />
          </span>
          {badge && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm font-semibold text-foreground">
              {badge}
            </span>
          )}
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight text-card-foreground">
          {href ? (
            <a
              href={href}
              className="rounded-sm before:absolute before:inset-0 before:z-10 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="mt-2 text-base text-muted-foreground">{description}</p>
        {href && (
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            {linkLabel}
            <ArrowRight className="size-3.5 transition-transform duration-300 ease-out motion-safe:group-hover/card9:translate-x-1" />
          </span>
        )}
      </div>
    </div>
  );
}
