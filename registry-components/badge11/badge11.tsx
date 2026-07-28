import { cn } from "@/lib/utils";

type Tone = "foreground" | "muted" | "primary";

interface Badge11Props {
  /** Label under the bars (also seeds the bar pattern) */
  label: string;
  /** Number of bars */
  bars?: number;
  /** Bars and label color */
  tone?: Tone;
  /** Hide the visible label (it stays available to screen readers) */
  hideLabel?: boolean;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  foreground: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
};

export const badge11Demo: Badge11Props = {
  label: "Est. 2019, Berlin",
};

/**
 * A decorative barcode: bar widths are derived deterministically from the
 * label's characters, so the same label always renders the same pattern
 * (and SSR output matches the client).
 */
export function Badge11({
  label,
  bars = 28,
  tone = "foreground",
  hideLabel = false,
  className,
}: Badge11Props) {
  const seed = label.length > 0 ? label : "beste";
  const widths = Array.from(
    { length: bars },
    (_, i) => 1 + ((seed.charCodeAt(i % seed.length) + i * 7) % 3)
  );

  return (
    <span className={cn("inline-flex w-fit flex-col gap-1.5", toneStyles[tone], className)}>
      <span aria-hidden="true" className="flex h-6 items-stretch gap-px">
        {widths.map((w, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: bars are static decoration
            key={i}
            className="bg-current"
            style={{ width: w }}
          />
        ))}
      </span>
      <span
        className={cn(
          "font-mono text-sm uppercase tracking-[0.3em]",
          hideLabel && "sr-only"
        )}
      >
        {label}
      </span>
    </span>
  );
}
