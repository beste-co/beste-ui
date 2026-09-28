"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface GrowingTreeProps {
  /** Seed for the tree's shape; the same seed always grows the same tree. */
  seed?: number;
  /** How far the branching goes, 0 (a young sapling) to 1 (a full crown). */
  complexity?: number;
  /** Seconds the tree takes to grow from a single point to full blossom. */
  duration?: number;
  /** Color of the branches. Any CSS color, tokens included. */
  branchColor?: string;
  /** Color of the blossoms and falling petals. */
  blossomColor?: string;
  /** Color of the ground the tree stands on. */
  paperColor?: string;
  /** How many tips open into blossoms, 0 to 1. */
  blossoms?: number;
  /** How often petals let go and drift down, 0 (never) to 1 (a steady fall). */
  fall?: number;
  /** Strength of the passing breeze, 0 to 1. */
  wind?: number;
  /** How far the thin branches bend, 0 (stiff) to 1 (supple). */
  sway?: number;
  /** Seconds a finished tree stands before it fades and a new one grows; 0 keeps it. */
  regrow?: number;
  /** Moving the cursor across the tree sends a gust through the branches. */
  interactive?: boolean;
  /** Freeze the tree where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const growingTreeDemo: GrowingTreeProps = {
  seed: 7,
  complexity: 0.6,
  duration: 8,
  branchColor: "var(--foreground)",
  blossomColor: "var(--primary)",
  paperColor: "var(--background)",
  blossoms: 0.6,
  fall: 0.4,
  wind: 0.5,
  sway: 0.5,
  regrow: 40,
  interactive: true,
  className: "min-h-[32rem]",
};

const MAX_BRANCHES = 2400;
const MAX_PETALS = 140;

interface Tree {
  count: number;
  parent: Int32Array;
  angle: Float32Array;
  length: Float32Array;
  thickness: Float32Array;
  depth: Uint8Array;
  birth: Float32Array;
  span: Float32Array;
  bend: Float32Array;
  endThickness: Float32Array;
  maxDepth: number;
  blooms: number;
  bloomBranch: Int32Array;
  bloomBirth: Float32Array;
  bloomSize: Float32Array;
  bloomTurn: Float32Array;
}

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A leader keeps climbing while side shoots break off it, the way real branches grow
function buildTree(seed: number, complexity: number, density: number): Tree {
  const rand = mulberry(seed * 9973 + 17);
  const maxDepth = Math.round(5 + Math.min(1, Math.max(0, complexity)) * 4);
  const parent: number[] = [];
  const angle: number[] = [];
  const length: number[] = [];
  const thickness: number[] = [];
  const depth: number[] = [];
  const birth: number[] = [];
  const span: number[] = [];
  const bend: number[] = [];
  const bloomBranch: number[] = [];
  const bloomBirth: number[] = [];
  const bloomSize: number[] = [];
  const bloomTurn: number[] = [];

  const grow = (from: number, turn: number, world: number, len: number, thick: number, level: number, start: number) => {
    if (parent.length >= MAX_BRANCHES) return;
    const index = parent.length;
    const time = 0.35 + len * 0.9;
    parent.push(from);
    angle.push(turn);
    length.push(len);
    thickness.push(thick);
    depth.push(level);
    birth.push(start);
    span.push(time);
    // A gentle curve per branch; the trunk barely bends
    bend.push((rand() - 0.5) * (level === 0 ? 0.05 : 0.16));
    const heading = world + turn - Math.atan(2 * (bend[index] ?? 0));
    const end = start + time;

    if (level >= maxDepth || len < 0.1) {
      if (rand() < 0.35 + density * 0.65) {
        bloomBranch.push(index);
        bloomBirth.push(end + rand() * 0.5);
        bloomSize.push(0.7 + rand() * 0.6);
        bloomTurn.push(rand() * Math.PI * 2);
      }
      return;
    }
    if (level >= maxDepth - 2 && rand() < density * 0.35) {
      bloomBranch.push(index);
      bloomBirth.push(end + 0.3 + rand() * 0.6);
      bloomSize.push(0.5 + rand() * 0.4);
      bloomTurn.push(rand() * Math.PI * 2);
    }
    // Leaning shoots are pulled gently back toward the light
    const lift = -heading * 0.18;
    // Side shoots alternate left and right so the crown stays balanced, with the odd exception
    const side = ((level + index) % 2 === 0 ? 1 : -1) * (rand() < 0.2 ? -1 : 1);
    grow(index, (rand() - 0.5) * 0.3 + lift, heading, len * (0.78 + rand() * 0.1), thick * 0.74, level + 1, start + time * (0.8 + rand() * 0.12));
    grow(index, side * (0.42 + rand() * 0.4) + lift, heading, len * (0.58 + rand() * 0.14), thick * 0.56, level + 1, start + time * (0.55 + rand() * 0.3));
    if (level > 0 && rand() < 0.3) {
      grow(index, -side * (0.5 + rand() * 0.35) + lift, heading, len * (0.45 + rand() * 0.15), thick * 0.48, level + 1, start + time * (0.65 + rand() * 0.25));
    }
  };

  grow(-1, (rand() - 0.5) * 0.08, 0, 1, 0.11, 0, 0);

  let total = 0;
  for (let i = 0; i < parent.length; i++) total = Math.max(total, (birth[i] ?? 0) + (span[i] ?? 0));
  for (let i = 0; i < bloomBirth.length; i++) total = Math.max(total, (bloomBirth[i] ?? 0) + 0.6);
  const unit = total > 0 ? 1 / total : 1;

  // Each branch ends exactly as wide as the shoot that carries on from it, so joints never step
  const endThickness = thickness.map((value) => value * 0.22);
  for (let i = 1; i < parent.length; i++) {
    const p = parent[i] ?? -1;
    if (p >= 0) endThickness[p] = Math.max(endThickness[p] ?? 0, thickness[i] ?? 0);
  }

  return {
    count: parent.length,
    parent: Int32Array.from(parent),
    angle: Float32Array.from(angle),
    length: Float32Array.from(length),
    thickness: Float32Array.from(thickness),
    depth: Uint8Array.from(depth),
    birth: Float32Array.from(birth, (value) => value * unit),
    span: Float32Array.from(span, (value) => value * unit),
    bend: Float32Array.from(bend),
    endThickness: Float32Array.from(endThickness),
    maxDepth,
    blooms: bloomBranch.length,
    bloomBranch: Int32Array.from(bloomBranch),
    bloomBirth: Float32Array.from(bloomBirth, (value) => value * unit),
    bloomSize: Float32Array.from(bloomSize),
    bloomTurn: Float32Array.from(bloomTurn),
  };
}

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
const easeOut = (value: number) => 1 - (1 - value) ** 3;
const easeBack = (value: number) => {
  const c = 1.7;
  return 1 + (c + 1) * (value - 1) ** 3 + c * (value - 1) ** 2;
};

export function GrowingTree({
  seed = 7,
  complexity = 0.6,
  duration = 8,
  branchColor = "var(--foreground)",
  blossomColor = "var(--primary)",
  paperColor = "var(--background)",
  blossoms = 0.6,
  fall = 0.4,
  wind = 0.5,
  sway = 0.5,
  regrow = 40,
  interactive = true,
  paused = false,
  className,
  children,
}: GrowingTreeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ seed, complexity, duration, branchColor, blossomColor, blossoms, fall, wind, sway, regrow, interactive, paused });
  settings.current = { seed, complexity, duration, branchColor, blossomColor, blossoms, fall, wind, sway, regrow, interactive, paused };
  const api = useRef({ rebuild: () => {}, recolor: () => {}, refresh: () => {} });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !root || !ctx) return;

    let tree = buildTree(settings.current.seed, settings.current.complexity, settings.current.blossoms);
    let generation = 0;
    let offset = new Float32Array(tree.count);
    let velocity = new Float32Array(tree.count);
    let world = new Float32Array(tree.count);
    let tipX = new Float32Array(tree.count);
    let tipY = new Float32Array(tree.count);
    let widths = new Float32Array(tree.count);
    let endWidths = new Float32Array(tree.count);

    const px = new Float32Array(MAX_PETALS);
    const py = new Float32Array(MAX_PETALS);
    const pvx = new Float32Array(MAX_PETALS);
    const pvy = new Float32Array(MAX_PETALS);
    const prot = new Float32Array(MAX_PETALS);
    const pspin = new Float32Array(MAX_PETALS);
    const page = new Float32Array(MAX_PETALS);
    const pground = new Float32Array(MAX_PETALS);
    const pstate = new Uint8Array(MAX_PETALS);

    let ink = "#111";
    let bloom = "#c44";
    let dpr = 1;
    let width = 1;
    let height = 1;
    let scale = 1;
    let rootX = 0;
    let rootY = 0;
    let groundLeft = 0;
    let groundRight = 0;
    let time = 0;
    let lived = 0;
    let fade = 1;
    let fading = false;
    let gust = 0;
    let spawnDebt = 0;
    let frame = 0;
    let visible = true;
    let lastFrame = 0;
    let average = 16.7;
    let tick = 0;
    let petalBudget = MAX_PETALS;
    const pointer = { x: -1e4, y: -1e4, lastX: 0, lastY: 0, lastAt: 0, inside: false };

    const allocate = () => {
      offset = new Float32Array(tree.count);
      velocity = new Float32Array(tree.count);
      world = new Float32Array(tree.count);
      tipX = new Float32Array(tree.count);
      tipY = new Float32Array(tree.count);
      widths = new Float32Array(tree.count);
      endWidths = new Float32Array(tree.count);
      pstate.fill(0);
    };
    allocate();

    // Fits the fully grown, windless tree inside the canvas
    const fit = () => {
      let minX = 0;
      let maxX = 0;
      let minY = 0;
      for (let i = 0; i < tree.count; i++) {
        const p = tree.parent[i] ?? -1;
        const heading = (p < 0 ? 0 : (world[p] ?? 0)) + (tree.angle[i] ?? 0);
        world[i] = heading;
        const sx = p < 0 ? 0 : (tipX[p] ?? 0);
        const sy = p < 0 ? 0 : (tipY[p] ?? 0);
        const len = tree.length[i] ?? 0;
        const x = sx + Math.sin(heading) * len;
        const y = sy - Math.cos(heading) * len;
        world[i] = heading - Math.atan(2 * (tree.bend[i] ?? 0));
        tipX[i] = x;
        tipY[i] = y;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
      }
      const pad = Math.min(width, height) * 0.07;
      const spanX = Math.max(0.5, maxX - minX + 0.3);
      const spanY = Math.max(0.5, -minY + 0.25);
      scale = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY);
      rootX = width / 2 - ((minX + maxX) / 2) * scale;
      rootY = height - pad;
      groundLeft = Math.max(pad * 0.5, rootX - spanX * scale * 0.42);
      groundRight = Math.min(width - pad * 0.5, rootX + spanX * scale * 0.42);
      for (let i = 0; i < tree.count; i++) {
        widths[i] = Math.max(0.7, (tree.thickness[i] ?? 0) * scale * 0.95);
        endWidths[i] = Math.max(0.5, (tree.endThickness[i] ?? 0) * scale * 0.95);
      }
    };

    const recolor = () => {
      ink = resolveColor(root, settings.current.branchColor);
      bloom = resolveColor(root, settings.current.blossomColor);
    };

    const growth = (birth: number, span: number, clock: number) => (span > 0 ? clamp01((clock - birth) / span) : 1);

    // Tapered outline of one branch along a gentle quadratic curve, added to the shared path.
    // Every outline and joint disc winds the same way, so one nonzero fill merges them seamlessly.
    const outline = (sx: number, sy: number, heading: number, len: number, bend: number, w0: number, w1: number, flare: boolean) => {
      const dx = Math.sin(heading);
      const dy = -Math.cos(heading);
      const nx = Math.cos(heading);
      const ny = Math.sin(heading);
      const ex = sx + dx * len;
      const ey = sy + dy * len;
      const cx = sx + dx * len * 0.5 + nx * bend * len;
      const cy = sy + dy * len * 0.5 + ny * bend * len;
      const SEG = 6;
      for (let k = 0; k <= SEG; k++) {
        const t = k / SEG;
        const u = 1 - t;
        const x = u * u * sx + 2 * u * t * cx + t * t * ex;
        const y = u * u * sy + 2 * u * t * cy + t * t * ey;
        let tx = 2 * u * (cx - sx) + 2 * t * (ex - cx);
        let ty = 2 * u * (cy - sy) + 2 * t * (ey - cy);
        const tl = Math.hypot(tx, ty) || 1;
        tx /= tl;
        ty /= tl;
        let w = w0 + (w1 - w0) * t ** 0.85;
        if (flare && t < 0.3) w *= 1 + 0.9 * (1 - t / 0.3) ** 2;
        edgeX[k] = x - ty * w * 0.5;
        edgeY[k] = y + tx * w * 0.5;
        edgeX[k + 7] = x + ty * w * 0.5;
        edgeY[k + 7] = y - tx * w * 0.5;
      }
      ctx.moveTo(edgeX[0] ?? 0, edgeY[0] ?? 0);
      for (let k = 1; k <= SEG; k++) ctx.lineTo(edgeX[k] ?? 0, edgeY[k] ?? 0);
      for (let k = SEG; k >= 0; k--) ctx.lineTo(edgeX[k + 7] ?? 0, edgeY[k + 7] ?? 0);
      ctx.closePath();
      return { ex, ey };
    };
    const edgeX = new Float32Array(14);
    const edgeY = new Float32Array(14);

    const disc = (x: number, y: number, r: number) => {
      if (r < 0.25) return;
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2, true);
    };

    const draw = () => {
      const s = settings.current;
      const clock = reduce ? 2 : time / Math.max(0.5, s.duration);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = fade * 0.3;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(groundLeft), Math.round(rootY) + 0.5);
      ctx.lineTo(Math.round(groundRight), Math.round(rootY) + 0.5);
      ctx.stroke();

      // Forward kinematics: every branch starts at its parent's current tip, continues along the
      // parent's end tangent and inherits its swing
      ctx.globalAlpha = fade;
      ctx.fillStyle = ink;
      ctx.beginPath();
      for (let i = 0; i < tree.count; i++) {
        const p = tree.parent[i] ?? -1;
        const heading = (p < 0 ? 0 : (world[p] ?? 0)) + (tree.angle[i] ?? 0) + (offset[i] ?? 0);
        const bend = tree.bend[i] ?? 0;
        world[i] = heading - Math.atan(2 * bend);
        const sx = p < 0 ? rootX : (tipX[p] ?? rootX);
        const sy = p < 0 ? rootY : (tipY[p] ?? rootY);
        const g = growth(tree.birth[i] ?? 0, tree.span[i] ?? 0, clock);
        if (g <= 0) {
          tipX[i] = sx;
          tipY[i] = sy;
          continue;
        }
        const grown = easeOut(g);
        const len = (tree.length[i] ?? 0) * scale * grown;
        const w0 = widths[i] ?? 1;
        // A growing shoot tapers to a fine point; once grown it ends at the width its continuation needs
        const w1 = (endWidths[i] ?? 0.5) * grown + w0 * 0.35 * (1 - grown);
        const end = outline(sx, sy, heading, len, bend, w0, w1, p < 0);
        tipX[i] = end.ex;
        tipY[i] = end.ey;
        if (p >= 0) disc(sx, sy, w0 * 0.5);
        disc(end.ex, end.ey, w1 * 0.5);
      }
      ctx.fill();

      // Blossoms: five rounded petals turned with their twig, a darker heart laid over them
      const petal = Math.max(1.6, scale * 0.03);
      ctx.fillStyle = bloom;
      ctx.globalAlpha = fade * 0.92;
      ctx.beginPath();
      for (let j = 0; j < tree.blooms; j++) {
        const opened = growth(tree.bloomBirth[j] ?? 0, 0.1, clock);
        if (opened <= 0) continue;
        const b = tree.bloomBranch[j] ?? 0;
        const size = petal * (tree.bloomSize[j] ?? 1) * easeBack(opened);
        const cx = tipX[b] ?? 0;
        const cy = tipY[b] ?? 0;
        const turn = (tree.bloomTurn[j] ?? 0) + (world[b] ?? 0);
        for (let q = 0; q < 5; q++) {
          const a = turn + (q * Math.PI * 2) / 5;
          const x = cx + Math.cos(a) * size * 0.58;
          const y = cy + Math.sin(a) * size * 0.58;
          ctx.moveTo(x + Math.cos(a) * size * 0.56, y + Math.sin(a) * size * 0.56);
          ctx.ellipse(x, y, size * 0.56, size * 0.36, a, 0, Math.PI * 2);
        }
      }
      for (let n = 0; n < MAX_PETALS; n++) {
        const state = pstate[n] ?? 0;
        if (state === 0) continue;
        const age = page[n] ?? 0;
        const shrink = state === 2 ? clamp01(1 - age / 5) : 1;
        if (shrink <= 0) continue;
        const rot = prot[n] ?? 0;
        // A tumbling petal turns edge-on and back, so its short axis breathes with the spin
        const rx = petal * 0.56 * shrink;
        const ry = petal * 0.36 * shrink * (state === 2 ? 1 : 0.25 + 0.75 * Math.abs(Math.cos(rot * 0.8)));
        const x = px[n] ?? 0;
        const y = py[n] ?? 0;
        ctx.moveTo(x + Math.cos(rot) * rx, y + Math.sin(rot) * rx);
        ctx.ellipse(x, y, rx, Math.max(0.2, ry), rot, 0, Math.PI * 2);
      }
      ctx.fill();

      ctx.fillStyle = ink;
      ctx.globalAlpha = fade * 0.4;
      ctx.beginPath();
      for (let j = 0; j < tree.blooms; j++) {
        const opened = growth(tree.bloomBirth[j] ?? 0, 0.1, clock);
        if (opened <= 0.4) continue;
        const b = tree.bloomBranch[j] ?? 0;
        disc(tipX[b] ?? 0, tipY[b] ?? 0, petal * (tree.bloomSize[j] ?? 1) * 0.2 * easeOut((opened - 0.4) / 0.6));
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const step = (dt: number) => {
      const s = settings.current;
      time += dt;
      const grown = time / Math.max(0.5, s.duration) >= 1;
      if (grown) lived += dt;

      const breeze = clamp01(s.wind);
      const t = time;
      const air = (Math.sin(t * 0.61) * 0.5 + Math.sin(t * 1.73 + 1.3) * 0.22 + Math.sin(t * 0.23 + 0.4) * 0.6) * breeze * 0.05;
      gust *= Math.exp(-dt * 2.2);
      const supple = 0.15 + clamp01(s.sway) * 1.3;
      const reach = Math.min(width, height) * 0.28;
      const reach2 = reach * reach;
      for (let i = 0; i < tree.count; i++) {
        const d = (tree.depth[i] ?? 0) / Math.max(1, tree.maxDepth);
        const flex = supple * (0.08 + d ** 1.4);
        let target = air * flex;
        if (gust !== 0) {
          const dx = (tipX[i] ?? 0) - pointer.x;
          const dy = (tipY[i] ?? 0) - pointer.y;
          const near = Math.exp(-(dx * dx + dy * dy) / reach2);
          target += gust * flex * (0.35 + near * 1.6);
        }
        const off = offset[i] ?? 0;
        let vel = velocity[i] ?? 0;
        vel += ((target - off) * 26 - vel * 5.5) * dt;
        velocity[i] = vel;
        offset[i] = off + vel * dt;
      }

      // Petals let go from open blossoms, tumble down on the breeze and rest on the ground before fading
      if (grown && tree.blooms > 0 && !fading) {
        spawnDebt += dt * clamp01(s.fall) * 3;
        const clock = time / Math.max(0.5, s.duration);
        while (spawnDebt >= 1) {
          spawnDebt -= 1;
          let slot = -1;
          let used = 0;
          for (let n = 0; n < MAX_PETALS; n++) {
            if ((pstate[n] ?? 0) === 0) {
              if (slot < 0) slot = n;
            } else used++;
          }
          if (slot < 0 || used >= petalBudget) break;
          const j = Math.floor(Math.random() * tree.blooms);
          if (growth(tree.bloomBirth[j] ?? 0, 0.1, clock) < 1) continue;
          const b = tree.bloomBranch[j] ?? 0;
          px[slot] = tipX[b] ?? 0;
          py[slot] = tipY[b] ?? 0;
          pvx[slot] = (Math.random() - 0.5) * 10;
          pvy[slot] = 4 + Math.random() * 6;
          prot[slot] = Math.random() * Math.PI * 2;
          pspin[slot] = (Math.random() - 0.5) * 4;
          page[slot] = Math.random() * 10;
          pground[slot] = rootY - Math.random() * Math.min(width, height) * 0.015;
          pstate[slot] = 1;
        }
      }
      const drift = (air * 900 + gust * 500) * (0.4 + breeze);
      const fallSpeed = Math.max(18, scale * 0.07);
      for (let n = 0; n < MAX_PETALS; n++) {
        const state = pstate[n] ?? 0;
        if (state === 0) continue;
        const age = (page[n] ?? 0) + dt;
        if (state === 1) {
          let vx = pvx[n] ?? 0;
          let vy = pvy[n] ?? 0;
          vx += (drift - vx) * dt * 0.8;
          vy = Math.min(fallSpeed, vy + fallSpeed * 1.4 * dt);
          const x = (px[n] ?? 0) + (vx + Math.sin(age * 2.3) * 14) * dt;
          const y = (py[n] ?? 0) + vy * dt;
          pvx[n] = vx;
          pvy[n] = vy;
          px[n] = x;
          prot[n] = (prot[n] ?? 0) + (pspin[n] ?? 0) * dt;
          page[n] = age;
          if (y >= (pground[n] ?? rootY) || x < -20 || x > width + 20) {
            py[n] = Math.min(y, pground[n] ?? rootY);
            pstate[n] = 2;
            page[n] = 0;
          } else {
            py[n] = y;
          }
        } else {
          page[n] = age;
          if (age > 5) pstate[n] = 0;
        }
      }

      if (s.regrow > 0 && lived > s.regrow && !fading) fading = true;
      if (fading) {
        fade = Math.max(0, fade - dt / 1.8);
        if (fade <= 0) {
          generation++;
          tree = buildTree(s.seed + generation * 7919, s.complexity, s.blossoms);
          allocate();
          fit();
          time = 0;
          lived = 0;
          fading = false;
          fade = 1;
        }
      }
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      average += (delta - average) * 0.05;
      lastFrame = now;
      tick++;
      if (tick % 90 === 0) {
        // Fewer petals in the air on a device that can't keep up
        if (average > 22) petalBudget = Math.max(30, petalBudget - 20);
        else if (average < 17.5) petalBudget = Math.min(MAX_PETALS, petalBudget + 10);
      }
      step(Math.min(0.05, delta / 1000));
      draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      fit();
      draw();
    };

    api.current = {
      rebuild: () => {
        const s = settings.current;
        generation = 0;
        tree = buildTree(s.seed, s.complexity, s.blossoms);
        allocate();
        fit();
        time = 0;
        lived = 0;
        fading = false;
        fade = 1;
        draw();
        play();
      },
      recolor: () => {
        recolor();
        draw();
      },
      refresh: () => {
        play();
        draw();
      },
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      const now = performance.now();
      if (inside && pointer.inside) {
        const dt = Math.max(8, now - pointer.lastAt);
        const vx = (x - pointer.lastX) / dt;
        gust = Math.max(-0.9, Math.min(0.9, gust + vx * 0.05));
      }
      pointer.x = x;
      pointer.y = y;
      pointer.lastX = x;
      pointer.lastY = y;
      pointer.lastAt = now;
      pointer.inside = inside;
      if ((reduce || settings.current.paused) && inside) draw();
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    const mo = new MutationObserver(() => requestAnimationFrame(() => api.current.recolor()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    resize();
    play();

    return () => {
      cancelAnimationFrame(frame);
      api.current = { rebuild: () => {}, recolor: () => {}, refresh: () => {} };
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  useEffect(() => {
    api.current.rebuild();
  }, [seed, complexity, blossoms]);

  useEffect(() => {
    api.current.recolor();
  }, [branchColor, blossomColor]);

  useEffect(() => {
    api.current.refresh();
  }, [duration, fall, wind, sway, regrow, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
