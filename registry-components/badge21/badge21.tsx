import { Slot } from "@radix-ui/react-slot";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground";

interface Badge21Props {
  /** The small emphasized tag (e.g. "New") */
  tag: string;
  /** The announcement text */
  text: string;
  /**
   * Compose the rendered element shadcn-style (radix asChild): your element
   * (e.g. a router Link) becomes the pill and the badge content is injected
   * as its children. Pass the element without children of its own.
   */
  asChild?: boolean;
  /** The element to render when `asChild` is set (e.g. your framework's Link) */
  children?: React.ReactElement;
  /**
   * Fallback link: renders a plain `<a>`. Prefer `asChild` with your
   * framework's Link component for client-side navigation.
   */
  href?: string;
  /** Tag chip color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
};

export const badge21Demo: Badge21Props = {
  tag: "New",
  text: "The Auralis studio set is live",
  href: "#",
};

/**
 * The SaaS-hero announcement pill: a bold mini tag, the news, and, when
 * linked, an arrow that nudges forward on hover.
 */
export function Badge21({
  tag,
  text,
  asChild = false,
  children,
  href,
  tone = "primary",
  className,
}: Badge21Props) {
  const isLink = Boolean(href) || (asChild && React.isValidElement(children));

  const classes = cn(
    "group/badge21 inline-flex w-fit items-center gap-2 rounded-full border bg-background py-1 pl-1.5 pr-3 text-sm",
    isLink &&
      "cursor-pointer transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className
  );

  const inner = (
    <>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-sm font-semibold leading-tight",
          toneStyles[tone]
        )}
      >
        {tag}
      </span>
      <span className="text-foreground">{text}</span>
      {isLink && (
        <ArrowRight
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out motion-safe:group-hover/badge21:translate-x-0.5"
        />
      )}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    return (
      <Slot className={classes}>
        {React.cloneElement(children, undefined, inner)}
      </Slot>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return <span className={classes}>{inner}</span>;
}
