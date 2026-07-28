import { cn } from "@/lib/utils";

type Tone = "success" | "info" | "warning" | "muted";

interface Badge8Props {
  /** Status label */
  label: string;
  /** Dot color: success (default), info, warning, or muted */
  tone?: Tone;
  /** Disable the ping animation and show a static dot */
  still?: boolean;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  success: "bg-emerald-500",
  info: "bg-sky-500",
  warning: "bg-amber-500",
  muted: "bg-muted-foreground",
};

export const badge8Demo: Badge8Props = {
  label: "Available for new projects",
};

export function Badge8({ label, tone = "success", still = false, className }: Badge8Props) {
  const dot = toneStyles[tone];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border bg-background py-1 pl-2.5 pr-3 text-sm font-medium text-foreground",
        className
      )}
    >
      <span className="relative flex size-2" aria-hidden="true">
        {!still && (
          <span
            className={cn(
              "absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping",
              dot
            )}
          />
        )}
        <span className={cn("relative inline-flex size-2 rounded-full", dot)} />
      </span>
      {label}
    </span>
  );
}
