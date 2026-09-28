"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. */
type Tone = "muted" | "outline" | "ghost";

/** Density preset. */
type Size = "sm" | "default" | "lg";

/** Health of a service, from best to worst (maintenance is planned, so it ranks above trouble). */
export type StatusLevel = "operational" | "maintenance" | "degraded" | "partial" | "major";

export interface StatusUptimeDay {
  /** ISO date, e.g. "2026-09-27". */
  date: string;
  /** The worst status the service reached that day. */
  status: StatusLevel;
  /** Uptime that day in percent. Falls back to a typical value for the status. */
  uptime?: number;
  incidents?: { title: string }[];
}

/**
 * One table for every `status-*` piece: the words and the colors for each level.
 * Siblings import this instead of keeping their own, so a status reads the same everywhere.
 */
export const statusMeta: Record<StatusLevel, { label: string; rank: number; dot: string; bar: string; text: string }> = {
  operational: {
    label: "Operational",
    rank: 0,
    dot: "bg-emerald-500 dark:bg-emerald-400",
    bar: "bg-emerald-500/85 dark:bg-emerald-400/80",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  maintenance: {
    label: "Maintenance",
    rank: 1,
    dot: "bg-sky-500 dark:bg-sky-400",
    bar: "bg-sky-500/85 dark:bg-sky-400/80",
    text: "text-sky-700 dark:text-sky-400",
  },
  degraded: {
    label: "Degraded performance",
    rank: 2,
    dot: "bg-amber-400 dark:bg-amber-300",
    bar: "bg-amber-400 dark:bg-amber-300/90",
    text: "text-amber-700 dark:text-amber-300",
  },
  partial: {
    label: "Partial outage",
    rank: 3,
    dot: "bg-orange-500 dark:bg-orange-400",
    bar: "bg-orange-500 dark:bg-orange-400/90",
    text: "text-orange-700 dark:text-orange-400",
  },
  major: {
    label: "Major outage",
    rank: 4,
    dot: "bg-red-500 dark:bg-red-400",
    bar: "bg-red-500 dark:bg-red-400/90",
    text: "text-red-700 dark:text-red-400",
  },
};

const TYPICAL_UPTIME: Record<StatusLevel, number> = {
  operational: 100,
  maintenance: 100,
  degraded: 99.9,
  partial: 99.5,
  major: 98,
};

/** Same spring the inspector family uses, so the bars answer with the same feel. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

/** Narrowest a bar may get before the strip drops its oldest days. */
const MIN_BAR = 4;
/** Gap between bars in px. Mirrors `gap-0.5`. */
const BAR_GAP = 2;

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent",
};

const sizeStyles: Record<Size, { root: string; name: string }> = {
  sm: { root: "gap-2.5 p-3 [--status-bar:--spacing(6)]", name: "text-sm" },
  default: { root: "gap-3 p-4 [--status-bar:--spacing(8)]", name: "text-sm" },
  lg: { root: "gap-4 p-5 [--status-bar:--spacing(10)]", name: "text-base" },
};

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00Z`));
const formatPercent = (value: number) => `${value.toFixed(2)}%`;

interface StatusUptimeProps {
  /** Service name on the left of the header. */
  name: string;
  /** Current status. Defaults to the status of the last day. */
  status?: StatusLevel;
  /** Daily history, oldest first. */
  days?: StatusUptimeDay[];
  /** How many days the strip shows at most; narrow rows show fewer. */
  range?: number;
  /** Show the uptime percentage for the days on screen. */
  showPercent?: boolean;
  size?: Size;
  tone?: Tone;
  className?: string;
}

// Deterministic demo history: fixed end date, hand-placed incidents, no randomness at render
const DEMO_END = Date.UTC(2026, 8, 27);
const DEMO_EVENTS: Record<number, Omit<StatusUptimeDay, "date">> = {
  12: { status: "maintenance", uptime: 100, incidents: [{ title: "Scheduled database upgrade" }] },
  23: { status: "degraded", uptime: 99.82, incidents: [{ title: "Elevated latency on EU requests" }] },
  40: { status: "partial", uptime: 99.41, incidents: [{ title: "Webhook deliveries delayed" }] },
  61: { status: "degraded", uptime: 99.9, incidents: [{ title: "Slow search indexing" }] },
  74: {
    status: "major",
    uptime: 97.63,
    incidents: [{ title: "API unavailable in us-east" }, { title: "Dashboard sign-in failures" }],
  },
};

export const statusUptimeDemo: StatusUptimeProps = {
  name: "Public API",
  status: "operational",
  days: Array.from({ length: 90 }, (_, index) => ({
    date: new Date(DEMO_END - (89 - index) * 86_400_000).toISOString().slice(0, 10),
    ...(DEMO_EVENTS[index] ?? { status: "operational" as const, uptime: 100 }),
  })),
  range: 90,
  showPercent: true,
  className: "w-full max-w-xl",
};

export function StatusUptime({
  name,
  status,
  days = [],
  range = 90,
  showPercent = true,
  size = "default",
  tone = "muted",
  className,
}: StatusUptimeProps) {
  const stripRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const tooltipId = React.useId();
  const [fit, setFit] = React.useState(range);
  const [active, setActive] = React.useState<number | null>(null);
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null);

  // Drop the oldest days rather than squeeze the bars under MIN_BAR
  useIsomorphicLayoutEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const measure = () => setFit(Math.max(7, Math.floor((strip.clientWidth + BAR_GAP) / (MIN_BAR + BAR_GAP))));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    return () => observer.disconnect();
  }, []);

  const count = Math.max(1, Math.min(range, fit));
  const recent = days.slice(-count);
  // Missing history pads the start with empty bars, so the strip always spans the range
  const slots: (StatusUptimeDay | null)[] = [...Array.from({ length: count - recent.length }, () => null), ...recent];
  const current = status ?? days.at(-1)?.status ?? "operational";
  const measured = recent.map((day) => day.uptime ?? TYPICAL_UPTIME[day.status]);
  const percent = measured.length > 0 ? measured.reduce((sum, value) => sum + value, 0) / measured.length : null;
  const roving = focusIndex ?? slots.length - 1;
  const activeDay = active === null ? undefined : slots[active];

  const describe = (day: StatusUptimeDay | null) => {
    if (!day) return "No data";
    const uptime = formatPercent(day.uptime ?? TYPICAL_UPTIME[day.status]);
    const incidents = day.incidents?.length ?? 0;
    return `${formatDate(day.date)}: ${statusMeta[day.status].label}, ${uptime} uptime${incidents ? `, ${incidents} incident${incidents > 1 ? "s" : ""}` : ""}`;
  };

  const move = (index: number) => {
    const next = Math.min(slots.length - 1, Math.max(0, index));
    setFocusIndex(next);
    setActive(next);
    itemRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowLeft: roving - 1,
      ArrowRight: roving + 1,
      Home: 0,
      End: slots.length - 1,
    };
    const target = keys[event.key];
    if (target === undefined) return;
    event.preventDefault();
    move(target);
  };

  return (
    <div
      data-slot="status-uptime"
      className={cn("flex w-full flex-col rounded-xl text-foreground", toneStyles[tone], sizeStyles[size].root, className)}
    >
      <div className="flex select-none items-center gap-2.5">
        <span aria-hidden="true" className="relative flex size-2.5 shrink-0">
          {current !== "operational" && (
            <span className={cn("absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping", statusMeta[current].dot)} />
          )}
          <span className={cn("relative size-2.5 rounded-full", statusMeta[current].dot)} />
        </span>
        <span className={cn("min-w-0 flex-1 truncate font-medium", sizeStyles[size].name)}>{name}</span>
        <span className={cn("shrink-0 text-sm", statusMeta[current].text)}>{statusMeta[current].label}</span>
        {showPercent && percent !== null && (
          <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{formatPercent(percent)}</span>
        )}
      </div>

      <div className="relative">
        <div
          ref={stripRef}
          role="list"
          aria-label={`${name} uptime, last ${count} days`}
          data-hovering={active !== null}
          onKeyDown={onKeyDown}
          onPointerLeave={() => {
            if (!stripRef.current?.contains(document.activeElement)) setActive(null);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
          }}
          className="group/strip flex h-(--status-bar) items-end gap-0.5"
        >
          {slots.map((day, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: a slot's place in the strip is its identity
              key={index}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              role="listitem"
              tabIndex={index === roving ? 0 : -1}
              aria-label={describe(day)}
              aria-describedby={active === index ? tooltipId : undefined}
              data-active={active === index}
              onPointerEnter={() => setActive(index)}
              onFocus={() => {
                setFocusIndex(index);
                setActive(index);
              }}
              style={{ transitionTimingFunction: SPRING_EASE }}
              className={cn(
                "h-full min-w-0 flex-1 origin-bottom rounded-[3px] outline-none transition-[transform,opacity] duration-[420ms]",
                "group-data-[hovering=true]/strip:opacity-45 data-[active=true]:scale-y-[1.12] data-[active=true]:opacity-100!",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                day ? statusMeta[day.status].bar : "bg-muted-foreground/20",
              )}
            />
          ))}
        </div>

        {active !== null && (
          <div
            id={tooltipId}
            role="tooltip"
            style={{ left: `clamp(7rem, ${((active + 0.5) / slots.length) * 100}%, calc(100% - 7rem))` }}
            className="pointer-events-none absolute bottom-full z-10 mb-2.5 w-56 -translate-x-1/2 select-none rounded-lg border border-border bg-popover p-3 text-sm text-popover-foreground shadow-md"
          >
            {activeDay ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{formatDate(activeDay.date)}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatPercent(activeDay.uptime ?? TYPICAL_UPTIME[activeDay.status])}
                  </span>
                </div>
                <div className={cn("mt-1", statusMeta[activeDay.status].text)}>{statusMeta[activeDay.status].label}</div>
                {activeDay.incidents && activeDay.incidents.length > 0 ? (
                  <ul className="mt-2 space-y-1 border-t border-border pt-2">
                    {activeDay.incidents.map((incident) => (
                      <li key={incident.title} className="text-muted-foreground">
                        {incident.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-2 border-t border-border pt-2 text-muted-foreground">No incidents</div>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">No data for this day</span>
            )}
          </div>
        )}
      </div>

      <div className="flex select-none items-center justify-between text-sm text-muted-foreground">
        <span>{count} days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
