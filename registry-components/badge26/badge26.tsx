import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "secondary" | "primary" | "accent" | "glass";

interface Badge26Props {
  /** The badge text, short and in sentence case */
  label: string;
  /** The bright secondary fill, the primary fill, the soft accent, or a translucent pill in the current text color for dark surfaces */
  tone?: Tone;
  /** Render as a span (default) or a div */
  as?: "span" | "div";
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  secondary: "bg-secondary text-secondary-foreground",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  glass: "bg-current/10 text-current",
};

export const badge26Demo: Badge26Props = {
  label: "Most chosen",
  tone: "secondary",
};

/** A small filled pill for plan flags, offers and mode chips. */
export function Badge26({ label, tone = "secondary", as: Tag = "span", className }: Badge26Props) {
  return (
    <Tag className={cn("inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1 text-sm font-bold leading-tight", toneStyles[tone], className)}>
      {label}
    </Tag>
  );
}
