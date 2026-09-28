"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";

export interface BlobMaskProps {
  /** Photo shown inside the blob. */
  src: string;
  /** Description of the photo for screen readers. */
  alt?: string;
  /** Color behind the photo while it loads. Any CSS color. */
  fillColor?: string;
  /** Color of the trailing outline blob. */
  outlineColor?: string;
  /** Draw the offset outline blob behind the photo. */
  outline?: boolean;
  /** How far the outline blob sits from the photo, 0 to 1. */
  outlineOffset?: number;
  /** Number of lobes the blob is built from, 5 to 14. */
  points?: number;
  /** How much the edge breathes, 0 (a still circle) to 1. */
  wobble?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** How far the edge swells toward the cursor, 0 to 1. */
  bulge?: number;
  /** The edge swells toward the cursor. */
  interactive?: boolean;
  /** Freeze the shape where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const blobMaskDemo: BlobMaskProps = {
  src: "https://images.unsplash.com/photo-1617897903246-719242758050?w=1600&q=80",
  alt: "A dropper bottle of golden oil on a round wooden board beside a sprig of eucalyptus",
  fillColor: "#dccbb9",
  outlineColor: "#b07a5b",
  outline: true,
  outlineOffset: 0.5,
  points: 9,
  wobble: 0.5,
  speed: 1,
  bulge: 0.5,
  interactive: true,
  className: "aspect-square max-w-[560px]",
};

const TAU = Math.PI * 2;

// Per-point frequencies and phases so every lobe breathes on its own
function makeSeeds(count: number, seed: number) {
  const out = new Float32Array(count * 4);
  for (let i = 0; i < count * 4; i++) {
    const s = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
    out[i] = s - Math.floor(s);
  }
  return out;
}

function blobPath(
  count: number,
  time: number,
  seeds: Float32Array,
  radius: number,
  wobble: number,
  bulge: Float32Array,
  xs: Float32Array,
  ys: Float32Array,
) {
  const at = (values: Float32Array, index: number) => values[(index + count) % count] ?? 50;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * TAU;
    const a = seeds[i * 4] ?? 0;
    const b = seeds[i * 4 + 1] ?? 0;
    const c = seeds[i * 4 + 2] ?? 0;
    const d = seeds[i * 4 + 3] ?? 0;
    const breath = 0.15 * Math.sin(time * (0.35 + a * 0.4) + b * TAU) + 0.09 * Math.sin(time * (0.6 + c * 0.5) + d * TAU);
    const r = radius * (1 + breath * wobble) + (bulge[i] ?? 0);
    xs[i] = 50 + Math.cos(angle) * r;
    ys[i] = 50 + Math.sin(angle) * r;
  }
  let path = `M${at(xs, 0).toFixed(2)} ${at(ys, 0).toFixed(2)}`;
  for (let i = 0; i < count; i++) {
    const c1x = at(xs, i) + (at(xs, i + 1) - at(xs, i - 1)) / 6;
    const c1y = at(ys, i) + (at(ys, i + 1) - at(ys, i - 1)) / 6;
    const c2x = at(xs, i + 1) - (at(xs, i + 2) - at(xs, i)) / 6;
    const c2y = at(ys, i + 1) - (at(ys, i + 2) - at(ys, i)) / 6;
    path += `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${at(xs, i + 1).toFixed(2)} ${at(ys, i + 1).toFixed(2)}`;
  }
  return `${path}Z`;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function BlobMask({
  src,
  alt,
  fillColor = "#dccbb9",
  outlineColor = "#b07a5b",
  outline = true,
  outlineOffset = 0.5,
  points = 9,
  wobble = 0.5,
  speed = 1,
  bulge = 0.5,
  interactive = true,
  paused = false,
  className,
  children,
}: BlobMaskProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const outlineRef = useRef<SVGPathElement>(null);
  const clipId = `blob-mask-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ wobble, speed, bulge, interactive, paused });
  settings.current = { wobble, speed, bulge, interactive, paused };
  const refresh = useRef<() => void>(() => {});
  const count = Math.round(Math.min(14, Math.max(5, points)));

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const clip = clipRef.current;
    const ring = outlineRef.current;
    if (!svg || !clip) return;

    const seedsA = makeSeeds(count, 1);
    const seedsB = makeSeeds(count, 7);
    const xs = new Float32Array(count);
    const ys = new Float32Array(count);
    const swell = new Float32Array(count);
    const none = new Float32Array(count);
    const pointer = { x: 50, y: 50, active: false };
    let strength = 0;
    let time = 4;
    let frame = 0;
    let visible = true;
    let last = 0;

    const draw = () => {
      const s = settings.current;
      strength += ((pointer.active && s.interactive ? 1 : 0) - strength) * 0.06;
      const dx = pointer.x - 50;
      const dy = pointer.y - 50;
      const dist = Math.hypot(dx, dy);
      const toward = Math.atan2(dy, dx);
      const reach = Math.max(0, Math.min(1, 1 - (dist - 30) / 45)) * strength;
      const amount = clamp01(s.bulge) * 14;
      for (let i = 0; i < count; i++) {
        const facing = Math.max(0, Math.cos((i / count) * TAU - toward));
        const target = facing * facing * facing * reach * amount;
        const now = swell[i] ?? 0;
        swell[i] = now + (target - now) * 0.12;
      }
      const w = clamp01(s.wobble);
      clip.setAttribute("d", blobPath(count, time, seedsA, 38, w, swell, xs, ys));
      ring?.setAttribute("d", blobPath(count, time * 0.8 + 11, seedsB, 40, w, none, xs, ys));
    };

    const loop = (now: number) => {
      const delta = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      time += delta * settings.current.speed;
      draw();
      frame = requestAnimationFrame(loop);
    };
    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    refresh.current = () => {
      play();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = svg.getBoundingClientRect();
      const x = ((event.clientX - box.left) / Math.max(1, box.width)) * 100;
      const y = ((event.clientY - box.top) / Math.max(1, box.height)) * 100;
      // Wake up a little outside the shape so the swell starts before the cursor arrives
      pointer.active = x > -50 && x < 150 && y > -50 && y < 150;
      pointer.x = x;
      pointer.y = y;
    };
    const onVisibility = () => play();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(svg);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    draw();
    play();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, count, outline]);

  useEffect(() => {
    refresh.current();
  }, [wobble, speed, bulge, interactive, paused]);

  const shift = clamp01(outlineOffset);

  return (
    <div className={cn("relative isolate w-full", className)}>
      <svg ref={svgRef} viewBox="0 0 100 100" role="img" aria-label={alt} className="absolute inset-0 size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <path ref={clipRef} d="M88 50C88 71 71 88 50 88C29 88 12 71 12 50C12 29 29 12 50 12C71 12 88 29 88 50Z" />
          </clipPath>
        </defs>
        {outline && (
          <path
            ref={outlineRef}
            d="M90 50C90 72 72 90 50 90C28 90 10 72 10 50C10 28 28 10 50 10C72 10 90 28 90 50Z"
            transform={`translate(${(shift * 7).toFixed(2)} ${(shift * 9).toFixed(2)})`}
            fill="none"
            stroke={outlineColor}
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
          />
        )}
        <rect x="0" y="0" width="100" height="100" fill={fillColor} clipPath={`url(#${clipId})`} />
        <image href={src} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />
      </svg>
      {children && <div className="absolute inset-0">{children}</div>}
    </div>
  );
}
