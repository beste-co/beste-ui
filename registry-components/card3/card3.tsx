import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "muted";

interface Card3Props {
  /** The testimonial quote, without quotation marks */
  quote: string;
  /** Author name */
  name: string;
  /** Muted second line (role, company) */
  role?: string;
  /** Author avatar URL. Falls back to an initial circle when omitted */
  src?: string;
  /** Star rating shown above the quote, 0 to 5. Omit to hide the stars */
  rating?: number;
  /** Surface tone: bordered card (default) or muted fill */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  neutral: "border bg-card",
  muted: "bg-muted",
};

export const card3Demo: Card3Props = {
  quote:
    "We rebuilt our marketing site in a weekend. The blocks are clean, accessible, and the code reads like we wrote it ourselves.",
  name: "Mary Pollock",
  role: "Founder, Nordwind",
  src: "https://i.pravatar.cc/72?img=26",
  rating: 5,
};

/**
 * A testimonial card: optional star rating, the quote under an oversized
 * serif quotation mark, and the author row with avatar or initial fallback.
 */
export function Card3({ quote, name, role, src, rating, tone = "neutral", className }: Card3Props) {
  const filled = rating === undefined ? 0 : Math.round(Math.min(Math.max(rating, 0), 5));

  return (
    <figure
      className={cn(
        "relative w-full max-w-md rounded-xl p-6 transition-shadow hover:shadow-md",
        toneStyles[tone],
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-1 select-none font-serif text-7xl leading-none text-foreground/10"
      >
        &rdquo;
      </span>

      {rating !== undefined && (
        <span
          className="flex items-center gap-0.5"
          role="img"
          aria-label={`Rated ${rating} out of 5`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative row
              key={i}
              aria-hidden="true"
              className={cn(
                "size-4",
                i < filled ? "fill-current text-amber-400" : "text-muted-foreground/30"
              )}
            />
          ))}
        </span>
      )}

      <blockquote
        className={cn("text-base leading-relaxed text-foreground", rating !== undefined && "mt-4")}
      >
        {quote}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3">
        {src ? (
          <img
            src={src}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-base font-semibold text-foreground">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-foreground">{name}</span>
          {role && <span className="text-sm text-muted-foreground">{role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
