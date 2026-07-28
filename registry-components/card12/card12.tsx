import { cn } from "@/lib/utils";

type Tone = "sand" | "sky" | "rose";

interface Card12Props {
  /** Photo URL */
  src: string;
  /** Caption written under the photo */
  caption?: string;
  /** Small muted line under the caption (e.g. a date or place) */
  date?: string;
  /** If set, the whole polaroid links to this href */
  href?: string;
  /** Hide the masking tape strip */
  untaped?: boolean;
  /** Tape color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  sand: "bg-amber-100/90 border-amber-200/70",
  sky: "bg-sky-100/90 border-sky-200/70",
  rose: "bg-rose-100/90 border-rose-200/70",
};

export const card12Demo: Card12Props = {
  src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
  caption: "Summer in Alacati",
  date: "Aug 2026",
};

/**
 * An instant photo pinned with masking tape: fixed white polaroid paper, a
 * serif caption, and a slight tilt that straightens with a small lift on
 * hover. Reads as a printed object on both site themes.
 */
export function Card12({
  src,
  caption,
  date,
  href,
  untaped = false,
  tone = "sand",
  className,
}: Card12Props) {
  const inner = (
    <>
      {!untaped && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute -top-3 left-1/2 z-10 h-7 w-24 -translate-x-1/2 -rotate-3 border shadow-sm",
            toneStyles[tone]
          )}
        />
      )}
      <span className="relative block aspect-square overflow-hidden bg-zinc-100">
        <img src={src} alt={caption ?? ""} className="absolute inset-0 size-full object-cover" />
      </span>
      <span className="flex min-h-14 flex-col items-center justify-center gap-0.5 px-2 pt-3">
        {caption && (
          <span className="text-center font-serif text-lg italic leading-snug text-zinc-800">
            {caption}
          </span>
        )}
        {date && (
          <span className="font-mono text-sm uppercase tracking-widest text-zinc-400">{date}</span>
        )}
      </span>
    </>
  );

  const classes = cn(
    "relative block w-full max-w-xs -rotate-2 bg-white p-3 pb-4 shadow-lg transition-transform duration-300 ease-out",
    "motion-safe:hover:-translate-y-1 motion-safe:hover:rotate-0",
    href &&
      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return <div className={classes}>{inner}</div>;
}
