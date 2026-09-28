"use client";

import { CircleCheck, CircleX, Info, LoaderCircle, TriangleAlert, X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of each notice. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Card size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export type NoticeVariant = "default" | "info" | "success" | "error" | "warning" | "loading";

export type NoticePosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

export interface NoticeAction {
  label: string;
  onClick: () => void;
}

export interface NoticeOptions {
  /** Reuse an id to replace a notice in place. */
  id?: string;
  description?: React.ReactNode;
  variant?: NoticeVariant;
  /** Milliseconds on screen. `Infinity` keeps it until dismissed. Loading notices never time out. */
  duration?: number;
  /** A primary button, e.g. Undo. Pressing it also dismisses the notice. */
  action?: NoticeAction;
  /** A quiet second button that only dismisses (and runs `onClick` if given). */
  cancel?: { label: string; onClick?: () => void };
  /** Replaces the variant icon; `null` shows none. */
  icon?: React.ReactNode;
  /** `false` turns off swipe and Escape for this notice. */
  dismissible?: boolean;
  onDismiss?: (id: string) => void;
  onAutoClose?: (id: string) => void;
}

interface NoticeRecord extends NoticeOptions {
  id: string;
  title: React.ReactNode;
  variant: NoticeVariant;
  /** Bumped on every update, so timers restart when the content changes. */
  version: number;
  leaving: boolean;
}

// A module-level store, so notice() works from anywhere without a provider
let records: NoticeRecord[] = [];
const listeners = new Set<() => void>();
let counter = 0;
const EMPTY: NoticeRecord[] = [];
const LEAVE_MS = 260;

function emit(next: NoticeRecord[]) {
  records = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function upsert(title: React.ReactNode, options: NoticeOptions = {}) {
  const id = options.id ?? `notice-${++counter}`;
  const existing = records.find((r) => r.id === id);
  if (existing) {
    emit(
      records.map((r) =>
        r.id === id
          ? { ...r, ...options, title, variant: options.variant ?? r.variant, version: r.version + 1, leaving: false }
          : r,
      ),
    );
  } else {
    emit([{ ...options, id, title, variant: options.variant ?? "default", version: 0, leaving: false }, ...records]);
  }
  return id;
}

function dismiss(id?: string) {
  const targets = records.filter((r) => (id === undefined || r.id === id) && !r.leaving);
  if (targets.length === 0) return;
  emit(records.map((r) => (targets.includes(r) ? { ...r, leaving: true } : r)));
  for (const target of targets) target.onDismiss?.(target.id);
  window.setTimeout(() => emit(records.filter((r) => !targets.some((t) => t.id === r.id) || !r.leaving)), LEAVE_MS);
}

type Content = React.ReactNode | { title: React.ReactNode; description?: React.ReactNode };
const split = (content: Content) =>
  content !== null && typeof content === "object" && "title" in (content as object) && !React.isValidElement(content)
    ? (content as { title: React.ReactNode; description?: React.ReactNode })
    : { title: content as React.ReactNode, description: undefined };

/** Shows a notice and returns its id. Works from any component, event handler or module. */
export const notice = Object.assign((title: React.ReactNode, options?: NoticeOptions) => upsert(title, options), {
  info: (title: React.ReactNode, options?: NoticeOptions) => upsert(title, { ...options, variant: "info" }),
  success: (title: React.ReactNode, options?: NoticeOptions) => upsert(title, { ...options, variant: "success" }),
  error: (title: React.ReactNode, options?: NoticeOptions) => upsert(title, { ...options, variant: "error" }),
  warning: (title: React.ReactNode, options?: NoticeOptions) => upsert(title, { ...options, variant: "warning" }),
  loading: (title: React.ReactNode, options?: NoticeOptions) => upsert(title, { ...options, variant: "loading" }),
  dismiss,
  /** One notice that reads loading while the promise runs, then turns into success or error in place. */
  promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: {
      loading: Content;
      success: Content | ((value: T) => Content);
      error: Content | ((error: unknown) => Content);
    },
    options?: Omit<NoticeOptions, "variant">,
  ): Promise<T> {
    const first = split(messages.loading);
    const id = upsert(first.title, { ...options, description: first.description, variant: "loading" });
    const run = typeof promise === "function" ? promise() : promise;
    run.then(
      (value) => {
        const next = split(typeof messages.success === "function" ? messages.success(value) : messages.success);
        upsert(next.title, { ...options, id, description: next.description, variant: "success" });
      },
      (error: unknown) => {
        const next = split(typeof messages.error === "function" ? messages.error(error) : messages.error);
        upsert(next.title, { ...options, id, description: next.description, variant: "error" });
      },
    );
    return run;
  },
});

export interface NoticeStackProps {
  position?: NoticePosition;
  /** How many notices show at once; older ones wait behind. */
  max?: number;
  /** Default time on screen in milliseconds. */
  duration?: number;
  /** Keep the stack fanned out instead of only on hover and focus. */
  expand?: boolean;
  /** A close button on every notice, shown on hover and focus. */
  closeButton?: boolean;
  /** Keys that move the focus to the notices. */
  hotkey?: string;
  /** Pins the stack inside its parent instead of the window, for previews and embedded panels. */
  contained?: boolean;
  /** Distance from the edges, in pixels. */
  offset?: number;
  tone?: Tone;
  size?: Size;
  className?: string;
  /** Classes for the frame `contained` draws around the stack, e.g. a max width. */
  frameClassName?: string;
  /** Rendered before the stack; with `contained`, inside the same frame. */
  children?: React.ReactNode;
}

function NoticeDemoButtons() {
  React.useEffect(() => {
    const id = notice("Setlist saved", {
      description: "Nina Simone's encore moved to the end of the show.",
      duration: Number.POSITIVE_INFINITY,
      action: { label: "Undo", onClick: () => notice.info("Encore moved back") },
    });
    return () => notice.dismiss(id);
  }, []);
  const button =
    "inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted";
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-6">
      <button type="button" className={button} onClick={() => notice.success("Tickets sent", { description: "Check hello@beste.co for the receipt." })}>
        Success
      </button>
      <button type="button" className={button} onClick={() => notice.error("Payment declined", { description: "Try another card or contact your bank." })}>
        Error
      </button>
      <button
        type="button"
        className={button}
        onClick={() =>
          notice.promise(new Promise((resolve) => window.setTimeout(resolve, 1800)), {
            loading: { title: "Uploading the mix", description: "Kind of Blue (remaster).wav" },
            success: { title: "Mix uploaded", description: "Miles Davis will get a link to listen." },
            error: "Upload failed",
          })
        }
      >
        Promise
      </button>
      <button type="button" className={button} onClick={() => notice.dismiss()}>
        Clear all
      </button>
    </div>
  );
}

export const noticeStackDemo: NoticeStackProps = {
  contained: true,
  position: "bottom-center",
  closeButton: true,
  frameClassName: "max-w-2xl",
  children: <NoticeDemoButtons />,
};

const toneStyles: Record<Tone, string> = {
  muted: "border-transparent bg-muted text-foreground",
  outline: "border-border bg-popover text-popover-foreground shadow-lg",
  ghost: "border-border/60 bg-background/80 text-foreground shadow-lg backdrop-blur-xl",
};

const sizeStyles: Record<Size, { card: string; title: string; width: number }> = {
  sm: { card: "gap-2.5 p-3", title: "text-sm", width: 300 },
  default: { card: "gap-3 p-3.5", title: "text-sm", width: 356 },
  lg: { card: "gap-3 p-4", title: "text-base", width: 400 },
};

const variantIcons: Record<NoticeVariant, React.ReactNode> = {
  default: null,
  info: <Info className="text-sky-600 dark:text-sky-400" />,
  success: <CircleCheck className="text-emerald-600 dark:text-emerald-400" />,
  error: <CircleX className="text-destructive" />,
  warning: <TriangleAlert className="text-amber-600 dark:text-amber-400" />,
  loading: <LoaderCircle className="animate-spin text-muted-foreground motion-reduce:animate-none" />,
};

// A soft overshoot for the stack, close to how physical cards settle
const STACK_EASE = "cubic-bezier(0.21, 1.02, 0.73, 1)";
const PEEK = 12;
const GAP = 12;

export function NoticeStack({
  position = "bottom-center",
  max = 3,
  duration = 4000,
  expand = false,
  closeButton = false,
  hotkey = "F8 or Alt+T",
  contained = false,
  offset = 24,
  tone = "outline",
  size = "default",
  className,
  frameClassName,
  children,
}: NoticeStackProps) {
  const list = React.useSyncExternalStore(subscribe, () => records, () => EMPTY);
  const [heights, setHeights] = React.useState<Record<string, number>>({});
  const [hovered, setHovered] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const listRef = React.useRef<HTMLOListElement>(null);
  const lastFocus = React.useRef<HTMLElement | null>(null);

  const [vertical, horizontal] = position.split("-") as ["top" | "bottom", "left" | "center" | "right"];
  const fromBottom = vertical === "bottom";
  const expanded = expand || hovered || focusWithin;
  const paused = expanded || hidden;

  React.useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // F8 or Alt+T moves the focus into the notices; Escape inside hands it back
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const hit = event.key === "F8" || (event.altKey && event.code === "KeyT");
      if (!hit || !listRef.current) return;
      const first = listRef.current.querySelector<HTMLElement>("[data-notice-card]");
      if (!first) return;
      event.preventDefault();
      lastFocus.current = document.activeElement as HTMLElement | null;
      first.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const setHeight = React.useCallback((id: string, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
  }, []);

  const live = list.filter((r) => !r.leaving);
  const frontHeight = heights[live[0]?.id ?? list[0]?.id ?? ""] ?? 64;
  const shown = Math.min(live.length, max);
  let running = 0;
  const offsets = new Map<string, number>();
  for (const record of live) {
    offsets.set(record.id, running);
    running += (heights[record.id] ?? 64) + GAP;
  }
  const expandedHeight = Math.max(0, live.slice(0, max).reduce((sum, r) => sum + (heights[r.id] ?? 64) + GAP, 0) - GAP);
  const collapsedHeight = live.length ? frontHeight + PEEK * Math.max(0, shown - 1) : 0;
  const width = sizeStyles[size].width;

  const viewport = (
    <section
      aria-label={`Notifications (${hotkey})`}
      tabIndex={-1}
      data-slot="notice-stack"
      className={cn(
        contained ? "pointer-events-none absolute z-50" : "pointer-events-none fixed z-[100]",
        fromBottom ? "bottom-(--notice-offset)" : "top-(--notice-offset)",
        horizontal === "left" && "left-(--notice-offset)",
        horizontal === "right" && "right-(--notice-offset)",
        horizontal === "center" && "left-1/2 -translate-x-1/2",
        "outline-none",
      )}
      style={{ "--notice-offset": `${offset}px`, width: `min(${width}px, calc(100% - ${offset * 2}px))` } as React.CSSProperties}
    >
      <ol
        ref={listRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
        }}
        className={cn("pointer-events-auto relative w-full transition-[height] duration-400 motion-reduce:transition-none", className)}
        style={{ height: expanded ? expandedHeight : collapsedHeight, transitionTimingFunction: STACK_EASE }}
      >
        {list.map((record) => {
          const index = live.indexOf(record);
          return (
            <NoticeCard
              key={record.id}
              record={record}
              index={index}
              expanded={expanded}
              offset={offsets.get(record.id) ?? 0}
              frontHeight={frontHeight}
              hiddenBehind={index >= max}
              fromBottom={fromBottom}
              paused={paused}
              duration={duration}
              closeButton={closeButton}
              tone={tone}
              size={size}
              onHeight={setHeight}
              onEscape={() => {
                lastFocus.current?.focus?.();
                lastFocus.current = null;
              }}
            />
          );
        })}
      </ol>
    </section>
  );

  if (contained) {
    return (
      <div className={cn("relative flex min-h-96 w-full items-start justify-center overflow-hidden", frameClassName)}>
        {children}
        {viewport}
      </div>
    );
  }
  return (
    <>
      {children}
      {viewport}
    </>
  );
}

interface NoticeCardProps {
  record: NoticeRecord;
  index: number;
  expanded: boolean;
  offset: number;
  frontHeight: number;
  hiddenBehind: boolean;
  fromBottom: boolean;
  paused: boolean;
  duration: number;
  closeButton: boolean;
  tone: Tone;
  size: Size;
  onHeight: (id: string, height: number) => void;
  onEscape: () => void;
}

function NoticeCard({
  record,
  index,
  expanded,
  offset,
  frontHeight,
  hiddenBehind,
  fromBottom,
  paused,
  duration,
  closeButton,
  tone,
  size,
  onHeight,
  onEscape,
}: NoticeCardProps) {
  const ref = React.useRef<HTMLLIElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const [swipeOut, setSwipeOut] = React.useState<"x" | "y" | null>(null);
  const swipe = React.useRef({ id: -1, x: 0, y: 0, dx: 0, dy: 0, t: 0, axis: null as "x" | "y" | null });
  const dismissible = record.dismissible !== false;
  const leaving = record.leaving;
  // A leaving notice drops out of the order, so it keeps the slot it last had while it animates away
  const last = React.useRef({ index: 0, offset: 0 });
  if (index >= 0) last.current = { index, offset };
  const slot = last.current.index;
  const front = slot === 0 && !leaving;
  const collapsedBehind = !expanded && slot > 0;

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  React.useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const measure = () => onHeight(record.id, node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [record.id, onHeight]);

  // The countdown keeps what is left across pauses and restarts when the notice changes
  const remaining = React.useRef(0);
  const variantDuration = record.variant === "loading" ? Number.POSITIVE_INFINITY : (record.duration ?? duration);
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new version is new content, so the clock starts over
  React.useEffect(() => {
    remaining.current = variantDuration;
  }, [record.version, variantDuration]);
  React.useEffect(() => {
    if (leaving || paused || !Number.isFinite(remaining.current)) return;
    const started = performance.now();
    const timer = window.setTimeout(() => {
      record.onAutoClose?.(record.id);
      dismiss(record.id);
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [paused, leaving, record.version, record.id, record.onAutoClose]);

  const onPointerDown = (event: React.PointerEvent<HTMLLIElement>) => {
    if (!dismissible || event.button !== 0 || (event.target as HTMLElement).closest("button, a")) return;
    swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0, t: performance.now(), axis: null };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLLIElement>) => {
    const s = swipe.current;
    if (s.id !== event.pointerId) return;
    let dx = event.clientX - s.x;
    let dy = event.clientY - s.y;
    if (!s.axis && Math.hypot(dx, dy) > 6) s.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (!s.axis) return;
    // Toward the screen the card resists; away from it, it follows the finger
    const outward = fromBottom ? dy > 0 : dy < 0;
    if (s.axis === "y" && !outward) dy = Math.sign(dy) * Math.sqrt(Math.abs(dy)) * 2;
    if (s.axis === "x") dy = 0;
    else dx = 0;
    s.dx = dx;
    s.dy = dy;
    const node = ref.current;
    node?.style.setProperty("--swipe-x", `${dx}px`);
    node?.style.setProperty("--swipe-y", `${dy}px`);
    node?.setAttribute("data-swiping", "true");
  };
  const onPointerUp = (event: React.PointerEvent<HTMLLIElement>) => {
    const s = swipe.current;
    if (s.id !== event.pointerId) return;
    s.id = -1;
    const node = ref.current;
    node?.removeAttribute("data-swiping");
    const distance = s.axis === "x" ? Math.abs(s.dx) : fromBottom ? s.dy : -s.dy;
    const velocity = distance / Math.max(1, performance.now() - s.t);
    if (s.axis && (distance > 48 || velocity > 0.11)) {
      setSwipeOut(s.axis);
      dismiss(record.id);
      return;
    }
    node?.style.setProperty("--swipe-x", "0px");
    node?.style.setProperty("--swipe-y", "0px");
  };

  const direction = fromBottom ? -1 : 1;
  const y = expanded ? direction * last.current.offset : direction * slot * PEEK;
  const scale = expanded ? 1 : 1 - Math.min(slot, 3) * 0.05;
  const enterFrom = fromBottom ? "100%" : "-100%";
  const icon = record.icon === undefined ? variantIcons[record.variant] : record.icon;
  const assertive = record.variant === "error" || record.variant === "warning";
  const s = sizeStyles[size];

  let transform = `translateY(${y}px) scale(${scale})`;
  if (!mounted) transform = `translateY(${enterFrom}) scale(0.96)`;
  else if (leaving && swipeOut === "x") transform = `translateX(calc(var(--swipe-x, 0px) * 4)) translateY(${y}px)`;
  else if (leaving && swipeOut === "y") transform = `translateY(calc(${enterFrom} + var(--swipe-y, 0px)))`;
  else if (leaving) transform = `translateY(${y + direction * -8}px) scale(${scale * 0.96})`;

  return (
    <li
      ref={ref}
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      aria-hidden={hiddenBehind || leaving || undefined}
      data-notice-card=""
      data-variant={record.variant}
      data-front={front}
      data-expanded={expanded}
      tabIndex={hiddenBehind || leaving ? -1 : 0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={(event) => {
        if (event.key === "Escape" && dismissible) {
          event.stopPropagation();
          dismiss(record.id);
          onEscape();
        }
      }}
      className={cn(
        "group/notice absolute inset-x-0 touch-none select-none rounded-xl outline-none",
        collapsedBehind && "overflow-hidden",
        fromBottom ? "bottom-0 origin-bottom" : "top-0 origin-top",
        "transition-[transform,opacity,height] duration-400 motion-reduce:transition-opacity",
        "data-[swiping=true]:transition-none",
        "focus-visible:[&>div]:ring-2 focus-visible:[&>div]:ring-ring/60",
      )}
      style={{
        zIndex: 100 - slot,
        transform: `${transform} translate(var(--swipe-x, 0px), var(--swipe-y, 0px))`,
        opacity: !mounted || leaving || hiddenBehind ? 0 : 1,
        height: collapsedBehind ? frontHeight : undefined,
        pointerEvents: hiddenBehind || leaving ? "none" : undefined,
        transitionTimingFunction: STACK_EASE,
      }}
    >
      <div
        ref={contentRef}
        className={cn(
          "relative flex w-full items-start overflow-hidden rounded-xl border",
          toneStyles[tone],
          s.card,
        )}
      >
        <div
          className={cn(
            "flex w-full items-start gap-3 transition-opacity duration-200",
            collapsedBehind ? "opacity-0" : "opacity-100",
          )}
        >
          {icon && (
            <span
              key={record.variant}
              className="mt-px flex size-5 shrink-0 items-center justify-center transition-[opacity,scale] duration-300 starting:scale-75 starting:opacity-0 motion-reduce:transition-none [&>svg]:size-4.5"
            >
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className={cn("font-medium leading-5", s.title)}>{record.title}</div>
            {record.description && <div className="mt-0.5 text-sm leading-5 text-muted-foreground">{record.description}</div>}
          </div>
          {(record.action || record.cancel) && (
            <div className="flex shrink-0 items-center gap-1.5 self-center">
              {record.cancel && (
                <button
                  type="button"
                  onClick={() => {
                    record.cancel?.onClick?.();
                    dismiss(record.id);
                  }}
                  className="inline-flex h-7 cursor-pointer items-center rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  {record.cancel.label}
                </button>
              )}
              {record.action && (
                <button
                  type="button"
                  onClick={() => {
                    record.action?.onClick();
                    dismiss(record.id);
                  }}
                  className="inline-flex h-7 cursor-pointer items-center rounded-md bg-foreground px-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  {record.action.label}
                </button>
              )}
            </div>
          )}
          {closeButton && dismissible && (
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismiss(record.id)}
              className="-me-1 -mt-1 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover/notice:opacity-100 group-focus-within/notice:opacity-100 hover:bg-foreground/5 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&>svg]:size-3.5"
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
