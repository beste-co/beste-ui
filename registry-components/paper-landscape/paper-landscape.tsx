"use client";

import { cn } from "@/lib/utils";
import { type MotionValue, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";

export interface PaperLandscapeProps {
  /** Six hill colors from the farthest layer to the nearest */
  palette?: string[];
  /** Color of the paper behind the hills and of the mist between them. Any CSS color, tokens included. */
  paperColor?: string;
  /** Show the low sun that sets behind the far hills on scroll */
  sun?: boolean;
  /** Color of the sun; its highlight and rim are mixed from it */
  sunColor?: string;
  /** Show the drifting paper clouds */
  clouds?: boolean;
  /** Color of the clouds */
  cloudColor?: string;
  /** Birds in the flock, 0 to 5 */
  birds?: number;
  /** Color of the birds; the nearest hill color when omitted */
  birdColor?: string;
  /** Soft mist between the hill layers */
  mist?: boolean;
  /** How many trees grow on the hills, 0 (bare) to 1 (dense woods) */
  trees?: number;
  /** Depth of the pointer and scroll parallax, 0 (flat) to 1 */
  parallax?: number;
  /** Layers follow the cursor */
  interactive?: boolean;
  /** Freeze birds, clouds and parallax */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const paperLandscapeDemo: PaperLandscapeProps = {
  palette: ["#efdcbc", "#e6c89c", "#d9ab7a", "#c4845a", "#985a3d", "#5c3426"],
  paperColor: "#f6ead6",
  sun: true,
  sunColor: "#f19a64",
  clouds: true,
  cloudColor: "#fdf7ec",
  birds: 5,
  mist: true,
  trees: 0.5,
  parallax: 0.5,
  interactive: true,
  className: "min-h-[32rem]",
};

type Species = "cypress" | "pine" | "round";

interface LayerSpec {
  base: number;
  amp: number;
  freq: number;
  seed: number;
  color: string;
  depth: number;
  clusters: number;
  perCluster: number;
  treeHeight: number;
  species: Species[];
  mist: boolean;
}

const LAYERS: LayerSpec[] = [
  { base: 500, amp: 110, freq: 0.9, seed: 1, color: "#efdcbc", depth: 0.08, clusters: 0, perCluster: 0, treeHeight: 0, species: [], mist: false },
  { base: 575, amp: 120, freq: 1.3, seed: 2, color: "#e6c89c", depth: 0.2, clusters: 0, perCluster: 0, treeHeight: 0, species: [], mist: true },
  { base: 640, amp: 95, freq: 1.7, seed: 3, color: "#d9ab7a", depth: 0.36, clusters: 3, perCluster: 5, treeHeight: 46, species: ["cypress", "cypress", "pine"], mist: true },
  { base: 710, amp: 85, freq: 1.1, seed: 4, color: "#c4845a", depth: 0.56, clusters: 3, perCluster: 4, treeHeight: 70, species: ["pine", "cypress", "pine", "round"], mist: false },
  { base: 785, amp: 70, freq: 1.9, seed: 5, color: "#985a3d", depth: 0.78, clusters: 2, perCluster: 4, treeHeight: 104, species: ["pine", "round", "pine"], mist: true },
  { base: 860, amp: 55, freq: 0.7, seed: 6, color: "#5c3426", depth: 1, clusters: 2, perCluster: 3, treeHeight: 150, species: ["round", "pine", "round"], mist: false },
];

function rand(n: number) {
  const s = Math.sin(n * 91.345 + 12.9) * 43758.5453;
  return s - Math.floor(s);
}

function r1(n: number) {
  return Math.round(n * 10) / 10;
}

function cypress(x: number, y: number, h: number) {
  const w = h * 0.15;
  return ` M${r1(x)} ${r1(y - h)} C${r1(x + w * 0.9)} ${r1(y - h * 0.72)} ${r1(x + w * 1.1)} ${r1(y - h * 0.25)} ${r1(x + w * 0.35)} ${r1(y)} L${r1(x - w * 0.35)} ${r1(y)} C${r1(x - w * 1.1)} ${r1(y - h * 0.25)} ${r1(x - w * 0.9)} ${r1(y - h * 0.72)} ${r1(x)} ${r1(y - h)} Z`;
}

function pine(x: number, y: number, h: number) {
  let d = "";
  const tiers = 4;
  let lastBottom = y;
  for (let k = 0; k < tiers; k++) {
    const top = y - h + k * h * 0.18;
    const bottom = top + h * (0.34 + k * 0.02);
    const w = h * (0.12 + k * 0.07);
    d += ` M${r1(x)} ${r1(top)} Q${r1(x + w * 0.3)} ${r1(bottom - h * 0.16)} ${r1(x + w)} ${r1(bottom)} Q${r1(x + w * 0.45)} ${r1(bottom - h * 0.07)} ${r1(x)} ${r1(bottom - h * 0.035)} Q${r1(x - w * 0.45)} ${r1(bottom - h * 0.07)} ${r1(x - w)} ${r1(bottom)} Q${r1(x - w * 0.3)} ${r1(bottom - h * 0.16)} ${r1(x)} ${r1(top)} Z`;
    lastBottom = bottom;
  }
  const t = h * 0.028;
  d += ` M${r1(x - t)} ${r1(lastBottom - h * 0.05)} L${r1(x + t)} ${r1(lastBottom - h * 0.05)} L${r1(x + t * 1.3)} ${r1(y)} L${r1(x - t * 1.3)} ${r1(y)} Z`;
  return d;
}

// Drawn clockwise like every other tree part, so overlapping shapes merge instead of cutting holes (nonzero fill)
function circle(cx: number, cy: number, r: number) {
  return ` M${r1(cx - r)} ${r1(cy)} a${r1(r)} ${r1(r)} 0 1 1 ${r1(r * 2)} 0 a${r1(r)} ${r1(r)} 0 1 1 ${r1(-r * 2)} 0 Z`;
}

function roundTree(x: number, y: number, h: number) {
  const r = h * 0.25;
  const cy = y - h + r;
  const t = h * 0.03;
  let d = ` M${r1(x - t)} ${r1(cy + r * 0.6)} L${r1(x + t)} ${r1(cy + r * 0.6)} L${r1(x + t * 1.4)} ${r1(y)} L${r1(x - t * 1.4)} ${r1(y)} Z`;
  d += circle(x, cy, r);
  d += circle(x - r * 0.62, cy + r * 0.5, r * 0.72);
  d += circle(x + r * 0.64, cy + r * 0.46, r * 0.68);
  d += circle(x + r * 0.05, cy + r * 0.78, r * 0.62);
  return d;
}

// Deterministic ridges and tree clumps, built once at module load so SSR and client match
function buildLayer(spec: LayerSpec, density: number) {
  const count = 16;
  const points: [number, number][] = [];
  for (let i = 0; i <= count; i++) {
    const x = -160 + (i * 1760) / count;
    const y = spec.base - spec.amp * (0.5 + 0.5 * Math.sin(i * spec.freq + spec.seed * 1.7)) - spec.amp * 0.4 * rand(spec.seed * 13 + i);
    points.push([x, y]);
  }
  const mids: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const [x0, y0] = points[i] ?? [0, 0];
    const [x1, y1] = points[i + 1] ?? [0, 0];
    mids.push([(x0 + x1) / 2, (y0 + y1) / 2]);
  }
  const [firstX, firstY] = points[0] ?? [0, 0];
  const [lastX, lastY] = points[count] ?? [0, 0];
  const [midX, midY] = mids[0] ?? [0, 0];
  let ridge = `M${r1(firstX)} ${r1(firstY)} L${r1(midX)} ${r1(midY)}`;
  for (let i = 1; i < mids.length; i++) {
    const [cx, cy] = points[i] ?? [0, 0];
    const [ex, ey] = mids[i] ?? [0, 0];
    ridge += ` Q${r1(cx)} ${r1(cy)} ${r1(ex)} ${r1(ey)}`;
  }
  ridge += ` L${r1(lastX)} ${r1(lastY)} L1600 1000 L-160 1000 Z`;

  const surface = (x: number) => {
    for (let i = 0; i < mids.length - 1; i++) {
      const [x0, y0] = mids[i] ?? [0, 0];
      const [x1, y1] = mids[i + 1] ?? [0, 0];
      if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
    return spec.base;
  };

  let trees = "";
  for (let c = 0; c < spec.clusters; c++) {
    const center = 120 + ((c + rand(spec.seed * 17 + c) * 0.7) / spec.clusters) * 1200;
    const perCluster = Math.max(0, Math.round(spec.perCluster * density * 2));
    for (let t = 0; t < perCluster; t++) {
      const key = spec.seed * 101 + c * 13 + t;
      const x = center + (t - (perCluster - 1) / 2) * spec.treeHeight * 0.42 + (rand(key) - 0.5) * spec.treeHeight * 0.3;
      const edge = 1 - Math.abs(t - (perCluster - 1) / 2) / Math.max(1, perCluster / 2);
      const h = spec.treeHeight * (0.62 + edge * 0.3 + rand(key * 3) * 0.25);
      const y = surface(x) + h * 0.06;
      const species = spec.species[Math.floor(rand(key * 7) * spec.species.length)] ?? "pine";
      trees += species === "cypress" ? cypress(x, y, h) : species === "round" ? roundTree(x, y, h) : pine(x, y, h);
    }
  }
  return { ridge, trees };
}


const CLOUD = "M20 40 C20 22 40 14 54 22 C62 6 92 4 102 22 C118 14 140 24 138 40 Z";

// A slow ease in and out, so every part of the scene settles in over about 2.4 seconds
const ease: [number, number, number, number] = [0.6, 0, 0.4, 1];

function Layer({
  index,
  spec,
  color,
  paper,
  mist,
  ridge,
  trees,
  depthScale,
  sx,
  sy,
  progress,
  still,
  reduce,
}: {
  index: number;
  spec: LayerSpec;
  color: string;
  paper: string;
  mist: boolean;
  ridge: string;
  trees: string;
  depthScale: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  progress: MotionValue<number>;
  still: boolean;
  reduce: boolean;
}) {
  const id = `paper-landscape-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const reach = spec.depth ** 1.4;
  const x = useTransform(sx, (value) => value * -reach * 90 * depthScale);
  const y = useTransform([sy, progress], ([a = 0, b = 0]: number[]) => (still ? 0 : (a * -reach * 26 + b * (1 - spec.depth) * 380) * depthScale));
  const scale = useTransform(progress, (value) => (still ? 1 : 1 + value * spec.depth * 0.1 * depthScale));
  const shadow = `drop-shadow(0 -6px ${10 + index * 3}px rgba(74, 38, 20, ${0.14 + index * 0.035}))`;

  return (
    <motion.div
      initial={reduce ? false : { y: 90 + index * 36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.9, ease, delay: 0.05 + index * 0.09 }}
      className="absolute -inset-x-[10%] -bottom-20 top-0"
    >
      <motion.div style={{ x, y, scale }} className="absolute inset-0 origin-bottom will-change-transform">
        {mist && spec.mist && (
          <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
            <defs>
              <linearGradient id={`${id}-mist`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: paper }} stopOpacity="0" />
                <stop offset="1" style={{ stopColor: paper }} stopOpacity="0.72" />
              </linearGradient>
            </defs>
            <rect x="-200" y={spec.base - spec.amp * 2.1} width="1840" height={spec.amp * 1.9} fill={`url(#${id}-mist)`} />
          </svg>
        )}
        <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" style={{ filter: shadow }}>
          <path d={ridge} fill={color} />
          {trees && <path d={trees} fill={color} />}
        </svg>
      </motion.div>
    </motion.div>
  );
}

const BIRDS = [
  { dx: 0, dy: 0, scale: 1, rate: 7.4, seed: 1 },
  { dx: -34, dy: 14, scale: 0.9, rate: 7.9, seed: 2.3 },
  { dx: -30, dy: -16, scale: 0.86, rate: 8.3, seed: 3.7 },
  { dx: -68, dy: 26, scale: 0.78, rate: 8.8, seed: 5.1 },
  { dx: -64, dy: -30, scale: 0.72, rate: 9.2, seed: 6.6 },
];

const WING = "M0 0 C-3 -3.2 -7 -4 -12 -1.6 C-8 -1.8 -4 -0.6 0 1.4 Z";

function Flock({ count, color, still, reduce }: { count: number; color: string; still: boolean; reduce: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const flock = BIRDS.slice(0, count);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || flock.length === 0) return;
    const birds = Array.from(svg.querySelectorAll<SVGGElement>("[data-bird]"));
    const lefts = Array.from(svg.querySelectorAll<SVGPathElement>("[data-wing='left']"));
    const rights = Array.from(svg.querySelectorAll<SVGPathElement>("[data-wing='right']"));
    const phases = new Float32Array(flock.length);
    for (let i = 0; i < flock.length; i++) phases[i] = (flock[i]?.seed ?? 0) * 1.3;

    let width = 1;
    let height = 1;
    let flockX = -120;
    let lane = 0.22;
    let time = 0;
    let last = 0;
    let frame = 0;
    let visible = true;

    const place = (dt: number) => {
      time += dt;
      flockX += dt * 46;
      if (flockX > width + 160) {
        flockX = -160;
        lane = 0.14 + Math.random() * 0.16;
      }
      const baseY = height * lane + Math.sin(time * 0.23) * height * 0.03;
      for (let i = 0; i < flock.length; i++) {
        const bird = flock[i];
        if (!bird) continue;
        const glide = Math.min(1, Math.max(0, Math.sin(time * 0.35 + bird.seed * 1.9) * 1.6 + 0.6));
        const amp = 0.18 + glide * 0.82;
        const phase = (phases[i] ?? 0) + dt * bird.rate * (0.4 + glide * 0.6);
        phases[i] = phase;
        const angle = amp * (Math.sin(phase) * 34 + 8);
        const x = flockX + bird.dx + Math.sin(time * 0.4 + bird.seed) * 7;
        const y = baseY + bird.dy + Math.sin(time * 0.6 + bird.seed * 2) * 5 - Math.cos(phase) * 1.6 * amp;
        birds[i]?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${bird.scale})`);
        lefts[i]?.setAttribute("transform", `rotate(${angle.toFixed(1)})`);
        rights[i]?.setAttribute("transform", `scale(-1 1) rotate(${angle.toFixed(1)})`);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      place(dt);
      frame = requestAnimationFrame(tick);
    };
    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!still && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      width = Math.max(1, svg.clientWidth);
      height = Math.max(1, svg.clientHeight);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      if (still) {
        flockX = width * 0.46;
        place(0);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(svg);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(svg);
    const onVisibility = () => play();
    document.addEventListener("visibilitychange", onVisibility);
    play();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [still, flock.length]);

  return (
    <motion.svg
      ref={ref}
      aria-hidden="true"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease, delay: 0.8 }}
      className="pointer-events-none absolute inset-0 size-full"
    >
      {flock.map((_, index) => (
        <g key={index} data-bird="" transform="translate(-200 -200)">
          <path data-wing="left" d={WING} fill={color} />
          <path data-wing="right" d={WING} fill={color} transform="scale(-1 1)" />
          <ellipse cx="0" cy="0.4" rx="2.6" ry="1.2" fill={color} />
        </g>
      ))}
    </motion.svg>
  );
}

const DEFAULT_PALETTE = LAYERS.map((layer) => layer.color);

export function PaperLandscape({
  palette = DEFAULT_PALETTE,
  paperColor = "#f6ead6",
  sun = true,
  sunColor = "#f19a64",
  clouds = true,
  cloudColor = "#fdf7ec",
  birds = 5,
  birdColor,
  mist = true,
  trees = 0.5,
  parallax = 0.5,
  interactive = true,
  paused = false,
  className,
  children,
}: PaperLandscapeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);
  const still = reduce || paused;
  const density = Math.min(1, Math.max(0, trees));
  const depthScale = Math.min(1, Math.max(0, parallax)) * 2;
  const shapes = useMemo(() => LAYERS.map((layer) => buildLayer(layer, density)), [density]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 18, mass: 0.9 });
  const sy = useSpring(my, { stiffness: 45, damping: 18, mass: 0.9 });
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end start"] });
  const sunX = useTransform(sx, (value) => value * -8 * depthScale);
  const sunY = useTransform([sy, scrollYProgress], ([a = 0, b = 0]: number[]) => (still ? 0 : (a * -5 + b * 460) * Math.max(0.5, depthScale)));
  const cloudX = useTransform(sx, (value) => value * -16 * depthScale);
  const settings = useRef({ interactive, still });
  settings.current = { interactive, still };

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const root = rootRef.current;
      const s = settings.current;
      if (!root || !s.interactive || s.still || event.pointerType === "touch") return;
      const rect = root.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      mx.set(inside ? ((event.clientX - rect.left) / rect.width - 0.5) * 2 : 0);
      my.set(inside ? ((event.clientY - rect.top) / rect.height - 0.5) * 2 : 0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const drift = (distance: number, duration: number, delay: number) =>
    still ? {} : { animate: { x: [0, distance, 0] }, transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const } };
  const flockCount = Math.max(0, Math.min(BIRDS.length, Math.round(birds)));

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, ease }}
        className="absolute inset-0"
        style={{ background: `radial-gradient(55% 45% at 78% 40%, color-mix(in oklab, ${paperColor} 55%, white) 0%, transparent 70%)` }}
      />

      {sun && (
        <motion.div aria-hidden="true" style={{ x: sunX, y: sunY }} className="absolute right-[8%] top-[26%] size-44 will-change-transform md:right-[14%] md:top-[22%] md:size-72">
          <motion.div
            initial={reduce ? false : { y: 160, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 2.1, ease, delay: 0.3 }}
            className="relative size-full"
          >
            <div
              className="absolute -inset-[70%] rounded-full"
              style={{
                background: `radial-gradient(circle, color-mix(in oklab, ${sunColor} 28%, transparent) 0%, color-mix(in oklab, ${sunColor} 10%, transparent) 32%, transparent 62%)`,
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at 42% 36%, color-mix(in oklab, ${sunColor} 55%, white) 0%, ${sunColor} 52%, color-mix(in oklab, ${sunColor} 85%, #b04a20) 100%)`,
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {clouds && (
        <motion.div
          aria-hidden="true"
          style={{ x: cloudX }}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease, delay: 0.6 }}
          className="absolute inset-0"
        >
          {[
            { className: "left-[46%] top-[14%] w-36 md:w-52", distance: 40, duration: 24, delay: 0 },
            { className: "left-[68%] top-[34%] w-24 md:w-32", distance: -30, duration: 19, delay: 2 },
            { className: "left-[6%] top-[40%] hidden w-28 md:block", distance: 26, duration: 28, delay: 1 },
          ].map((cloud, index) => (
            <motion.svg
              key={index}
              viewBox="0 0 160 48"
              {...drift(cloud.distance, cloud.duration, cloud.delay)}
              className={cn("absolute will-change-transform", cloud.className)}
              style={{ filter: "drop-shadow(0 4px 6px rgba(74, 38, 20, 0.12))" }}
            >
              <path d={CLOUD} fill={cloudColor} />
            </motion.svg>
          ))}
        </motion.div>
      )}

      {flockCount > 0 && <Flock count={flockCount} color={birdColor ?? palette[5] ?? "#5c3426"} still={still} reduce={reduce} />}

      {LAYERS.map((spec, index) => (
        <Layer
          key={index}
          index={index}
          spec={spec}
          color={palette[index] ?? spec.color}
          paper={paperColor}
          mist={mist}
          ridge={shapes[index]?.ridge ?? ""}
          trees={shapes[index]?.trees ?? ""}
          depthScale={depthScale}
          sx={sx}
          sy={sy}
          progress={scrollYProgress}
          still={still}
          reduce={reduce}
        />
      ))}

      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
