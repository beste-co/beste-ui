import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "muted";

interface Badge16Props {
  /** Avatar image URL */
  src: string;
  /** Person's name */
  name: string;
  /** Muted second line (role, company, handle) */
  role?: string;
  /**
   * Compose the rendered element shadcn-style (radix asChild): your element
   * (e.g. a router Link) becomes the chip and the badge content is injected
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
  /** Surface tone: bordered background (default) or muted fill */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  neutral: "border bg-background",
  muted: "bg-muted",
};

export const badge16Demo: Badge16Props = {
  src: "https://i.pravatar.cc/72?img=26",
  name: "Selin Aksoy",
  role: "Product Designer",
};

/** An avatar + name + role chip, authors, hosts, "built by" credits. */
export function Badge16({
  src,
  name,
  role,
  asChild = false,
  children,
  href,
  tone = "neutral",
  className,
}: Badge16Props) {
  const isLink = Boolean(href) || (asChild && React.isValidElement(children));

  const inner = (
    <>
      <img
        src={src}
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-full object-cover"
      />
      <span className="flex flex-col">
        <span className="text-sm font-medium leading-tight text-foreground">{name}</span>
        {role && <span className="text-sm text-muted-foreground">{role}</span>}
      </span>
    </>
  );

  const classes = cn(
    "inline-flex w-fit items-center gap-3 rounded-lg px-3 py-2",
    toneStyles[tone],
    isLink && "transition-colors hover:bg-muted",
    className
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
