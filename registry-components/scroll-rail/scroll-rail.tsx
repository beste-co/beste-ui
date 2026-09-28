"use client";

import { cn } from "@/lib/utils";
import { Children, type ReactNode, useEffect, useRef, useState } from "react";

/** Anything with a `get()` that returns 0 to 1, such as a framer-motion MotionValue, so scroll can drive the rail without re-rendering. */
export interface ScrollRailProgressSource {
  get(): number;
}

export interface ScrollRailProps {
  /** The panels along the rail, in order. Each child is one panel and sets its own width. Inside a panel, `data-rail-depth="0.3"` makes an element drift against the travel and `data-rail-focus="0.35"` dims it until its panel reaches the middle. */
  children?: ReactNode;
  /** Space between panels in pixels; narrow screens use less. */
  gap?: number;
  /** Where panels sit vertically inside the rail. */
  align?: "start" | "center" | "end" | "stretch";
  /** Travel along the rail from start (0) to end (1): a number or a live source such as a scroll MotionValue. */
  progress?: number | ScrollRailProgressSource;
  /** Drift slowly along the rail and back on its own. Defaults to on when no progress is given. */
  autoplay?: boolean;
  /** Pace of the autoplay drift. */
  speed?: number;
  /** How softly the rail follows its progress, 0 (instant) to 1 (very soft). */
  smoothing?: number;
  /** Stop the rail where it is. */
  paused?: boolean;
  className?: string;
}

export const scrollRailDemo: ScrollRailProps = {
  gap: 48,
  align: "center",
  autoplay: true,
  speed: 1,
  smoothing: 0.5,
  className: "min-h-[32rem]",
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (x: number) => x * x * (3 - 2 * x);
const DRIFT_SECONDS = 36;

const demoPanels = [
  { n: "01", title: "Listen first", text: "Every project opens with a week of questions and no drawings at all." },
  { n: "02", title: "Draw by hand", text: "Early ideas stay on paper, where they are cheap to change." },
  { n: "03", title: "Build a model", text: "Card and timber models tell the truth about light and scale." },
  { n: "04", title: "Make it real", text: "The same small team stays with the work until the keys are handed over." },
  { n: "05", title: "Come back", text: "A visit a year later, to see how the place is being lived in." },
];

export function ScrollRail({
  children,
  gap = 48,
  align = "center",
  progress,
  autoplay,
  speed = 1,
  smoothing = 0.5,
  paused = false,
  className,
}: ScrollRailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const loop = autoplay ?? progress === undefined;
  const settings = useRef({ gap, progress, loop, speed, smoothing, paused });
  settings.current = { gap, progress, loop, speed, smoothing, paused };

  const panels =
    Children.count(children) > 0
      ? Children.toArray(children)
      : demoPanels.map((panel) => (
          <div key={panel.n} className="flex w-[78vw] max-w-sm flex-col border-t pt-6 md:w-[26rem]">
            <span data-rail-depth="0.25" className="text-7xl font-semibold tracking-[-0.05em] text-muted-foreground/40">
              {panel.n}
            </span>
            <h3 data-rail-focus="0.4" className="mt-10 text-3xl font-semibold tracking-[-0.03em]">
              {panel.title}
            </h3>
            <p data-rail-focus="0.4" className="mt-3 text-lg leading-relaxed text-muted-foreground">
              {panel.text}
            </p>
          </div>
        ));
  const count = panels.length;

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduce);

    let holders: HTMLElement[] = [];
    let left = new Float32Array(0);
    let widths = new Float32Array(0);
    let depthEls: HTMLElement[] = [];
    let depthOf = new Float32Array(0);
    let depthPanel = new Int16Array(0);
    let focusEls: HTMLElement[] = [];
    let focusMin = new Float32Array(0);
    let focusPanel = new Int16Array(0);
    let viewW = 0;
    let travel = 0;
    let current = -1;
    let written = -1;
    let phase = 0;
    let last = 0;
    let frame = 0;
    let visible = true;
    let dirty = true;

    const measure = () => {
      const w = root.clientWidth;
      if (!w) return;
      viewW = w;
      const edge = Math.round(Math.max(16, Math.min(96, w * 0.06)));
      const space = Math.round(Math.min(Math.max(0, settings.current.gap), w * 0.1));
      track.style.paddingLeft = `${edge}px`;
      track.style.paddingRight = `${edge}px`;
      track.style.gap = `${space}px`;
      holders = Array.from(track.children) as HTMLElement[];
      left = new Float32Array(holders.length);
      widths = new Float32Array(holders.length);
      const depth: HTMLElement[] = [];
      const depthK: number[] = [];
      const depthP: number[] = [];
      const focus: HTMLElement[] = [];
      const focusK: number[] = [];
      const focusP: number[] = [];
      holders.forEach((holder, i) => {
        left[i] = holder.offsetLeft;
        widths[i] = holder.offsetWidth;
        holder.querySelectorAll<HTMLElement>("[data-rail-depth]").forEach((el) => {
          depth.push(el);
          depthK.push(Number(el.dataset.railDepth) || 0);
          depthP.push(i);
        });
        holder.querySelectorAll<HTMLElement>("[data-rail-focus]").forEach((el) => {
          focus.push(el);
          focusK.push(clamp01(Number(el.dataset.railFocus) || 0));
          focusP.push(i);
        });
      });
      depthEls = depth;
      depthOf = Float32Array.from(depthK);
      depthPanel = Int16Array.from(depthP);
      focusEls = focus;
      focusMin = Float32Array.from(focusK);
      focusPanel = Int16Array.from(focusP);
      travel = Math.max(0, track.scrollWidth - w);
      dirty = true;
      setReady(true);
    };
    measureRef.current = measure;

    const target = () => {
      const s = settings.current;
      if (s.loop) return 0.5 - 0.5 * Math.cos(phase);
      const source = s.progress;
      if (typeof source === "number") return clamp01(source);
      return clamp01(source?.get() ?? 0);
    };

    const offsetOf = (i: number, x: number) => {
      const pw = widths[i] ?? 0;
      const center = (left[i] ?? 0) + pw / 2 + x;
      const reach = viewW / 2 + pw / 2;
      return reach > 0 ? Math.max(-1, Math.min(1, (center - viewW / 2) / reach)) : 0;
    };

    const write = () => {
      const dpr = window.devicePixelRatio || 1;
      const x = Math.round(-current * travel * dpr) / dpr;
      track.style.transform = `translate3d(${x}px,0,0)`;
      for (let j = 0; j < depthEls.length; j++) {
        const i = depthPanel[j] ?? 0;
        const shift = Math.round(-offsetOf(i, x) * (widths[i] ?? 0) * 0.5 * (depthOf[j] ?? 0) * dpr) / dpr;
        const el = depthEls[j];
        if (el) el.style.transform = `translate3d(${shift}px,0,0)`;
      }
      for (let j = 0; j < focusEls.length; j++) {
        const i = focusPanel[j] ?? 0;
        const near = smooth(clamp01(1 - Math.abs(offsetOf(i, x)) * 1.6));
        const min = focusMin[j] ?? 0;
        const el = focusEls[j];
        if (el) el.style.opacity = (min + (1 - min) * near).toFixed(3);
      }
      written = current;
      dirty = false;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const s = settings.current;
      if (s.loop && !s.paused) phase += (dt * Math.max(0, s.speed) * Math.PI * 2) / DRIFT_SECONDS;
      const goal = target();
      const rate = 4 + (1 - clamp01(s.smoothing)) * 22;
      if (current < 0) current = goal;
      else if (!s.paused) current += (goal - current) * (1 - Math.exp(-dt * rate));
      if (dirty || Math.abs(current - written) * travel > 0.05) write();
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduce && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(track);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", onVisibility);
    measure();
    if (!reduce) {
      current = target();
      write();
    }
    play();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      measureRef.current = () => {};
    };
  }, [count]);

  useEffect(() => {
    measureRef.current();
  }, [gap]);

  const alignClass = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  }[align];

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative isolate w-full",
        reduced ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden",
        className,
      )}
    >
      <div
        ref={trackRef}
        className={cn(
          "absolute inset-y-0 left-0 flex w-max transition-opacity duration-700",
          alignClass,
          !reduced && "will-change-transform",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        {panels.map((panel, i) => (
          <div key={i} className="relative flex shrink-0 [&>*]:shrink-0">
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
