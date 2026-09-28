"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface behind the text. Ghost is plain inline text. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Type scale preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

export interface TimeRelativeProps {
  /** The moment to describe: an ISO string, a Date or a timestamp. */
  date: string | Date | number;
  /** Locale for the wording and the full date; the reader's own when omitted. */
  locale?: string;
  /** Length of the unit words: "3 minutes ago", "3 min. ago" or "3m ago". */
  format?: "long" | "short" | "narrow";
  /** "auto" says "yesterday" and "now"; "always" says "1 day ago" and "in 0 seconds". */
  numeric?: "auto" | "always";
  /** Seconds after which the relative wording gives way to a short date. `Infinity` never does. */
  threshold?: number;
  /** Options for the short date past the threshold. */
  dateFormat?: Intl.DateTimeFormatOptions;
  /** Text before the time, e.g. "Edited". */
  prefix?: string;
  /** Reserve the width of the longest wording in the current unit, so neighbors never shift as it ticks. */
  reserveWidth?: boolean;
  /** Fixed "now" for tests or server-rendered snapshots. The live clock otherwise. */
  now?: number;
  tone?: Tone;
  size?: Size;
  className?: string;
}

export const timeRelativeDemo: TimeRelativeProps = {
  date: Date.now() - 3 * 60 * 1000,
  prefix: "Mastered by Nils Frahm",
  locale: "en-US",
  format: "long",
  reserveWidth: true,
  tone: "muted",
  className: "w-fit",
};

// Soft ease-out for the crossfade from the server's date to the live wording
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const toneStyles: Record<Tone, string> = {
  muted: "rounded-full bg-muted px-2.5 py-0.5",
  outline: "rounded-full border border-border px-2.5 py-0.5",
  ghost: "",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm",
  default: "text-sm",
  lg: "text-base",
};

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

/* ------------------------------ Shared clock ------------------------------ */

// One timer for every timestamp on the page, running at the fastest pace any of them needs
const clock = {
  now: 0,
  timer: 0 as ReturnType<typeof setTimeout> | 0,
  listeners: new Map<() => void, number>(),
};

function schedule() {
  if (clock.timer) clearTimeout(clock.timer);
  clock.timer = 0;
  if (clock.listeners.size === 0 || (typeof document !== "undefined" && document.hidden)) return;
  const pace = Math.min(...clock.listeners.values());
  // Lands just after the next whole step, so every stamp flips on the same beat
  const wait = pace - (Date.now() % pace) + 20;
  clock.timer = setTimeout(() => {
    clock.now = Date.now();
    for (const listener of clock.listeners.keys()) listener();
    schedule();
  }, wait);
}

function onVisibility() {
  if (!document.hidden) {
    clock.now = Date.now();
    for (const listener of clock.listeners.keys()) listener();
  }
  schedule();
}

function subscribe(listener: () => void, pace: number) {
  if (clock.listeners.size === 0) document.addEventListener("visibilitychange", onVisibility);
  clock.listeners.set(listener, pace);
  clock.now = Date.now();
  schedule();
  return () => {
    clock.listeners.delete(listener);
    if (clock.listeners.size === 0) document.removeEventListener("visibilitychange", onVisibility);
    schedule();
  };
}

/* -------------------------------- Helpers -------------------------------- */

const toTime = (date: TimeRelativeProps["date"]) => (date instanceof Date ? date.getTime() : typeof date === "number" ? date : Date.parse(date));

/** The unit and count for a difference in seconds, e.g. -180 is [-3, "minute"]. */
export function relativeParts(seconds: number): [number, Intl.RelativeTimeFormatUnit] {
  const abs = Math.abs(seconds);
  for (const [unit, size] of UNITS) {
    // Truncated, not rounded, so 59.6 minutes never reads as "60 minutes"
    if (abs >= size || unit === "second") return [Math.trunc(seconds / size), unit];
  }
  return [Math.trunc(seconds), "second"];
}

/** "3 minutes ago", "in 2 days", "just now": the wording for a difference in seconds. */
export function formatRelative(seconds: number, { locale, format = "long", numeric = "auto" }: Pick<TimeRelativeProps, "locale" | "format" | "numeric"> = {}) {
  if (numeric === "auto" && Math.abs(seconds) < 10) return new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: format }).format(0, "second");
  const [value, unit] = relativeParts(seconds);
  return new Intl.RelativeTimeFormat(locale, { numeric, style: format }).format(value, unit);
}

/** How often a stamp needs to update: every second under a minute, every minute under an hour, then hourly. */
const paceFor = (seconds: number) => (Math.abs(seconds) < 60 ? 1000 : Math.abs(seconds) < 3600 ? 60000 : 3600000);

/**
 * A timestamp that reads "3 minutes ago" and keeps itself current on a clock shared by the
 * whole page, with the full date on hover and a stable width while it ticks.
 */
export function TimeRelative({
  date,
  locale,
  format = "long",
  numeric = "auto",
  threshold = 7 * 86400,
  dateFormat,
  prefix,
  reserveWidth = false,
  now: nowProp,
  tone = "ghost",
  size = "default",
  className,
}: TimeRelativeProps) {
  const time = toTime(date);
  const valid = Number.isFinite(time);
  const [mounted, setMounted] = React.useState(false);
  const [, bump] = React.useReducer((n: number) => n + 1, 0);
  React.useEffect(() => setMounted(true), []);

  const now = nowProp ?? (mounted ? clock.now || Date.now() : 0);
  const seconds = valid && mounted ? (time - now) / 1000 : 0;
  const pace = paceFor(seconds);

  React.useEffect(() => {
    if (!mounted || nowProp !== undefined || !valid) return;
    return subscribe(bump, pace);
  }, [mounted, nowProp, valid, pace]);

  const iso = valid ? new Date(time).toISOString() : undefined;
  // Before mount the server and the first client paint agree on a UTC date; the live wording fades in after
  const shortDate = (zone?: string) =>
    valid
      ? new Intl.DateTimeFormat(mounted ? locale : (locale ?? "en-US"), {
          ...(dateFormat ?? { month: "short", day: "numeric", ...(new Date(time).getFullYear() !== new Date(now || time).getFullYear() && { year: "numeric" }) }),
          timeZone: zone,
        }).format(time)
      : "";
  const full = valid && mounted ? new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short" }).format(time) : undefined;

  let text: string;
  let widest = "";
  if (!valid) text = "";
  else if (!mounted) text = shortDate("UTC");
  else if (Math.abs(seconds) > threshold) text = shortDate();
  else {
    text = formatRelative(seconds, { locale, format, numeric });
    if (reserveWidth) {
      // The longest wording this unit can reach, e.g. "59 minutes ago", holds the width
      const [, unit] = relativeParts(seconds);
      const step = UNITS.find(([u]) => u === unit)?.[1] ?? 1;
      const next = UNITS[UNITS.findIndex(([u]) => u === unit) - 1]?.[1] ?? step * 100;
      const peak = Math.max(1, Math.floor(next / step) - 1) * step * Math.sign(seconds || -1);
      widest = formatRelative(peak, { locale, format, numeric: "always" });
      if (widest.length < text.length) widest = text;
    }
  }

  return (
    <span data-slot="time-relative" className={cn("inline-flex select-none items-baseline gap-1 whitespace-nowrap text-muted-foreground", toneStyles[tone], sizeStyles[size], className)}>
      {prefix && <span className="text-foreground">{prefix}</span>}
      {/* dateTime waits for mount too: a date made relative to "now" differs between server and browser */}
      <time dateTime={mounted ? iso : undefined} title={full} className="inline-grid tabular-nums">
        {widest && (
          <span aria-hidden="true" className="invisible col-start-1 row-start-1">
            {widest}
          </span>
        )}
        <span
          key={mounted ? "live" : "static"}
          className="col-start-1 row-start-1 motion-safe:transition-opacity motion-safe:duration-500 motion-safe:starting:opacity-0"
          style={{ transitionTimingFunction: EASE }}
        >
          {text}
        </span>
      </time>
    </span>
  );
}
