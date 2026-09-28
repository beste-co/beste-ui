"use client";

import { ChevronDown, CircleCheck, FileAudio, GitMerge, LoaderCircle, MessageSquare, Music2, Pencil, Upload, UserPlus } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface behind the feed. */
type Tone = "muted" | "outline" | "ghost";

/** Density and type size. */
type Size = "sm" | "default" | "lg";

/** Color of an event's node on the rail. */
export type ActivityTone = "neutral" | "info" | "success" | "warning" | "danger";

type IconLike = React.ComponentType<{ className?: string }> | React.ReactNode;

export interface ActivityEvent {
  id: string;
  actor: { name: string; avatar?: string };
  /** What happened, after the name: "uploaded", "commented on". */
  action: string;
  /** What it happened to, set in the foreground color. */
  target?: string;
  /** When it happened: an ISO string or epoch milliseconds. */
  time: string | number;
  icon?: IconLike;
  tone?: ActivityTone;
  /** Extra content that opens under the event. */
  detail?: React.ReactNode;
}

export interface ActivityFeedProps {
  /** Newest first. New events added at the start animate in. */
  events: ActivityEvent[];
  /** Ids of the events whose details are open. Pair with `onExpandedChange` to control it. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** Shows a "Load more" button while true. */
  hasMore?: boolean;
  /** Called by "Load more"; a returned promise keeps the button busy until it settles. */
  onLoadMore?: () => void | Promise<void>;
  /** Locale for day headers, times and relative times. @defaultValue "en-US" */
  locale?: string;
  /** Words used by the component, for translation. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /** @defaultValue "ghost" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  /** @defaultValue "Activity" */
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_LABELS = {
  today: "Today",
  yesterday: "Yesterday",
  showDetails: "Show details",
  hideDetails: "Hide details",
  loadMore: "Load more",
  loading: "Loading",
};

const MINUTE = 60_000;
const ago = (minutes: number) => new Date(Date.now() - minutes * MINUTE).toISOString();

export const activityFeedDemo: ActivityFeedProps = {
  events: [
    {
      id: "e1",
      actor: { name: "Hania Rani" },
      action: "uploaded",
      target: "Esja (piano take 4).wav",
      time: ago(3),
      icon: Upload,
      tone: "info",
      detail: "48 kHz, 24 bit, 6 min 12 s. Replaces take 3 in the album session.",
    },
    { id: "e2", actor: { name: "Nils Frahm" }, action: "commented on", target: "Says, mix 7", time: ago(26), icon: MessageSquare, detail: "The pad comes in a bar early after the second chorus. Can we nudge it?" },
    { id: "e3", actor: { name: "Ólafur Arnalds" }, action: "approved", target: "Saman master", time: ago(95), icon: CircleCheck, tone: "success" },
    { id: "e4", actor: { name: "Kelly Lee Owens" }, action: "joined", target: "the Harpa live crew", time: ago(190), icon: UserPlus },
    { id: "e5", actor: { name: "Jon Hopkins" }, action: "merged", target: "Singularity stems into the main session", time: ago(60 * 24 + 40), icon: GitMerge, tone: "info" },
    { id: "e6", actor: { name: "Arooj Aftab" }, action: "flagged clipping in", target: "Mohabbat, vocal bus", time: ago(60 * 24 + 180), icon: FileAudio, tone: "warning", detail: "Peaks at +0.4 dB between 2:31 and 2:34. The limiter on the bus was bypassed." },
    { id: "e7", actor: { name: "Nils Frahm" }, action: "renamed", target: "Spaces (live) to Spaces, Harpa", time: ago(60 * 26), icon: Pencil },
    { id: "e8", actor: { name: "Hania Rani" }, action: "created", target: "the Reykjavík setlist", time: ago(60 * 48 + 30), icon: Music2 },
    { id: "e9", actor: { name: "Björk" }, action: "removed a take from", target: "Hyperballad rehearsal", time: ago(60 * 49 + 15), icon: FileAudio, tone: "danger" },
    { id: "e10", actor: { name: "Ólafur Arnalds" }, action: "invited", target: "Kelly Lee Owens", time: ago(60 * 50), icon: UserPlus },
  ],
  defaultExpanded: ["e1"],
  hasMore: true,
  onLoadMore: () => new Promise((resolve) => setTimeout(resolve, 1200)),
  className: "w-full max-w-md max-h-[30rem] overflow-y-auto",
};

// Same spring as inspector-slider: overshoots a hair, then settles, with no animation library
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

// The day headers stick over the list, so they paint the same surface as the feed
const toneStyles: Record<Tone, string> = {
  muted: "rounded-xl bg-muted [--feed-bg:var(--muted)]",
  outline: "rounded-xl border border-border bg-background [--feed-bg:var(--background)]",
  ghost: "[--feed-bg:var(--background)]",
};

// --node is the rail's node size and --pad each row's vertical padding; the rail between nodes is drawn from both
const sizeStyles: Record<Size, { root: string; icon: string; text: string; row: string }> = {
  sm: { root: "px-3 pb-3 [--node:1.5rem] [--pad:0.5rem]", icon: "size-3.5", text: "text-sm", row: "gap-3" },
  default: { root: "px-4 pb-4 [--node:2rem] [--pad:0.625rem]", icon: "size-4", text: "text-sm", row: "gap-3.5" },
  lg: { root: "px-5 pb-5 [--node:2.5rem] [--pad:0.75rem]", icon: "size-5", text: "text-base", row: "gap-4" },
};

const nodeStyles: Record<ActivityTone, string> = {
  neutral: "bg-background text-muted-foreground ring-border",
  info: "bg-sky-50 text-sky-600 ring-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:ring-sky-900",
  success: "bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-900",
  warning: "bg-amber-50 text-amber-600 ring-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:ring-amber-900",
  danger: "bg-red-50 text-red-600 ring-red-200 dark:bg-red-950 dark:text-red-400 dark:ring-red-900",
};

/* -------------------------------------------------------------------------- */
/* One shared clock for every feed on the page                                 */
/* -------------------------------------------------------------------------- */

const listeners = new Set<() => void>();
let now = 0;
let timer: ReturnType<typeof setInterval> | undefined;

function tick() {
  now = Date.now();
  for (const listener of listeners) listener();
}

function onVisibility() {
  if (document.hidden) {
    clearInterval(timer);
    timer = undefined;
  } else if (!timer && listeners.size > 0) {
    tick();
    timer = setInterval(tick, 30_000);
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    now = Date.now();
    if (!document.hidden) timer = setInterval(tick, 30_000);
    document.addEventListener("visibilitychange", onVisibility);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
      document.removeEventListener("visibilitychange", onVisibility);
    }
  };
}

/** The current time, refreshed every 30s while the tab is visible. 0 on the server and while hydrating. */
function useNow() {
  return React.useSyncExternalStore(
    subscribe,
    () => {
      // Stable between ticks, as useSyncExternalStore requires
      if (!now) now = Date.now();
      return now;
    },
    () => 0,
  );
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                  */
/* -------------------------------------------------------------------------- */

const toMs = (time: string | number) => (typeof time === "number" ? time : Date.parse(time));

/** "just now", "3 min ago", "2 hr ago"; past a day, the clock time. */
export function formatRelative(time: string | number, at: number, locale = "en-US") {
  const diff = at - toMs(time);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" });
  if (diff < 45_000) return rtf.format(0, "second");
  if (diff < 45 * MINUTE) return rtf.format(-Math.round(diff / MINUTE), "minute");
  if (diff < 22 * 60 * MINUTE) return rtf.format(-Math.round(diff / (60 * MINUTE)), "hour");
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(toMs(time));
}

/** A local calendar day key: events on the same wall-clock date share it. */
const dayKey = (ms: number, utc: boolean) => {
  const d = new Date(ms);
  return utc ? `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}` : `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

function dayLabel(ms: number, at: number, locale: string, labels: typeof DEFAULT_LABELS) {
  const today = new Date(at);
  today.setHours(0, 0, 0, 0);
  const day = new Date(ms);
  day.setHours(0, 0, 0, 0);
  const days = Math.round((today.getTime() - day.getTime()) / (24 * 60 * MINUTE));
  if (days === 0) return labels.today;
  if (days === 1) return labels.yesterday;
  return new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric", year: today.getFullYear() === day.getFullYear() ? undefined : "numeric" }).format(ms);
}

function renderIcon(icon: IconLike | undefined, className: string) {
  if (!icon) return <span className="size-1.5 rounded-full bg-current" />;
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "render" in icon)) {
    const Icon = icon as React.ComponentType<{ className?: string }>;
    return <Icon className={className} />;
  }
  return icon as React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export function ActivityFeed({
  events,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  hasMore = false,
  onLoadMore,
  locale = "en-US",
  labels: labelsProp,
  tone = "ghost",
  size = "default",
  "aria-label": ariaLabel = "Activity",
  className,
}: ActivityFeedProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const at = useNow();
  const mounted = at > 0;
  const s = sizeStyles[size];
  const uid = React.useId();

  const [inner, setInner] = React.useState(defaultExpanded);
  const expanded = expandedProp ?? inner;
  const toggle = (id: string) => {
    const next = expanded.includes(id) ? expanded.filter((x) => x !== id) : [...expanded, id];
    if (expandedProp === undefined) setInner(next);
    onExpandedChange?.(next);
  };

  // The first paint staggers in; events that arrive later slide in on their own, without a delay
  const painted = React.useRef(false);
  const firstPaint = !painted.current;
  React.useEffect(() => {
    painted.current = true;
  }, []);

  const [loading, setLoading] = React.useState(false);
  const loadMore = async () => {
    if (!onLoadMore || loading) return;
    setLoading(true);
    try {
      await onLoadMore();
    } finally {
      setLoading(false);
    }
  };

  // Grouped by UTC day until mounted so the server and the first paint agree, then by the reader's day
  const groups: { key: string; ms: number; items: ActivityEvent[] }[] = [];
  const byKey = new Map<string, (typeof groups)[number]>();
  for (const event of events) {
    const ms = toMs(event.time);
    const key = dayKey(ms, !mounted);
    const group = byKey.get(key);
    if (group) group.items.push(event);
    else {
      const next = { key, ms, items: [event] };
      byKey.set(key, next);
      groups.push(next);
    }
  }

  let order = 0;

  return (
    <section aria-label={ariaLabel} data-slot="activity-feed" className={cn("relative", toneStyles[tone], s.root, s.text, className)}>
      {groups.map((group) => (
        <div key={group.key} role="group" aria-labelledby={`${uid}-${group.key}`}>
          <h3
            id={`${uid}-${group.key}`}
            className="sticky top-0 z-10 bg-(--feed-bg) pt-4 pb-2 font-medium text-foreground select-none"
          >
            {/* Relative day names need the reader's clock, so the header waits for mount rather than guessing */}
            <span className={cn("transition-opacity duration-300", mounted ? "opacity-100" : "opacity-0")}>
              {mounted ? dayLabel(group.ms, at, locale, labels) : " "}
            </span>
          </h3>
          <ol className="relative">
            {group.items.map((event, index) => {
              const open = expanded.includes(event.id);
              const lastInGroup = index === group.items.length - 1;
              const delay = firstPaint ? Math.min(order++, 10) * 40 : 0;
              const panelId = `${uid}-${event.id}-detail`;
              return (
                <li
                  key={event.id}
                  className={cn(
                    "relative flex py-(--pad) transition-[opacity,translate] duration-500 starting:opacity-0 motion-safe:starting:-translate-y-2",
                    s.row,
                  )}
                  style={{ transitionTimingFunction: SPRING_EASE, transitionDelay: `${delay}ms` }}
                >
                  {!lastInGroup && (
                    // From this node's centre down to the next one's, which sits the same distance into its row
                    <span
                      aria-hidden="true"
                      className="absolute top-[calc(var(--pad)+var(--node)/2)] left-[calc(var(--node)/2)] h-full w-px -translate-x-1/2 bg-border"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={cn("relative z-[1] grid size-(--node) shrink-0 place-items-center rounded-full ring-1", nodeStyles[event.tone ?? "neutral"])}
                  >
                    {renderIcon(event.icon, s.icon)}
                  </span>
                  <div className="min-w-0 flex-1 pt-[0.2em]">
                    <div className="flex items-start gap-3">
                      <p className="min-w-0 flex-1 leading-snug text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 align-top font-medium text-foreground">
                          {event.actor.avatar && (
                            // biome-ignore lint/performance/noImgElement: registry components ship plain img
                            <img src={event.actor.avatar} alt="" className="size-5 rounded-full object-cover" />
                          )}
                          {event.actor.name}
                        </span>{" "}
                        {event.action}
                        {event.target && (
                          <>
                            {" "}
                            <span className="font-medium text-foreground">{event.target}</span>
                          </>
                        )}
                      </p>
                      <time
                        dateTime={mounted ? new Date(toMs(event.time)).toISOString() : undefined}
                        className={cn("shrink-0 whitespace-nowrap text-muted-foreground tabular-nums transition-opacity duration-300 select-none", mounted ? "opacity-100" : "opacity-0")}
                      >
                        {mounted ? formatRelative(event.time, at, locale) : " "}
                      </time>
                    </div>
                    {event.detail && (
                      <>
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-controls={panelId}
                          onClick={() => toggle(event.id)}
                          className="-ml-1 mt-1 inline-flex cursor-pointer items-center gap-1 rounded-md px-1 py-0.5 text-muted-foreground transition-colors select-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          {open ? labels.hideDetails : labels.showDetails}
                          <ChevronDown
                            aria-hidden="true"
                            className={cn("size-4 transition-transform duration-500", open && "rotate-180")}
                            style={{ transitionTimingFunction: SPRING_EASE }}
                          />
                        </button>
                        <div
                          id={panelId}
                          inert={!open}
                          className={cn(
                            "grid transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none",
                            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                          )}
                          style={{ transitionTimingFunction: SPRING_EASE }}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <div className="mt-2 rounded-lg border border-border bg-background px-3 py-2.5 leading-relaxed text-muted-foreground">
                              {event.detail}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}

      {hasMore && onLoadMore && (
        <div className="pt-3">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            aria-busy={loading || undefined}
            className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background font-medium text-foreground transition-colors select-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-70"
          >
            {loading && <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />}
            {loading ? labels.loading : labels.loadMore}
          </button>
        </div>
      )}
    </section>
  );
}
