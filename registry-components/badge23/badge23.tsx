"use client";

import { cn } from "@/lib/utils";

type Tone = "muted" | "foreground" | "primary";

interface Badge23Props {
  /** Eyebrow label (rendered uppercase) */
  label: string;
  /** Text/border tone */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  muted: "border-border text-muted-foreground",
  foreground: "border-foreground/30 text-foreground",
  primary: "border-primary/40 text-primary",
};

export const badge23Demo: Badge23Props = {
  label: "Product",
};

export function Badge23({ label, tone = "muted", className }: Badge23Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border bg-transparent px-2.5 py-1 font-mono text-sm uppercase leading-none tracking-widest",
        toneStyles[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
