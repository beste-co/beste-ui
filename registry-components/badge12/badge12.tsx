import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "amber" | "primary" | "foreground";

interface Badge12Props {
  /** Rating value, 0–5 */
  value?: number;
  /** Muted context after the stars (e.g. "from 200+ reviews") */
  text?: string;
  /** Show the numeric value next to the stars */
  showValue?: boolean;
  /** Star color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  amber: "text-amber-400",
  primary: "text-primary",
  foreground: "text-foreground",
};

export const badge12Demo: Badge12Props = {
  value: 4.9,
  text: "from 200+ reviews",
};

/** A star-rating badge: filled stars, optional numeric value, muted context. */
export function Badge12({
  value = 5,
  text,
  showValue = true,
  tone = "amber",
  className,
}: Badge12Props) {
  const filled = Math.round(Math.min(Math.max(value, 0), 5));

  return (
    <span className={cn("inline-flex w-fit items-center gap-2", className)}>
      <span
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${value} out of 5`}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative row
            key={i}
            aria-hidden="true"
            className={cn(
              "size-4",
              i < filled ? cn("fill-current", toneStyles[tone]) : "text-muted-foreground/30"
            )}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-sm font-semibold tabular-nums text-foreground">{value}</span>
      )}
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </span>
  );
}
