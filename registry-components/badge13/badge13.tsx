import { cn } from "@/lib/utils";

type Tone = "amber" | "emerald" | "pink" | "sky";

interface Badge13Props {
  /** The highlighted text */
  label: string;
  /** Highlighter color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  amber: "bg-amber-200 dark:bg-amber-600",
  emerald: "bg-emerald-200 dark:bg-emerald-600",
  pink: "bg-pink-200 dark:bg-pink-600",
  sky: "bg-sky-200 dark:bg-sky-600",
};

export const badge13Demo: Badge13Props = {
  label: "40% faster",
};

/**
 * A marker-highlight accent for inline emphasis: a slightly rotated
 * highlighter stroke sits behind the text, covering its lower half like a
 * real swipe. Drop it mid-headline to make one phrase pop.
 */
export function Badge13({ label, tone = "amber", className }: Badge13Props) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap px-1", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "absolute -inset-x-1 bottom-[-0.1em] top-[0.4em] -rotate-1 rounded-sm",
          toneStyles[tone]
        )}
      />
      <span className="relative font-semibold">{label}</span>
    </span>
  );
}
