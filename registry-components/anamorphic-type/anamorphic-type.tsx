"use client";

import { type ElementType, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "div";
type Fragment = "dots" | "dashes";

export interface AnamorphicTypeProps {
  /** The statement; it only reads from one exact viewpoint */
  text: string;
  /** Element the text renders as; screen readers always get the plain text */
  as?: Tag;
  /** How finely the letters are cut into fragments, 0 (coarse) to 1 (fine) */
  density?: number;
  /** How deep the fragments are scattered, 0 (shallow) to 1 (deep) */
  depth?: number;
  /** How far the camera wanders away from the true viewpoint, 0 to 1 */
  orbit?: number;
  /** Seconds between the moments the words snap into focus */
  interval?: number;
  /** Seconds the words hold in focus */
  hold?: number;
  /** Shape of each fragment */
  fragment?: Fragment;
  /** Color of the fragments. "currentColor" follows the text color; any CSS color or token works */
  color?: string;
  /** Color of the accent fragments */
  accentColor?: string;
  /** Share of fragments drawn in the accent color, 0 to 1 */
  accent?: number;
  /** The cursor steers the camera; the center of the text is the true viewpoint */
  interactive?: boolean;
  /** Hold the camera where it is */
  paused?: boolean;
  className?: string;
}

export const anamorphicTypeDemo: AnamorphicTypeProps = {
  text: "It only makes sense from here.",
  as: "h2",
  className: "max-w-4xl text-center text-6xl font-semibold leading-[1] tracking-[-0.045em] md:text-8xl",
};

const HARD_CAP = 9000;

// Resolves any CSS color (tokens and oklch included) to an rgb() string the canvas accepts everywhere
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
const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

export function AnamorphicType({
  text,
  as = "div",
  density = 0.5,
  depth = 0.5,
  orbit = 0.5,
  interval = 6,
  hold = 2.2,
  fragment = "dots",
  color = "currentColor",
  accentColor = "var(--primary)",
  accent = 0.08,
  interactive = true,
  paused = false,
  className,
}: AnamorphicTypeProps) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const settings = useRef({ orbit, interval, hold, fragment, color, accentColor, interactive, paused });
  settings.current = { orbit, interval, hold, fragment, color, accentColor, interactive, paused };
  const recolor = useRef<() => void>(() => {});
  const Tag = as as ElementType;
  const spread = clamp01(depth);
  // The canvas reaches past the text box, since fragments swing wider than the words when seen off-axis
  const bleedX = 40 + spread * 160;
  const bleedY = 30 + spread * 90;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const probe = document.createElement("canvas");
    const pctx = probe.getContext("2d", { willReadFrequently: true });
    if (!root || !canvas || !ctx || !pctx) {
      setFailed(true);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const px = new Float32Array(HARD_CAP);
    const py = new Float32Array(HARD_CAP);
    const pz = new Float32Array(HARD_CAP);
    const turn = new Float32Array(HARD_CAP);
    const tone = new Uint8Array(HARD_CAP);
    let count = 0;
    let gap = 3;
    let boxW = 1;
    let boxH = 1;
    let focal = 1;
    let dpr = 1;
    let ink = "#111";
    let hue = "#e4572e";
    let frame = 0;
    let visible = true;
    let disposed = false;
    let stride = 1;
    let average = 16.7;
    let last = 0;
    let clock = 0;
    let tick = 0;
    const camera = { yaw: 0.6, pitch: -0.25, vyaw: 0, vpitch: 0 };
    const pointer = { x: 0, y: 0, inside: false };

    const readColors = () => {
      ink = resolveColor(root, settings.current.color);
      hue = resolveColor(root, settings.current.accentColor);
    };

    // Trace the words where the page laid them out, in the element's own font, then scatter them in depth
    const build = () => {
      if (disposed) return;
      const rect = root.getBoundingClientRect();
      boxW = Math.max(1, rect.width);
      boxH = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round((boxW + bleedX * 2) * dpr));
      canvas.height = Math.max(1, Math.round((boxH + bleedY * 2) * dpr));
      probe.width = Math.ceil(boxW);
      probe.height = Math.ceil(boxH);

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
      for (const word of root.querySelectorAll<HTMLSpanElement>("[data-word]")) {
        const label = word.textContent ?? "";
        for (const box of word.getClientRects()) {
          const top = box.top - rect.top + (box.height - ascent - descent) / 2;
          pctx.fillText(label, box.left - rect.left, top + ascent);
        }
      }

      const data = pctx.getImageData(0, 0, probe.width, probe.height).data;
      const w = probe.width;
      gap = Math.max(2, Math.round(fontSize / (10 + clamp01(density) * 22)));
      for (let tries = 0; tries < 12; tries++) {
        let found = 0;
        for (let y = 0; y < probe.height; y += gap) for (let x = 0; x < w; x += gap) if ((data[(y * w + x) * 4 + 3] ?? 0) > 128) found++;
        if (found <= HARD_CAP) break;
        gap++;
      }

      focal = boxW * 1.6;
      const range = boxW * (0.12 + spread * 0.7);
      const share = clamp01(accent);
      const cx = boxW / 2;
      const cy = boxH / 2;
      count = 0;
      let seed = 7;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      for (let y = 0; y < probe.height && count < HARD_CAP; y += gap) {
        for (let x = 0; x < w && count < HARD_CAP; x += gap) {
          if ((data[(y * w + x) * 4 + 3] ?? 0) <= 128) continue;
          const z = (random() * 2 - 1) * range;
          // Place the fragment on the sight line through its letter pixel, so the true view reads exactly
          const k = (focal - z) / focal;
          const i = count++;
          px[i] = (x + gap / 2 - cx) * k;
          py[i] = (y + gap / 2 - cy) * k;
          pz[i] = z;
          turn[i] = random() * Math.PI;
          tone[i] = random() < share ? 1 : 0;
        }
      }
      readColors();
      setReady(true);
      draw();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, boxW + bleedX * 2, boxH + bleedY * 2);
      const cyaw = Math.cos(camera.yaw);
      const syaw = Math.sin(camera.yaw);
      const cpitch = Math.cos(camera.pitch);
      const spitch = Math.sin(camera.pitch);
      const ox = bleedX + boxW / 2;
      const oy = bleedY + boxH / 2;
      const dash = settings.current.fragment === "dashes";
      const base = gap * (dash ? 0.5 : 0.62);
      // Four buckets: three depth bands in ink, one in accent, each filled or stroked in a single call
      for (let bucket = 0; bucket < 4; bucket++) {
        const accentPass = bucket === 3;
        ctx.beginPath();
        for (let i = 0; i < count; i += stride) {
          if ((tone[i] === 1) !== accentPass) continue;
          const x = px[i] ?? 0;
          const y = py[i] ?? 0;
          const z = pz[i] ?? 0;
          const x1 = x * cyaw + z * syaw;
          const z1 = -x * syaw + z * cyaw;
          const y2 = y * cpitch - z1 * spitch;
          const z2 = y * spitch + z1 * cpitch;
          const scale = focal / Math.max(1, focal - z2);
          if (!accentPass) {
            const band = scale < 0.93 ? 0 : scale < 1.07 ? 1 : 2;
            if (band !== bucket) continue;
          }
          const sx = ox + x1 * scale;
          const sy = oy + y2 * scale;
          const size = base * scale;
          if (dash) {
            const a = turn[i] ?? 0;
            const dx = Math.cos(a) * size;
            const dy = Math.sin(a) * size;
            ctx.moveTo(sx - dx, sy - dy);
            ctx.lineTo(sx + dx, sy + dy);
          } else {
            ctx.rect(sx - size / 2, sy - size / 2, size, size);
          }
        }
        ctx.globalAlpha = accentPass ? 1 : bucket === 0 ? 0.55 : bucket === 1 ? 0.8 : 1;
        if (dash) {
          ctx.strokeStyle = accentPass ? hue : ink;
          ctx.lineWidth = Math.max(1, gap * 0.28);
          ctx.lineCap = "round";
          ctx.stroke();
        } else {
          ctx.fillStyle = accentPass ? hue : ink;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    // Where the camera wants to be: wandering most of the time, easing into the true view every few seconds
    const aim = (out: { yaw: number; pitch: number }) => {
      const s = settings.current;
      const reach = 0.25 + clamp01(s.orbit) * 0.85;
      if (s.interactive && pointer.inside) {
        out.yaw = pointer.x * reach;
        out.pitch = -pointer.y * reach * 0.6;
        return;
      }
      const drift = Math.max(1.5, s.interval);
      const rest = Math.max(0.3, s.hold);
      const period = drift + rest + 2.4;
      const t = clock % period;
      // 1.2s in, hold, 1.2s out, then the wander
      const focus = t < 1.2 ? smooth(t / 1.2) : t < 1.2 + rest ? 1 : t < 2.4 + rest ? 1 - smooth((t - 1.2 - rest) / 1.2) : 0;
      const wander = 1 - focus;
      out.yaw = (Math.sin(clock * 0.21) * 0.8 + Math.sin(clock * 0.13 + 1.3) * 0.35) * reach * wander;
      out.pitch = (Math.sin(clock * 0.17 + 0.6) * 0.5 + Math.sin(clock * 0.29) * 0.2) * reach * wander;
    };
    const goal = { yaw: 0, pitch: 0 };

    const loop = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      average += (dt * 1000 - average) * 0.05;
      tick++;
      if (tick % 90 === 0) {
        // Draw fewer fragments on a device that can't keep up, more once it has room again
        if (average > 22 && stride < 3) stride++;
        else if (average < 17 && stride > 1) stride--;
      }
      if (!settings.current.paused) {
        clock += dt;
        aim(goal);
        const k = 38;
        const c = 2 * Math.sqrt(k);
        camera.vyaw += ((goal.yaw - camera.yaw) * k - camera.vyaw * c) * dt;
        camera.vpitch += ((goal.pitch - camera.pitch) * k - camera.vpitch * c) * dt;
        camera.yaw += camera.vyaw * dt;
        camera.pitch += camera.vpitch * dt;
        draw();
      }
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduce && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    recolor.current = () => {
      readColors();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        pointer.inside = false;
        return;
      }
      const rect = root.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / Math.max(1, rect.width / 2 + bleedX);
      const y = (event.clientY - rect.top - rect.height / 2) / Math.max(1, rect.height / 2 + bleedY);
      pointer.inside = Math.abs(x) <= 1 && Math.abs(y) <= 1;
      pointer.x = x;
      pointer.y = y;
    };
    const onVisibility = () => play();

    if (reduce) {
      camera.yaw = 0;
      camera.pitch = 0;
    }

    const ro = new ResizeObserver(() => {
      build();
      play();
    });
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
      if (!disposed) build();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      recolor.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [text, density, depth, accent, bleedX, bleedY, spread]);

  useEffect(() => {
    recolor.current();
  }, [color, accentColor]);

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag ref={rootRef} className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      {/* Laid out invisibly so the fragments are traced from the real line breaks and font */}
      <span aria-hidden="true" className={cn(ready && !failed && "invisible")}>
        {words.map((word, index) => (
          <span key={index}>
            {index > 0 && " "}
            <span data-word="">{word}</span>
          </span>
        ))}
      </span>
      {!failed && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: -bleedX, top: -bleedY, width: `calc(100% + ${bleedX * 2}px)`, height: `calc(100% + ${bleedY * 2}px)` }}
        />
      )}
    </Tag>
  );
}
