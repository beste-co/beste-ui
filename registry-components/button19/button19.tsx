"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "outline" | "dark" | "primary";

interface Button19Props {
  /** Button label (rendered uppercase, monospace) */
  label: string;
  /**
   * Compose the rendered element shadcn-style (radix asChild): your element
   * (e.g. a router Link) becomes the root and the button content is injected
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
  /** Surface tone: bordered outline (default), solid dark, or primary */
  tone?: Tone;
  /** Click handler (used when there is no href and no asChild) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  outline: "border border-foreground/30 bg-background text-foreground hover:border-foreground",
  dark: "bg-foreground text-background hover:bg-foreground/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
};

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$";

export const button19Demo: Button19Props = {
  label: "Decrypt access",
};

/**
 * On hover or focus the label scrambles through random glyphs and settles
 * back character by character, left to right. Monospace keeps the width
 * stable while glyphs cycle; screen readers only ever see the real label.
 * The effect is skipped entirely under prefers-reduced-motion.
 */
export function Button19({
  label,
  asChild = false,
  children,
  href,
  tone = "outline",
  onClick,
  className,
}: Button19Props) {
  const [display, setDisplay] = React.useState(label);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    setDisplay(label);
  }, [label]);

  React.useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const scramble = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (timer.current) clearInterval(timer.current);
    let step = 0;
    timer.current = setInterval(() => {
      step++;
      const settled = Math.floor(step / 2);
      if (settled >= label.length) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setDisplay(label);
        return;
      }
      setDisplay(
        label
          .split("")
          .map((ch, i) => {
            if (ch === " " || i < settled) return ch;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );
    }, 28);
  };

  const classes = cn(
    "inline-flex w-fit cursor-pointer items-center px-6 py-3 font-mono text-base uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    toneStyles[tone],
    className
  );

  const inner = (
    <>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="whitespace-pre">
        {display}
      </span>
    </>
  );

  if (asChild && React.isValidElement(children)) {
    return (
      <Slot className={classes} onMouseEnter={scramble} onFocus={scramble}>
        {React.cloneElement(children, undefined, inner)}
      </Slot>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onMouseEnter={scramble} onFocus={scramble}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={scramble}
      onFocus={scramble}
      className={classes}
    >
      {inner}
    </button>
  );
}
