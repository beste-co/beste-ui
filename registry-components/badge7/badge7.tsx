import { cn } from "@/lib/utils";

/** Allowed wrapper styles, a fixed set, not arbitrary characters. */
type Badge7Bracket = "round" | "square" | "curly" | "angle" | "none";

const BRACKETS: Record<Badge7Bracket, [open: string, close: string]> = {
  round: ["(", ")"],
  square: ["[", "]"],
  curly: ["{", "}"],
  angle: ["<", ">"],
  none: ["", ""],
};

type Tone = "muted" | "foreground" | "primary";

interface Badge7Props {
  /** Eyebrow label (rendered uppercase) */
  label: string;
  /** Which characters wrap the label. Limited to the BRACKETS set. */
  bracket?: Badge7Bracket;
  /** Label color */
  tone?: Tone;
  /** Render rotated for vertical edge placement (e.g. along a hero side) */
  vertical?: boolean;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  muted: "text-muted-foreground",
  foreground: "text-foreground",
  primary: "text-primary",
};

export const badge7Demo: Badge7Props = {
  label: "About",
};

export function Badge7({
  label,
  bracket = "round",
  tone = "muted",
  vertical = false,
  className,
}: Badge7Props) {
  const [open, close] = BRACKETS[bracket];

  return (
    <span
      className={cn(
        "font-mono text-base uppercase tracking-[0.25em]",
        toneStyles[tone],
        vertical ? "rotate-180 [writing-mode:vertical-rl]" : "inline-block",
        className
      )}
    >
      {`${open}${label}${close}`}
    </span>
  );
}
