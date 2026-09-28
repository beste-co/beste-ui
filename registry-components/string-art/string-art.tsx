"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface StringArtImage {
  src: string;
  alt: string;
  /** Vertical focus of the square crop, 0 (top) to 1 (bottom). */
  focus?: number;
}

export interface StringArtProps {
  /** Photos woven one after another. Loaded with CORS so the canvas can read them. */
  images: StringArtImage[];
  /** Nails around the board. */
  pins?: number;
  /** Most thread passes per portrait; the weave stops earlier once the picture is used up */
  lines?: number;
  /** Ink each pass leaves, 0 to 1. */
  threadOpacity?: number;
  /** Thread color. Any CSS color, tokens included. */
  threadColor?: string;
  /** Board color. */
  boardColor?: string;
  /** Color of the thread being pulled right now. */
  needleColor?: string;
  /** How hard the photo is pushed toward black and white before weaving, 0 to 1. */
  contrast?: number;
  /** Thread passes per second. */
  speed?: number;
  /** Seconds a finished portrait rests before the next one starts. */
  hold?: number;
  /** Thin rim around the board. */
  rim?: boolean;
  /** How far the board leans, idle and toward the cursor, 0 to 1. */
  tilt?: number;
  /** Hovering speeds the weaving and leans the board; a click starts the next portrait. */
  interactive?: boolean;
  /** Stop weaving where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const stringArtDemo: StringArtProps = {
  images: [
    {
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80",
      alt: "Portrait of a man in a grey sweater against a pale wall",
      focus: 0.32,
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&q=80",
      alt: "Portrait of a woman with short red hair by a lake",
      focus: 0.5,
    },
  ],
  pins: 220,
  lines: 3000,
  threadOpacity: 0.14,
  threadColor: "var(--foreground)",
  boardColor: "var(--background)",
  needleColor: "var(--primary)",
  contrast: 0.5,
  speed: 260,
  hold: 4,
  rim: true,
  tilt: 0.5,
  interactive: true,
  className: "aspect-square w-full max-w-[560px]",
};

const GRID = 200;

// Resolves any CSS color (tokens and oklch included) to an rgb() string the canvas accepts everywhere
function resolveColor(el: HTMLElement, color: string) {
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  el.style.color = "";
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return computed;
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${data[0] ?? 0}, ${data[1] ?? 0}, ${data[2] ?? 0})`;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function StringArt({
  images,
  pins = 220,
  lines = 3000,
  threadOpacity = 0.14,
  threadColor = "var(--foreground)",
  boardColor = "var(--background)",
  needleColor = "var(--primary)",
  contrast = 0.5,
  speed = 260,
  hold = 4,
  rim = true,
  tilt = 0.5,
  interactive = true,
  paused = false,
  className,
  children,
}: StringArtProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const weaveRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [reduce, setReduce] = useState(false);
  const [failed, setFailed] = useState(false);
  const [current, setCurrent] = useState(0);
  const settings = useRef({ threadOpacity, threadColor, boardColor, needleColor, speed, hold, tilt, interactive, paused });
  settings.current = { threadOpacity, threadColor, boardColor, needleColor, speed, hold, tilt, interactive, paused };
  const refresh = useRef<(recolor?: boolean) => void>(() => {});
  const sources = images.map((image) => `${image.src}|${image.focus ?? 0.5}`).join(",");

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: images is read through `sources`, which captures what matters about it
  useEffect(() => {
    const root = rootRef.current;
    const board = boardRef.current;
    const weave = weaveRef.current;
    const overlay = overlayRef.current;
    const wctx = weave?.getContext("2d");
    const octx = overlay?.getContext("2d");
    if (!root || !board || !weave || !overlay || !wctx || !octx || images.length === 0) return;

    const pinCount = Math.max(60, Math.min(400, Math.round(pins)));
    const lineCount = Math.max(200, Math.min(6000, Math.round(lines)));
    // Chords must cross a good part of the board; short hops along the rim only pile thread at the edge
    const minGap = Math.max(12, Math.round(pinCount * 0.12));
    const px = new Float32Array(pinCount);
    const py = new Float32Array(pinCount);
    const center = GRID / 2;
    const radius = GRID / 2 - 1;
    for (let i = 0; i < pinCount; i++) {
      const a = (i / pinCount) * Math.PI * 2 - Math.PI / 2;
      px[i] = center + Math.cos(a) * radius;
      py[i] = center + Math.sin(a) * radius;
    }

    const dark = new Float32Array(GRID * GRID);
    const sequence = new Int16Array(lineCount + 1);
    const recent = new Int16Array(4).fill(-1);
    const sample = document.createElement("canvas");
    sample.width = sample.height = GRID;
    const sctx = sample.getContext("2d", { willReadFrequently: true });

    let thread = "#111";
    let boardFill = "#fff";
    let needle = "#e4572e";
    let size = 1;
    let dpr = 1;
    let imageIndex = 0;
    let computed = 0;
    let drawn = 0;
    let carry = 0;
    // The weave ends when the portrait is used up, not at a fixed count: `lines` is only a ceiling
    let limit = lineCount;
    // How much one pass darkens a cell of the grid, matched to the drawn thread, so the plan tracks what is actually visible
    let weight = 0.026;
    let phase: "load" | "weave" | "hold" | "fade" = "load";
    let phaseTime = 0;
    let fadeLeft = 0;
    let frame = 0;
    let visible = true;
    let hovering = false;
    let disposed = false;
    let last = 0;
    let clock = 0;
    const lean = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };

    const recolor = () => {
      const s = settings.current;
      thread = resolveColor(root, s.threadColor);
      boardFill = resolveColor(root, s.boardColor);
      needle = resolveColor(root, s.needleColor);
    };

    const clearWeave = () => {
      wctx.setTransform(1, 0, 0, 1, 0, 0);
      wctx.globalAlpha = 1;
      wctx.fillStyle = boardFill;
      wctx.fillRect(0, 0, weave.width, weave.height);
    };

    // Replays every pass woven so far, used after a resize or a theme change
    const repaint = () => {
      clearWeave();
      drawSegments(0, drawn);
    };

    const drawSegments = (from: number, to: number) => {
      if (to <= from) return;
      const scale = size / GRID;
      wctx.setTransform(1, 0, 0, 1, 0, 0);
      wctx.globalAlpha = clamp01(settings.current.threadOpacity);
      wctx.strokeStyle = thread;
      wctx.lineWidth = Math.max(0.5, 0.55 * dpr);
      // One stroke per pass: overlapping passes inside a single path would not build up density
      for (let i = from; i < to; i++) {
        const a = sequence[i] ?? 0;
        const b = sequence[i + 1] ?? 0;
        wctx.beginPath();
        wctx.moveTo((px[a] ?? 0) * scale, (py[a] ?? 0) * scale);
        wctx.lineTo((px[b] ?? 0) * scale, (py[b] ?? 0) * scale);
        wctx.stroke();
      }
    };

    const fail = () => {
      disposed = true;
      cancelAnimationFrame(frame);
      setFailed(true);
    };

    const loadImage = (index: number) => {
      const image = images[index % images.length];
      if (!image || !sctx) return;
      phase = "load";
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (disposed) return;
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const side = Math.min(w, h);
        const sx = (w - side) / 2;
        const sy = Math.max(0, Math.min(h - side, (h - side) * (image.focus ?? 0.5)));
        sctx.clearRect(0, 0, GRID, GRID);
        sctx.drawImage(img, sx, sy, side, side, 0, 0, GRID, GRID);
        let data: Uint8ClampedArray;
        try {
          data = sctx.getImageData(0, 0, GRID, GRID).data;
        } catch {
          fail();
          return;
        }
        const gain = 1 + clamp01(contrast) * 1.6;
        for (let y = 0; y < GRID; y++) {
          for (let x = 0; x < GRID; x++) {
            const i = y * GRID + x;
            const dx = x - center;
            const dy = y - center;
            if (dx * dx + dy * dy > radius * radius) {
              dark[i] = 0;
              continue;
            }
            const l = ((data[i * 4] ?? 0) * 0.299 + (data[i * 4 + 1] ?? 0) * 0.587 + (data[i * 4 + 2] ?? 0) * 0.114) / 255;
            // The rim collects thread at every pin anyway, so the picture asks a little less of it
            const rr = Math.sqrt(dx * dx + dy * dy) / radius;
            const rim = rr > 0.9 ? 1 - ((rr - 0.9) / 0.1) * 0.6 : 1;
            dark[i] = Math.pow(clamp01((1 - l - 0.5) * gain + 0.5), 1.4) * rim;
          }
        }
        // Start at the pin nearest the darkest part of the rim, so the first passes already belong to the picture
        let start = 0;
        let darkest = -1;
        for (let i = 0; i < pinCount; i++) {
          const cx = (px[i] ?? 0) + (center - (px[i] ?? 0)) * 0.12;
          const cy = (py[i] ?? 0) + (center - (py[i] ?? 0)) * 0.12;
          const v = dark[(cy | 0) * GRID + (cx | 0)] ?? 0;
          if (v > darkest) {
            darkest = v;
            start = i;
          }
        }
        sequence[0] = start;
        recent.fill(-1);
        computed = 0;
        drawn = 0;
        carry = 0;
        limit = lineCount;
        const boardPx = weave.clientWidth || 560;
        weight = Math.min(0.06, Math.max(0.015, clamp01(settings.current.threadOpacity) * 0.55 * (GRID / boardPx)));
        setCurrent(index % images.length);
        clearWeave();
        phase = "weave";
        phaseTime = 0;
      };
      img.onerror = fail;
      img.src = image.src;
    };

    // One greedy pass: from the current pin, pick the chord that still covers the most darkness.
    // The residual may go negative where thread has already piled up, so those areas repel further passes
    const computeNext = () => {
      const from = sequence[computed] ?? 0;
      const ax = px[from] ?? 0;
      const ay = py[from] ?? 0;
      let best = -1;
      let bestScore = -1;
      for (let b = 0; b < pinCount; b++) {
        const gap = Math.abs(b - from);
        if (Math.min(gap, pinCount - gap) < minGap) continue;
        if (b === recent[0] || b === recent[1] || b === recent[2] || b === recent[3]) continue;
        const bx = px[b] ?? 0;
        const by = py[b] ?? 0;
        const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay)));
        const sx = (bx - ax) / steps;
        const sy = (by - ay) / steps;
        let sum = 0;
        let x = ax;
        let y = ay;
        for (let k = 0; k <= steps; k++) {
          sum += dark[(y | 0) * GRID + (x | 0)] ?? 0;
          x += sx;
          y += sy;
        }
        const score = sum / (steps + 1);
        if (score > bestScore) {
          bestScore = score;
          best = b;
        }
      }
      // Once the best chord would add less than a fraction of one pass, the picture is finished
      if (best < 0 || (computed >= 120 && bestScore < weight * 0.15)) {
        limit = computed;
        return;
      }
      const bx = px[best] ?? 0;
      const by = py[best] ?? 0;
      const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay)));
      const sx = (bx - ax) / steps;
      const sy = (by - ay) / steps;
      let x = ax;
      let y = ay;
      for (let k = 0; k <= steps; k++) {
        const i = (y | 0) * GRID + (x | 0);
        dark[i] = Math.max(-0.35, (dark[i] ?? 0) - weight);
        x += sx;
        y += sy;
      }
      recent[computed % 4] = from;
      computed++;
      sequence[computed] = best;
    };

    const drawOverlay = () => {
      octx.setTransform(1, 0, 0, 1, 0, 0);
      octx.clearRect(0, 0, overlay.width, overlay.height);
      const scale = size / GRID;
      const dot = Math.max(1.2, 1.1 * dpr);
      octx.fillStyle = thread;
      octx.globalAlpha = 0.55;
      octx.beginPath();
      for (let i = 0; i < pinCount; i++) octx.rect((px[i] ?? 0) * scale - dot / 2, (py[i] ?? 0) * scale - dot / 2, dot, dot);
      octx.fill();
      if (phase !== "weave" || drawn < 1) {
        octx.globalAlpha = 1;
        return;
      }
      const a = sequence[drawn - 1] ?? 0;
      const b = sequence[drawn] ?? 0;
      octx.globalAlpha = 0.9;
      octx.strokeStyle = needle;
      octx.lineWidth = Math.max(1, 1.1 * dpr);
      octx.beginPath();
      octx.moveTo((px[a] ?? 0) * scale, (py[a] ?? 0) * scale);
      octx.lineTo((px[b] ?? 0) * scale, (py[b] ?? 0) * scale);
      octx.stroke();
      octx.fillStyle = needle;
      octx.beginPath();
      octx.arc((px[b] ?? 0) * scale, (py[b] ?? 0) * scale, 2.6 * dpr, 0, Math.PI * 2);
      octx.fill();
      octx.globalAlpha = 1;
    };

    const applyLean = (dt: number) => {
      const s = settings.current;
      const amount = clamp01(s.tilt) * 10;
      if (!hovering) {
        lean.tx = Math.sin(clock * 0.37) * 0.35;
        lean.ty = Math.cos(clock * 0.29) * 0.35;
      }
      const k = 60;
      const damp = 12;
      lean.vx += ((lean.tx - lean.x) * k - lean.vx * damp) * dt;
      lean.vy += ((lean.ty - lean.y) * k - lean.vy * damp) * dt;
      lean.x += lean.vx * dt;
      lean.y += lean.vy * dt;
      board.style.transform = `rotateX(${(-lean.y * amount).toFixed(2)}deg) rotateY(${(lean.x * amount).toFixed(2)}deg)`;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      clock += dt;
      phaseTime += dt;
      const s = settings.current;
      applyLean(dt);

      if (phase === "weave") {
        const budget = performance.now() + 4;
        while (computed < limit && performance.now() < budget) computeNext();
        carry += dt * Math.max(10, s.speed) * (hovering ? 1.6 : 1);
        const target = Math.min(computed, drawn + Math.floor(carry));
        carry -= target - drawn;
        drawSegments(drawn, target);
        drawn = target;
        if (drawn >= limit) {
          phase = "hold";
          phaseTime = 0;
        }
      } else if (phase === "hold" && phaseTime > Math.max(0, s.hold)) {
        phase = "fade";
        fadeLeft = 50;
      } else if (phase === "fade") {
        wctx.setTransform(1, 0, 0, 1, 0, 0);
        wctx.globalAlpha = 0.08;
        wctx.fillStyle = boardFill;
        wctx.fillRect(0, 0, weave.width, weave.height);
        fadeLeft--;
        if (fadeLeft <= 0) {
          imageIndex++;
          loadImage(imageIndex);
        }
      }
      drawOverlay();
      frame = requestAnimationFrame(tick);
    };

    // Reduced motion: weave the whole portrait in time-sliced chunks, then stop
    const settle = () => {
      if (disposed || phase === "load") {
        frame = requestAnimationFrame(settle);
        return;
      }
      const budget = performance.now() + 8;
      while (computed < limit && performance.now() < budget) computeNext();
      drawSegments(drawn, computed);
      drawn = computed;
      if (computed < limit) frame = requestAnimationFrame(settle);
      else drawOverlay();
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (reduce) {
        frame = requestAnimationFrame(settle);
        return;
      }
      if (!settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.max(1, Math.round(weave.clientWidth * dpr));
      weave.width = weave.height = size;
      overlay.width = overlay.height = size;
      repaint();
      drawOverlay();
    };

    refresh.current = (withColors = false) => {
      if (withColors) {
        recolor();
        repaint();
      }
      drawOverlay();
      play();
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || event.pointerType === "touch") return;
      const rect = board.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hovering = Math.hypot(x, y) < 0.55;
      if (hovering) {
        lean.tx = x * 2;
        lean.ty = y * 2;
      }
    };
    const onClick = () => {
      if (!settings.current.interactive || phase === "load") return;
      phase = "fade";
      fadeLeft = 18;
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(board);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(board);
    const mo = new MutationObserver(() => requestAnimationFrame(() => refresh.current(true)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    board.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    loadImage(0);
    play();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      board.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sources, pins, lines, contrast, reduce]);

  useEffect(() => {
    refresh.current(true);
  }, [threadColor, boardColor, needleColor]);

  useEffect(() => {
    refresh.current(false);
  }, [threadOpacity, speed, hold, tilt, interactive, paused]);

  const active = images[current] ?? images[0];

  return (
    <div ref={rootRef} className={cn("relative isolate w-full [perspective:1400px]", className)}>
      {active && <span className="sr-only">{active.alt}</span>}
      <div
        ref={boardRef}
        className={cn(
          "absolute inset-0 overflow-hidden rounded-full will-change-transform",
          interactive && "cursor-pointer",
          rim && "shadow-[0_0_0_1px_color-mix(in_oklab,currentColor_14%,transparent),0_30px_60px_-30px_rgba(0,0,0,0.3)]",
        )}
        style={{ backgroundColor: boardColor, color: threadColor }}
      >
        {failed && active ? (
          <img src={active.src} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover grayscale" />
        ) : (
          <>
            <canvas ref={weaveRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
            <canvas ref={overlayRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
          </>
        )}
      </div>
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
