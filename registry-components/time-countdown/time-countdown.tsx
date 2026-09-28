"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of each unit tile. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Type scale preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

export type CountdownUnit = "days" | "hours" | "minutes" | "seconds";

export interface TimeCountdownProps {
  /** The moment to count down to: an ISO string, a Date or a timestamp. */
  target?: string | Date | number;
  /** Seconds to count down from mount, used when there is no `target`. */
  duration?: number;
  /** Which units to show, largest first. */
  units?: CountdownUnit[];
  /** Drop leading units while they are zero, e.g. days once under a day is left. */
  hideLeadingZeros?: boolean;
  /** How unit labels are written: "long" (days), "short" (days, abbreviated), "narrow" or "none". */
  labels?: "long" | "short" | "narrow" | "none";
  /** Locale for the unit labels; the reader's own when omitted. */
  locale?: string;
  /** Put a colon between the units. */
  separator?: boolean;
  /** Shown in place of the digits once the countdown is over. */
  completeLabel?: string;
  /** Fires once when the countdown reaches zero. */
  onComplete?: () => void;
  tone?: Tone;
  size?: Size;
  className?: string;
}

export const timeCountdownDemo: TimeCountdownProps = {
  duration: 3 * 86400 + 7 * 3600 + 42 * 60 + 18,
  units: ["days", "hours", "minutes", "seconds"],
  labels: "long",
  locale: "en-US",
  completeLabel: "Doors are open",
  size: "lg",
};

// Same spring as inspector-slider: overshoots a hair, then settles, with no animation library
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted",
  outline: "border border-border bg-background",
  ghost: "bg-transparent",
};

const sizeStyles: Record<Size, { tile: string; digits: string; label: string; colon: string }> = {
  sm: { tile: "min-w-12 rounded-md px-2 py-1.5", digits: "text-2xl", label: "text-sm", colon: "text-2xl" },
  default: { tile: "min-w-16 rounded-lg px-3 py-2", digits: "text-4xl", label: "text-sm", colon: "text-4xl" },
  lg: { tile: "min-w-24 rounded-xl px-4 py-3", digits: "text-6xl", label: "text-base", colon: "text-6xl" },
};

const SECONDS: Record<CountdownUnit, number> = { days: 86400, hours: 3600, minutes: 60, seconds: 1 };
const INTL_UNIT: Record<CountdownUnit, string> = { days: "day", hours: "hour", minutes: "minute", seconds: "second" };
const ORDER: CountdownUnit[] = ["days", "hours", "minutes", "seconds"];
const DIGITS = Array.from({ length: 30 }, (_, i) => i % 10);

/** Splits seconds across the chosen units; the largest unit absorbs everything above it. */
export function splitDuration(total: number, units: CountdownUnit[] = ORDER) {
  const chosen = ORDER.filter((unit) => units.includes(unit));
  let rest = Math.max(0, Math.floor(total));
  const out = {} as Record<CountdownUnit, number>;
  for (const unit of chosen) {
    out[unit] = Math.floor(rest / SECONDS[unit]);
    rest -= out[unit] * SECONDS[unit];
  }
  return { values: out, units: chosen };
}

/** The locale's own word for a unit at a count ("1 day", "3 days"), without the number. */
function unitWord(unit: CountdownUnit, count: number, locale: string | undefined, display: "long" | "short" | "narrow") {
  const parts = new Intl.NumberFormat(locale, { style: "unit", unit: INTL_UNIT[unit], unitDisplay: display }).formatToParts(count);
  return parts
    .filter((part) => part.type === "unit")
    .map((part) => part.value)
    .join("")
    .trim();
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One rolling digit: a 0-9 strip repeated three times, so it always rolls down as time
 * runs out (0 to 9 included) and recenters on the middle copy once the roll has settled.
 */
function RollDigit({ value }: { value: number }) {
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
    const steps = -((from - value + 10) % 10);
    setSnap(false);
    setPos((p) => {
      const next = p + steps;
      return next < 0 || next > 29 ? 10 + value : next;
    });
  }, [value]);

  const settle = () => {
    if (pos < 10 || pos > 19) {
      setSnap(true);
      setPos(10 + value);
    }
  };

  return (
    <span aria-hidden="true" className="relative inline-block h-[1.1em] w-[1ch] overflow-hidden">
      <span
        onTransitionEnd={settle}
        data-snap={snap}
        className="absolute inset-x-0 top-0 flex flex-col motion-safe:transition-transform motion-safe:duration-[700ms] data-[snap=true]:transition-none"
        style={{ transform: `translateY(${(-pos / 30) * 100}%)`, transitionTimingFunction: SPRING_EASE }}
      >
        {DIGITS.map((digit, index) => (
          <span key={index} className="flex h-[1.1em] items-center justify-center">
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

function resolveTarget(target: TimeCountdownProps["target"]) {
  if (target === undefined) return null;
  const time = target instanceof Date ? target.getTime() : typeof target === "number" ? target : Date.parse(target);
  return Number.isFinite(time) ? time : null;
}

export function TimeCountdown({
  target,
  duration = 0,
  units = ORDER,
  hideLeadingZeros = false,
  labels = "long",
  locale,
  separator = false,
  completeLabel,
  onComplete,
  tone = "muted",
  size = "default",
  className,
}: TimeCountdownProps) {
  // Null until mounted: the server and the first client render show the same placeholder
  const [remaining, setRemaining] = React.useState<number | null>(null);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;
  const targetTime = resolveTarget(target);

  React.useEffect(() => {
    const end = targetTime ?? Date.now() + Math.max(0, duration) * 1000;
    let timer = 0;
    let fired = false;
    const tick = () => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        if (!fired) {
          fired = true;
          onCompleteRef.current?.();
        }
        return;
      }
      // Wake just after the next whole second, so the digits change on the beat
      timer = window.setTimeout(tick, ((end - Date.now()) % 1000) + 20);
    };
    const onVisibility = () => {
      window.clearTimeout(timer);
      if (!document.hidden) tick();
    };
    tick();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [targetTime, duration]);

  const mounted = remaining !== null;
  const complete = remaining === 0;
  const split = splitDuration(remaining ?? 0, units);
  let shown = split.units;
  if (hideLeadingZeros && mounted) {
    const first = shown.findIndex((unit) => (split.values[unit] ?? 0) > 0);
    shown = first === -1 ? shown.slice(-1) : shown.slice(first);
  }

  // Announced once a minute (and at the end), never every second
  const coarse = mounted ? Math.ceil((remaining ?? 0) / 60) : null;
  const spoken = React.useMemo(() => {
    if (coarse === null) return "";
    if (coarse === 0) return completeLabel ?? "Time is up";
    const { values, units: parts } = splitDuration(coarse * 60, ["days", "hours", "minutes"]);
    return parts
      .filter((unit) => (values[unit] ?? 0) > 0)
      .map((unit) => new Intl.NumberFormat(locale, { style: "unit", unit: INTL_UNIT[unit], unitDisplay: "long" }).format(values[unit] ?? 0))
      .join(" ")
      .concat(" left");
  }, [coarse, completeLabel, locale]);

  const s = sizeStyles[size];

  return (
    <div
      role="timer"
      data-slot="time-countdown"
      data-complete={complete}
      data-mounted={mounted}
      className={cn("inline-flex select-none flex-col items-start", className)}
    >
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {spoken}
      </span>
      {complete && completeLabel ? (
        <span aria-hidden="true" className={cn("font-semibold leading-none tracking-tight text-foreground", s.digits)}>
          {completeLabel}
        </span>
      ) : (
        <span aria-hidden="true" className={cn("inline-flex items-start gap-2 transition-opacity duration-300", mounted ? "opacity-100" : "opacity-0")}>
          {shown.map((unit, index) => {
            const value = split.values[unit] ?? 0;
            const text = String(value).padStart(2, "0");
            return (
              <React.Fragment key={unit}>
                {separator && index > 0 && (
                  <span className={cn("self-start py-[0.12em] font-semibold leading-none text-muted-foreground", s.colon, labels !== "none" && "pt-2")}>:</span>
                )}
                <span data-unit={unit} className={cn("inline-flex flex-col items-center gap-1.5", toneStyles[tone], s.tile)}>
                  <span className={cn("inline-flex font-semibold leading-none tracking-tight tabular-nums text-foreground", s.digits)}>
                    {[...text].map((char, place) => (
                      <RollDigit key={`${mounted}-${text.length - place}`} value={Number(char)} />
                    ))}
                  </span>
                  {labels !== "none" && <span className={cn("text-muted-foreground", s.label)}>{unitWord(unit, value, mounted ? locale : (locale ?? "en-US"), labels)}</span>}
                </span>
              </React.Fragment>
            );
          })}
        </span>
      )}
    </div>
  );
}
