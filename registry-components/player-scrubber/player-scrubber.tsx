"use client";

import { Pause, Play } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the track. */
type Tone = "muted" | "outline" | "ghost";

/** Height preset. */
type Size = "sm" | "default" | "lg";

export interface PlayerChapter {
  /** Start of the chapter, in seconds. It runs until the next chapter or the end. */
  start: number;
  title: string;
}

export interface PlayerScrubberProps {
  /** Length of the media, in seconds. */
  duration: number;
  /** Playhead position in seconds, controlled. */
  value?: number;
  /** Starting playhead position in seconds, uncontrolled. */
  defaultValue?: number;
  /** Every drag frame and every key press, with the new time in seconds. */
  onValueChange?: (seconds: number) => void;
  /** Once per gesture: on release, or after a key press. Seek the media here. */
  onValueCommit?: (seconds: number) => void;
  /** Loaded media: seconds from the start, or explicit `[start, end]` ranges. */
  buffered?: number | [number, number][];
  /** Chapters drawn as separate segments of the track. */
  chapters?: PlayerChapter[];
  /** Elapsed time on the left and remaining time on the right. */
  showTime?: boolean;
  /** The current chapter's title and its place in the list, above the track. */
  showChapter?: boolean;
  /** A play and pause button before the track. */
  showPlay?: boolean;
  /** Whether the playhead runs, controlled. With an uncontrolled value the scrubber keeps its own clock. */
  playing?: boolean;
  /** Whether it starts running, uncontrolled. */
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  /** Start over at the end instead of stopping. */
  loop?: boolean;
  /** Playback speed of the built-in clock, 1 is real time. */
  rate?: number;
  tone?: Tone;
  size?: Size;
  disabled?: boolean;
  /** Form name for the underlying range input. */
  name?: string;
  /** Accessible name. Defaults to "Seek". */
  "aria-label"?: string;
  className?: string;
}

export const playerScrubberDemo: PlayerScrubberProps = {
  duration: 242,
  defaultValue: 71,
  buffered: 150,
  chapters: [
    { start: 0, title: "Intro with Nils Frahm" },
    { start: 38, title: "Says" },
    { start: 121, title: "Hammers" },
    { start: 196, title: "Outro" },
  ],
  showTime: true,
  showChapter: true,
  showPlay: true,
  defaultPlaying: true,
  loop: true,
  className: "w-full max-w-xl",
};

/* -------------------------------------------------------------------------- */
/* Tuning                                                                     */
/* -------------------------------------------------------------------------- */

/** Seconds per arrow key, and with Shift held for fine seeking. */
const KEY_STEP = 5;
const FINE_STEP = 1;
/** Share of the duration per Page Up / Page Down. */
const PAGE_SHARE = 0.1;
/** How long a click or key jump animates, matching the duration utilities below. */
const JUMP_MS = 420;

/** The family's spring, sampled from a lightly under-damped spring. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const toneStyles: Record<Tone, { track: string; buffered: string; fill: string }> = {
  muted: { track: "bg-muted", buffered: "bg-muted-foreground/20", fill: "bg-foreground" },
  outline: { track: "bg-transparent ring-1 ring-inset ring-border", buffered: "bg-muted", fill: "bg-foreground" },
  ghost: {
    track: "bg-muted-foreground/10 group-data-[active=true]/player-scrubber:bg-muted",
    buffered: "bg-muted-foreground/15",
    fill: "bg-foreground/80 group-data-[active=true]/player-scrubber:bg-foreground",
  },
};

const sizeStyles: Record<Size, string> = {
  sm: "[--scrub-height:--spacing(6)] [--scrub-track:--spacing(1)] [--scrub-thumb:--spacing(3)] [--scrub-button:--spacing(8)]",
  default: "[--scrub-height:--spacing(8)] [--scrub-track:--spacing(1.5)] [--scrub-thumb:--spacing(3.5)] [--scrub-button:--spacing(10)]",
  lg: "[--scrub-height:--spacing(10)] [--scrub-track:--spacing(2)] [--scrub-thumb:--spacing(4)] [--scrub-button:--spacing(12)]",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function clamp(value: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, value));
}

/** `m:ss`, or `h:mm:ss` once the reference length reaches an hour. */
export function formatTime(seconds: number, reference = seconds) {
  const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return reference >= 3600 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

function toRanges(buffered: PlayerScrubberProps["buffered"], duration: number): [number, number][] {
  if (buffered === undefined) return [];
  if (typeof buffered === "number") return [[0, clamp(buffered, 0, duration)]];
  return buffered.map(([a, b]) => [clamp(a, 0, duration), clamp(b, 0, duration)] as [number, number]).filter(([a, b]) => b > a);
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function PlayerScrubber({
  duration,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  onValueCommit,
  buffered,
  chapters,
  showTime = false,
  showChapter = false,
  showPlay = false,
  playing: playingProp,
  defaultPlaying = false,
  onPlayingChange,
  loop = false,
  rate = 1,
  tone = "muted",
  size = "default",
  disabled = false,
  name,
  "aria-label": ariaLabel = "Seek",
  className,
}: PlayerScrubberProps) {
  const length = Math.max(duration, 0.001);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const bubbleRef = React.useRef<HTMLDivElement>(null);
  const bubbleTimeRef = React.useRef<HTMLSpanElement>(null);
  const bubbleTitleRef = React.useRef<HTMLSpanElement>(null);
  const elapsedRef = React.useRef<HTMLSpanElement>(null);
  const remainingRef = React.useRef<HTMLSpanElement>(null);
  const chapterTitleRef = React.useRef<HTMLSpanElement>(null);
  const chapterIndexRef = React.useRef<HTMLSpanElement>(null);
  const segmentRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const valueRef = React.useRef(clamp(valueProp ?? defaultValue, 0, length));
  const flagsRef = React.useRef({ hover: false, focus: false, dragging: false });
  const dragRef = React.useRef<{ pointerId: number } | null>(null);
  const jumpTimer = React.useRef<number>(0);
  const [playingInner, setPlayingInner] = React.useState(defaultPlaying);
  const playing = playingProp ?? playingInner;
  const callbacks = React.useRef({ onValueChange, onValueCommit, onPlayingChange });
  callbacks.current = { onValueChange, onValueCommit, onPlayingChange };
  const setPlaying = React.useCallback(
    (next: boolean) => {
      if (playingProp === undefined) setPlayingInner(next);
      callbacks.current.onPlayingChange?.(next);
    },
    [playingProp],
  );

  // Chapters as [start, end] seconds; no chapters is one segment over the whole track
  const segments = React.useMemo(() => {
    const sorted = [...(chapters ?? [])].filter((c) => c.start < length).sort((a, b) => a.start - b.start);
    if (sorted.length === 0) return [{ start: 0, end: length, title: "" }];
    return sorted.map((chapter, index) => ({
      start: index === 0 ? 0 : clamp(chapter.start, 0, length),
      end: clamp(sorted[index + 1]?.start ?? length, 0, length),
      title: chapter.title,
    }));
  }, [chapters, length]);
  const ranges = React.useMemo(() => toRanges(buffered, length), [buffered, length]);
  const chapterAt = React.useCallback(
    (seconds: number) => segments.find((s) => seconds >= s.start && seconds < s.end) ?? segments[segments.length - 1],
    [segments],
  );

  const writeState = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const { hover, focus, dragging } = flagsRef.current;
    root.dataset.active = String(hover || focus || dragging);
    root.dataset.dragging = String(dragging);
  }, []);

  // All visual state goes through CSS custom properties and refs, so seeking costs no renders
  const paint = React.useCallback(
    (seconds: number, jump = false) => {
      const root = rootRef.current;
      if (!root) return;
      if (jump) {
        root.dataset.jump = "true";
        window.clearTimeout(jumpTimer.current);
        jumpTimer.current = window.setTimeout(() => {
          if (rootRef.current) rootRef.current.dataset.jump = "false";
        }, JUMP_MS);
      }
      root.style.setProperty("--scrub-f", String(seconds / length));
      if (elapsedRef.current) elapsedRef.current.textContent = formatTime(seconds, length);
      if (remainingRef.current) remainingRef.current.textContent = `-${formatTime(length - seconds, length)}`;
      const chapter = chapterAt(seconds);
      if (chapter && chapterTitleRef.current && chapterTitleRef.current.textContent !== chapter.title) {
        chapterTitleRef.current.textContent = chapter.title;
        if (chapterIndexRef.current) chapterIndexRef.current.textContent = `${segments.indexOf(chapter) + 1} of ${segments.length}`;
      }
      const input = inputRef.current;
      if (input) {
        input.value = String(seconds);
        input.setAttribute(
          "aria-valuetext",
          `${formatTime(seconds, length)} of ${formatTime(length)}${chapter?.title ? `, ${chapter.title}` : ""}`,
        );
      }
    },
    [length, chapterAt, segments],
  );

  const showHover = React.useCallback(
    (fraction: number | null) => {
      const root = rootRef.current;
      const rail = railRef.current;
      if (!root || !rail) return;
      root.dataset.hover = String(fraction !== null);
      const hovered = fraction === null ? null : chapterAt(fraction * length);
      segments.forEach((segment, index) => {
        const el = segmentRefs.current[index];
        if (el) el.dataset.hovered = String(segments.length > 1 && segment === hovered);
      });
      if (fraction === null) return;
      const seconds = fraction * length;
      if (bubbleTimeRef.current) bubbleTimeRef.current.textContent = formatTime(seconds, length);
      if (bubbleTitleRef.current) bubbleTitleRef.current.textContent = hovered?.title ?? "";
      const bubble = bubbleRef.current;
      if (bubble) {
        // Centered over the pointer, but never hanging off either end of the rail
        const width = rail.offsetWidth;
        const x = clamp(fraction * width - bubble.offsetWidth / 2, 0, Math.max(0, width - bubble.offsetWidth));
        bubble.style.transform = `translateX(${x}px)`;
      }
    },
    [chapterAt, length, segments],
  );

  const set = React.useCallback(
    (seconds: number, jump: boolean) => {
      const next = clamp(seconds, 0, length);
      valueRef.current = next;
      paint(next, jump);
      callbacks.current.onValueChange?.(next);
      return next;
    },
    [length, paint],
  );

  const fractionAt = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return clamp((clientX - rect.left) / rect.width, 0, 1);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId };
    flagsRef.current.dragging = true;
    writeState();
    inputRef.current?.focus({ preventScroll: true });
    const fraction = fractionAt(event.clientX);
    set(fraction * length, true);
    showHover(fraction);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const fraction = fractionAt(event.clientX);
    if (dragRef.current?.pointerId === event.pointerId) {
      // The press may have started a jump; once the pointer moves, the playhead follows it directly
      if (rootRef.current) rootRef.current.dataset.jump = "false";
      set(fraction * length, false);
    }
    if (event.pointerType !== "touch" || dragRef.current) showHover(fraction);
  };

  const finish = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    flagsRef.current.dragging = false;
    writeState();
    if (!flagsRef.current.hover || event.pointerType === "touch") showHover(null);
    callbacks.current.onValueCommit?.(valueRef.current);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const step = event.shiftKey ? FINE_STEP : KEY_STEP;
    const current = valueRef.current;
    const targets: Record<string, number> = {
      ArrowRight: current + step,
      ArrowUp: current + step,
      ArrowLeft: current - step,
      ArrowDown: current - step,
      PageUp: current + length * PAGE_SHARE,
      PageDown: current - length * PAGE_SHARE,
      Home: 0,
      End: length,
    };
    if (showPlay && (event.key === " " || event.key.toLowerCase() === "k")) {
      event.preventDefault();
      setPlaying(!playing);
      return;
    }
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = set(target, true);
    callbacks.current.onValueCommit?.(next);
  };

  useIsomorphicLayoutEffect(() => {
    paint(valueRef.current);
  }, [paint]);

  // Controlled playback updates move the playhead without the jump spring
  useIsomorphicLayoutEffect(() => {
    if (valueProp === undefined || flagsRef.current.dragging) return;
    const next = clamp(valueProp, 0, length);
    if (next === valueRef.current) return;
    valueRef.current = next;
    paint(next);
  }, [valueProp, length, paint]);

  React.useEffect(() => () => window.clearTimeout(jumpTimer.current), []);

  // The built-in clock: advances an uncontrolled playhead each frame, holding still while it is dragged
  const uncontrolled = valueProp === undefined;
  React.useEffect(() => {
    if (!playing || !uncontrolled || disabled) return;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      if (!flagsRef.current.dragging) {
        let next = valueRef.current + dt * rate;
        if (next >= length) {
          if (!loop) {
            valueRef.current = length;
            paint(length);
            callbacks.current.onValueChange?.(length);
            setPlaying(false);
            return;
          }
          next = 0;
        }
        valueRef.current = next;
        paint(next);
        callbacks.current.onValueChange?.(next);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, uncontrolled, disabled, rate, loop, length, paint, setPlaying]);

  const toneStyle = toneStyles[tone];
  const initial = valueRef.current;
  const initialChapter = chapterAt(initial);
  const hasChapters = segments.length > 1 || Boolean(segments[0]?.title);
  const jumpMotion =
    "group-data-[jump=true]/player-scrubber:motion-safe:transition-transform group-data-[jump=true]/player-scrubber:motion-safe:duration-[420ms] group-data-[jump=true]/player-scrubber:motion-safe:ease-(--scrub-ease)";

  return (
    <div
      data-slot="player-scrubber"
      data-disabled={disabled}
      data-playing={playing}
      className={cn(
        "flex flex-col gap-2 select-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
        sizeStyles[size],
        className,
      )}
    >
      {showChapter && hasChapters && (
        <div aria-hidden="true" className={cn("flex items-baseline justify-between gap-3 text-sm", showPlay && "pl-[calc(var(--scrub-button)+--spacing(3))]")}>
          <span ref={chapterTitleRef} className="min-w-0 truncate font-medium text-foreground">
            {initialChapter?.title}
          </span>
          <span ref={chapterIndexRef} className="shrink-0 tabular-nums text-muted-foreground">
            {initialChapter ? `${segments.indexOf(initialChapter) + 1} of ${segments.length}` : ""}
          </span>
        </div>
      )}
      <div className="flex items-center gap-3">
      {showPlay && (
        <button
          type="button"
          disabled={disabled}
          aria-label={playing ? "Pause" : "Play"}
          aria-keyshortcuts="K"
          onClick={() => setPlaying(!playing)}
          className={cn(
            "grid size-(--scrub-button) shrink-0 cursor-pointer place-items-center rounded-full bg-foreground text-background outline-none",
            "motion-safe:transition-[scale,background-color] motion-safe:duration-300 hover:bg-foreground/85 active:scale-90",
            "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed",
          )}
          style={{ transitionTimingFunction: SPRING_EASE }}
        >
          {playing ? <Pause className="size-[45%] fill-current" /> : <Play className="size-[45%] translate-x-[8%] fill-current" />}
        </button>
      )}
      {showTime && (
        <span
          ref={elapsedRef}
          data-slot="player-scrubber-elapsed"
          aria-hidden="true"
          className="min-w-[4ch] shrink-0 text-sm font-medium tabular-nums text-foreground"
        >
          {formatTime(initial, length)}
        </span>
      )}

      {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer surface for the native range input below */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pointer surface for the native range input below */}
      <div
        ref={rootRef}
        data-slot="player-scrubber-surface"
        data-active="false"
        data-dragging="false"
        data-hover="false"
        data-jump="false"
        className={cn(
          "group/player-scrubber relative h-(--scrub-height) min-w-0 flex-1 touch-none rounded-full",
          "cursor-pointer in-data-[disabled=true]:cursor-not-allowed",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
          "[--scrub-gap:2px] data-[active=true]:[--scrub-gap:4px]",
        )}
        style={{ "--scrub-f": initial / length, "--scrub-ease": SPRING_EASE } as React.CSSProperties}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finish}
        onPointerCancel={finish}
        onPointerEnter={() => {
          flagsRef.current.hover = true;
          writeState();
        }}
        onPointerLeave={() => {
          flagsRef.current.hover = false;
          writeState();
          if (!flagsRef.current.dragging) showHover(null);
        }}
      >
        {/* The rail is inset by half a thumb, so the thumb sits flush at both ends */}
        <div ref={railRef} className="absolute inset-y-0 right-[calc(var(--scrub-thumb)/2)] left-[calc(var(--scrub-thumb)/2)]">
          {segments.map((segment, index) => {
            const from = (segment.start / length) * 100;
            const span = segment.end - segment.start;
            const first = index === 0;
            const last = index === segments.length - 1;
            return (
              <div
                key={`${segment.start}-${index}`}
                ref={(el) => {
                  segmentRefs.current[index] = el;
                }}
                data-slot="player-scrubber-segment"
                data-hovered="false"
                className={cn(
                  "absolute top-1/2 h-(--scrub-track) -translate-y-1/2 overflow-hidden rounded-full",
                  "motion-safe:transition-[left,width,scale] motion-safe:duration-[420ms] motion-safe:ease-(--scrub-ease)",
                  "group-data-[active=true]/player-scrubber:scale-y-150 group-data-[active=true]/player-scrubber:data-[hovered=true]:scale-y-[2]",
                  toneStyle.track,
                )}
                style={{
                  left: first ? `${from}%` : `calc(${from}% + var(--scrub-gap) / 2)`,
                  width: `calc(${(span / length) * 100}% - var(--scrub-gap) * ${(first ? 0 : 0.5) + (last ? 0 : 0.5)})`,
                }}
              >
                {ranges.map(([a, b], r) => {
                  const lo = Math.max(a, segment.start);
                  const hi = Math.min(b, segment.end);
                  if (hi <= lo) return null;
                  return (
                    <div
                      key={r}
                      aria-hidden="true"
                      data-slot="player-scrubber-buffered"
                      className={cn("absolute inset-y-0", toneStyle.buffered)}
                      style={{ left: `${((lo - segment.start) / span) * 100}%`, width: `${((hi - lo) / span) * 100}%` }}
                    />
                  );
                })}
                <div
                  aria-hidden="true"
                  data-slot="player-scrubber-fill"
                  className={cn("absolute inset-0 origin-left", jumpMotion, toneStyle.fill)}
                  style={{
                    transform: `scaleX(clamp(0, calc((var(--scrub-f) - ${segment.start / length}) / ${span / length}), 1))`,
                  }}
                />
              </div>
            );
          })}

          <div
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-0", jumpMotion)}
            style={{ transform: "translateX(calc(var(--scrub-f) * 100%))" }}
          >
            {/* A small playhead while playing; the full thumb grows over it on hover or drag */}
            <div
              className="absolute top-1/2 left-0 size-[calc(var(--scrub-thumb)*0.6)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground opacity-0 motion-safe:transition-opacity motion-safe:duration-300 in-data-[playing=true]:opacity-100"
            />
            <div
              data-slot="player-scrubber-thumb"
              className={cn(
                "absolute top-1/2 left-0 size-(--scrub-thumb) -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-sm",
                "scale-0 opacity-0 motion-safe:transition-[opacity,scale] motion-safe:duration-[420ms] motion-safe:ease-(--scrub-ease)",
                "group-data-[active=true]/player-scrubber:scale-100 group-data-[active=true]/player-scrubber:opacity-100",
                "group-data-[active=true]/player-scrubber:group-data-[dragging=true]/player-scrubber:scale-125",
              )}
            />
          </div>

          <div
            ref={bubbleRef}
            aria-hidden="true"
            data-slot="player-scrubber-bubble"
            className={cn(
              "pointer-events-none absolute bottom-full left-0 mb-2 flex flex-col items-center rounded-md bg-foreground px-2 py-1 whitespace-nowrap text-background shadow-md",
              "translate-y-1 opacity-0 transition-[opacity,translate] duration-150",
              "group-data-[hover=true]/player-scrubber:translate-y-0 group-data-[hover=true]/player-scrubber:opacity-100",
            )}
          >
            <span ref={bubbleTitleRef} className="text-sm font-medium empty:hidden" />
            <span ref={bubbleTimeRef} className="text-sm tabular-nums opacity-80" />
          </div>
        </div>

        {/* The real control: role, value, keyboard, form and assistive technology all live here */}
        <input
          ref={inputRef}
          type="range"
          className="sr-only"
          min={0}
          max={length}
          step="any"
          defaultValue={String(initial)}
          disabled={disabled}
          name={name}
          aria-label={ariaLabel}
          onKeyDown={handleKeyDown}
          onChange={(event) => callbacks.current.onValueCommit?.(set(Number(event.currentTarget.value), true))}
          onFocus={() => {
            flagsRef.current.focus = true;
            writeState();
          }}
          onBlur={() => {
            flagsRef.current.focus = false;
            writeState();
          }}
        />
      </div>

      {showTime && (
        <span
          ref={remainingRef}
          data-slot="player-scrubber-remaining"
          aria-hidden="true"
          className="min-w-[5ch] shrink-0 text-right text-sm tabular-nums text-muted-foreground"
        >
          -{formatTime(length - initial, length)}
        </span>
      )}
      </div>
    </div>
  );
}
