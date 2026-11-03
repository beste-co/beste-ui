import { Asterisk, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tag = "p" | "span" | "div";

interface Badge25Props {
  /** The eyebrow text, in sentence case */
  text: string;
  /** Leading icon (defaults to Asterisk) */
  icon?: LucideIcon;
  /** Element to render */
  as?: Tag;
  /** Additional classes merged onto the element (margins, alignment, text color) */
  className?: string;
}

export const badge25Demo: Badge25Props = {
  text: "AI inbox for small teams",
};

/**
 * A quiet sentence-case eyebrow led by a small primary asterisk.
 */
export function Badge25({ text, icon: Icon = Asterisk, as: Tag = "p", className }: Badge25Props) {
  return (
    <Tag className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
      {text}
    </Tag>
  );
}
