"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "primary" | "outline";

interface Button3Props {
  /** Button label */
  label: string;
  /**
   * Controlled loading state. Leave it undefined and return a promise from
   * onClick instead, the button then manages loading by itself.
   */
  loading?: boolean;
  /** Label shown while loading (defaults to label) */
  loadingLabel?: string;
  /** Optional leading icon (replaced by the spinner while loading) */
  icon?: LucideIcon;
  /** Surface tone: solid dark (default), primary, or bordered outline */
  tone?: Tone;
  /** HTML button type, use "submit" inside forms */
  type?: "button" | "submit";
  /** Disable independently of loading */
  disabled?: boolean;
  /** Click handler. Return a promise to drive the built-in loading state */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
  /** Additional classes merged onto the button */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  dark: "bg-foreground text-background hover:bg-foreground/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border bg-background text-foreground hover:bg-muted",
};

export const button3Demo: Button3Props = {
  label: "Create account",
  loadingLabel: "Creating account...",
  onClick: () => new Promise((resolve) => setTimeout(resolve, 2000)),
};

/**
 * The async action button every form needs. Return a promise from onClick and
 * it handles the rest: disables itself, shows a spinner in place of the icon,
 * swaps to the loading label, and reports aria-busy until the promise
 * settles. Pass the controlled `loading` prop to drive it yourself instead.
 */
export function Button3({
  label,
  loading,
  loadingLabel,
  icon: Icon,
  tone = "dark",
  type = "button",
  disabled = false,
  onClick,
  className,
}: Button3Props) {
  const [pending, setPending] = React.useState(false);
  const isLoading = loading ?? pending;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const result = onClick?.(event);
    // Uncontrolled mode: a promise-returning handler drives the spinner.
    if (
      loading === undefined &&
      result &&
      typeof (result as PromiseLike<unknown>).then === "function"
    ) {
      setPending(true);
      Promise.resolve(result).finally(() => setPending(false));
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      onClick={handleClick}
      className={cn(
        "inline-flex w-fit cursor-pointer items-center gap-2 rounded-md px-6 py-2.5 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        toneStyles[tone],
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />
      )}
      {isLoading ? (loadingLabel ?? label) : label}
    </button>
  );
}
