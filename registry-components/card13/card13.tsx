import { ArrowRight, Layers, type LucideIcon, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary";

interface Card13Props {
  /** Front face icon (defaults to Layers) */
  icon?: LucideIcon;
  /** Title, shown on both faces */
  title: string;
  /** Back face body text */
  description: string;
  /** Back face link */
  href?: string;
  /** Back face link label (defaults to "Learn more") */
  linkLabel?: string;
  /** Back face surface */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, { back: string; muted: string }> = {
  dark: { back: "bg-foreground text-background", muted: "text-background/70" },
  primary: { back: "bg-primary text-primary-foreground", muted: "text-primary-foreground/75" },
};

export const card13Demo: Card13Props = {
  title: "Brand systems",
  description:
    "Identity, guidelines, and design tokens that scale across every touchpoint of your product.",
  href: "#",
  linkLabel: "Explore service",
};

/**
 * A 3D flip card: hovering (or keyboard focus, since the back link is
 * tabbable) rotates the card in perspective to reveal the detail face.
 * Under reduced motion the faces swap without the rotation tween.
 */
export function Card13({
  icon: Icon = Layers,
  title,
  description,
  href,
  linkLabel = "Learn more",
  tone = "dark",
  className,
}: Card13Props) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn("group/card13 aspect-[4/3] w-full max-w-sm [perspective:1200px]", className)}
    >
      <div className="relative size-full transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] [transform-style:preserve-3d] group-hover/card13:[transform:rotateY(180deg)] group-focus-within/card13:[transform:rotateY(180deg)] motion-reduce:transition-none">
        {/* Front */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-xl border bg-card p-6 [backface-visibility:hidden]">
          <span className="flex size-11 items-center justify-center rounded-lg bg-muted">
            <Icon aria-hidden="true" className="size-5 text-foreground" />
          </span>
          <div className="flex items-end justify-between gap-2">
            <h3 className="text-lg font-semibold tracking-tight text-card-foreground">{title}</h3>
            <Repeat2
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-safe:group-hover/card13:rotate-180"
            />
          </div>
        </div>

        {/* Back */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-between rounded-xl p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]",
            styles.back
          )}
        >
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className={cn("mt-2 text-base leading-relaxed", styles.muted)}>{description}</p>
          </div>
          {href && (
            <a
              href={href}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-sm text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {linkLabel}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
