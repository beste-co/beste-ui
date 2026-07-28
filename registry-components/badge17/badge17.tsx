import { BellRing, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "emerald" | "amber";

interface Badge17Props {
  /** Notification title */
  title: string;
  /** Muted second line */
  description?: string;
  /** Icon in the leading tile (defaults to BellRing) */
  icon?: LucideIcon;
  /** Icon color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "text-primary",
  emerald: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
};

export const badge17Demo: Badge17Props = {
  title: "New template added",
  description: "The Auralis studio set is live",
};

/** A toast-style notification chip: icon tile, title, and muted description. */
export function Badge17({
  title,
  description,
  icon: Icon = BellRing,
  tone = "primary",
  className,
}: Badge17Props) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-3 rounded-xl border bg-background p-2.5 pr-4 shadow-sm",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon aria-hidden="true" className={cn("size-4", toneStyles[tone])} />
      </span>
      <span className="flex flex-col text-left">
        <span className="text-sm font-medium leading-tight text-foreground">{title}</span>
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </span>
    </span>
  );
}
