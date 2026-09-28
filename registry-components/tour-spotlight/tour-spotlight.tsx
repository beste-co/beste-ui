"use client";

import { Bell, Plus, Search, Settings } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/** Surface of the step card. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Card size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

/** Which side of the target the card prefers. It flips when that side has no room. */
export type TourSide = "top" | "right" | "bottom" | "left";

export interface TourStep {
  /** A CSS selector (searched inside the component when `contained`) or a ref to the element. */
  target: string | React.RefObject<HTMLElement | null>;
  title: string;
  body?: React.ReactNode;
  /** Preferred side for the card. Defaults to `bottom`. */
  side?: TourSide;
  /** Room left around the target inside the cutout, in px. Defaults to 8. */
  padding?: number;
  /** Corner radius of the cutout, in px. Defaults to 12. */
  radius?: number;
}

export interface TourSpotlightLabels {
  back?: string;
  next?: string;
  skip?: string;
  finish?: string;
  /** How the step count reads, e.g. "Step 2 of 5". */
  stepOf?: (step: number, total: number) => string;
}

export interface TourSpotlightProps {
  steps: TourStep[];
  /** Whether the tour is showing. Pair with `onOpenChange` to control it. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Milliseconds to wait before a tour that is open on load first shows, so the page can settle. @defaultValue 3000 */
  openDelay?: number;
  /** The current step, zero based. Pair with `onStepChange` to control it. */
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  /** Fired when the reader presses the last step's finish button. */
  onFinish?: () => void;
  /** Fired when the reader skips, presses Escape or clicks the dimmed area (with `closeOnOverlayClick`). */
  onSkip?: () => void;
  /** Dim only this component's own box instead of the whole viewport, for tours inside a panel or preview. */
  contained?: boolean;
  /** Let clicks through the cutout to the highlighted element. */
  allowTargetClick?: boolean;
  /** Clicking the dimmed area skips the tour. */
  closeOnOverlayClick?: boolean;
  /** A soft ring pulses around the cutout. */
  ring?: boolean;
  /** How dark the dimmed area is, 0 to 1. */
  dim?: number;
  /** When set, a button with this label starts the tour again while it is closed. */
  launcherLabel?: string;
  labels?: TourSpotlightLabels;
  tone?: Tone;
  size?: Size;
  className?: string;
  /** The interface being toured. Selectors in `steps` are searched here when `contained`. */
  children?: React.ReactNode;
}

const toneStyles: Record<Tone, string> = {
  muted: "border-transparent bg-muted text-foreground",
  outline: "border-border bg-background text-foreground",
  ghost: "border-transparent bg-popover text-popover-foreground",
};

const sizeStyles: Record<Size, { card: string; title: string; body: string; button: string }> = {
  sm: { card: "w-72 p-4 gap-3", title: "text-sm", body: "text-sm", button: "h-8 px-3 text-sm" },
  default: { card: "w-80 p-5 gap-4", title: "text-base", body: "text-sm", button: "h-9 px-3.5 text-sm" },
  lg: { card: "w-96 p-6 gap-5", title: "text-lg", body: "text-base", button: "h-10 px-4 text-base" },
};

// Same spring as inspector-slider: overshoots a hair, then settles, with no animation library
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

// The cutout and the card travel on a soft ease-out; the spring's overshoot read as a wobble at this size
const GLIDE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const GAP = 14;
const MARGIN = 12;
const EXIT_MS = 220;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const OPPOSITE: Record<TourSide, TourSide> = { top: "bottom", bottom: "top", left: "right", right: "left" };

/** Places a card of size `w`×`h` beside `target` inside `bw`×`bh`, flipping to the side with room. */
export function placeCard(target: Box | null, w: number, h: number, bw: number, bh: number, side: TourSide = "bottom") {
  if (!target) return { x: (bw - w) / 2, y: (bh - h) / 2, side };
  const at = (s: TourSide) => {
    const cx = target.x + target.w / 2 - w / 2;
    const cy = target.y + target.h / 2 - h / 2;
    if (s === "top") return { x: cx, y: target.y - GAP - h };
    if (s === "bottom") return { x: cx, y: target.y + target.h + GAP };
    if (s === "left") return { x: target.x - GAP - w, y: cy };
    return { x: target.x + target.w + GAP, y: cy };
  };
  const fits = (s: TourSide, p: { x: number; y: number }) =>
    s === "top" ? p.y >= MARGIN : s === "bottom" ? p.y + h <= bh - MARGIN : s === "left" ? p.x >= MARGIN : p.x + w <= bw - MARGIN;
  const room: Record<TourSide, number> = {
    top: target.y,
    bottom: bh - target.y - target.h,
    left: target.x,
    right: bw - target.x - target.w,
  };
  const rest = (["bottom", "top", "right", "left"] as TourSide[]).filter((s) => s !== side && s !== OPPOSITE[side]);
  let chosen = [side, OPPOSITE[side], ...rest].find((s) => fits(s, at(s)));
  chosen ??= (Object.keys(room) as TourSide[]).reduce((a, b) => (room[b] > room[a] ? b : a));
  const p = at(chosen);
  return {
    x: Math.min(Math.max(p.x, MARGIN), Math.max(MARGIN, bw - w - MARGIN)),
    y: Math.min(Math.max(p.y, MARGIN), Math.max(MARGIN, bh - h - MARGIN)),
    side: chosen,
  };
}

function useControllable<T>(value: T | undefined, fallback: T, onChange?: (next: T) => void) {
  const [inner, setInner] = React.useState(fallback);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set] as const;
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function isTyping(el: Element | null) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (el as HTMLElement).isContentEditable;
}

function DemoApp() {
  return (
    <div className="flex h-full min-h-[26rem] w-full flex-col bg-background text-foreground">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <span className="select-none text-sm font-semibold">Setlist</span>
        <div data-tour="search" className="ml-2 flex h-9 flex-1 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground">
          <Search className="size-4" />
          <span className="select-none">Search songs and venues</span>
        </div>
        <button type="button" data-tour="alerts" aria-label="Notifications" className="grid size-9 cursor-pointer place-items-center rounded-md border">
          <Bell className="size-4" />
        </button>
        <button type="button" aria-label="Settings" className="grid size-9 cursor-pointer place-items-center rounded-md border">
          <Settings className="size-4" />
        </button>
      </div>
      <div className="grid flex-1 gap-3 p-4 sm:grid-cols-[1fr_12rem]">
        <div data-tour="list" className="flex flex-col gap-2">
          {[
            ["Hounds of Love", "3:02"],
            ["Running Up That Hill", "4:58"],
            ["Cloudbusting", "5:10"],
            ["Wuthering Heights", "4:28"],
          ].map(([song, length]) => (
            <div key={song} className="flex items-center justify-between rounded-md border px-3 py-2.5 text-sm">
              <span className="select-none">{song}</span>
              <span className="select-none text-muted-foreground tabular-nums">{length}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            data-tour="add"
            className="flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm text-primary-foreground"
          >
            <Plus className="size-4" />
            New setlist
          </button>
          <div className="select-none rounded-md border p-3 text-sm text-muted-foreground">Kate Bush, Hammersmith Odeon, 12 songs</div>
        </div>
      </div>
    </div>
  );
}

export const tourSpotlightDemo: TourSpotlightProps = {
  steps: [
    {
      target: '[data-tour="search"]',
      title: "Find anything",
      body: "Search every song, venue and setlist you have ever played. Try a lyric if you forget a title.",
      side: "bottom",
    },
    { target: '[data-tour="list"]', title: "Tonight's set", body: "Drag songs to reorder the set. Timings update as you go.", side: "right" },
    { target: '[data-tour="add"]', title: "Start a new one", body: "Every tour gets its own setlist, copied from the last one by default.", side: "left" },
    { target: '[data-tour="alerts"]', title: "Stay in the loop", body: "Your band sees changes here the moment you make them.", side: "bottom", radius: 10 },
  ],
  contained: true,
  defaultOpen: true,
  launcherLabel: "Replay the tour",
  children: <DemoApp />,
  className: "w-full max-w-3xl overflow-hidden rounded-lg border",
};

export function TourSpotlight({
  steps,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  openDelay = 3000,
  step: stepProp,
  defaultStep = 0,
  onStepChange,
  onFinish,
  onSkip,
  contained = false,
  allowTargetClick = false,
  closeOnOverlayClick = false,
  ring = true,
  dim = 0.55,
  launcherLabel,
  labels,
  tone = "ghost",
  size = "default",
  className,
  children,
}: TourSpotlightProps) {
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const [rawStep, setStep] = useControllable(stepProp, defaultStep, onStepChange);
  const total = steps.length;
  const index = Math.min(Math.max(rawStep, 0), Math.max(0, total - 1));
  const current = steps[index];
  // A tour open on load waits for the page to settle, so its first target is measured where it ends up
  const [settled, setSettled] = React.useState(() => openDelay <= 0 || !(openProp ?? defaultOpen));
  React.useEffect(() => {
    if (settled) return;
    const timer = window.setTimeout(() => setSettled(true), openDelay);
    return () => window.clearTimeout(timer);
  }, [settled, openDelay]);
  const showing = open && total > 0 && settled;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const holeRef = React.useRef<HTMLDivElement>(null);
  const blockerRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const primaryRef = React.useRef<HTMLButtonElement>(null);
  const returnFocus = React.useRef<HTMLElement | null>(null);
  const frame = React.useRef(0);
  // Moves between steps travel on the spring; scrolling and resizing track the target directly
  const springUntil = React.useRef(0);

  const [mounted, setMounted] = React.useState(false);
  const [present, setPresent] = React.useState(showing);
  const [reduce, setReduce] = React.useState(false);
  // A tour that opens by itself on load neither scrolls the page nor takes focus for its first step
  const autoOpened = React.useRef(openProp === undefined ? defaultOpen : openProp);
  const titleId = React.useId();
  const bodyId = React.useId();

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Stays mounted a moment after closing so the overlay can fade out
  React.useEffect(() => {
    if (showing) return setPresent(true);
    const timer = window.setTimeout(() => setPresent(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [showing]);

  const resolve = React.useCallback(
    (item: TourStep | undefined): HTMLElement | null => {
      if (!item) return null;
      if (typeof item.target !== "string") return item.target.current;
      const scope: ParentNode = contained && rootRef.current ? rootRef.current : document;
      return scope.querySelector<HTMLElement>(item.target);
    },
    [contained],
  );

  // Everything that follows the target is written straight to styles, so scrolling costs no renders
  const measure = React.useCallback(() => {
    const overlay = overlayRef.current;
    const hole = holeRef.current;
    const card = cardRef.current;
    if (!overlay || !hole || !card) return;
    const bounds = overlay.getBoundingClientRect();
    const el = resolve(current);
    let box: Box | null = null;
    if (el) {
      const r = el.getBoundingClientRect();
      const pad = current?.padding ?? 8;
      box = { x: r.left - bounds.left - pad, y: r.top - bounds.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 };
    }
    const target = box ?? { x: bounds.width / 2, y: bounds.height / 2, w: 0, h: 0 };
    const glide = performance.now() < springUntil.current ? "true" : "false";
    if (hole.dataset.instant !== "true") hole.dataset.glide = glide;
    if (card.dataset.instant !== "true") card.dataset.glide = glide;
    hole.style.setProperty("--tour-x", `${target.x}px`);
    hole.style.setProperty("--tour-y", `${target.y}px`);
    hole.style.setProperty("--tour-w", `${target.w}px`);
    hole.style.setProperty("--tour-h", `${target.h}px`);
    hole.style.setProperty("--tour-r", `${box ? (current?.radius ?? 12) : 0}px`);
    hole.dataset.empty = box ? "false" : "true";

    const blocker = blockerRef.current;
    if (blocker) {
      const W = bounds.width;
      const H = bounds.height;
      blocker.style.clipPath =
        allowTargetClick && box
          ? `polygon(evenodd, 0 0, ${W}px 0, ${W}px ${H}px, 0 ${H}px, 0 0, ${box.x}px ${box.y}px, ${box.x + box.w}px ${box.y}px, ${box.x + box.w}px ${box.y + box.h}px, ${box.x}px ${box.y + box.h}px, ${box.x}px ${box.y}px)`
          : "";
    }

    const placed = placeCard(box, card.offsetWidth, card.offsetHeight, bounds.width, bounds.height, current?.side ?? "bottom");
    card.style.setProperty("--tour-cx", `${placed.x}px`);
    card.style.setProperty("--tour-cy", `${placed.y}px`);
    card.dataset.side = placed.side;
  }, [current, resolve, allowTargetClick]);

  const measureRef = React.useRef(measure);
  measureRef.current = measure;
  const schedule = React.useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => measureRef.current());
  }, []);
  const targetKey = current?.target;

  // The first placement lands without a transition; later ones travel on the spring
  React.useLayoutEffect(() => {
    if (!present) return;
    const hole = holeRef.current;
    const card = cardRef.current;
    if (!hole || !card) return;
    hole.dataset.instant = "true";
    card.dataset.instant = "true";
    measureRef.current();
    const id = requestAnimationFrame(() => {
      hole.dataset.instant = "false";
      card.dataset.instant = "false";
    });
    return () => cancelAnimationFrame(id);
  }, [present]);

  React.useEffect(() => {
    springUntil.current = performance.now() + 900;
  }, [index]);

  // Follow the target through scrolling, resizing and layout changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-subscribes when the target changes, not when a new steps array arrives
  React.useEffect(() => {
    if (!present) return;
    const el = resolve(current);
    const ro = new ResizeObserver(schedule);
    measureRef.current();
    if (el) ro.observe(el);
    if (overlayRef.current) ro.observe(overlayRef.current);
    if (cardRef.current) ro.observe(cardRef.current);
    window.addEventListener("scroll", schedule, { capture: true, passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame.current);
    };
  }, [present, index, targetKey, resolve, schedule]);

  // Bring the target into view when it is not fully on screen
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs per step, not per new steps array
  React.useEffect(() => {
    if (!showing) return;
    if (autoOpened.current && index === 0) return;
    const el = resolve(current);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const inView = r.top >= 0 && r.left >= 0 && r.bottom <= window.innerHeight && r.right <= window.innerWidth;
    if (!inView) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center", inline: "nearest" });
  }, [showing, index, targetKey, resolve, reduce]);

  // Focus moves into the card on open and goes back where it came from on close
  React.useEffect(() => {
    if (!showing) return;
    if (autoOpened.current) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const id = requestAnimationFrame(() => primaryRef.current?.focus({ preventScroll: true }));
    return () => {
      cancelAnimationFrame(id);
      const back = returnFocus.current;
      if (back?.isConnected) back.focus({ preventScroll: true });
    };
  }, [showing]);

  const close = React.useCallback(() => {
    autoOpened.current = false;
    setOpen(false);
  }, [setOpen]);
  const skip = React.useCallback(() => {
    onSkip?.();
    close();
  }, [onSkip, close]);
  const next = React.useCallback(() => {
    autoOpened.current = false;
    if (index >= total - 1) {
      onFinish?.();
      close();
    } else setStep(index + 1);
  }, [index, total, onFinish, close, setStep]);
  const back = React.useCallback(() => {
    autoOpened.current = false;
    if (index > 0) setStep(index - 1);
  }, [index, setStep]);

  React.useEffect(() => {
    if (!showing) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      // A contained tour only answers keys pressed inside it, so the rest of the page keeps its arrows
      if (contained && !rootRef.current?.contains(document.activeElement)) return;
      if (event.key === "Escape") {
        event.preventDefault();
        skip();
      } else if (event.key === "ArrowRight" && !isTyping(document.activeElement)) {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft" && !isTyping(document.activeElement)) {
        event.preventDefault();
        back();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showing, skip, next, back, contained]);

  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const start = () => {
    autoOpened.current = false;
    setStep(0);
    setOpen(true);
  };

  const s = sizeStyles[size];
  const text = {
    back: labels?.back ?? "Back",
    next: labels?.next ?? "Next",
    skip: labels?.skip ?? "Skip",
    finish: labels?.finish ?? "Done",
    stepOf: labels?.stepOf ?? ((n: number, t: number) => `Step ${n} of ${t}`),
  };
  const last = index >= total - 1;
  const transition = { transitionTimingFunction: SPRING_EASE };
  const glide = { transitionTimingFunction: GLIDE_EASE };

  const overlay = present ? (
    <div
      ref={overlayRef}
      data-state={showing ? "open" : "closed"}
      className={cn(
        "inset-0 z-50 transition-opacity duration-300 motion-safe:starting:opacity-0 data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0",
        contained ? "absolute overflow-hidden" : "fixed",
      )}
      style={{ "--tour-dim": String(Math.min(1, Math.max(0, dim))) } as React.CSSProperties}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: the dimmed area only swallows clicks; Escape and the card cover the keyboard */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: the dimmed area only swallows clicks; Escape and the card cover the keyboard */}
      <div ref={blockerRef} aria-hidden="true" className="absolute inset-0" onClick={closeOnOverlayClick ? skip : undefined} />
      <div
        ref={holeRef}
        aria-hidden="true"
        data-instant="true"
        className={cn(
          "pointer-events-none absolute top-0 left-0 h-(--tour-h) w-(--tour-w) translate-x-(--tour-x) translate-y-(--tour-y) rounded-(--tour-r) shadow-[0_0_0_200vmax_rgb(0_0_0/var(--tour-dim))]",
          "motion-safe:data-[glide=true]:transition-[translate,width,height,border-radius] motion-safe:duration-700 data-[instant=true]:transition-none",
        )}
        style={glide}
      >
        {ring && (
          <span className="absolute -inset-0.5 rounded-[inherit] ring-2 ring-primary/70 in-data-[empty=true]:hidden motion-safe:animate-pulse" />
        )}
      </div>
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={current?.body ? bodyId : undefined}
        data-instant="true"
        onKeyDown={trapFocus}
        className={cn(
          "absolute top-0 left-0 translate-x-(--tour-cx) translate-y-(--tour-cy) outline-none",
          "motion-safe:data-[glide=true]:transition-[translate] motion-safe:duration-700 data-[instant=true]:transition-none",
        )}
        style={glide}
      >
        {/* The outer box only travels; this one draws the card and settles in when the tour opens */}
        <div
          className={cn(
            "flex flex-col rounded-2xl border shadow-2xl shadow-black/15 transition-[opacity,scale] duration-500 motion-safe:starting:scale-95 starting:opacity-0",
            toneStyles[tone],
            s.card,
          )}
          style={glide}
        >
        <div className="flex items-center justify-between gap-3">
          <p className="select-none text-sm text-muted-foreground tabular-nums">{text.stepOf(index + 1, total)}</p>
          <div className="flex items-center gap-1">
            {steps.map((item, i) => (
              <button
                key={`${item.title}-${i}`}
                type="button"
                aria-label={`Go to step ${i + 1}: ${item.title}`}
                aria-current={i === index ? "step" : undefined}
                onClick={() => setStep(i)}
                className="group/dot grid size-4 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full bg-foreground/20 transition-[width,background-color] duration-500 group-hover/dot:bg-foreground/45",
                    i === index ? "w-4 bg-foreground" : "w-1.5",
                  )}
                  style={transition}
                />
              </button>
            ))}
          </div>
        </div>
        <div
          key={index}
          className="flex flex-col gap-1.5 transition-[opacity,translate,filter] duration-500 motion-safe:starting:translate-y-1.5 motion-safe:starting:blur-[3px] starting:opacity-0"
          style={glide}
        >
          <h2 id={titleId} className={cn("select-none font-semibold leading-snug", s.title)}>
            {current?.title}
          </h2>
          {current?.body && (
            <div id={bodyId} className={cn("text-muted-foreground leading-relaxed", s.body)}>
              {current.body}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
          {!last && (
            <button
              type="button"
              onClick={skip}
              className={cn("-ml-2 shrink-0 cursor-pointer select-none whitespace-nowrap rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring", s.button)}
            >
              {text.skip}
            </button>
          )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
          {index > 0 && (
            <button
              type="button"
              onClick={back}
              className={cn("shrink-0 cursor-pointer select-none whitespace-nowrap rounded-lg border bg-background transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring", s.button)}
            >
              {text.back}
            </button>
          )}
          <button
            ref={primaryRef}
            type="button"
            onClick={next}
            className={cn(
              "shrink-0 cursor-pointer select-none whitespace-nowrap rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              s.button,
            )}
          >
            {last ? text.finish : text.next}
          </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {children}
      {launcherLabel && !showing && settled && total > 0 && (
        <button
          type="button"
          onClick={start}
          className={cn(
            "z-10 cursor-pointer select-none rounded-full border bg-background shadow-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring",
            contained && "absolute right-4 bottom-4",
            s.button,
          )}
        >
          {launcherLabel}
        </button>
      )}
      {contained ? overlay : mounted && overlay ? createPortal(overlay, document.body) : null}
    </div>
  );
}
