import { Asterisk, type LucideIcon } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";

type Tone = "foreground" | "muted" | "primary";

interface Badge10Props {
  /** Circular text. End with a separator (e.g. "Open for work • ") so the loop reads cleanly */
  text: string;
  /** Diameter in pixels */
  size?: number;
  /** Seconds per full rotation */
  duration?: number;
  /** Center icon (defaults to Asterisk) */
  icon?: LucideIcon;
  /** Text and icon color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  foreground: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
};

export const badge10Demo: Badge10Props = {
  text: "Open for work • Available now • ",
  size: 120,
};

/**
 * An editorial rotating seal: monospace text runs around a circle with an
 * icon at the center. Rotation pauses entirely under prefers-reduced-motion.
 */
export function Badge10({
  text,
  size = 112,
  duration = 14,
  icon: Icon = Asterisk,
  tone = "foreground",
  className,
}: Badge10Props) {
  const pathId = useId();

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center",
        toneStyles[tone],
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="size-full motion-safe:animate-[spin_14s_linear_infinite]"
        style={{ animationDuration: `${duration}s` }}
        aria-hidden="true"
      >
        <defs>
          <path
            id={pathId}
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
        </defs>
        <text
          fill="currentColor"
          fontSize="10.5"
          className="font-mono uppercase tracking-[0.18em]"
        >
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <Icon className="absolute size-5" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </span>
  );
}
