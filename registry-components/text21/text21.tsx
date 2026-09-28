"use client";

import { type ElementType, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Text21Props {
  /** The text to set; every letter is sampled into particles */
  text: string;
  /** Element the text renders as */
  as?: Tag;
  /** Particle color. "currentColor" follows the text color; any CSS color or token works */
  color?: string;
  /** Color particles take while they are moving */
  accentColor?: string;
  /** How finely the letters are sampled, 0 (coarse) to 1 (dense) */
  density?: number;
  /** Upper bound on particles, whatever the size of the text */
  maxParticles?: number;
  /** Particle size relative to the sampling grid, 0 to 1 */
  size?: number;
  /** How hard the cursor scatters particles, 0 to 1 */
  force?: number;
  /** Radius around the cursor that scatters particles, in pixels */
  reach?: number;
  /** How quickly particles pull back into their letters, 0 to 1 */
  spring?: number;
  /** Sideways swirl around the cursor, 0 to 1 */
  swirl?: number;
  /** Brightness flicker of particles at rest, 0 to 1 */
  shimmer?: number;
  /** Particles fly in from a ring on mount */
  entrance?: boolean;
  /** Particles scatter from the cursor */
  interactive?: boolean;
  /** A slow invisible pointer keeps the letters moving when nobody is pointing */
  idle?: boolean;
  className?: string;
}

export const text21Demo: Text21Props = {
  text: "Every letter, loose.",
  as: "h2",
  className: "text-7xl font-semibold leading-[0.92] tracking-[-0.04em] md:text-9xl",
};

const HARD_CAP = 12000;

// Resolves a CSS color (tokens and oklch included) to an rgb() string the canvas accepts everywhere
function resolveColor(el: HTMLElement, color: string) {
  let computed = getComputedStyle(el).color;
  if (color !== "currentColor") {
    const previous = el.style.color;
    el.style.color = color;
    computed = getComputedStyle(el).color;
    el.style.color = previous;
  }
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

export function Text21({
  text,
  as = "p",
  color = "currentColor",
  accentColor = "var(--primary)",
  density = 0.5,
  maxParticles = 9000,
  size = 0.5,
  force = 0.5,
  reach = 160,
  spring = 0.5,
  swirl = 0.5,
  shimmer = 0.5,
  entrance = true,
  interactive = true,
  idle = true,
  className,
}: Text21Props) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ color, accentColor, force, reach, spring, swirl, shimmer, interactive, idle });
  settings.current = { color, accentColor, force, reach, spring, swirl, shimmer, interactive, idle };
  const rebuild = useRef<() => void>(() => {});
  const recolor = useRef<() => void>(() => {});
  const Tag = as as ElementType;
  const bleed = Math.max(0, reach);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const probe = document.createElement("canvas");
    const pctx = probe.getContext("2d", { willReadFrequently: true });
    if (!root || !canvas || !ctx || !pctx || !text) return;

    const cap = Math.min(HARD_CAP, Math.max(100, Math.round(maxParticles)));
    const px = new Float32Array(cap);
    const py = new Float32Array(cap);
    const vx = new Float32Array(cap);
    const vy = new Float32Array(cap);
    const tx = new Float32Array(cap);
    const ty = new Float32Array(cap);
    const seed = new Float32Array(cap);
    for (let i = 0; i < cap; i++) seed[i] = Math.random() * Math.PI * 2;

    let count = 0;
    let dot = 2;
    let dpr = 1;
    let width = 1;
    let height = 1;
    let ink = "#111";
    let accent = "#e4572e";
    let frame = 0;
    let visible = true;
    let built = false;
    let disposed = false;
    let quality = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    const start = performance.now();
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };

    const readColors = () => {
      ink = resolveColor(root, settings.current.color);
      accent = resolveColor(root, settings.current.accentColor);
    };

    const build = () => {
      if (disposed) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      probe.width = Math.max(1, Math.ceil(width));
      probe.height = Math.max(1, Math.ceil(height));

      // Draw every word where the page laid it out, in the element's own font
      const style = getComputedStyle(root);
      const fontSize = Number.parseFloat(style.fontSize) || 16;
      pctx.clearRect(0, 0, probe.width, probe.height);
      pctx.fillStyle = "#000";
      pctx.textBaseline = "alphabetic";
      pctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const spaced = pctx as CanvasRenderingContext2D & { letterSpacing?: string };
      if ("letterSpacing" in spaced) spaced.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
      const metrics = pctx.measureText("Hg");
      const ascent = metrics.fontBoundingBoxAscent || fontSize * 0.8;
      const descent = metrics.fontBoundingBoxDescent || fontSize * 0.2;
      const origin = canvas.getBoundingClientRect();
      for (const word of root.querySelectorAll<HTMLSpanElement>("[data-word]")) {
        const label = word.textContent ?? "";
        for (const rect of word.getClientRects()) {
          const top = rect.top - origin.top + (rect.height - ascent - descent) / 2;
          pctx.fillText(label, rect.left - origin.left, top + ascent);
        }
      }

      const data = pctx.getImageData(0, 0, probe.width, probe.height).data;
      const w = probe.width;
      let gap = Math.max(2, Math.round(fontSize / ((40 + clamp01(density) * 60) * quality)));
      for (let tries = 0; tries < 10; tries++) {
        let found = 0;
        for (let y = 0; y < probe.height; y += gap) for (let x = 0; x < w; x += gap) if ((data[(y * w + x) * 4 + 3] ?? 0) > 128) found++;
        if (found <= cap) break;
        gap++;
      }

      const previous = count;
      count = 0;
      for (let y = 0; y < probe.height && count < cap; y += gap) {
        for (let x = 0; x < w && count < cap; x += gap) {
          if ((data[(y * w + x) * 4 + 3] ?? 0) <= 128) continue;
          const i = count++;
          tx[i] = x;
          ty[i] = y;
          if (i >= previous || !built) {
            if (reduce || !entrance) {
              px[i] = x;
              py[i] = y;
            } else {
              const angle = (seed[i] ?? 0) * 3;
              const radius = Math.max(width, height) * (0.3 + Math.random() * 0.5);
              px[i] = width * 0.5 + Math.cos(angle) * radius;
              py[i] = height * 0.5 + Math.sin(angle) * radius;
            }
            vx[i] = 0;
            vy[i] = 0;
          }
        }
      }
      dot = Math.max(1.1, gap * (0.35 + clamp01(size) * 0.55));
      built = true;
      readColors();
      draw(0);
      setReady(true);
    };

    const draw = (time: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const half = dot * 0.5;
      const flicker = clamp01(settings.current.shimmer) * 0.56;
      // Three shimmer buckets at rest, one accent bucket for moving particles
      for (let bucket = 0; bucket < 4; bucket++) {
        ctx.beginPath();
        for (let i = bucket < 3 ? bucket : 0; i < count; i += bucket < 3 ? 3 : 1) {
          const u = vx[i] ?? 0;
          const v = vy[i] ?? 0;
          if ((bucket === 3) !== u * u + v * v > 1.2) continue;
          ctx.rect((px[i] ?? 0) - half, (py[i] ?? 0) - half, dot, dot);
        }
        ctx.fillStyle = bucket === 3 ? accent : ink;
        ctx.globalAlpha = bucket === 3 ? 0.95 : reduce ? 1 : 1 - flicker / 2 + (flicker / 2) * Math.sin(time * 1.6 + bucket * 2.1);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = (time: number) => {
      const s = settings.current;
      let mx = pointer.x;
      let my = pointer.y;
      let strength = 1;
      if (!(s.interactive && pointer.active)) {
        if (!s.idle) {
          mx = -99999;
          my = -99999;
        } else {
          mx = width * (0.5 + 0.42 * Math.sin(time * 0.23));
          my = height * (0.55 + 0.25 * Math.sin(time * 0.37 + 1.3));
          strength = 0.45;
        }
      }
      pointer.vx *= 0.85;
      pointer.vy *= 0.85;
      const radius = Math.max(20, s.reach);
      const radius2 = radius * radius;
      const pull = 0.015 + clamp01(s.spring) * 0.06;
      const push = clamp01(s.force) * 11;
      const turn = clamp01(s.swirl) * 2.8;
      for (let i = 0; i < count; i++) {
        const sd = seed[i] ?? 0;
        const x = px[i] ?? 0;
        const y = py[i] ?? 0;
        const gx = (tx[i] ?? 0) + Math.sin(time * 1.3 + sd * 5) * 0.7;
        const gy = (ty[i] ?? 0) + Math.cos(time * 1.1 + sd * 7) * 0.7;
        let ax = (gx - x) * pull;
        let ay = (gy - y) * pull;
        const dx = x - mx;
        const dy = y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < radius2) {
          const d = Math.sqrt(d2) + 0.001;
          const f = (1 - d / radius) * strength;
          ax += (dx / d) * f * push + pointer.vx * f * 0.08 - (dy / d) * f * turn;
          ay += (dy / d) * f * push + pointer.vy * f * 0.08 + (dx / d) * f * turn;
        }
        const nvx = ((vx[i] ?? 0) + ax) * 0.86;
        const nvy = ((vy[i] ?? 0) + ay) * 0.86;
        vx[i] = nvx;
        vy[i] = nvy;
        px[i] = x + nvx;
        py[i] = y + nvy;
      }
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      average += (delta - average) * 0.05;
      lastFrame = now;
      tick++;
      // Coarser sampling on a device that can't keep up
      if (tick % 120 === 0 && average > 22 && quality > 0.5) {
        quality = Math.max(0.5, quality - 0.15);
        build();
      }
      const time = (now - start) / 1000;
      step(time);
      draw(time);
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && visible && built && !document.hidden) frame = requestAnimationFrame(loop);
    };

    rebuild.current = () => {
      build();
      play();
    };
    recolor.current = () => {
      readColors();
      draw((performance.now() - start) / 1000);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height && event.pointerType !== "touch";
      if (inside && pointer.active) {
        pointer.vx = x - pointer.x;
        pointer.vy = y - pointer.y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.active = inside;
    };
    const onVisibility = () => play();

    // Only the text box is observed: the canvas takes its size from it, so watching both would feed back
    const ro = new ResizeObserver(() => rebuild.current());
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    const mo = new MutationObserver(() => requestAnimationFrame(() => recolor.current()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    document.fonts?.ready.then(() => {
      if (!disposed) rebuild.current();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      rebuild.current = () => {};
      recolor.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [text, reduce, density, maxParticles, size, entrance]);

  useEffect(() => {
    recolor.current();
  }, [color, accentColor]);

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag ref={rootRef} className={cn("relative", className)}>
      {words.map((word, index) => (
        <span key={index}>
          {index > 0 && " "}
          <span data-word="" className={cn(ready && "[-webkit-text-fill-color:transparent]")}>
            {word}
          </span>
        </span>
      ))}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ left: -bleed, top: -bleed, width: `calc(100% + ${bleed * 2}px)`, height: `calc(100% + ${bleed * 2}px)` }}
      />
    </Tag>
  );
}
