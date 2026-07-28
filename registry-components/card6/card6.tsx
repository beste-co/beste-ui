import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "light" | "primary";

interface Card6Props {
  /** Project image URL */
  src: string;
  /** Project title */
  title: string;
  /** Monospace eyebrow above the title (e.g. "Brand identity") */
  subtitle?: string;
  /** If set, the whole card links to this href */
  href?: string;
  /** Corner arrow seal: light chip (default) or primary */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  light: "bg-white text-black",
  primary: "bg-primary text-primary-foreground",
};

export const card6Demo: Card6Props = {
  src: "https://images.unsplash.com/photo-1780789594659-06738d73854b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  title: "Nordwind Studio",
  subtitle: "Brand identity",
  href: "#",
};

/**
 * A portfolio showcase card: a full bleed image with a slow hover zoom, a
 * bottom gradient carrying the eyebrow and title, and an arrow seal that
 * slides in on hover. The overlay is always dark, so the text stays white on
 * any image.
 */
export function Card6({ src, title, subtitle, href, tone = "light", className }: Card6Props) {
  const inner = (
    <>
      <img
        src={src}
        alt={title}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover/card6:scale-105"
      />
      {/* Fixed dark scrim so the copy reads on any photo */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
      />

      <span
        className={cn(
          "absolute right-4 top-4 flex size-10 items-center justify-center rounded-full opacity-0 transition-all duration-300 ease-out motion-safe:-translate-y-1 group-hover/card6:opacity-100 motion-safe:group-hover/card6:translate-y-0",
          toneStyles[tone]
        )}
      >
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </span>

      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5">
        {subtitle && (
          <span className="font-mono text-sm uppercase tracking-[0.2em] text-white/70">
            {subtitle}
          </span>
        )}
        <span className="text-xl font-semibold tracking-tight text-white">{title}</span>
      </span>
    </>
  );

  const classes = cn(
    "group/card6 relative block aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl bg-muted",
    href &&
      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className
  );

  if (href) {
    return (
      <a href={href} aria-label={title} className={classes}>
        {inner}
      </a>
    );
  }

  return <div className={classes}>{inner}</div>;
}
