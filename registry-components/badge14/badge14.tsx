import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "amber" | "primary" | "foreground";

interface Badge14Props {
  /** Avatar image URLs, rendered as an overlapping stack */
  avatars: string[];
  /** The social-proof line (e.g. "Loved by 2,400+ founders") */
  text: string;
  /** Star count, 0–5 */
  rating?: number;
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

export const badge14Demo: Badge14Props = {
  avatars: [
    "https://i.pravatar.cc/64?img=12",
    "https://i.pravatar.cc/64?img=32",
    "https://i.pravatar.cc/64?img=45",
    "https://i.pravatar.cc/64?img=8",
  ],
  text: "Loved by 2,400+ founders",
};

/** Avatar stack + star row + social-proof line, the classic hero trust badge. */
export function Badge14({
  avatars,
  text,
  rating = 5,
  tone = "amber",
  className,
}: Badge14Props) {
  const filled = Math.round(Math.min(Math.max(rating, 0), 5));

  return (
    <span className={cn("inline-flex w-fit items-center gap-3", className)}>
      <span className="flex -space-x-2">
        {avatars.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full border-2 border-background object-cover"
          />
        ))}
      </span>
      <span className="flex flex-col gap-0.5">
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
                "size-3.5",
                i < filled ? cn("fill-current", toneStyles[tone]) : "text-muted-foreground/30"
              )}
            />
          ))}
        </span>
        <span className="text-sm text-muted-foreground">{text}</span>
      </span>
    </span>
  );
}
