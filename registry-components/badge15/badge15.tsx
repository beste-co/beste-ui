import { type LucideIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "muted";

interface Badge15Props {
  /** The stat value (e.g. "12k+") */
  value: string;
  /** Muted label after the value (e.g. "active users") */
  label?: string;
  /** Optional leading icon (defaults to Users) */
  icon?: LucideIcon;
  /** Icon color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  muted: "text-muted-foreground",
};

export const badge15Demo: Badge15Props = {
  value: "12k+",
  label: "active users",
};

/** A compact stat chip: icon, bold value, muted label, quick hero metrics. */
export function Badge15({
  value,
  label,
  icon: Icon = Users,
  tone = "primary",
  className,
}: Badge15Props) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-lg border bg-background px-4 py-2",
        className
      )}
    >
      <Icon aria-hidden="true" className={cn("size-5 shrink-0", toneStyles[tone])} />
      <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </span>
  );
}
