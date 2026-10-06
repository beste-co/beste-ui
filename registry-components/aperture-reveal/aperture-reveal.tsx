"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

/** A number, or anything with `get()` (a framer-motion MotionValue works), read every frame without re-rendering */
export type ApertureProgress = number | { get: () => number };

export interface ApertureRevealProps {
  /** Photograph behind the iris. */
  imageSrc?: string;
  /** Alt text for the photograph. */
  imageAlt?: string;
  /** Number of iris blades. */
  blades?: number;
  /** Color of the blades and the machined ring. Any CSS color. */
  bladeColor?: string;
  /** Color of the light caught by blade edges and the ring. */
  highlightColor?: string;
  /** Color of the lens body around the ring. */
  bodyColor?: string;
  /** Starting angle of the blades, in degrees. */
  rotation?: number;
  /** How far the blades turn while opening, 0 to 1. */
  twist?: number;
  /** 0 closed, 1 open with the ring gone past the frame. Leave unset to let autoplay run. */
  progress?: ApertureProgress;
  /** Open, hold and close on a slow loop. Defaults to on when no progress is given; when on, it wins over progress. */
  autoplay?: boolean;
  /** Autoplay pace, 1 is the default. */
  speed?: number;
  /** Fine grain on the metal, 0 to 1. */
  grain?: number;
  /** Light on the metal and the photo follow the cursor. */
  interactive?: boolean;
  /** Hold the autoplay where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const apertureRevealDemo: ApertureRevealProps = {
  imageSrc: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2400&q=80",
  imageAlt: "Snowy peaks under the Milky Way above a dark line of pines",
  blades: 9,
  bladeColor: "#1b1c1f",
  highlightColor: "#f3ede2",
  bodyColor: "#0b0b0c",
  rotation: 0,
  twist: 0.6,
  autoplay: true,
  speed: 1,
  grain: 0.5,
  interactive: true,
  className: "min-h-[32rem]",
};

type Rgb = [number, number, number];

const TAU = Math.PI * 2;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const readProgress = (source: ApertureProgress | undefined) =>
  source === undefined ? undefined : typeof source === "number" ? source : source.get();

// Closed hold, open, open hold, close, in seconds at speed 1
const CYCLE = [1.4, 3.8, 3.2, 3.4] as const;
const CYCLE_TOTAL = CYCLE[0] + CYCLE[1] + CYCLE[2] + CYCLE[3];
function cycle(t: number) {
  let u = t % CYCLE_TOTAL;
  if (u < CYCLE[0]) return 0;
  u -= CYCLE[0];
  if (u < CYCLE[1]) return easeInOut(u / CYCLE[1]);
  u -= CYCLE[1];
  if (u < CYCLE[2]) return 1;
  u -= CYCLE[2];
  return 1 - easeInOut(u / CYCLE[3]);
}

function resolveRgb(el: HTMLElement, color: string): Rgb {
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  el.style.color = "";
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [24, 24, 26];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0];
}

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Concentric turning marks on a neutral gray, laid over the metal in overlay
function makeBrushed(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const random = mulberry(7);
  const c = size / 2;
  ctx.fillStyle = "rgb(128,128,128)";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 900; i++) {
    const radius = Math.sqrt(random()) * c;
    const start = random() * TAU;
    ctx.beginPath();
    ctx.arc(c, c, radius, start, start + 0.4 + random() * 4);
    ctx.lineWidth = 0.4 + random() * 1.4;
    ctx.strokeStyle = random() > 0.5 ? `rgba(255,255,255,${0.03 + random() * 0.07})` : `rgba(0,0,0,${0.04 + random() * 0.09})`;
    ctx.stroke();
  }
  return canvas;
}

function makeNoise() {
  const size = 160;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const image = ctx.createImageData(size, size);
  const random = mulberry(11);
  for (let i = 0; i < size * size; i++) {
    const value = random() > 0.5 ? 255 : 0;
    image.data[i * 4] = value;
    image.data[i * 4 + 1] = value;
    image.data[i * 4 + 2] = value;
    image.data[i * 4 + 3] = Math.round(random() * 34);
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

export function ApertureReveal({
  imageSrc = apertureRevealDemo.imageSrc,
  imageAlt = "",
  blades = 9,
  bladeColor = "#1b1c1f",
  highlightColor = "#f3ede2",
  bodyColor = "#0b0b0c",
  rotation = 0,
  twist = 0.6,
  progress,
  autoplay,
  speed = 1,
  grain = 0.5,
  interactive = true,
  paused = false,
  className,
  children,
}: ApertureRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const settings = useRef({ blades, bladeColor, highlightColor, bodyColor, rotation, twist, progress, autoplay, speed, grain, interactive, paused });
  settings.current = { blades, bladeColor, highlightColor, bodyColor, rotation, twist, progress, autoplay, speed, grain, interactive, paused };

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const photo = photoRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !photo || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vx = new Float32Array(16);
    const vy = new Float32Array(16);
    const qx = new Float32Array(16);
    const qy = new Float32Array(16);
    const ex = new Float32Array(16);
    const ey = new Float32Array(16);
    const nx = new Float32Array(16);
    const ny = new Float32Array(16);
    const noise = makeNoise();
    const grainPattern = ctx.createPattern(noise, "repeat");
    let brushed = makeBrushed(512);

    let blade: Rgb = [27, 28, 31];
    let hi: Rgb = [243, 237, 226];
    let body: Rgb = [11, 11, 12];
    const mix = (a: Rgb, b: Rgb, t: number, scale = 1, alpha = 1) =>
      `rgba(${Math.round((a[0] + (b[0] - a[0]) * t) * scale)},${Math.round((a[1] + (b[1] - a[1]) * t) * scale)},${Math.round((a[2] + (b[2] - a[2]) * t) * scale)},${alpha})`;

    let dpr = 1;
    let quality = 1;
    let frame = 0;
    let last = 0;
    let visible = true;
    let clock = 0;
    let shown = readProgress(settings.current.progress) ?? 0;
    let drawnAt = -1;
    let drawnLight = 0;
    let dirty = true;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let slowFrames = 0;
    let frameAverage = 16;

    let readBlade = "";
    let readHi = "";
    let readBody = "";
    const readColors = () => {
      const s = settings.current;
      readBlade = s.bladeColor;
      readHi = s.highlightColor;
      readBody = s.bodyColor;
      blade = resolveRgb(root, s.bladeColor);
      hi = resolveRgb(root, s.highlightColor);
      body = resolveRgb(root, s.bodyColor);
      dirty = true;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(root.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(root.clientHeight * dpr));
      const size = Math.min(1400, Math.max(256, Math.round(Math.min(canvas.width, canvas.height) * 0.95)));
      if (Math.abs(size - brushed.width) > 64) brushed = makeBrushed(size);
      dirty = true;
    };

    const bladePath = (i: number, n: number, far: number) => {
      const h = (i - 1 + n) % n;
      const j = (i + 1) % n;
      ctx.beginPath();
      ctx.moveTo(vx[i] ?? 0, vy[i] ?? 0);
      ctx.lineTo(vx[j] ?? 0, vy[j] ?? 0);
      ctx.quadraticCurveTo(qx[i] ?? 0, qy[i] ?? 0, ex[i] ?? 0, ey[i] ?? 0);
      ctx.arc(0, 0, far, Math.atan2(ey[i] ?? 0, ex[i] ?? 0), Math.atan2(ey[h] ?? 0, ex[h] ?? 0), true);
      ctx.lineTo(ex[h] ?? 0, ey[h] ?? 0);
      ctx.quadraticCurveTo(qx[h] ?? 0, qy[h] ?? 0, vx[i] ?? 0, vy[i] ?? 0);
      ctx.closePath();
    };

    const draw = (p: number, light: number) => {
      const s = settings.current;
      const W = canvas.width;
      const H = canvas.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);

      const n = Math.max(5, Math.min(16, Math.round(s.blades)));
      const Rh = Math.min(W, H) * 0.4;
      // Too small to draw: the hairline insets below would turn a radius negative
      if (Rh < 4) return;
      const Rb = Rh * 1.15;
      const halfDiag = Math.hypot(W, H) / 2;
      const open = easeInOut(clamp01(p / 0.7));
      const grow = easeInOut(clamp01((p - 0.5) / 0.5));
      const S = 1 + ((halfDiag * 1.04) / Rh - 1) * grow;
      if (grow >= 0.999) return;

      const k = Math.cos(Math.PI / n);
      const r = Rh * (0.045 + (1.08 / k - 0.045) * open);
      const rot = (s.rotation * Math.PI) / 180 + open * Math.max(0, s.twist) * 1.6;
      const reach = Rb * 1.04;
      const far = Rb * 1.6;
      const px = 1 / S;

      ctx.setTransform(S, 0, 0, S, W / 2, H / 2);

      for (let i = 0; i < n; i++) {
        const angle = rot + (i * TAU) / n;
        vx[i] = r * Math.cos(angle);
        vy[i] = r * Math.sin(angle);
      }
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const ax = vx[j] ?? 0;
        const ay = vy[j] ?? 0;
        let dx = ax - (vx[i] ?? 0);
        let dy = ay - (vy[i] ?? 0);
        const length = Math.hypot(dx, dy) || 1;
        dx /= length;
        dy /= length;
        nx[i] = dy;
        ny[i] = -dx;
        const b = ax * dx + ay * dy;
        const t = -b + Math.sqrt(Math.max(0, b * b - (ax * ax + ay * ay) + reach * reach));
        // The blade edge runs on past the opening and bends outward, like a real curved blade
        qx[i] = ax + dx * t * 0.5 + dy * t * 0.08;
        qy[i] = ay + dy * t * 0.5 - dx * t * 0.08;
        ex[i] = ax + dx * t + dy * t * 0.22;
        ey[i] = ay + dy * t - dx * t * 0.22;
      }

      // Dark backing under the blades so antialiased seams never show the photo
      ctx.beginPath();
      ctx.arc(0, 0, Rb, 0, TAU);
      ctx.moveTo(vx[0] ?? 0, vy[0] ?? 0);
      for (let i = 1; i < n; i++) ctx.lineTo(vx[i] ?? 0, vy[i] ?? 0);
      ctx.closePath();
      ctx.fillStyle = mix(blade, blade, 0, 0.45);
      ctx.fill("evenodd");

      const brush = reach * 1.02;
      for (let i = 0; i < n; i++) {
        const h = (i - 1 + n) % n;
        const facing = Math.atan2(ny[i] ?? 0, nx[i] ?? 0);
        const spec = Math.max(0, Math.cos(facing - light)) ** 2;
        const sheen = Math.max(0, Math.cos(facing - light - Math.PI)) ** 3 * 0.35;
        const j = (i + 1) % n;
        const mx = ((vx[i] ?? 0) + (vx[j] ?? 0)) / 2;
        const my = ((vy[i] ?? 0) + (vy[j] ?? 0)) / 2;

        ctx.save();
        bladePath(i, n, far);
        const gradient = ctx.createLinearGradient(mx, my, mx + (nx[i] ?? 0) * Rh * 0.9, my + (ny[i] ?? 0) * Rh * 0.9);
        gradient.addColorStop(0, mix(blade, hi, 0.05 + 0.2 * spec + 0.06 * sheen));
        gradient.addColorStop(1, mix(blade, hi, 0.02 * spec, 0.72 + 0.2 * spec));
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.clip();

        ctx.globalCompositeOperation = "overlay";
        ctx.globalAlpha = 0.7;
        ctx.rotate(rot * 0.6 + i * 1.7);
        ctx.drawImage(brushed, -brush, -brush, brush * 2, brush * 2);
        ctx.rotate(-(rot * 0.6 + i * 1.7));
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;

        // The blade above lies over this one: a crisp dark seam with a soft shadow falling onto it
        ctx.beginPath();
        ctx.moveTo(vx[i] ?? 0, vy[i] ?? 0);
        ctx.quadraticCurveTo(qx[h] ?? 0, qy[h] ?? 0, ex[h] ?? 0, ey[h] ?? 0);
        ctx.shadowColor = "rgba(0,0,0,0.75)";
        ctx.shadowBlur = Rh * 0.05 * S;
        ctx.strokeStyle = "rgba(0,0,0,0.85)";
        ctx.lineWidth = 2.2 * px * dpr;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        ctx.restore();
      }

      // Light caught by each leading edge: the lip at the opening and the curve over the next blade
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const facing = Math.atan2(ny[i] ?? 0, nx[i] ?? 0);
        const spec = Math.max(0, Math.cos(facing - light + 0.5)) ** 3;
        ctx.beginPath();
        ctx.moveTo(vx[i] ?? 0, vy[i] ?? 0);
        ctx.lineTo(vx[j] ?? 0, vy[j] ?? 0);
        ctx.quadraticCurveTo(qx[i] ?? 0, qy[i] ?? 0, ex[i] ?? 0, ey[i] ?? 0);
        ctx.strokeStyle = mix(hi, hi, 0, 1, 0.06 + 0.5 * spec);
        ctx.lineWidth = 1.1 * px * dpr;
        ctx.stroke();
      }

      // Depth inside the opening: the blades shade the photo right at their lips
      if (open < 0.995) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(vx[0] ?? 0, vy[0] ?? 0);
        for (let i = 1; i < n; i++) ctx.lineTo(vx[i] ?? 0, vy[i] ?? 0);
        ctx.closePath();
        ctx.clip();
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = Math.max(4, r * 0.35) * S;
        ctx.strokeStyle = "rgba(0,0,0,0.9)";
        ctx.lineWidth = 3 * px * dpr;
        ctx.stroke();
        ctx.restore();
      }

      // The blades sit recessed below the ring
      const lip = ctx.createRadialGradient(0, 0, Rh * 0.84, 0, 0, Rh);
      lip.addColorStop(0, "rgba(0,0,0,0)");
      lip.addColorStop(1, `rgba(0,0,0,${0.6 * (1 - grow)})`);
      ctx.beginPath();
      ctx.arc(0, 0, Rh, 0, TAU);
      ctx.arc(0, 0, Rh * 0.84, 0, TAU, true);
      ctx.fillStyle = lip;
      ctx.fill();

      // Machined ring: anisotropic lobes of light that turn with the light
      const conic = typeof ctx.createConicGradient === "function" ? ctx.createConicGradient(light, 0, 0) : null;
      const edge = typeof ctx.createConicGradient === "function" ? ctx.createConicGradient(light, 0, 0) : null;
      if (conic) {
        conic.addColorStop(0, mix(blade, hi, 0.34));
        conic.addColorStop(0.1, mix(blade, hi, 0.05, 0.95));
        conic.addColorStop(0.4, mix(blade, hi, 0, 0.8));
        conic.addColorStop(0.5, mix(blade, hi, 0.16));
        conic.addColorStop(0.6, mix(blade, hi, 0, 0.8));
        conic.addColorStop(0.9, mix(blade, hi, 0.05, 0.95));
        conic.addColorStop(1, mix(blade, hi, 0.34));
      }
      if (edge) {
        edge.addColorStop(0, mix(hi, hi, 0, 1, 0.9));
        edge.addColorStop(0.12, mix(hi, hi, 0, 1, 0.08));
        edge.addColorStop(0.42, mix(hi, hi, 0, 1, 0.04));
        edge.addColorStop(0.5, mix(hi, hi, 0, 1, 0.4));
        edge.addColorStop(0.58, mix(hi, hi, 0, 1, 0.04));
        edge.addColorStop(0.88, mix(hi, hi, 0, 1, 0.08));
        edge.addColorStop(1, mix(hi, hi, 0, 1, 0.9));
      }
      ctx.beginPath();
      ctx.arc(0, 0, Rb, 0, TAU);
      ctx.arc(0, 0, Rh, 0, TAU, true);
      ctx.fillStyle = conic ?? mix(blade, hi, 0.08);
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = 0.9;
      ctx.drawImage(brushed, -Rb, -Rb, Rb * 2, Rb * 2);
      ctx.restore();
      ctx.lineWidth = 0.8 * px * dpr;
      for (let i = 1; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, Rh + ((Rb - Rh) * i) / 12, 0, TAU);
        ctx.strokeStyle = i % 3 === 0 ? "rgba(0,0,0,0.28)" : i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.1)";
        ctx.stroke();
      }
      // Chamfers catch a line of light on both edges of the ring
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1.6 * px * dpr;
      ctx.strokeStyle = edge ?? mix(hi, hi, 0, 1, 0.25);
      ctx.beginPath();
      ctx.arc(0, 0, Rh + 0.8 * px * dpr, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(0, Rb - 0.8 * px * dpr), 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Lens body around the ring, softly lit near the metal
      const extent = halfDiag * 1.1 * px;
      const plate = ctx.createRadialGradient(0, 0, Rb, 0, 0, Math.max(Rb * 1.01, extent));
      plate.addColorStop(0, mix(body, hi, 0.05));
      plate.addColorStop(0.35, mix(body, body, 0));
      plate.addColorStop(1, mix(body, body, 0, 0.65));
      ctx.beginPath();
      ctx.rect(-extent, -extent, extent * 2, extent * 2);
      ctx.arc(0, 0, Rb, 0, TAU, true);
      ctx.fillStyle = plate;
      ctx.fill("evenodd");
      // Soft shadow the ring casts on the body
      const cast = ctx.createRadialGradient(0, 0, Rb, 0, 0, Rb * 1.08);
      cast.addColorStop(0, "rgba(0,0,0,0.5)");
      cast.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(0, 0, Rb * 1.08, 0, TAU);
      ctx.arc(0, 0, Rb, 0, TAU, true);
      ctx.fillStyle = cast;
      ctx.fill();

      if (grainPattern && s.grain > 0) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = "source-atop";
        ctx.globalAlpha = clamp01(s.grain);
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }
    };

    let photoX = Number.NaN;
    let photoY = Number.NaN;
    let photoScale = Number.NaN;
    const writePhoto = (p: number) => {
      const scale = 1.16 - 0.16 * (1 - (1 - clamp01(p)) ** 2);
      const x = -pointerX * 14;
      const y = -pointerY * 10;
      if (Math.abs(x - photoX) < 0.05 && Math.abs(y - photoY) < 0.05 && Math.abs(scale - photoScale) < 0.0002) return;
      photoX = x;
      photoY = y;
      photoScale = scale;
      photo.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
    };

    const target = (dt: number) => {
      const s = settings.current;
      const controlled = readProgress(s.progress);
      const looping = s.autoplay ?? controlled === undefined;
      if (!looping || reduce) return controlled !== undefined ? clamp01(controlled) : 0.36;
      if (!s.paused) clock += dt * Math.max(0, s.speed);
      return cycle(clock);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const s = settings.current;
      if (s.bladeColor !== readBlade || s.highlightColor !== readHi || s.bodyColor !== readBody) readColors();
      const goal = target(dt);
      const controlled = !(s.autoplay ?? readProgress(s.progress) === undefined);
      shown = reduce || !controlled ? goal : shown + (goal - shown) * (1 - Math.exp(-dt * 9));
      if (Math.abs(goal - shown) < 0.0002) shown = goal;

      const follow = s.interactive && !reduce;
      const ease = 1 - Math.exp(-dt * 3.5);
      pointerX += ((follow ? targetX : 0) - pointerX) * ease;
      pointerY += ((follow ? targetY : 0) - pointerY) * ease;
      const light = -2.35 + pointerX * 0.7 + pointerY * 0.25;

      if (dirty || Math.abs(shown - drawnAt) > 0.00005 || Math.abs(light - drawnLight) > 0.002) {
        draw(shown, light);
        drawnAt = shown;
        drawnLight = light;
        dirty = false;
        frameAverage = frameAverage * 0.9 + dt * 100;
        if (frameAverage > 22 && quality > 0.67) {
          if (++slowFrames > 30) {
            quality = 0.67;
            slowFrames = 0;
            resize();
          }
        } else slowFrames = 0;
      }
      writePhoto(shown);
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = root.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      targetX = inside ? ((event.clientX - rect.left) / rect.width) * 2 - 1 : 0;
      targetY = inside ? ((event.clientY - rect.top) / rect.height) * 2 - 1 : 0;
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    const mo = new MutationObserver(() => requestAnimationFrame(readColors));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    readColors();
    resize();
    play();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // A cached photo can finish loading before hydration attaches onLoad
  useEffect(() => {
    const image = photoRef.current?.querySelector("img");
    if (image?.complete && image.naturalWidth > 0) setLoaded(true);
  }, [imageSrc]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: bodyColor }}>
      <div ref={photoRef} className="absolute inset-0 will-change-transform">
        {imageSrc && (
          // biome-ignore lint/performance/noImgElement: registry components ship a plain img
          <img
            src={imageSrc}
            alt={imageAlt}
            onLoad={() => setLoaded(true)}
            className={cn("absolute inset-0 size-full object-cover transition-opacity duration-700", loaded ? "opacity-100" : "opacity-0")}
          />
        )}
      </div>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
