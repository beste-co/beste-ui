import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "up" | "down" | "flat";

interface Badge9Props {
  /** The delta value (e.g. "+12.4%") */
  value: string;
  /** Optional muted context after the chip (e.g. "vs last month") */
  label?: string;
  /** Trend direction, controls the arrow and colors */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, { chip: string; icon: typeof ArrowUpRight }> = {
  up: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400",
    icon: ArrowUpRight,
  },
  down: {
    chip: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400",
    icon: ArrowDownRight,
  },
  flat: {
    chip: "border-border bg-muted text-muted-foreground",
    icon: Minus,
  },
};

export const badge9Demo: Badge9Props = {
  value: "+12.4%",
  label: "vs last month",
};

export function Badge9({ value, label, tone = "up", className }: Badge9Props) {
  const styles = toneStyles[tone];
  const Icon = styles.icon;

  return (
    <span className={cn("inline-flex w-fit items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border py-0.5 pl-1.5 pr-2.5 text-sm font-semibold tabular-nums",
          styles.chip
        )}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
        {value}
      </span>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </span>
  );
}
