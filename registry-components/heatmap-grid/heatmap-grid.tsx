"use client";

import * as React from "react";
import { levelOf, quantileThresholds } from "@/components/beste/component/heatmap-calendar";
import { cn } from "@/lib/utils";

/** Surface treatment of the grid. Mirrors the heatmap family. */
type Tone = "muted" | "outline" | "ghost";

/** Smallest cell size and spacing. */
type Size = "sm" | "default" | "lg";

export interface HeatmapGridCell {
  /** Row index in `data`. */
  row: number;
  /** Column index in `data`. */
  column: number;
}

interface HeatmapGridProps {
  /**
   * Values by row, then column. With the default axes, `data[0]` is Sunday and each row holds
   * 24 hours; with `rows` and `columns` it is laid out as given.
   */
  data?: number[][];
  /** Custom row labels. Replaces the weekdays and turns off `weekStartsOn`. */
  rows?: string[];
  /** Custom column labels. Replaces the hours. */
  columns?: string[];
  /** 0 starts the week on Sunday, 1 on Monday. Weekday rows only. */
  weekStartsOn?: 0 | 1;
  /** Locale for weekday names, hours and numbers. */
  locale?: string;
  /** 12 or 24 hour labels. "auto" follows the locale. */
  hourCycle?: "auto" | "12" | "24";
  /** The scale's strongest color, any CSS color. Lighter levels are mixed from it. */
  color?: string;
  /** Number of shades including the empty one, 3 to 9. */
  levels?: number;
  /** Lowest value of each non-empty level, ascending. Computed from quantiles when left out. */
  thresholds?: number[];
  /** Singular and plural word for the value, used in labels, the tooltip and the peak. */
  unit?: [string, string];
  /** Custom text for a cell's value. */
  formatValue?: (value: number, cell: HeatmapGridCell) => string;
  /** Accessible name of the grid. */
  label?: string;
  showLegend?: boolean;
  /** Names the busiest cell beside the legend. */
  showPeak?: boolean;
  /** Selected cell, controlled. Cells become selectable when this or `onSelectedChange` is set. */
  selected?: HeatmapGridCell | null;
  defaultSelected?: HeatmapGridCell | null;
  onSelectedChange?: (cell: HeatmapGridCell, value: number) => void;
  size?: Size;
  tone?: Tone;
  className?: string;
}

// Deterministic demo: listening sessions by weekday and hour, evenings busiest, weekends sleep in
const hash = (n: number) => {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};
const demoData: number[][] = Array.from({ length: 7 }, (_, weekday) =>
  Array.from({ length: 24 }, (_, hour) => {
    const weekend = weekday === 0 || weekday === 6;
    const commute = weekend ? 0 : Math.exp(-((hour - 8) ** 2) / 2) * 22;
    const evening = Math.exp(-((hour - (weekend ? 22 : 21)) ** 2) / 6) * (weekday === 5 || weekday === 6 ? 58 : 44);
    const lateMorning = weekend ? Math.exp(-((hour - 11) ** 2) / 5) * 30 : 0;
    const base = hour >= 2 && hour <= 6 ? 0.4 : 5;
    return Math.max(0, Math.round((base + commute + evening + lateMorning) * (0.8 + hash(weekday * 24 + hour) * 0.4)));
  }),
);

export const heatmapGridDemo: HeatmapGridProps = {
  data: demoData,
  weekStartsOn: 1,
  label: "Listening sessions for Hounds of Love by Kate Bush, by weekday and hour",
  unit: ["session", "sessions"],
  showPeak: true,
  className: "w-full max-w-3xl",
};

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent",
};

const sizeStyles: Record<Size, { root: string; cell: number; gap: number; radius: string }> = {
  sm: { root: "gap-2 p-3", cell: 12, gap: 2, radius: "rounded-[2px]" },
  default: { root: "gap-3 p-4", cell: 16, gap: 3, radius: "rounded-[3px]" },
  lg: { root: "gap-3 p-5", cell: 20, gap: 4, radius: "rounded-[4px]" },
};

/** Soft ease-out for the crosshair, which changes on every cell the pointer crosses. */
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Fill for a level, the same ramp heatmap-calendar draws. */
const shade = (level: number, levels: number, color: string) =>
  level === 0
    ? "color-mix(in oklab, var(--foreground) 8%, transparent)"
    : `color-mix(in oklab, ${color} ${Math.round(28 + (72 * (level - 1)) / Math.max(1, levels - 2))}%, transparent)`;

/** Hour labels thin out as the grid narrows: every 6th always, every 3rd from @xl, all from @3xl. */
const hourLabelClass = (index: number, count: number) =>
  count <= 12 || index % 6 === 0 ? "" : index % 3 === 0 ? "invisible @xl/heatmap:visible" : "invisible @3xl/heatmap:visible";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

// 2026-01-04 is a Sunday, so weekday d is that date plus d days
const weekdayDate = (weekday: number) => new Date(Date.UTC(2026, 0, 4 + weekday));

const sameCell = (a: HeatmapGridCell | null | undefined, b: HeatmapGridCell | null | undefined) =>
  Boolean(a && b && a.row === b.row && a.column === b.column);

/**
 * A heatmap of values by two axes, by default weekday by hour: shaded cells on the heatmap family's
 * scale, a soft crosshair under the pointer, a tooltip, a legend and the busiest slot named.
 */
export function HeatmapGrid({
  data = [],
  rows: rowLabelsProp,
  columns: columnLabelsProp,
  weekStartsOn = 0,
  locale = "en-US",
  hourCycle = "auto",
  color = "var(--primary)",
  levels: levelsProp = 5,
  thresholds: thresholdsProp,
  unit = ["event", "events"],
  formatValue,
  label = "Activity by weekday and hour",
  showLegend = true,
  showPeak = true,
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  size = "default",
  tone = "muted",
  className,
}: HeatmapGridProps) {
  const weekStart: 0 | 1 = Number(weekStartsOn) === 1 ? 1 : 0;
  const weekdays = rowLabelsProp === undefined;
  const hours = columnLabelsProp === undefined;
  const rowCount = rowLabelsProp?.length ?? 7;
  const columnCount = columnLabelsProp?.length ?? 24;
  const levels = Math.min(9, Math.max(3, Math.round(levelsProp)));
  const { cell, gap, radius } = sizeStyles[size];

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cellRefs = React.useRef(new Map<string, HTMLDivElement>());
  const tooltipId = React.useId();
  const [active, setActive] = React.useState<HeatmapGridCell | null>(null);
  const [focusCell, setFocusCell] = React.useState<HeatmapGridCell>({ row: 0, column: 0 });
  const [tip, setTip] = React.useState<{ x: number; y: number } | null>(null);
  const [innerSelected, setInnerSelected] = React.useState<HeatmapGridCell | null>(defaultSelected);
  const selected = selectedProp !== undefined ? selectedProp : innerSelected;
  const selectable = onSelectedChange !== undefined || selectedProp !== undefined;

  // Display row to data row: weekday rows turn so the week starts on the chosen day
  const dataRow = (displayRow: number) => (weekdays ? (displayRow + weekStart) % 7 : displayRow);
  const valueAt = (row: number, column: number) => data[row]?.[column] ?? 0;

  const hour12 = React.useMemo(() => {
    if (hourCycle !== "auto") return hourCycle === "12";
    const cycle = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hourCycle;
    return cycle === "h11" || cycle === "h12";
  }, [hourCycle, locale]);

  const shortWeekday = React.useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }), [locale]);
  const longWeekday = React.useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }), [locale]);
  const longHour = React.useMemo(() => new Intl.DateTimeFormat(locale, { hour: "numeric", hour12, timeZone: "UTC" }), [locale, hour12]);
  const numberFormat = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const rowLabel = (row: number) => (weekdays ? shortWeekday.format(weekdayDate(row)) : (rowLabelsProp?.[row] ?? ""));
  const rowName = (row: number) => (weekdays ? longWeekday.format(weekdayDate(row)) : (rowLabelsProp?.[row] ?? ""));
  const columnLabel = (column: number) =>
    hours ? (hour12 ? `${column % 12 || 12}${column < 12 ? "a" : "p"}` : String(column)) : (columnLabelsProp?.[column] ?? "");
  const columnName = (column: number) => (hours ? longHour.format(new Date(Date.UTC(2026, 0, 4, column))) : (columnLabelsProp?.[column] ?? ""));
  const slotName = (c: HeatmapGridCell) => `${rowName(c.row)}, ${columnName(c.column)}`;
  const describe = (value: number, c: HeatmapGridCell) =>
    formatValue ? formatValue(value, c) : `${value === 0 ? "No" : numberFormat.format(value)} ${value === 1 ? unit[0] : unit[1]}`;

  const thresholds = React.useMemo(() => {
    if (thresholdsProp && thresholdsProp.length > 0) return thresholdsProp.slice(0, levels - 1);
    const values: number[] = [];
    for (let r = 0; r < rowCount; r++) for (let c = 0; c < columnCount; c++) values.push(data[r]?.[c] ?? 0);
    return quantileThresholds(values, levels);
  }, [thresholdsProp, levels, data, rowCount, columnCount]);

  const peak = React.useMemo(() => {
    let best: (HeatmapGridCell & { value: number }) | null = null;
    for (let r = 0; r < rowCount; r++)
      for (let c = 0; c < columnCount; c++) {
        const v = data[r]?.[c] ?? 0;
        if (v > 0 && (!best || v > best.value)) best = { row: r, column: c, value: v };
      }
    return best;
  }, [data, rowCount, columnCount]);

  // The tooltip sits outside the scroller, so the scroll area never clips it
  const placeTip = React.useCallback(() => {
    const frame = frameRef.current;
    const node = active ? cellRefs.current.get(`${active.row}:${active.column}`) : undefined;
    if (!frame || !node) return setTip(null);
    const f = frame.getBoundingClientRect();
    const c = node.getBoundingClientRect();
    setTip({ x: c.left - f.left + c.width / 2, y: c.top - f.top });
  }, [active]);

  useIsomorphicLayoutEffect(() => {
    placeTip();
  }, [placeTip]);

  const moveFocus = (displayRow: number, column: number) => {
    const next = { row: Math.max(0, Math.min(rowCount - 1, displayRow)), column: Math.max(0, Math.min(columnCount - 1, column)) };
    setFocusCell(next);
    const target = { row: dataRow(next.row), column: next.column };
    setActive(target);
    const node = cellRefs.current.get(`${target.row}:${target.column}`);
    node?.focus({ preventScroll: true });
    node?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const choose = (c: HeatmapGridCell) => {
    if (!selectable) return;
    if (selectedProp === undefined) setInnerSelected(c);
    onSelectedChange?.(c, valueAt(c.row, c.column));
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const { row, column } = focusCell;
    const edge = event.ctrlKey || event.metaKey;
    const moves: Record<string, [number, number]> = {
      ArrowUp: [row - 1, column],
      ArrowDown: [row + 1, column],
      ArrowLeft: [row, column - 1],
      ArrowRight: [row, column + 1],
      Home: edge ? [0, 0] : [row, 0],
      End: edge ? [rowCount - 1, columnCount - 1] : [row, columnCount - 1],
      PageUp: [0, column],
      PageDown: [rowCount - 1, column],
    };
    const target = moves[event.key];
    if (target) {
      event.preventDefault();
      moveFocus(target[0], target[1]);
    } else if ((event.key === "Enter" || event.key === " ") && selectable) {
      event.preventDefault();
      choose({ row: dataRow(row), column });
    }
  };

  const activeValue = active ? valueAt(active.row, active.column) : 0;
  const hovering = active !== null;

  return (
    <div data-slot="heatmap-grid" className={cn("flex w-full min-w-0 flex-col rounded-xl text-foreground", toneStyles[tone], sizeStyles[size].root, className)}>
      <div ref={frameRef} className="relative min-w-0">
        <div onScroll={placeTip} className="@container/heatmap overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin]">
          <div
            role="grid"
            aria-label={label}
            aria-readonly={!selectable}
            aria-rowcount={rowCount + 1}
            aria-colcount={columnCount + 1}
            onKeyDown={onKeyDown}
            onPointerLeave={() => {
              if (!frameRef.current?.contains(document.activeElement)) setActive(null);
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
            }}
            className="grid w-full items-center"
            style={{ gridTemplateColumns: `max-content repeat(${columnCount}, minmax(${cell}px, 1fr))`, gap }}
          >
            {/* Column headers */}
            <div role="row" className="contents">
              <span role="columnheader" className="sr-only">
                {weekdays ? "Weekday" : "Row"}
              </span>
              {Array.from({ length: columnCount }, (_, column) => (
                <span
                  key={column}
                  role="columnheader"
                  aria-label={columnName(column)}
                  className={cn(
                    "select-none whitespace-nowrap pb-1 text-left text-sm leading-none text-muted-foreground transition-colors duration-200",
                    hours && hourLabelClass(column, columnCount),
                    active?.column === column && "text-foreground",
                  )}
                >
                  {columnLabel(column)}
                </span>
              ))}
            </div>

            {Array.from({ length: rowCount }, (_, displayRow) => {
              const row = dataRow(displayRow);
              return (
                <div key={row} role="row" className="contents">
                  <span
                    role="rowheader"
                    aria-label={rowName(row)}
                    className={cn(
                      "select-none whitespace-nowrap pr-2 text-sm leading-none text-muted-foreground transition-colors duration-200",
                      active?.row === row && "text-foreground",
                    )}
                  >
                    {rowLabel(row)}
                  </span>
                  {Array.from({ length: columnCount }, (_, column) => {
                    const here = { row, column };
                    const value = valueAt(row, column);
                    const level = levelOf(value, thresholds);
                    const isActive = sameCell(active, here);
                    const inCross = hovering && (active?.row === row || active?.column === column);
                    const isSelected = sameCell(selected, here);
                    return (
                      <div
                        key={column}
                        ref={(node) => {
                          if (node) cellRefs.current.set(`${row}:${column}`, node);
                          else cellRefs.current.delete(`${row}:${column}`);
                        }}
                        role="gridcell"
                        tabIndex={focusCell.row === displayRow && focusCell.column === column ? 0 : -1}
                        aria-label={`${describe(value, here)}, ${slotName(here)}`}
                        aria-selected={selectable ? isSelected : undefined}
                        aria-describedby={isActive ? tooltipId : undefined}
                        data-level={level}
                        data-active={isActive}
                        data-selected={isSelected || undefined}
                        onPointerEnter={() => setActive((prev) => (sameCell(prev, here) ? prev : here))}
                        onFocus={() => {
                          setFocusCell({ row: displayRow, column });
                          setActive(here);
                        }}
                        onClick={() => {
                          setFocusCell({ row: displayRow, column });
                          choose(here);
                        }}
                        className={cn(
                          "relative aspect-square w-full outline-none transition-[opacity,transform,box-shadow] duration-200 motion-reduce:transition-none",
                          radius,
                          selectable && "cursor-pointer",
                          // A soft crosshair: the row and column under the pointer stay full, the rest step back
                          hovering && !inCross && "opacity-45",
                          "data-[active=true]:z-10 data-[active=true]:scale-[1.18]",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                          "data-[selected]:ring-2 data-[selected]:ring-foreground data-[selected]:ring-offset-1 data-[selected]:ring-offset-background",
                        )}
                        style={{ background: shade(level, levels, color), transitionTimingFunction: EASE }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {active && tip && (
          <div
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full select-none whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-sm text-popover-foreground shadow-md"
            style={{ left: `clamp(8rem, ${tip.x}px, calc(100% - 8rem))`, top: tip.y - 8 }}
          >
            <span className="font-medium">{describe(activeValue, active)}</span>
            <span className="text-muted-foreground"> on {slotName(active)}</span>
          </div>
        )}
      </div>

      {(showLegend || (showPeak && peak)) && (
        <div className="flex select-none flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span>
            {showPeak && peak ? (
              <>
                Busiest: <span className="text-foreground">{slotName(peak)}</span> ({describe(peak.value, peak)})
              </>
            ) : null}
          </span>
          {showLegend && (
            <span className="flex items-center gap-1.5" aria-hidden="true">
              Less
              {Array.from({ length: levels }, (_, level) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: levels are positional
                  key={level}
                  className={cn("inline-block", radius)}
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
