"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface behind the dots. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Dot size preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

type Orientation = "horizontal" | "vertical";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border bg-background",
  ghost: "border border-transparent",
};

// Dot, stretched pill and gap as custom properties, so the window maths lives in CSS
const sizeStyles: Record<Size, string> = {
  sm: "p-1.5 [--pager-dot:6px] [--pager-pill:20px] [--pager-gap:6px]",
  default: "p-2 [--pager-dot:8px] [--pager-pill:28px] [--pager-gap:8px]",
  lg: "p-2.5 [--pager-dot:10px] [--pager-pill:36px] [--pager-gap:10px]",
};

/** The inspector family's spring, so the pill stretches without an animation library. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

export interface PagerDotsProps {
  /** Number of pages. */
  count: number;
  /** The active page, zero-based. Pair with `onValueChange` to control it. */
  value?: number;
  /**
   * The page shown first when uncontrolled.
   * @defaultValue 0 */
  defaultValue?: number;
  /** Called with the new page whenever it changes: a click, a key, or autoplay advancing. */
  onValueChange?: (value: number) => void;
  /** Milliseconds each page stays before autoplay moves on. Leave it out for a plain indicator. */
  duration?: number;
  /** Whether autoplay runs. Pair with `duration`; hover, focus, a hidden tab and scrolling away still pause it. */
  playing?: boolean;
  /**
   * Whether autoplay starts running when uncontrolled. Reduced motion starts it paused.
   * @defaultValue true */
  defaultPlaying?: boolean;
  /** Called when a page's timer runs out, just before autoplay moves on. */
  onCycleEnd?: (value: number) => void;
  /**
   * Autoplay wraps from the last page to the first. Off, it stops on the last page.
   * @defaultValue true */
  loop?: boolean;
  /**
   * Most dots on screen at once. Longer sets slide a window along and shrink the dots at its edges.
   * @defaultValue 7 */
  visible?: number;
  /** @defaultValue "horizontal" */
  orientation?: Orientation;
  /** Accessible name of each dot. Defaults to "Slide 3 of 12". */
  getLabel?: (index: number, count: number) => string;
  /** Id of the panel each dot shows, for `aria-controls`. */
  getControls?: (index: number) => string | undefined;
  /**
   * Surface behind the dots: filled, hairline outline, or bare for use over a photo.
   * @defaultValue "muted" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  disabled?: boolean;
  /**
   * Accessible name for the set of dots.
   * @defaultValue "Slides" */
  "aria-label"?: string;
  className?: string;
}

export const pagerDotsDemo: PagerDotsProps = {
  count: 12,
  defaultValue: 0,
  duration: 4000,
  visible: 7,
  "aria-label": "Tour photos",
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Keeps the active dot off the window's edges, moving the window only when it has to. */
function nextStart(start: number, active: number, count: number, visible: number) {
  if (count <= visible) return 0;
  let next = clamp(start, 0, count - visible);
  if (active < next + 1) next = active - 1;
  if (active > next + visible - 2) next = active - visible + 2;
  return clamp(next, 0, count - visible);
}

/**
 * Slide dots where the active one stretches into a pill. With `duration` the pill fills
 * as its page plays, pausing under the pointer, on focus, on a hidden tab and offscreen.
 */
export function PagerDots({
  count,
  value,
  defaultValue = 0,
  onValueChange,
  duration,
  playing,
  defaultPlaying = true,
  onCycleEnd,
  loop = true,
  visible = 7,
  orientation = "horizontal",
  getLabel = (index, total) => `Slide ${index + 1} of ${total}`,
  getControls,
  tone = "muted",
  size = "default",
  disabled = false,
  "aria-label": ariaLabel = "Slides",
  className,
}: PagerDotsProps) {
  const total = Math.max(0, Math.floor(count));
  const windowSize = Math.max(3, Math.floor(visible));
  const [inner, setInner] = React.useState(() => clamp(defaultValue, 0, Math.max(0, total - 1)));
  const active = clamp(value ?? inner, 0, Math.max(0, total - 1));
  const vertical = orientation === "vertical";

  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // The window position is derived state: adjusted during render, only when the active dot nears an edge
  const [start, setStart] = React.useState(() => nextStart(0, active, total, windowSize));
  const settledStart = nextStart(start, active, total, windowSize);
  if (settledStart !== start) setStart(settledStart);
  const windowed = total > windowSize;

  const select = React.useCallback(
    (next: number) => {
      if (next === active) return;
      if (value === undefined) setInner(next);
      onValueChange?.(next);
    },
    [active, value, onValueChange],
  );

  // Latest values for the timer's finish handler, which outlives renders
  const latest = React.useRef({ active, total, loop, select, onCycleEnd });
  latest.current = { active, total, loop, select, onCycleEnd };

  const rootRef = React.useRef<HTMLDivElement>(null);
  const dotRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const fillRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const animRef = React.useRef<Animation | null>(null);
  const holds = React.useRef({ hover: false, focus: false, hidden: false, offscreen: false });

  const autoplay = typeof duration === "number" && duration > 0 && total > 1 && !disabled;
  const running = autoplay && (playing ?? (defaultPlaying && !reduce));

  const runningRef = React.useRef(running);
  runningRef.current = running;
  // Pausing never restarts the fill: the animation is kept and only played or paused
  const sync = React.useCallback(() => {
    const anim = animRef.current;
    if (!anim) return;
    const h = holds.current;
    if (runningRef.current && !h.hover && !h.focus && !h.hidden && !h.offscreen) anim.play();
    else anim.pause();
  }, []);

  // One fill animation per page visit; the compositor runs it, React never re-renders for it
  React.useEffect(() => {
    animRef.current?.cancel();
    animRef.current = null;
    const fill = fillRefs.current[active];
    if (!autoplay || !fill || typeof fill.animate !== "function") return;
    const axis = vertical ? "scaleY" : "scaleX";
    const anim = fill.animate([{ transform: `${axis}(0)` }, { transform: `${axis}(1)` }], {
      duration,
      easing: "linear",
      fill: "forwards",
    });
    anim.pause();
    anim.onfinish = () => {
      const { active: current, total: pages, loop: wraps, select: go, onCycleEnd: ended } = latest.current;
      ended?.(current);
      if (current + 1 < pages) go(current + 1);
      else if (wraps) go(0);
    };
    animRef.current = anim;
    sync();
    return () => anim.cancel();
  }, [active, autoplay, duration, vertical, sync]);

  React.useEffect(() => {
    sync();
  }, [running, sync]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onVisibility = () => {
      holds.current.hidden = document.hidden;
      sync();
    };
    const io = new IntersectionObserver(([entry]) => {
      holds.current.offscreen = !(entry?.isIntersecting ?? true);
      sync();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sync]);

  const hold = (key: "hover" | "focus", on: boolean) => {
    holds.current[key] = on;
    sync();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || total === 0) return;
    const back = vertical ? "ArrowUp" : "ArrowLeft";
    const forward = vertical ? "ArrowDown" : "ArrowRight";
    let next: number | null = null;
    if (event.key === back) next = active === 0 ? total - 1 : active - 1;
    else if (event.key === forward) next = active === total - 1 ? 0 : active + 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = total - 1;
    if (next === null) return;
    event.preventDefault();
    select(next);
    dotRefs.current[next]?.focus();
  };

  if (total === 0) return null;

  const viewport = windowed
    ? { [vertical ? "height" : "width"]: `calc(${windowSize - 1} * (var(--pager-dot) + var(--pager-gap)) + var(--pager-pill))` }
    : undefined;
  const offset = windowed ? `calc(${-start} * (var(--pager-dot) + var(--pager-gap)))` : "0px";

  return (
    <div
      ref={rootRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      data-slot="pager-dots"
      data-disabled={disabled || undefined}
      onKeyDown={onKeyDown}
      onPointerEnter={() => hold("hover", true)}
      onPointerLeave={() => hold("hover", false)}
      // Only keyboard focus pauses; a click leaves the dot focused and must not stop autoplay for good
      onFocus={(event) => hold("focus", (event.target as HTMLElement).matches(":focus-visible"))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hold("focus", false);
      }}
      className={cn(
        "inline-flex w-fit select-none rounded-full text-foreground",
        vertical ? "flex-col" : "flex-row",
        toneStyles[tone],
        sizeStyles[size],
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <div className={cn("relative", vertical ? "w-(--pager-dot)" : "h-(--pager-dot)")} style={viewport}>
        <div
          className={cn(
            "flex gap-(--pager-gap) motion-safe:transition-transform motion-safe:duration-500",
            vertical ? "flex-col" : "flex-row",
          )}
          style={{
            transform: vertical ? `translateY(${offset})` : `translateX(${offset})`,
            transitionTimingFunction: SPRING_EASE,
          }}
        >
          {Array.from({ length: total }, (_, index) => {
            const current = index === active;
            const pos = index - start;
            const inside = !windowed || (pos >= 0 && pos < windowSize);
            const more = { before: windowed && start > 0, after: windowed && start + windowSize < total };
            // Dots at a window edge shrink when more pages wait beyond it
            let scale = inside ? 1 : 0;
            if (inside && ((pos === 0 && more.before) || (pos === windowSize - 1 && more.after))) scale = 0.5;
            else if (inside && ((pos === 1 && more.before) || (pos === windowSize - 2 && more.after))) scale = 0.75;
            return (
              <button
                key={index}
                ref={(node) => {
                  dotRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                aria-selected={current}
                aria-label={getLabel(index, total)}
                aria-controls={getControls?.(index)}
                tabIndex={current ? 0 : -1}
                disabled={disabled}
                data-active={current}
                data-autoplay={autoplay || undefined}
                onClick={() => select(index)}
                className={cn(
                  "group/dot relative shrink-0 cursor-pointer rounded-full outline-none",
                  "before:absolute before:content-['']",
                  vertical
                    ? "h-(--pager-dot) w-(--pager-dot) before:-inset-x-2 before:-inset-y-[calc(var(--pager-gap)/2)] data-[active=true]:h-(--pager-pill)"
                    : "h-(--pager-dot) w-(--pager-dot) before:-inset-x-[calc(var(--pager-gap)/2)] before:-inset-y-2 data-[active=true]:w-(--pager-pill)",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  "motion-safe:transition-[width,height,transform,opacity] motion-safe:duration-500",
                  !inside && "pointer-events-none",
                )}
                style={{ transform: `scale(${scale})`, opacity: inside ? 1 : 0, transitionTimingFunction: SPRING_EASE }}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 overflow-hidden rounded-full bg-current/30 transition-colors duration-200 group-hover/dot:bg-current/50",
                    current && !autoplay && "bg-current group-hover/dot:bg-current",
                  )}
                >
                  {current && autoplay && (
                    <span
                      ref={(node) => {
                        fillRefs.current[index] = node;
                      }}
                      className={cn("absolute inset-0 rounded-full bg-current", vertical ? "origin-top" : "origin-left")}
                      style={{ transform: vertical ? "scaleY(0)" : "scaleX(0)" }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
