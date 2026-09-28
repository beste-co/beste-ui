"use client";

import { Star } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface around the stars. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Star size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

/** Color of the filled stars. */
type Color = "amber" | "primary" | "foreground";

export interface ReactionRatingProps {
  /** Controlled rating, 0 to `max`. */
  value?: number;
  /** Initial rating when uncontrolled. @defaultValue 0 */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Number of stars. @defaultValue 5 */
  max?: number;
  /** Allow half stars. @defaultValue false */
  allowHalf?: boolean;
  /** Pressing the current rating again clears it. @defaultValue true */
  clearable?: boolean;
  /** Display only: fractional fill (4.3 fills 30% of the fifth star) and no input. */
  readOnly?: boolean;
  /** Write the rating beside the stars. */
  showValue?: boolean;
  /** Number of ratings, written in brackets after the value. */
  count?: number;
  /** Icon drawn for each star. @defaultValue Star */
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  /** @defaultValue "amber" */
  color?: Color;
  /** Accessible name. @defaultValue "Rating" */
  label?: string;
  /** Formats the written value. Defaults to one decimal when needed. */
  formatValue?: (value: number) => string;
  locale?: string;
  name?: string;
  disabled?: boolean;
  /** @defaultValue "ghost" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  className?: string;
}

export const reactionRatingDemo: ReactionRatingProps = {
  defaultValue: 3.5,
  allowHalf: true,
  showValue: true,
  count: 1284,
  label: "Rate Blue by Joni Mitchell",
  onValueChange: (value) => console.log("Rated", value),
  className: "w-fit",
};

const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const toneStyles: Record<Tone, string> = {
  muted: "rounded-full bg-muted px-3 py-1.5",
  outline: "rounded-full border border-border bg-background px-3 py-1.5 shadow-xs",
  ghost: "",
};

const sizeStyles: Record<Size, { star: string; gap: string; text: string }> = {
  sm: { star: "size-4", gap: "gap-0.5", text: "text-sm" },
  default: { star: "size-6", gap: "gap-1", text: "text-sm" },
  lg: { star: "size-8", gap: "gap-1.5", text: "text-base" },
};

const colorStyles: Record<Color, string> = {
  amber: "text-amber-400 dark:text-amber-300",
  primary: "text-primary",
  foreground: "text-foreground",
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * A star rating that previews under the pointer, pops the star you land on, and reads as a
 * native range to the keyboard and assistive technology.
 */
export function ReactionRating({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  allowHalf = false,
  clearable = true,
  readOnly = false,
  showValue = false,
  count,
  icon: Icon = Star,
  color = "amber",
  label = "Rating",
  formatValue,
  locale = "en-US",
  name,
  disabled = false,
  tone = "ghost",
  size = "default",
  className,
}: ReactionRatingProps) {
  const step = allowHalf ? 0.5 : 1;
  const [inner, setInner] = React.useState(() => clamp(defaultValue, 0, max));
  const value = clamp(valueProp ?? inner, 0, max);
  const [hover, setHover] = React.useState<number | null>(null);
  const starsRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const s = sizeStyles[size];
  const interactive = !readOnly && !disabled;

  const format = (reading: number) =>
    formatValue ? formatValue(reading) : new Intl.NumberFormat(locale, { maximumFractionDigits: 1, minimumFractionDigits: Number.isInteger(reading) ? 0 : 1 }).format(reading);
  const countText = count !== undefined ? new Intl.NumberFormat(locale).format(count) : null;

  // The star that was just set gives a small pop; Web Animations keep it off React's render path
  const pop = (reading: number) => {
    if (reading <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const star = starsRef.current?.children[Math.ceil(reading) - 1] as HTMLElement | undefined;
    star?.animate([{ scale: "1" }, { scale: "1.3" }, { scale: "1" }], { duration: 420, easing: SPRING_EASE });
  };

  const set = (next: number) => {
    const snapped = clamp(Math.round(next / step) * step, 0, max);
    if (snapped === value) return;
    if (valueProp === undefined) setInner(snapped);
    onValueChange?.(snapped);
    pop(snapped);
  };

  // Read from the row's geometry, so the gaps between stars belong to the star on their left and never blank the preview
  const readingAt = (event: React.MouseEvent<HTMLDivElement>) => {
    const stars = starsRef.current?.querySelectorAll<HTMLElement>("[data-star]");
    if (!stars || stars.length === 0) return null;
    const x = event.clientX;
    for (let index = 0; index < stars.length; index++) {
      const rect = stars[index]?.getBoundingClientRect();
      if (!rect) continue;
      if (x < rect.left) return Math.max(step, index);
      if (x <= rect.right) return index + (allowHalf && x - rect.left < rect.width / 2 ? 0.5 : 1);
    }
    return stars.length;
  };
  const preview = (event: React.PointerEvent<HTMLDivElement>) => {
    const reading = readingAt(event);
    if (reading !== null) setHover((prev) => (prev === reading ? prev : reading));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      set(Math.min(Number(event.key), max));
    } else if ((event.key === "Backspace" || event.key === "Delete") && clearable) {
      event.preventDefault();
      set(0);
    }
  };

  const shown = interactive && hover !== null ? hover : value;
  let widest = "";
  for (let reading = 0; reading <= max; reading += readOnly ? 0.1 : step) {
    const text = format(Math.round(reading * 10) / 10);
    if (text.length > widest.length) widest = text;
  }
  const spoken = readOnly
    ? `Rated ${format(value)} out of ${max}${countText ? ` from ${countText} ratings` : ""}`
    : `${format(value)} of ${max} stars`;

  return (
    <div
      data-slot="reaction-rating"
      data-readonly={readOnly || undefined}
      data-disabled={disabled || undefined}
      role={readOnly ? "img" : undefined}
      aria-label={readOnly ? spoken : undefined}
      className={cn(
        "relative inline-flex select-none items-center gap-2.5",
        toneStyles[tone],
        disabled && "opacity-50",
        // The focus ring belongs to the whole row, since the range input itself is invisible
        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-ring",
        tone !== "ghost" ? "" : "rounded-md",
        className,
      )}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer surface; the range input below is the control */}
      <div
        ref={starsRef}
        aria-hidden="true"
        className={cn("relative flex items-center", s.gap, interactive ? "cursor-pointer" : "", disabled && "cursor-not-allowed")}
        onPointerMove={interactive ? preview : undefined}
        onPointerLeave={interactive ? () => setHover(null) : undefined}
        onClick={
          interactive
            ? (event) => {
                const reading = readingAt(event);
                if (reading === null) return;
                inputRef.current?.focus({ preventScroll: true });
                if (clearable && reading === value) {
                  if (valueProp === undefined) setInner(0);
                  onValueChange?.(0);
                  setHover(null);
                } else set(reading);
              }
            : undefined
        }
      >
        {Array.from({ length: max }, (_, index) => {
          const fill = clamp(shown - index, 0, 1);
          return (
            <span key={index} data-star={index} className={cn("relative block shrink-0", s.star)}>
              <Icon className="size-full fill-current text-muted-foreground/25" strokeWidth={0} />
              <span
                className={cn(
                  // A short ease-out while previewing; a spring would overshoot on every star the pointer crosses
                  "absolute inset-0 block transition-[clip-path,opacity] duration-150 ease-out",
                  colorStyles[color],
                  hover !== null && interactive && "opacity-80",
                )}
                style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
              >
                <Icon className="size-full fill-current" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      {/* The real control, outside the hidden picture so assistive technology reaches it */}
      {!readOnly && (
        <input
          ref={inputRef}
          type="range"
          className="sr-only"
          min={0}
          max={max}
          step={step}
          value={value}
          name={name}
          disabled={disabled}
          aria-label={label}
          aria-valuetext={`${format(value)} of ${max} stars`}
          onChange={(event) => set(Number(event.currentTarget.value))}
          onKeyDown={onKeyDown}
        />
      )}
      {(showValue || countText) && (
        <span aria-hidden="true" className={cn("flex items-baseline gap-1 whitespace-nowrap tabular-nums", s.text)}>
          {showValue && (
            // The widest reading is laid out invisibly under the live one, so the row never changes width while previewing
            <span className="inline-grid font-semibold text-foreground">
              <span className="invisible col-start-1 row-start-1">{widest}</span>
              <span className="col-start-1 row-start-1">{format(shown)}</span>
            </span>
          )}
          {countText && <span className="text-muted-foreground">({countText})</span>}
        </span>
      )}
    </div>
  );
}
