"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the calendar. */
type Tone = "muted" | "outline" | "ghost";

/** Cell size and spacing. */
type Size = "sm" | "default" | "lg";

export interface HeatmapDay {
  /** ISO date, e.g. "2026-09-27". Read as a calendar day, never shifted by time zone. */
  date: string;
  value: number;
}

interface HeatmapCalendarProps {
  data?: HeatmapDay[];
  /** Last day shown. Defaults to the latest date in `data`, or today once mounted. */
  endDate?: string;
  /** Weeks shown, counting back from `endDate`. Ignored when `year` is set. */
  weeks?: number;
  /** Show one calendar year, January to December, instead of a rolling range. */
  year?: number;
  /** 0 starts weeks on Sunday, 1 on Monday. */
  weekStartsOn?: 0 | 1;
  /** Locale for month and weekday names and for numbers. */
  locale?: string;
  /** The scale's strongest color, any CSS color. Lighter levels are mixed from it. */
  color?: string;
  /** Number of shades including the empty one, 3 to 9. */
  levels?: number;
  /** Lowest value of each non-empty level, ascending. Computed from quantiles when left out. */
  thresholds?: number[];
  /** Singular and plural word for the value, used in labels and the total. */
  unit?: [string, string];
  /** Custom text for a day's value in the tooltip and its label. */
  formatValue?: (value: number, date: string) => string;
  /** Accessible name of the grid. */
  label?: string;
  showMonthLabels?: boolean;
  showWeekdayLabels?: boolean;
  showLegend?: boolean;
  /** Total of the range, shown beside the legend. */
  showTotal?: boolean;
  /** Selected day, controlled. */
  selected?: string | null;
  defaultSelected?: string | null;
  /** Fires when a day is picked with a click, Enter or Space. Days become selectable when this or `selected` is set. */
  onSelectedChange?: (date: string, day: HeatmapDay) => void;
  size?: Size;
  tone?: Tone;
  className?: string;
}

const DAY = 86_400_000;
const parseDay = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.floor(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1) / DAY);
};
const isoOf = (day: number) => new Date(day * DAY).toISOString().slice(0, 10);
const weekdayOf = (day: number) => new Date(day * DAY).getUTCDay();

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent",
};

const sizeStyles: Record<Size, { root: string; cell: number; gap: number; radius: string }> = {
  sm: { root: "gap-2 p-3", cell: 10, gap: 2, radius: "rounded-[2px]" },
  default: { root: "gap-3 p-4", cell: 12, gap: 3, radius: "rounded-[3px]" },
  lg: { root: "gap-3 p-5", cell: 15, gap: 3, radius: "rounded-[4px]" },
};

const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

/** Lowest value of each non-empty level: the first catches any activity, the rest split the rest by quantile. */
export function quantileThresholds(values: number[], levels: number) {
  const positive = values.filter((v) => v > 0).sort((a, b) => a - b);
  if (positive.length === 0) return Array.from({ length: levels - 1 }, (_, i) => i + 1);
  const at = (q: number) => positive[Math.min(positive.length - 1, Math.floor(q * positive.length))] ?? 0;
  const result = [positive[0] ?? 1];
  for (let k = 1; k < levels - 1; k++) result.push(Math.max(result[k - 1] ?? 0, at(k / (levels - 1))));
  return result;
}

export function levelOf(value: number, thresholds: number[]) {
  if (value <= 0) return 0;
  let level = 0;
  for (let i = 0; i < thresholds.length; i++) if (value >= (thresholds[i] ?? Number.POSITIVE_INFINITY)) level = i + 1;
  return Math.max(1, level);
}

/** Fill for a level: the empty level is a faint foreground tint, the rest ramp up to `color`. */
const shade = (level: number, levels: number, color: string) =>
  level === 0
    ? "color-mix(in oklab, var(--foreground) 8%, transparent)"
    : `color-mix(in oklab, ${color} ${Math.round(28 + (72 * (level - 1)) / Math.max(1, levels - 2))}%, transparent)`;

// Deterministic demo: a year of commits from a small hash, weekdays busier, a quiet August
const DEMO_END = "2026-09-27";
const hash = (n: number) => {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};
const demoData: HeatmapDay[] = Array.from({ length: 371 }, (_, i) => {
  const day = parseDay(DEMO_END) - 370 + i;
  const weekday = weekdayOf(day);
  const month = new Date(day * DAY).getUTCMonth();
  const busy = (weekday === 0 || weekday === 6 ? 0.35 : 1) * (month === 7 ? 0.3 : 1);
  const r = hash(day);
  const value = r > 1 - 0.78 * busy ? Math.round(hash(day * 7 + 3) ** 2 * 14 * busy + 1) : 0;
  return { date: isoOf(day), value };
});

export const heatmapCalendarDemo: HeatmapCalendarProps = {
  data: demoData,
  endDate: DEMO_END,
  weeks: 53,
  label: "Commits to the Homogenic sessions repository by Björk",
  unit: ["commit", "commits"],
  showTotal: true,
  className: "w-fit max-w-full",
};

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export function HeatmapCalendar({
  data = [],
  endDate,
  weeks = 53,
  year,
  weekStartsOn = 0,
  locale = "en-US",
  color = "var(--primary)",
  levels: levelsProp = 5,
  thresholds: thresholdsProp,
  unit = ["contribution", "contributions"],
  formatValue,
  label = "Activity",
  showMonthLabels = true,
  showWeekdayLabels = true,
  showLegend = true,
  showTotal = false,
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  size = "default",
  tone = "muted",
  className,
}: HeatmapCalendarProps) {
  // Tolerates "0" and "1" from a form or a playground as well as numbers
  const weekStart: 0 | 1 = Number(weekStartsOn) === 1 ? 1 : 0;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const [tip, setTip] = React.useState<{ x: number; y: number } | null>(null);
  const cellRefs = React.useRef(new Map<number, HTMLDivElement>());
  const tooltipId = React.useId();
  const [today, setToday] = React.useState<number | null>(null);
  const [active, setActive] = React.useState<number | null>(null);
  const [focusDay, setFocusDay] = React.useState<number | null>(null);
  const [innerSelected, setInnerSelected] = React.useState<string | null>(defaultSelected);
  const selected = selectedProp !== undefined ? selectedProp : innerSelected;
  const selectable = onSelectedChange !== undefined || selectedProp !== undefined;
  const levels = Math.min(9, Math.max(3, Math.round(levelsProp)));
  const { cell, gap } = sizeStyles[size];

  // Today is only read after mount, so the server and the first client render agree
  React.useEffect(() => {
    const now = new Date();
    setToday(Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY));
  }, []);

  const byDay = React.useMemo(() => {
    const map = new Map<number, number>();
    for (const entry of data) map.set(parseDay(entry.date), (map.get(parseDay(entry.date)) ?? 0) + entry.value);
    return map;
  }, [data]);

  const latest = React.useMemo(() => {
    let max: number | null = null;
    for (const day of byDay.keys()) if (max === null || day > max) max = day;
    return max;
  }, [byDay]);

  const range = React.useMemo(() => {
    if (year !== undefined) return { first: parseDay(`${year}-01-01`), last: parseDay(`${year}-12-31`) };
    const last = endDate ? parseDay(endDate) : (latest ?? today);
    if (last === null) return null;
    // Whole weeks back from the end, so the first column starts on the week's first day
    const lastWeekStart = last - ((weekdayOf(last) - weekStart + 7) % 7);
    return { first: lastWeekStart - (Math.max(1, weeks) - 1) * 7, last };
  }, [year, endDate, latest, today, weeks, weekStart]);

  const grid = React.useMemo(() => {
    if (!range) return { start: 0, columns: Math.max(1, weeks) };
    const start = range.first - ((weekdayOf(range.first) - weekStart + 7) % 7);
    return { start, columns: Math.ceil((range.last - start + 1) / 7) };
  }, [range, weeks, weekStart]);

  const inRange = (day: number) => range !== null && day >= range.first && day <= range.last;

  const thresholds = React.useMemo(() => {
    if (thresholdsProp && thresholdsProp.length > 0) return thresholdsProp.slice(0, levels - 1);
    const values: number[] = [];
    if (range) for (let d = range.first; d <= range.last; d++) values.push(byDay.get(d) ?? 0);
    return quantileThresholds(values, levels);
  }, [thresholdsProp, levels, range, byDay]);

  const total = React.useMemo(() => {
    let sum = 0;
    if (range) for (let d = range.first; d <= range.last; d++) sum += byDay.get(d) ?? 0;
    return sum;
  }, [range, byDay]);

  const numberFormat = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const longDate = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }),
    [locale],
  );
  const monthName = React.useMemo(() => new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }), [locale]);
  const weekdayName = React.useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }), [locale]);

  const describeValue = (value: number, iso: string) =>
    formatValue ? formatValue(value, iso) : `${value === 0 ? "No" : numberFormat.format(value)} ${value === 1 ? unit[0] : unit[1]}`;

  const firstFocusable = range ? Math.max(range.first, Math.min(range.last, focusDay ?? selectedDay(selected) ?? range.last)) : null;

  // Open on the latest week; the reader scrolls back in time
  useIsomorphicLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [grid.columns, range?.last]);

  // The tooltip lives outside the scroller, so the scroll area never clips it
  const placeTip = React.useCallback(() => {
    const frame = frameRef.current;
    const node = active !== null ? cellRefs.current.get(active) : undefined;
    if (!frame || !node) return setTip(null);
    const f = frame.getBoundingClientRect();
    const c = node.getBoundingClientRect();
    setTip({ x: c.left - f.left + c.width / 2, y: c.top - f.top });
  }, [active]);

  useIsomorphicLayoutEffect(() => {
    placeTip();
  }, [placeTip]);

  const focus = (day: number) => {
    if (!range) return;
    const next = Math.max(range.first, Math.min(range.last, day));
    setFocusDay(next);
    setActive(next);
    const node = cellRefs.current.get(next);
    node?.focus({ preventScroll: true });
    node?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const choose = (day: number) => {
    if (!selectable) return;
    const iso = isoOf(day);
    if (selectedProp === undefined) setInnerSelected(iso);
    onSelectedChange?.(iso, { date: iso, value: byDay.get(day) ?? 0 });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (firstFocusable === null || !range) return;
    const moves: Record<string, number> = {
      ArrowUp: -1,
      ArrowDown: 1,
      ArrowLeft: -7,
      ArrowRight: 7,
      PageUp: -28,
      PageDown: 28,
    };
    if (event.key in moves) {
      event.preventDefault();
      focus(firstFocusable + (moves[event.key] ?? 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      focus(event.ctrlKey || event.metaKey ? range.first : firstFocusable - ((weekdayOf(firstFocusable) - weekStart + 7) % 7));
    } else if (event.key === "End") {
      event.preventDefault();
      focus(event.ctrlKey || event.metaKey ? range.last : firstFocusable + 6 - ((weekdayOf(firstFocusable) - weekStart + 7) % 7));
    } else if ((event.key === "Enter" || event.key === " ") && selectable) {
      event.preventDefault();
      choose(firstFocusable);
    }
  };

  // Month labels sit over the column holding the 1st; a label too close to the previous one is dropped
  const months: { column: number; text: string }[] = [];
  if (range && showMonthLabels) {
    for (let column = 0; column < grid.columns; column++) {
      for (let row = 0; row < 7; row++) {
        const day = grid.start + column * 7 + row;
        if (inRange(day) && new Date(day * DAY).getUTCDate() === 1) {
          const prev = months.at(-1);
          if (!prev || column - prev.column >= 3) months.push({ column, text: monthName.format(new Date(day * DAY)) });
          break;
        }
      }
    }
    // The opening partial month gets a label too when there is room before the next one
    const opening = months[0];
    if (!opening || opening.column >= 3) months.unshift({ column: 0, text: monthName.format(new Date(range.first * DAY)) });
  }

  const activeValue = active !== null ? (byDay.get(active) ?? 0) : 0;
  const pitch = cell + gap;
  const labelWidth = showWeekdayLabels ? 32 : 0;

  return (
    <div
      data-slot="heatmap-calendar"
      className={cn("flex w-full min-w-0 flex-col rounded-xl text-foreground", toneStyles[tone], sizeStyles[size].root, className)}
    >
      <div ref={frameRef} className="relative min-w-0">
        <div ref={scrollRef} onScroll={placeTip} className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
          <div className="relative w-max" style={{ paddingLeft: labelWidth }}>
            {showMonthLabels && (
              <div aria-hidden="true" className="relative mb-1.5 h-5 select-none text-sm text-muted-foreground">
                {months.map((month) => (
                  <span key={`${month.column}-${month.text}`} className="absolute top-0 whitespace-nowrap" style={{ left: month.column * pitch }}>
                    {month.text}
                  </span>
                ))}
              </div>
            )}

            {showWeekdayLabels && (
              <div aria-hidden="true" className="absolute left-0 flex select-none flex-col text-sm text-muted-foreground" style={{ top: showMonthLabels ? 26 : 0, gap }}>
                {Array.from({ length: 7 }, (_, row) => (
                  <span key={row} className="flex items-center leading-none" style={{ height: cell }}>
                    {row % 2 === 1 ? weekdayName.format(new Date((3 + weekStart + row) * DAY)) : ""}
                  </span>
                ))}
              </div>
            )}

            <div
              role="grid"
              aria-label={label}
              aria-readonly={!selectable}
              data-hovering={active !== null}
              onKeyDown={onKeyDown}
              onPointerLeave={() => {
                if (!scrollRef.current?.contains(document.activeElement)) setActive(null);
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
              }}
              className="group/heatmap flex flex-col"
              style={{ gap }}
            >
              {Array.from({ length: 7 }, (_, row) => (
                <div key={row} role="row" className="flex" style={{ gap }}>
                  {Array.from({ length: grid.columns }, (_, column) => {
                    const day = grid.start + column * 7 + row;
                    if (!inRange(day)) {
                      return <div key={column} role="presentation" style={{ width: cell, height: cell }} />;
                    }
                    const iso = isoOf(day);
                    const value = byDay.get(day) ?? 0;
                    const level = levelOf(value, thresholds);
                    const isSelected = selected === iso;
                    return (
                      <div
                        key={column}
                        ref={(node) => {
                          if (node) cellRefs.current.set(day, node);
                          else cellRefs.current.delete(day);
                        }}
                        role="gridcell"
                        tabIndex={day === firstFocusable ? 0 : -1}
                        aria-label={`${describeValue(value, iso)} on ${longDate.format(new Date(day * DAY))}`}
                        aria-selected={selectable ? isSelected : undefined}
                        aria-describedby={active === day ? tooltipId : undefined}
                        data-level={level}
                        data-active={active === day}
                        data-selected={isSelected || undefined}
                        data-today={today === day || undefined}
                        onPointerEnter={() => setActive(day)}
                        onFocus={() => {
                          setFocusDay(day);
                          setActive(day);
                        }}
                        onClick={() => {
                          setFocusDay(day);
                          choose(day);
                        }}
                        className={cn(
                          "relative shrink-0 outline-none transition-[transform,box-shadow] duration-300 motion-reduce:transition-none",
                          sizeStyles[size].radius,
                          selectable && "cursor-pointer",
                          "data-[active=true]:scale-[1.3] data-[active=true]:z-10",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                          "data-[selected]:ring-2 data-[selected]:ring-foreground data-[selected]:ring-offset-1 data-[selected]:ring-offset-background",
                          "data-[today]:outline data-[today]:outline-1 data-[today]:outline-offset-1 data-[today]:outline-foreground/40",
                        )}
                        style={{ width: cell, height: cell, background: shade(level, levels, color), transitionTimingFunction: SPRING_EASE }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

          </div>
        </div>

        {active !== null && tip && (
          <div
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full select-none whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-sm text-popover-foreground shadow-md"
            style={{ left: `clamp(9rem, ${tip.x}px, calc(100% - 9rem))`, top: tip.y - 8 }}
          >
            <span className="font-medium">{describeValue(activeValue, isoOf(active))}</span>
            <span className="text-muted-foreground"> on {longDate.format(new Date(active * DAY))}</span>
          </div>
        )}
      </div>

      {(showLegend || showTotal) && (
        <div className="flex select-none flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span>
            {showTotal && range
              ? `${numberFormat.format(total)} ${total === 1 ? unit[0] : unit[1]} ${year !== undefined ? `in ${year}` : `in the last ${grid.columns} weeks`}`
              : ""}
          </span>
          {showLegend && (
            <span className="flex items-center gap-1.5" aria-hidden="true">
              Less
              {Array.from({ length: levels }, (_, level) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: levels are positional
                  key={level}
                  className={cn("inline-block", sizeStyles[size].radius)}
                  style={{ width: cell, height: cell, background: shade(level, levels, color) }}
                />
              ))}
              More
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function selectedDay(iso: string | null | undefined) {
  return iso ? parseDay(iso) : null;
}
