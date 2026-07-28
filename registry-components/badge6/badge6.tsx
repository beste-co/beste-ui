import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "muted";
type Badge6Orientation = "horizontal" | "vertical";

interface Badge6Props {
  /** Eyebrow label (rendered uppercase) */
  label: string;
  /** Accent square color */
  tone?: Tone;
  /** Layout: square beside the label (default) or stacked above it */
  orientation?: Badge6Orientation;
  /** Override the label classes, e.g. "text-background/70" on dark surfaces */
  labelClassName?: string;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  muted: "bg-muted-foreground",
};

export const badge6Demo: Badge6Props = {
  label: "About Us",
};

export function Badge6({
  label,
  tone = "primary",
  orientation = "horizontal",
  labelClassName,
  className,
}: Badge6Props) {
  const vertical = orientation === "vertical";

  return (
    <div className={cn("flex", vertical ? "flex-col gap-3" : "items-center gap-2.5", className)}>
      <span className={cn("size-2.5 shrink-0", toneStyles[tone])} />
      <span
        className={cn(
          "text-base font-bold uppercase tracking-widest text-muted-foreground",
          vertical && "leading-tight",
          labelClassName
        )}
      >
        {label}
      </span>
    </div>
  );
}
