"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the savings chip. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Type scale preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

/** How the currency symbol or the cents sit beside the whole amount. */
type Placement = "inline" | "raised";

export interface PriceTagProps {
  /** The price, in major units (29.5 is $29.50). */
  amount: number;
  /** ISO 4217 code, e.g. "USD", "EUR". */
  currency?: string;
  /** Formatting locale; the reader's own when omitted. */
  locale?: string;
  /** "auto" hides the cents on whole amounts; a number always shows that many. */
  fractionDigits?: "auto" | number;
  /** Short suffix after the amount, e.g. "/mo". */
  period?: string;
  /** How the period is read aloud, e.g. "per month". Falls back to `period`. */
  periodLabel?: string;
  /** The old price, struck through beside the current one. */
  compareAt?: number;
  /** Show a "Save 20%" chip when `compareAt` is higher than `amount`. */
  showSavings?: boolean;
  /** Template for the chip; `{percent}` is replaced by the saving. */
  savingsLabel?: string;
  /** Shown instead of the number when `amount` is 0. Pass null to print the zero. */
  freeLabel?: string | null;
  /** Currency symbol beside the digits, or smaller and raised. */
  symbol?: Placement;
  /** Cents beside the digits, or smaller and raised. */
  cents?: Placement;
  tone?: Tone;
  size?: Size;
  className?: string;
}

export const priceTagDemo: PriceTagProps = {
  amount: 29,
  currency: "USD",
  locale: "en-US",
  period: "/mo",
  periodLabel: "per month",
  compareAt: 39,
  showSavings: true,
  symbol: "raised",
  size: "lg",
};

// Same spring as inspector-slider: overshoots a hair, then settles, with no animation library
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted text-foreground",
  outline: "border border-border bg-background text-foreground",
  ghost: "text-muted-foreground",
};

const sizeStyles: Record<Size, { amount: string; side: string; chip: string }> = {
  sm: { amount: "text-2xl", side: "text-sm", chip: "h-6 px-2 text-sm" },
  default: { amount: "text-4xl", side: "text-sm", chip: "h-7 px-2.5 text-sm" },
  lg: { amount: "text-6xl", side: "text-base", chip: "h-8 px-3 text-sm" },
};

const DIGITS = Array.from({ length: 30 }, (_, i) => i % 10);

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One rolling digit: a 0-9 strip repeated three times, so it can always roll the way
 * the number moved and recenter on the middle copy once the roll has settled.
 */
function RollDigit({ value, direction }: { value: number; direction: 1 | -1 }) {
  const [pos, setPos] = React.useState(10 + value);
  const [snap, setSnap] = React.useState(true);
  const previous = React.useRef(value);

  React.useEffect(() => {
    const from = previous.current;
    if (from === value) return;
    previous.current = value;
    if (prefersReducedMotion()) {
      setSnap(true);
      setPos(10 + value);
      return;
    }
    const steps = direction > 0 ? (value - from + 10) % 10 : -((from - value + 10) % 10);
    setSnap(false);
    setPos((p) => {
      const next = p + steps;
      return next < 0 || next > 29 ? 10 + value : next;
    });
  }, [value, direction]);

  const settle = () => {
    if (pos < 10 || pos > 19) {
      setSnap(true);
      setPos(10 + value);
    }
  };

  // clip-path rather than overflow keeps the invisible in-flow digit's baseline, so the tag aligns as plain text
  return (
    <span aria-hidden="true" className="relative inline-block [clip-path:inset(-0.1em_0)]">
      <span className="invisible">{value}</span>
      <span
        onTransitionEnd={settle}
        data-snap={snap}
        className="absolute inset-x-0 top-0 flex flex-col motion-safe:transition-transform motion-safe:duration-[900ms] data-[snap=true]:transition-none"
        style={{ transform: `translateY(${(-pos / 30) * 100}%)`, transitionTimingFunction: SPRING_EASE }}
      >
        {DIGITS.map((digit, index) => (
          <span key={index} className="block h-[1em] text-center leading-none">
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Digits roll, everything else (group separators) sits still; keyed from the right so places line up. */
function RollNumber({ text, direction }: { text: string; direction: 1 | -1 }) {
  const chars = [...text];
  return (
    <>
      {chars.map((char, index) => {
        const place = chars.length - index;
        return /\d/.test(char) ? (
          <RollDigit key={`d${place}`} value={Number(char)} direction={direction} />
        ) : (
          <span key={`s${place}`} aria-hidden="true">
            {char}
          </span>
        );
      })}
    </>
  );
}

/** Splits an amount into the pieces the tag lays out, using the locale's own rules. */
export function formatPriceParts(amount: number, { currency = "USD", locale, fractionDigits = "auto" }: Pick<PriceTagProps, "currency" | "locale" | "fractionDigits"> = {}) {
  const digits = fractionDigits === "auto" ? (Number.isInteger(amount) ? 0 : 2) : fractionDigits;
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  const parts = formatter.formatToParts(amount);
  const firstNumber = parts.findIndex((part) => part.type === "integer");
  const symbolIndex = parts.findIndex((part) => part.type === "currency");
  let whole = "";
  let fraction = "";
  let decimal = "";
  for (const part of parts) {
    if (part.type === "integer" || part.type === "group") whole += part.value;
    else if (part.type === "decimal") decimal = part.value;
    else if (part.type === "fraction") fraction = part.value;
  }
  return {
    symbol: parts[symbolIndex]?.value ?? "",
    symbolFirst: symbolIndex < firstNumber,
    whole,
    decimal,
    fraction,
    text: formatter.format(amount),
  };
}

/** Whole-number saving of `amount` against `compareAt`, or null when there is none. */
export function savingsPercent(amount: number, compareAt?: number) {
  if (!compareAt || compareAt <= amount || compareAt <= 0) return null;
  return Math.round((1 - amount / compareAt) * 100);
}

export function PriceTag({
  amount,
  currency = "USD",
  locale,
  fractionDigits = "auto",
  period,
  periodLabel,
  compareAt,
  showSavings = true,
  savingsLabel = "Save {percent}%",
  freeLabel = "Free",
  symbol = "inline",
  cents = "inline",
  tone = "muted",
  size = "default",
  className,
}: PriceTagProps) {
  const previous = React.useRef(amount);
  const direction: 1 | -1 = amount >= previous.current ? 1 : -1;
  React.useEffect(() => {
    previous.current = amount;
  }, [amount]);

  const parts = formatPriceParts(amount, { currency, locale, fractionDigits });
  const old = compareAt !== undefined ? formatPriceParts(compareAt, { currency, locale, fractionDigits }) : null;
  const percent = savingsPercent(amount, compareAt);
  const isFree = amount === 0 && freeLabel !== null;
  const s = sizeStyles[size];

  const spoken = [
    isFree ? freeLabel : parts.text,
    !isFree && (periodLabel ?? period),
    old && percent !== null && `was ${old.text}`,
    showSavings && percent !== null && savingsLabel.replace("{percent}", String(percent)),
  ]
    .filter(Boolean)
    .join(", ");

  // Raised pieces sit at the top of the figure's line at a smaller size; inline ones share its baseline
  const raised = "self-start text-[0.45em] leading-none mt-[0.35em]";
  const symbolNode = <span className={cn(symbol === "raised" ? raised : parts.symbolFirst ? "mr-[0.04em]" : "ml-[0.12em]")}>{parts.symbol}</span>;

  return (
    <div data-slot="price-tag" data-free={isFree} className={cn("inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 select-none", className)}>
      <span className="sr-only">{spoken}</span>
      <span aria-hidden="true" className="inline-flex items-baseline gap-x-1.5">
        {isFree ? (
          <span className={cn("font-semibold leading-none tracking-tight text-foreground", s.amount)}>{freeLabel}</span>
        ) : (
          <span className={cn("inline-flex items-baseline font-semibold leading-none tracking-tight tabular-nums text-foreground", s.amount)}>
            {parts.symbolFirst && symbolNode}
            <RollNumber text={parts.whole} direction={direction} />
            {parts.fraction && (
              <span className={cn("inline-flex items-baseline", cents === "raised" && cn(raised, "ml-[0.08em]"))}>
                {cents === "inline" && <span>{parts.decimal}</span>}
                <RollNumber text={parts.fraction} direction={direction} />
              </span>
            )}
            {!parts.symbolFirst && symbolNode}
          </span>
        )}
        {period && !isFree && <span className={cn("text-muted-foreground", s.side)}>{period}</span>}
      </span>
      {(old || (showSavings && percent !== null)) && (
        <span aria-hidden="true" className="inline-flex items-baseline gap-2">
          {old && percent !== null && <del className={cn("text-muted-foreground tabular-nums", s.side)}>{old.text}</del>}
          {showSavings && percent !== null && (
            <span data-slot="price-tag-savings" className={cn("inline-flex items-center rounded-full font-medium", toneStyles[tone], s.chip)}>
              {savingsLabel.replace("{percent}", String(percent))}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
