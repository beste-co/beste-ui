"use client";

import { Pause, Play } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface behind the waveform. */
type Tone = "muted" | "outline" | "ghost";

/** Height preset. */
type Size = "sm" | "default" | "lg";

export interface PlayerWaveformProps {
  /** Loudness samples from 0 to 1, any length. They are resampled to the bars that fit. */
  peaks: number[];
  /** Length of the audio, in seconds. */
  duration: number;
  /** Playhead position in seconds, controlled. */
  value?: number;
  /** Starting playhead position in seconds, uncontrolled. */
  defaultValue?: number;
  /** Every drag frame, clock tick and key press, with the new time in seconds. */
  onValueChange?: (seconds: number) => void;
  /** Once per gesture: on release, or after a key press. Seek the media here. */
  onValueCommit?: (seconds: number) => void;
  /** Whether the playhead runs, controlled. With an uncontrolled value the waveform keeps its own clock. */
  playing?: boolean;
  /** Whether it starts running, uncontrolled. */
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  /** Start over at the end instead of stopping. */
  loop?: boolean;
  /** Playback speed of the built-in clock, 1 is real time. */
  rate?: number;
  /** A play and pause button before the waveform. */
  showPlay?: boolean;
  /** Elapsed time on the left and remaining time on the right. */
  showTime?: boolean;
  /** Width of one bar in px. */
  barWidth?: number;
  /** Space between bars in px. */
  gap?: number;
  /** Corner radius of a bar in px. Defaults to half the bar width, a pill. */
  radius?: number;
  tone?: Tone;
  size?: Size;
  disabled?: boolean;
  /** Form name for the underlying range input. */
  name?: string;
  /** Accessible name. Defaults to "Seek". */
  "aria-label"?: string;
  className?: string;
}

// A deterministic demo track: verse, chorus and a quiet bridge, the same on the server and the client
function demoPeaks(count: number) {
  let seed = 7;
  const next = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: count }, (_, i) => {
    const t = i / count;
    const section = t < 0.12 ? 0.35 : t < 0.42 ? 0.62 : t < 0.58 ? 0.9 : t < 0.7 ? 0.3 : t < 0.92 ? 0.85 : 0.25;
    const pulse = 0.75 + 0.25 * Math.sin(i * 0.9);
    return Math.min(1, Math.max(0.06, section * pulse * (0.7 + next() * 0.45)));
  });
}

export const playerWaveformDemo: PlayerWaveformProps = {
  peaks: demoPeaks(240),
  duration: 214,
  defaultValue: 48,
  defaultPlaying: true,
  loop: true,
  showPlay: true,
  showTime: true,
  "aria-label": "Seek in Teardrop by Massive Attack",
  className: "w-full max-w-xl",
};

/* -------------------------------------------------------------------------- */
/* Tuning                                                                     */
/* -------------------------------------------------------------------------- */

const KEY_STEP = 5;
const FINE_STEP = 1;
const PAGE_SHARE = 0.1;
/** Soft ease-out for anything that follows the pointer; a spring would wobble on every move. */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

const toneStyles: Record<Tone, { root: string; base: string; hover: string; played: string }> = {
  muted: { root: "rounded-xl bg-muted p-3", base: "bg-muted-foreground/25", hover: "bg-foreground/40", played: "bg-foreground" },
  outline: { root: "rounded-xl border border-border bg-background p-3", base: "bg-muted-foreground/25", hover: "bg-foreground/40", played: "bg-foreground" },
  ghost: { root: "", base: "bg-muted-foreground/30", hover: "bg-foreground/45", played: "bg-foreground" },
};

const sizeStyles: Record<Size, string> = {
  sm: "[--wave-height:--spacing(10)] [--wave-button:--spacing(8)]",
  default: "[--wave-height:--spacing(14)] [--wave-button:--spacing(10)]",
  lg: "[--wave-height:--spacing(20)] [--wave-button:--spacing(12)]",
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

/** Folds any number of peaks into `count` bars, keeping each bucket's loudest sample. */
export function resamplePeaks(peaks: number[], count: number) {
  const n = peaks.length;
  if (count <= 0 || n === 0) return [];
  return Array.from({ length: count }, (_, i) => {
    const start = Math.floor((i * n) / count);
    const end = Math.max(start + 1, Math.floor(((i + 1) * n) / count));
    let loudest = 0;
    for (let j = start; j < end && j < n; j++) loudest = Math.max(loudest, peaks[j] ?? 0);
    return clamp(loudest, 0, 1);
  });
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function PlayerWaveform({
  peaks,
  duration,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  onValueCommit,
  playing: playingProp,
  defaultPlaying = false,
  onPlayingChange,
  loop = false,
  rate = 1,
  showPlay = false,
  showTime = false,
  barWidth = 3,
  gap = 2,
  radius,
  tone = "ghost",
  size = "default",
  disabled = false,
  name,
  "aria-label": ariaLabel = "Seek",
  className,
}: PlayerWaveformProps) {
  const length = Math.max(duration, 0.001);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const bubbleRef = React.useRef<HTMLDivElement>(null);
  const bubbleTimeRef = React.useRef<HTMLSpanElement>(null);
  const elapsedRef = React.useRef<HTMLSpanElement>(null);
  const remainingRef = React.useRef<HTMLSpanElement>(null);
  const valueRef = React.useRef(clamp(valueProp ?? defaultValue, 0, length));
  const flagsRef = React.useRef({ hover: false, focus: false, dragging: false });
  const dragRef = React.useRef<number | null>(null);
  const [count, setCount] = React.useState<number | null>(null);
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

  const bars = React.useMemo(() => (count === null ? [] : resamplePeaks(peaks, count)), [peaks, count]);

  // As many bars as fit the width, recounted whenever the track resizes
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const width = track.clientWidth;
      const next = Math.max(1, Math.floor((width + gap) / (barWidth + gap)));
      setCount((prev) => (prev === next ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [barWidth, gap]);

  const writeState = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const { hover, focus, dragging } = flagsRef.current;
    root.dataset.active = String(hover || focus || dragging);
    root.dataset.dragging = String(dragging);
  }, []);

  // Everything visual goes through custom properties and refs, so seeking and playback cost no renders
  const paint = React.useCallback(
    (seconds: number) => {
      const root = rootRef.current;
      if (!root) return;
      root.style.setProperty("--wave-f", String(seconds / length));
      if (elapsedRef.current) elapsedRef.current.textContent = formatTime(seconds, length);
      if (remainingRef.current) remainingRef.current.textContent = `-${formatTime(length - seconds, length)}`;
      const input = inputRef.current;
      if (input) {
        input.value = String(seconds);
        input.setAttribute("aria-valuetext", `${formatTime(seconds, length)} of ${formatTime(length)}`);
      }
    },
    [length],
  );

  const showHover = React.useCallback(
    (fraction: number | null) => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track) return;
      root.dataset.hover = String(fraction !== null);
      if (fraction === null) return;
      root.style.setProperty("--wave-h", String(fraction));
      if (bubbleTimeRef.current) bubbleTimeRef.current.textContent = formatTime(fraction * length, length);
      const bubble = bubbleRef.current;
      if (bubble) {
        const width = track.offsetWidth;
        const x = clamp(fraction * width - bubble.offsetWidth / 2, 0, Math.max(0, width - bubble.offsetWidth));
        bubble.style.transform = `translateX(${x}px)`;
      }
    },
    [length],
  );

  const set = React.useCallback(
    (seconds: number) => {
      const next = clamp(seconds, 0, length);
      valueRef.current = next;
      paint(next);
      callbacks.current.onValueChange?.(next);
      return next;
    },
    [length, paint],
  );

  // Read from the track's full box, so the gaps between bars seek like the bars themselves
  const fractionAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return clamp((clientX - rect.left) / rect.width, 0, 1);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = event.pointerId;
    flagsRef.current.dragging = true;
    writeState();
    inputRef.current?.focus({ preventScroll: true });
    const fraction = fractionAt(event.clientX);
    set(fraction * length);
    showHover(fraction);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const fraction = fractionAt(event.clientX);
    if (dragRef.current === event.pointerId) set(fraction * length);
    if (event.pointerType !== "touch" || dragRef.current !== null) showHover(fraction);
  };

  const finish = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current !== event.pointerId) return;
    dragRef.current = null;
    flagsRef.current.dragging = false;
    writeState();
    if (!flagsRef.current.hover || event.pointerType === "touch") showHover(null);
    callbacks.current.onValueCommit?.(valueRef.current);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (showPlay && (event.key === " " || event.key.toLowerCase() === "k")) {
      event.preventDefault();
      setPlaying(!playing);
      return;
    }
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
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    callbacks.current.onValueCommit?.(set(target));
  };

  useIsomorphicLayoutEffect(() => {
    paint(valueRef.current);
  }, [paint]);

  // Controlled playback moves the playhead directly
  useIsomorphicLayoutEffect(() => {
    if (valueProp === undefined || flagsRef.current.dragging) return;
    const next = clamp(valueProp, 0, length);
    if (next === valueRef.current) return;
    valueRef.current = next;
    paint(next);
  }, [valueProp, length, paint]);

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

  const t = toneStyles[tone];
  const initial = valueRef.current;
  const r = radius ?? barWidth / 2;
  const widestTime = formatTime(length, length);

  // One layer of bars; three stacked copies draw the rest, the hover preview and the played part
  const layer = (color: string, clip?: string) => (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center"
      style={{ gap, clipPath: clip }}
    >
      {bars.map((peak, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: bars are positions along the track
          key={index}
          className={cn(
            "block shrink-0 origin-center motion-safe:transition-[scale] motion-safe:duration-700 motion-safe:starting:scale-y-0",
            color,
          )}
          style={{
            width: barWidth,
            height: `${Math.max(8, peak * 100)}%`,
            borderRadius: r,
            transitionTimingFunction: EASE_OUT,
            transitionDelay: `${Math.round((index / Math.max(1, bars.length)) * 450)}ms`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      data-slot="player-waveform"
      data-disabled={disabled}
      data-playing={playing}
      className={cn(
        "flex items-center gap-3 select-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
        sizeStyles[size],
        t.root,
        className,
      )}
    >
      {showPlay && (
        <button
          type="button"
          disabled={disabled}
          aria-label={playing ? "Pause" : "Play"}
          aria-keyshortcuts="K"
          onClick={() => setPlaying(!playing)}
          className={cn(
            "grid size-(--wave-button) shrink-0 cursor-pointer place-items-center rounded-full bg-foreground text-background outline-none",
            "motion-safe:transition-[scale,background-color] motion-safe:duration-300 hover:bg-foreground/85 active:scale-90",
            "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed",
          )}
        >
          {playing ? <Pause className="size-[45%] fill-current" /> : <Play className="size-[45%] translate-x-[8%] fill-current" />}
        </button>
      )}

      {showTime && (
        // The widest time is laid out invisibly underneath, so the readout never changes width
        <span aria-hidden="true" className="inline-grid shrink-0 text-sm font-medium tabular-nums text-foreground">
          <span className="invisible col-start-1 row-start-1">{widestTime}</span>
          <span ref={elapsedRef} className="col-start-1 row-start-1">
            {formatTime(initial, length)}
          </span>
        </span>
      )}

      {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer surface for the native range input below */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pointer surface for the native range input below */}
      <div
        ref={rootRef}
        data-active="false"
        data-dragging="false"
        data-hover="false"
        className={cn(
          "group/wave relative h-(--wave-height) min-w-0 flex-1 touch-none rounded-md",
          "cursor-pointer in-data-[disabled=true]:cursor-not-allowed",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        )}
        style={{ "--wave-f": initial / length, "--wave-h": 0 } as React.CSSProperties}
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
        <div ref={trackRef} className="absolute inset-0">
          {layer(t.base)}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-data-[hover=true]/wave:opacity-100">
            {layer(t.hover, "inset(0 calc((1 - var(--wave-h)) * 100%) 0 0)")}
          </div>
          {layer(t.played, "inset(0 calc((1 - var(--wave-f)) * 100%) 0 0)")}
          {/* A thin playhead line at the edge of the played part */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-foreground opacity-0 transition-opacity duration-200 group-data-[active=true]/wave:opacity-100"
            style={{ left: "calc(var(--wave-f) * 100%)" }}
          />
        </div>

        <div
          ref={bubbleRef}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-full left-0 mb-2 rounded-md bg-foreground px-2 py-1 whitespace-nowrap text-sm tabular-nums text-background shadow-md",
            "translate-y-1 opacity-0 transition-[opacity,translate] duration-150",
            "group-data-[hover=true]/wave:translate-y-0 group-data-[hover=true]/wave:opacity-100",
          )}
        >
          <span ref={bubbleTimeRef} />
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
          onChange={(event) => callbacks.current.onValueCommit?.(set(Number(event.currentTarget.value)))}
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
        <span aria-hidden="true" className="inline-grid shrink-0 text-right text-sm tabular-nums text-muted-foreground">
          <span className="invisible col-start-1 row-start-1">-{widestTime}</span>
          <span ref={remainingRef} className="col-start-1 row-start-1">
            -{formatTime(length - initial, length)}
          </span>
        </span>
      )}
    </div>
  );
}
