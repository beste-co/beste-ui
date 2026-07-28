import { cn } from "@/lib/utils";

type Tone = "muted" | "primary";

interface Card20Props {
  /** Step number (e.g. "01") */
  step: string;
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Ghost number color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  muted: "text-muted-foreground/25",
  primary: "text-primary/25",
};

export const card20Demo: Card20Props = {
  step: "01",
  title: "Pick a block",
  description: "Browse 1,400+ sections and copy the install command for the one you like.",
};

/** A numbered step card with an oversized ghost number for how it works sections. */
export function Card20({ step, title, description, tone = "muted", className }: Card20Props) {
  return (
    <div className={cn("w-full max-w-sm rounded-xl border bg-card p-6", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "block font-mono text-5xl font-bold leading-none tracking-tight",
          toneStyles[tone]
        )}
      >
        {step}
      </span>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-card-foreground">
        <span className="sr-only">Step {step}: </span>
        {title}
      </h3>
      {description && <p className="mt-2 text-base text-muted-foreground">{description}</p>}
    </div>
  );
}
