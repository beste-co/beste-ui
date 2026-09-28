"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Anything with a `get()` that returns 0 to 1, such as a framer-motion MotionValue */
export interface ProgressSource {
  get(): number;
}

export interface TypeWindowProps {
  /** The word cut out of the surface; the photo shows through its letters */
  word?: string;
  /** Photo seen through the word */
  imageSrc: string;
  imageAlt?: string;
  /** Index of the letter the camera flies into; defaults to the middle letter of the word */
  letter?: number;
  /** How far the camera has flown in, 0 to 1. A number or a MotionValue (for example a pinned section's scroll) */
  progress?: ProgressSource | number;
  /** Fly in and back out on a loop by itself; a MotionValue `progress` always wins, a number applies when autoplay is off */
  autoplay?: boolean;
  /** Speed of the autoplay loop */
  speed?: number;
  /** Surface the word is cut from */
  surface?: "background" | "foreground";
  /** Weight of the word; heavier weights open wider windows */
  fontWeight?: number;
  /** Letter spacing of the word, in em */
  tracking?: number;
  /** Share of the width the word fills at rest, 0 to 1 */
  fit?: number;
  /** How much the photo moves toward the camera as it flies in, 0 to 1 */
  depth?: number;
  /** The photo drifts gently with the pointer */
  interactive?: boolean;
  /** Stop the autoplay loop */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const typeWindowDemo: TypeWindowProps = {
  word: "Horizon",
  imageSrc: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=80",
  imageAlt: "A mountain valley and lake at first light",
  autoplay: true,
  speed: 1,
  surface: "background",
  fontWeight: 800,
  tracking: -0.04,
  fit: 0.9,
  depth: 0.5,
  interactive: true,
  className: "min-h-[32rem]",
};

const FONT_SIZE = 100;
const CYCLE = 11;

const clamp01 = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x);
const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
const isSource = (value: unknown): value is ProgressSource =>
  typeof value === "object" && value !== null && typeof (value as ProgressSource).get === "function";

// Fly in, rest open, fly back out, rest on the word
const loop = (t: number) => {
  if (t < 0.12) return 0;
  if (t < 0.5) return (t - 0.12) / 0.38;
  if (t < 0.64) return 1;
  return 1 - (t - 0.64) / 0.36;
};

// Resolves any CSS color (tokens and oklch included) to something the canvas accepts
function resolveColor(el: HTMLElement) {
  const computed = getComputedStyle(el).color;
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return computed;
  probe.fillStyle = "#000";
  probe.fillStyle = computed;
  return probe.fillStyle;
}

/** The middle of a glyph's stroke near its center, and the stroke's half width and half height there, in font units relative to the glyph origin */
function inkPoint(char: string, font: string) {
  const scale = 2;
  const pad = 6;
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.font = font;
  const m = ctx.measureText(char);
  const left = m.actualBoundingBoxLeft;
  const ascent = m.actualBoundingBoxAscent;
  const w = Math.ceil((left + m.actualBoundingBoxRight) * scale) + pad * 2;
  const h = Math.ceil((ascent + m.actualBoundingBoxDescent) * scale) + pad * 2;
  if (w <= pad * 2 || h <= pad * 2) return null;
  ctx.canvas.width = w;
  ctx.canvas.height = h;
  ctx.setTransform(scale, 0, 0, scale, pad + left * scale, pad + ascent * scale);
  ctx.font = font;
  ctx.fillText(char, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;
  const inked = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && (data[(y * w + x) * 4 + 3] ?? 0) > 160;
  const longest = (n: number, at: (i: number) => boolean) => {
    let mid = -1;
    let half = 0;
    let start = -1;
    for (let i = 0; i <= n; i++) {
      const on = i < n && at(i);
      if (on && start < 0) start = i;
      if (!on && start >= 0) {
        if (i - start > half * 2) {
          half = (i - start) / 2;
          mid = start + half;
        }
        start = -1;
      }
    }
    return { mid, half };
  };
  const through = (n: number, from: number, at: (i: number) => boolean) => {
    let lo = from;
    let hi = from;
    while (lo > 0 && at(lo - 1)) lo -= 1;
    while (hi < n - 1 && at(hi + 1)) hi += 1;
    return { mid: (lo + hi + 1) / 2, half: (hi - lo + 1) / 2 };
  };
  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);
  let px: number;
  let py: number;
  const column = longest(h, (y) => inked(cx, y));
  if (column.mid >= 0) {
    py = Math.floor(column.mid);
    px = through(w, cx, (x) => inked(x, py)).mid;
  } else {
    const row = longest(w, (x) => inked(x, cy));
    if (row.mid < 0) return null;
    px = Math.floor(row.mid);
    py = through(h, cy, (y) => inked(px, y)).mid;
  }
  const xi = Math.min(w - 1, Math.floor(px));
  const yi = Math.min(h - 1, Math.floor(py));
  const rx = through(w, xi, (x) => inked(x, yi)).half;
  const ry = through(h, yi, (y) => inked(xi, y)).half;
  return {
    x: (px - pad) / scale - left,
    y: (py - pad) / scale - ascent,
    rx: Math.max(0.5, rx / scale),
    ry: Math.max(0.5, ry / scale),
  };
}

export function TypeWindow({
  word = "Horizon",
  imageSrc,
  imageAlt = "",
  letter,
  progress,
  autoplay = true,
  speed = 1,
  surface = "background",
  fontWeight = 800,
  tracking = -0.04,
  fit = 0.9,
  depth = 0.5,
  interactive = true,
  paused = false,
  className,
  children,
}: TypeWindowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const dirty = useRef(true);
  const settings = useRef({ progress, autoplay, speed, fit, depth, interactive, paused });
  settings.current = { progress, autoplay, speed, fit, depth, interactive, paused };

  useEffect(() => {
    dirty.current = true;
  });

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const shade = shadeRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx || !image || !shade) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = root.clientWidth;
    let H = root.clientHeight;
    let dpr = 1;
    let ready = false;
    let color = "#fff";
    let font = `${fontWeight} ${FONT_SIZE}px sans-serif`;
    // Word geometry in font units, baseline at y = 0: each glyph's pen position, the word's width and ink box
    const chars = Array.from(word);
    const pen = new Float32Array(chars.length);
    let boxW = 1;
    let inkTop = -70;
    let inkBottom = 0;
    let fx = 0;
    let fy = -35;
    let rx = 10;
    let ry = 30;
    let shown = 0;
    let pointerX = 0;
    let pointerY = 0;
    let aimX = 0;
    let aimY = 0;
    let clock = 0;
    let last = 0;
    let frame = 0;
    let visible = true;
    let drawnShown = -1;
    let drawnX = 0;
    let drawnY = 0;

    const recolor = () => {
      color = resolveColor(canvas);
      dirty.current = true;
    };

    const locate = () => {
      const family = getComputedStyle(root).fontFamily || "sans-serif";
      font = `${fontWeight} ${FONT_SIZE}px ${family}`;
      ctx.font = font;
      const spacing = tracking * FONT_SIZE;
      let x = 0;
      for (let i = 0; i < chars.length; i++) {
        pen[i] = x;
        x += ctx.measureText(chars[i] ?? "").width + spacing;
      }
      boxW = Math.max(1, x - spacing);
      const m = ctx.measureText(word);
      inkTop = -m.actualBoundingBoxAscent;
      inkBottom = m.actualBoundingBoxDescent;

      let index = Math.min(chars.length - 1, Math.max(0, Math.round(letter ?? (chars.length - 1) / 2)));
      while (index > 0 && !(chars[index] ?? "").trim()) index -= 1;
      const spot = inkPoint(chars[index] ?? "", font);
      if (spot) {
        fx = (pen[index] ?? 0) + spot.x;
        fy = spot.y;
        rx = spot.rx;
        ry = spot.ry;
      } else {
        const width = ctx.measureText(chars[index] ?? "").width;
        fx = (pen[index] ?? 0) + width / 2;
        fy = (inkTop + inkBottom) / 2;
        rx = width * 0.1;
        ry = (inkBottom - inkTop) * 0.3;
      }
      ready = true;
      dirty.current = true;
    };

    const source = () => {
      const s = settings.current;
      if (isSource(s.progress)) return clamp01(s.progress.get());
      if (s.autoplay && !reduce) return loop(((clock * Math.max(0.1, s.speed)) / CYCLE) % 1);
      return typeof s.progress === "number" ? clamp01(s.progress) : 0;
    };

    const write = () => {
      const s = settings.current;
      const e = smooth(shown);
      const inkH = Math.max(1, inkBottom - inkTop);
      const base = Math.min((W * Math.min(1, Math.max(0.2, s.fit))) / boxW, (H * 0.62) / inkH);
      const x0 = W / 2 - (boxW / 2) * base;
      const y0 = H / 2 - (inkTop + inkH / 2) * base;
      // The word never moves or breaks apart: it only grows around the middle of the chosen letter's stroke
      const sx = x0 + fx * base;
      const sy = y0 + fy * base;
      // The scale at which that stroke covers the whole frame from its middle; reached at 88% of the flight
      const cover = Math.max(base * 1.5, (Math.max(sx, W - sx) / rx) * 1.04, (Math.max(sy, H - sy) / ry) * 1.04);
      const k = base * (cover / base) ** (e / 0.88);
      const tx = sx - fx * k;
      const ty = sy - fy * k;

      // Once the stroke has covered the frame the surface lifts, so nothing is left to catch the eye
      const open = 1 - smooth((e - 0.86) / 0.12);
      canvas.style.opacity = open.toFixed(3);
      canvas.style.visibility = open < 0.005 ? "hidden" : "visible";
      if (open >= 0.005) {
        // The surface, with the word cut out of it; glyphs are drawn as outlines, so they stay put at any scale
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#000";
        ctx.setTransform(k * dpr, 0, 0, k * dpr, tx * dpr, ty * dpr);
        ctx.font = font;
        ctx.textBaseline = "alphabetic";
        for (let i = 0; i < chars.length; i++) {
          // Skip glyphs that have flown off the frame
          const left = (pen[i] ?? 0) * k + tx;
          if (left > W * 2 || left < -W * 4) continue;
          ctx.fillText(chars[i] ?? "", pen[i] ?? 0, 0);
        }
      }

      // The photograph grows gently around the same point, so the scene travels with the letter
      const grow = 1.06 + Math.min(1, Math.max(0, s.depth)) * 0.3 * e;
      const minX = W * (1 - grow);
      const minY = H * (1 - grow);
      const ix = Math.min(0, Math.max(minX, sx * (1 - grow) + pointerX * W * 0.012));
      const iy = Math.min(0, Math.max(minY, sy * (1 - grow) + pointerY * H * 0.012));
      image.style.transform = `translate3d(${ix.toFixed(2)}px, ${iy.toFixed(2)}px, 0) scale(${grow.toFixed(4)})`;
      shade.style.opacity = ((1 - e) * 0.85).toFixed(3);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const s = settings.current;
      if (!s.paused) clock += dt;
      const target = source();
      shown = reduce ? target : shown + (target - shown) * (1 - Math.exp(-dt * 9));
      if (Math.abs(target - shown) < 1e-4) shown = target;
      const follow = s.interactive && !reduce;
      pointerX += ((follow ? aimX : 0) - pointerX) * (1 - Math.exp(-dt * 3));
      pointerY += ((follow ? aimY : 0) - pointerY) * (1 - Math.exp(-dt * 3));
      if (
        ready &&
        (dirty.current ||
          Math.abs(shown - drawnShown) > 1e-5 ||
          Math.abs(pointerX - drawnX) > 1e-4 ||
          Math.abs(pointerY - drawnY) > 1e-4)
      ) {
        dirty.current = false;
        drawnShown = shown;
        drawnX = pointerX;
        drawnY = pointerY;
        write();
      }
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      W = root.clientWidth;
      H = root.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      dirty.current = true;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = root.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      aimX = inside ? ((event.clientX - rect.left) / rect.width) * 2 - 1 : 0;
      aimY = inside ? ((event.clientY - rect.top) / rect.height) * 2 - 1 : 0;
    };
    const onVisibility = () => play();
    const onFonts = () => locate();

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    // Themes can be scoped to any wrapper, not just <html>, so every ancestor is watched for token changes
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        recolor();
      });
    });
    for (let node = root.parentElement; node; node = node.parentElement) {
      mo.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    document.fonts?.addEventListener("loadingdone", onFonts);
    resize();
    recolor();
    shown = source();
    locate();
    document.fonts?.ready.then(() => locate());
    play();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      document.fonts?.removeEventListener("loadingdone", onFonts);
    };
  }, [word, letter, fontWeight, tracking]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)}>
      <span className="sr-only">{word}</span>
      <img
        ref={imageRef}
        src={imageSrc}
        alt={imageAlt}
        decoding="async"
        className="absolute inset-0 size-full origin-top-left object-cover will-change-transform"
      />
      <div
        ref={shadeRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 size-full", surface === "foreground" ? "text-foreground" : "text-background")}
      />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
