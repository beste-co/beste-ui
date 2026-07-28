import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "foreground" | "primary";

interface Card21Props {
  /** The headline value (e.g. "98%") */
  value: string;
  /** Label under the value */
  label: string;
  /** Optional delta chip (e.g. "+2.1%") */
  delta?: string;
  /** Delta direction, controls its color and arrow */
  trend?: "up" | "down";
  /** Muted context line under the label (e.g. "vs last quarter") */
  description?: string;
  /** Value color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  foreground: "text-card-foreground",
  primary: "text-primary",
};

export const card21Demo: Card21Props = {
  value: "98%",
  label: "Customer satisfaction",
  delta: "+2.1%",
  trend: "up",
  description: "vs last quarter",
};

/** A minimal stat card: bold value, label, and an optional trend delta. */
export function Card21({
  value,
  label,
  delta,
  trend = "up",
  description,
  tone = "foreground",
  className,
}: Card21Props) {
  return (
    <div className={cn("w-full max-w-xs rounded-xl border bg-card p-6", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={cn("text-4xl font-bold tracking-tight", toneStyles[tone])}>{value}</span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-sm font-semibold tabular-nums",
              trend === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {trend === "up" ? (
              <TrendingUp aria-hidden="true" className="size-3.5" />
            ) : (
              <TrendingDown aria-hidden="true" className="size-3.5" />
            )}
            {delta}
          </span>
        )}
      </div>
      <p className="mt-2 text-base font-medium text-card-foreground">{label}</p>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
