"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

type Palette = "mixed" | "kohaku" | "golden";

export interface KoiPondProps {
  /** Number of koi in the pond, 1 to 12 */
  fish?: number;
  /** Which varieties swim: a mix, red and white kohaku, or golden fish */
  palette?: Palette;
  /** Color of the pond floor. Any CSS color */
  waterColor?: string;
  /** Floating lily pads and a flower or two */
  lilyPads?: boolean;
  /** Strength of the sunlight caustics on the floor, 0 to 1 */
  caustics?: number;
  /** Strength of the ripple rings on the surface, 0 to 1 */
  ripples?: number;
  /** How readily the koi gather toward the cursor, 0 to 1 */
  curiosity?: number;
  /** Swimming pace, 1 is the default */
  speed?: number;
  /** Koi follow the cursor, and a click drops food */
  interactive?: boolean;
  /** Hold the pond still */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const koiPondDemo: KoiPondProps = {
  fish: 7,
  palette: "mixed",
  waterColor: "#173f39",
  lilyPads: true,
  caustics: 0.6,
  ripples: 0.7,
  curiosity: 0.6,
  speed: 1,
  interactive: true,
  className: "min-h-[32rem]",
};

interface Variety {
  base: string;
  belly: string;
  patches: string[];
}

const VARIETIES: Record<string, Variety> = {
  kohaku: { base: "#f5f0e7", belly: "#fffdf8", patches: ["#dd4326"] },
  sanke: { base: "#f3eee4", belly: "#fffcf6", patches: ["#dc4628", "#1c1a19"] },
  showa: { base: "#1f1c1b", belly: "#3a3431", patches: ["#e14a2b", "#f2ece2"] },
  yamabuki: { base: "#e8a636", belly: "#f7cd6c", patches: ["#f6d27a"] },
  ogon: { base: "#d9d1bf", belly: "#f2ecde", patches: ["#efe7d4"] },
  orange: { base: "#e46f2c", belly: "#f39a55", patches: ["#f7dcc0"] },
};

const LINEUPS: Record<Palette, string[]> = {
  mixed: ["kohaku", "sanke", "yamabuki", "showa", "kohaku", "ogon", "orange", "sanke", "kohaku", "yamabuki", "showa", "ogon"],
  kohaku: ["kohaku", "sanke", "kohaku", "kohaku", "sanke", "kohaku", "sanke", "kohaku", "kohaku", "sanke", "kohaku", "sanke"],
  golden: ["yamabuki", "ogon", "orange", "yamabuki", "ogon", "orange", "yamabuki", "ogon", "orange", "yamabuki", "ogon", "orange"],
};

const SPINE = 14;
const DROPS = 6;

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uWater;
uniform float uCaustic;
uniform float uRipple;
uniform vec4 uDrops[${DROPS}];
uniform float uIntro;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float caustic(vec2 uv,float t){
  vec2 p=mod(uv*6.2831,6.2831)-250.;
  vec2 i=p;
  float c=1.;
  for(int n=0;n<4;n++){
    float tt=t*(1.-(3.5/float(n+1)));
    i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));
    c+=1./length(vec2(p.x/(sin(i.x+tt)/.005),p.y/(cos(i.y+tt)/.005)));
  }
  c/=4.;
  c=1.17-pow(c,1.4);
  return clamp(pow(abs(c),8.),0.,1.);
}
void main(){
  vec2 st=gl_FragCoord.xy/uRes;
  float aspect=uRes.x/uRes.y;
  vec2 disp=vec2(0.);
  float ring=0.;
  for(int k=0;k<${DROPS};k++){
    vec4 d=uDrops[k];
    float age=uTime-d.z;
    if(age<0.||age>4.)continue;
    vec2 dd=(st-d.xy)*vec2(aspect,1.);
    float r=length(dd)+.0001;
    float front=age*.16;
    float w=sin((r-front)*140.)*exp(-abs(r-front)*28.)*exp(-age*1.)*d.w*uRipple;
    disp+=dd/r*w;
    ring+=w;
  }
  vec2 q=vec2(st.x*aspect,st.y)+disp*.006;
  float mott=noise(q*2.6)*.6+noise(q*7.3)*.4;
  vec3 col=uWater*(.72+.5*mott);
  col+=(noise(q*38.)-.5)*.025;
  float c=caustic(q*.9,uTime*.32)*.7+caustic(q*.9+vec2(.13,.07),uTime*.32)*.3;
  col+=vec3(.62,.86,.74)*c*uCaustic*.42*uIntro;
  col+=vec3(.78,.9,.92)*pow(max(0.,1.-length(st-vec2(.18,.92))*1.35),3.)*.14;
  col+=max(0.,ring)*vec3(.5,.7,.66)*.12;
  col*=1.-.38*pow(length((st-.5)*vec2(1.,.9))*1.25,2.);
  // The pond deepens out of the flat water color on arrival
  col=mix(uWater,col,uIntro);
  gl_FragColor=vec4(col,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Resolves any CSS color (tokens and oklch included) to 0-1 RGB
function resolveColor(el: HTMLElement, color: string): [number, number, number] {
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  el.style.color = "";
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0.1, 0.25, 0.22];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [(data[0] ?? 0) / 255, (data[1] ?? 0) / 255, (data[2] ?? 0) / 255];
}

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const INTRO_MS = 2400;

interface Patch {
  at: number;
  side: number;
  size: number;
  color: string;
}

interface Koi {
  x: Float32Array;
  y: Float32Array;
  lx: Float32Array;
  ly: Float32Array;
  rx: Float32Array;
  ry: Float32Array;
  heading: number;
  speed: number;
  pace: number;
  length: number;
  width: number;
  phase: number;
  tx: number;
  ty: number;
  retarget: number;
  orbit: number;
  variety: Variety;
  patches: Patch[];
}

interface Pad {
  x: number;
  y: number;
  r: number;
  notch: number;
  spin: number;
  seed: number;
  flower: boolean;
}

interface Pellet {
  x: number;
  y: number;
  born: number;
}

export function KoiPond({
  fish = 7,
  palette = "mixed",
  waterColor = "#173f39",
  lilyPads = true,
  caustics = 0.6,
  ripples = 0.7,
  curiosity = 0.6,
  speed = 1,
  interactive = true,
  paused = false,
  className,
  children,
}: KoiPondProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLCanvasElement>(null);
  const lifeRef = useRef<HTMLCanvasElement>(null);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ waterColor, lilyPads, caustics, ripples, curiosity, speed, interactive, paused });
  settings.current = { waterColor, lilyPads, caustics, ripples, curiosity, speed, interactive, paused };
  const refresh = useRef<(recolor?: boolean) => void>(() => {});
  const count = Math.max(1, Math.min(12, Math.round(fish)));

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const life = lifeRef.current;
    const ctx = life?.getContext("2d");
    if (!root || !life || !ctx) return;

    // Water surface: a small WebGL pass for the floor, caustics and ripple light; the pond still works without it
    const water = waterRef.current;
    const gl = water?.getContext("webgl", { antialias: false, alpha: false }) ?? null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    const uniform: Record<string, WebGLUniformLocation | null> = {};
    if (gl) {
      vs = compile(gl, gl.VERTEX_SHADER, vertex);
      fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
      program = gl.createProgram();
      if (vs && fs && program) {
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.useProgram(program);
          buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
          const loc = gl.getAttribLocation(program, "p");
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
          for (const name of ["uRes", "uTime", "uWater", "uCaustic", "uRipple", "uDrops", "uIntro"]) uniform[name] = gl.getUniformLocation(program, name);
        } else program = null;
      } else program = null;
    }
    // Without a working shader the pond floor falls back to the root's water color
    if (water && !program) water.style.display = "none";

    const shadowCanvas = document.createElement("canvas");
    const sctx = shadowCanvas.getContext("2d");
    const drops = new Float32Array(DROPS * 4).fill(-100);
    let nextDrop = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let clock = 0;
    let frame = 0;
    let last = 0;
    let visible = true;
    let nextKiss = 3;
    let introStart = 0;
    let intro = reduce ? 1 : 0;
    const pointer = { x: 0, y: 0, inside: false, at: -1e9 };
    const pellets: Pellet[] = [];
    const koi: Koi[] = [];
    const pads: Pad[] = [];

    const drop = (x: number, y: number, strength: number) => {
      const i = nextDrop * 4;
      drops[i] = x / width;
      drops[i + 1] = 1 - y / height;
      drops[i + 2] = clock;
      drops[i + 3] = strength;
      nextDrop = (nextDrop + 1) % DROPS;
    };

    const build = () => {
      koi.length = 0;
      pads.length = 0;
      const random = seeded(4271);
      const lineup = LINEUPS[palette] ?? LINEUPS.mixed;
      const scale = Math.min(width, height);
      for (let n = 0; n < count; n++) {
        const variety = VARIETIES[lineup[n % lineup.length] ?? "kohaku"] ?? (VARIETIES.kohaku as Variety);
        const length = scale * (0.16 + random() * 0.07);
        const x = width * (0.15 + random() * 0.7);
        const y = height * (0.15 + random() * 0.7);
        const heading = random() * Math.PI * 2;
        const spineX = new Float32Array(SPINE);
        const spineY = new Float32Array(SPINE);
        const seg = length / (SPINE - 1);
        for (let i = 0; i < SPINE; i++) {
          spineX[i] = x - Math.cos(heading) * seg * i;
          spineY[i] = y - Math.sin(heading) * seg * i;
        }
        const patches: Patch[] = [];
        const spots = variety.patches.length > 0 ? 2 + Math.floor(random() * 3) : 0;
        for (let k = 0; k < spots; k++) {
          patches.push({
            at: 0.08 + random() * 0.62,
            side: (random() - 0.5) * 0.7,
            size: 0.5 + random() * 0.55,
            color: variety.patches[Math.floor(random() * variety.patches.length)] ?? variety.base,
          });
        }
        koi.push({
          x: spineX,
          y: spineY,
          lx: new Float32Array(SPINE),
          ly: new Float32Array(SPINE),
          rx: new Float32Array(SPINE),
          ry: new Float32Array(SPINE),
          heading,
          speed: 0,
          pace: 0.75 + random() * 0.5,
          length,
          width: length * (0.2 + random() * 0.04),
          phase: random() * 6,
          tx: x,
          ty: y,
          retarget: 0,
          orbit: random() * Math.PI * 2,
          variety,
          patches,
        });
      }
      const padCount = width < 640 ? 3 : 5;
      for (let n = 0; n < padCount; n++) {
        pads.push({
          x: width * (0.55 + random() * 0.42),
          y: height * (0.08 + random() * 0.84),
          r: scale * (0.045 + random() * 0.04),
          notch: random() * Math.PI * 2,
          spin: (random() - 0.5) * 0.4,
          seed: random() * 10,
          flower: n === 1 || n === 3,
        });
      }
    };

    const recolor = () => {
      const [r, g, b] = resolveColor(root, settings.current.waterColor);
      if (gl && program) {
        gl.useProgram(program);
        gl.uniform3f(uniform.uWater ?? null, r, g, b);
      }
    };

    const resize = () => {
      width = Math.max(1, root.clientWidth);
      height = Math.max(1, root.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      life.width = Math.round(width * dpr);
      life.height = Math.round(height * dpr);
      shadowCanvas.width = Math.max(1, Math.round(width / 5));
      shadowCanvas.height = Math.max(1, Math.round(height / 5));
      if (gl && water && program) {
        const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
        water.width = Math.max(1, Math.round(width * scale));
        water.height = Math.max(1, Math.round(height * scale));
        gl.viewport(0, 0, water.width, water.height);
      }
      build();
      recolor();
      draw();
    };

    const pickWander = (k: Koi) => {
      const margin = Math.min(width, height) * 0.12;
      k.tx = margin + Math.random() * (width - margin * 2);
      k.ty = margin + Math.random() * (height - margin * 2);
      k.retarget = clock + 4 + Math.random() * 5;
    };

    const steer = (k: Koi, dt: number) => {
      const s = settings.current;
      const hx = k.x[0] ?? 0;
      const hy = k.y[0] ?? 0;
      let goalX = k.tx;
      let goalY = k.ty;
      let urgency = 1;

      let nearest: Pellet | null = null;
      let best = Infinity;
      for (const pellet of pellets) {
        const d = Math.hypot(pellet.x - hx, pellet.y - hy);
        if (d < best) {
          best = d;
          nearest = pellet;
        }
      }
      const curious = s.interactive && pointer.inside && clock - pointer.at < 6 && ((k.orbit * 97) % 1) < clamp01(s.curiosity) + 0.05;
      if (nearest) {
        goalX = nearest.x;
        goalY = nearest.y;
        urgency = 1.9;
      } else if (curious) {
        // Circle the hand at a respectful distance instead of piling onto it
        const ring = k.length * 0.9;
        const angle = k.orbit + clock * 0.25;
        goalX = pointer.x + Math.cos(angle) * ring;
        goalY = pointer.y + Math.sin(angle) * ring;
        urgency = Math.hypot(goalX - hx, goalY - hy) < k.length ? 0.55 : 1.15;
      } else if (clock > k.retarget || Math.hypot(k.tx - hx, k.ty - hy) < k.length * 0.6) {
        pickWander(k);
      }

      let desired = Math.atan2(goalY - hy, goalX - hx);
      // Keep clear of the other koi
      let pushX = 0;
      let pushY = 0;
      for (const other of koi) {
        if (other === k) continue;
        const dx = hx - (other.x[0] ?? 0);
        const dy = hy - (other.y[0] ?? 0);
        const d = Math.hypot(dx, dy);
        const reach = (k.length + other.length) * 0.45;
        if (d > 0 && d < reach) {
          pushX += (dx / d) * (1 - d / reach);
          pushY += (dy / d) * (1 - d / reach);
        }
      }
      // Turn back from the pond's edge
      const margin = Math.min(width, height) * 0.08;
      if (hx < margin) pushX += (margin - hx) / margin;
      if (hx > width - margin) pushX -= (hx - (width - margin)) / margin;
      if (hy < margin) pushY += (margin - hy) / margin;
      if (hy > height - margin) pushY -= (hy - (height - margin)) / margin;
      if (pushX !== 0 || pushY !== 0) {
        const blend = Math.min(1, Math.hypot(pushX, pushY));
        const away = Math.atan2(pushY, pushX);
        desired = Math.atan2(
          Math.sin(desired) * (1 - blend) + Math.sin(away) * blend,
          Math.cos(desired) * (1 - blend) + Math.cos(away) * blend,
        );
      }

      let turn = desired - k.heading;
      turn = Math.atan2(Math.sin(turn), Math.cos(turn));
      const maxTurn = (1.3 + urgency * 0.6) * dt;
      k.heading += Math.max(-maxTurn, Math.min(maxTurn, turn));

      const cruise = Math.min(width, height) * 0.07 * k.pace * s.speed * urgency;
      k.speed += (cruise - k.speed) * Math.min(1, dt * 1.8);
      k.x[0] = hx + Math.cos(k.heading) * k.speed * dt;
      k.y[0] = hy + Math.sin(k.heading) * k.speed * dt;

      // The body follows the head link by link
      const seg = k.length / (SPINE - 1);
      for (let i = 1; i < SPINE; i++) {
        const px = k.x[i - 1] ?? 0;
        const py = k.y[i - 1] ?? 0;
        const dx = px - (k.x[i] ?? 0);
        const dy = py - (k.y[i] ?? 0);
        const d = Math.hypot(dx, dy) || 1;
        k.x[i] = px - (dx / d) * seg;
        k.y[i] = py - (dy / d) * seg;
      }
      k.phase += dt * (2.2 + (k.speed / Math.max(1, k.length)) * 5.5);

      if (nearest && best < k.width * 0.9) {
        const index = pellets.indexOf(nearest);
        if (index >= 0) pellets.splice(index, 1);
        drop(nearest.x, nearest.y, 0.45);
      }
    };

    // Outline of the body: a rounded head, full shoulders and a long taper into the tail
    const outline = (k: Koi) => {
      for (let i = 0; i < SPINE; i++) {
        const t = i / (SPINE - 1);
        const ax = k.x[Math.max(0, i - 1)] ?? 0;
        const ay = k.y[Math.max(0, i - 1)] ?? 0;
        const bx = k.x[Math.min(SPINE - 1, i + 1)] ?? 0;
        const by = k.y[Math.min(SPINE - 1, i + 1)] ?? 0;
        const tx = ax - bx;
        const ty = ay - by;
        const tl = Math.hypot(tx, ty) || 1;
        const nx = -ty / tl;
        const ny = tx / tl;
        const sway = Math.sin(k.phase - i * 0.55) * k.length * 0.034 * t ** 1.3;
        const shape = (t < 0.2 ? 0.58 + 0.42 * Math.sin((t / 0.2) * (Math.PI / 2)) : 1) * (1 - t ** 1.55 * 0.9);
        const half = (k.width * shape) / 2;
        const cx = (k.x[i] ?? 0) + nx * sway;
        const cy = (k.y[i] ?? 0) + ny * sway;
        k.lx[i] = cx + nx * half;
        k.ly[i] = cy + ny * half;
        k.rx[i] = cx - nx * half;
        k.ry[i] = cy - ny * half;
      }
    };

    const traceBody = (c: CanvasRenderingContext2D, k: Koi) => {
      c.beginPath();
      c.moveTo(k.lx[0] ?? 0, k.ly[0] ?? 0);
      for (let i = 1; i < SPINE - 1; i++) {
        const mx = ((k.lx[i] ?? 0) + (k.lx[i + 1] ?? 0)) / 2;
        const my = ((k.ly[i] ?? 0) + (k.ly[i + 1] ?? 0)) / 2;
        c.quadraticCurveTo(k.lx[i] ?? 0, k.ly[i] ?? 0, mx, my);
      }
      c.lineTo(k.lx[SPINE - 1] ?? 0, k.ly[SPINE - 1] ?? 0);
      c.lineTo(k.rx[SPINE - 1] ?? 0, k.ry[SPINE - 1] ?? 0);
      for (let i = SPINE - 2; i > 0; i--) {
        const mx = ((k.rx[i] ?? 0) + (k.rx[i + 1] ?? 0)) / 2;
        const my = ((k.ry[i] ?? 0) + (k.ry[i + 1] ?? 0)) / 2;
        c.quadraticCurveTo(k.rx[i + 1] ?? 0, k.ry[i + 1] ?? 0, mx, my);
      }
      c.lineTo(k.rx[0] ?? 0, k.ry[0] ?? 0);
      const hx = k.x[0] ?? 0;
      const hy = k.y[0] ?? 0;
      const fx = Math.cos(k.heading);
      const fy = Math.sin(k.heading);
      c.bezierCurveTo(
        (k.rx[0] ?? 0) + fx * k.width * 0.55,
        (k.ry[0] ?? 0) + fy * k.width * 0.55,
        (k.lx[0] ?? 0) + fx * k.width * 0.55,
        (k.ly[0] ?? 0) + fy * k.width * 0.55,
        k.lx[0] ?? hx,
        k.ly[0] ?? hy,
      );
      c.closePath();
    };

    const fin = (c: CanvasRenderingContext2D, x: number, y: number, dirX: number, dirY: number, size: number, open: number) => {
      const ex = x + dirX * size;
      const ey = y + dirY * size;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x + dirX * size * 0.4 - dirY * size * open, y + dirY * size * 0.4 + dirX * size * open, ex, ey);
      c.quadraticCurveTo(x + dirX * size * 0.7 + dirY * size * 0.12, y + dirY * size * 0.7 - dirX * size * 0.12, x, y);
      c.fill();
    };

    const drawKoi = (k: Koi) => {
      const v = k.variety;
      const i1 = 3;
      const ax = k.x[i1 - 1] ?? 0;
      const ay = k.y[i1 - 1] ?? 0;
      const bx = k.x[i1 + 1] ?? 0;
      const by = k.y[i1 + 1] ?? 0;
      const tl = Math.hypot(ax - bx, ay - by) || 1;
      const tx = (ax - bx) / tl;
      const ty = (ay - by) / tl;
      const nx = -ty;
      const ny = tx;
      const beat = Math.sin(k.phase * 0.5);

      // Pectoral fins, translucent and trailing, under the body
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = v.belly;
      const size = k.width * 1.15;
      for (const side of [1, -1]) {
        const px = (k.x[i1] ?? 0) + nx * side * k.width * 0.32;
        const py = (k.y[i1] ?? 0) + ny * side * k.width * 0.32;
        const spread = 0.55 + beat * 0.2 * side;
        const dx = nx * side * spread - tx * (1 - spread * 0.4);
        const dy = ny * side * spread - ty * (1 - spread * 0.4);
        const dl = Math.hypot(dx, dy) || 1;
        fin(ctx, px, py, dx / dl, dy / dl, size, 0.28 * side);
      }

      // Tail: two soft lobes that flutter with the swim
      const end = SPINE - 1;
      const ex = k.x[end] ?? 0;
      const ey = k.y[end] ?? 0;
      const pbx = k.x[end - 1] ?? 0;
      const pby = k.y[end - 1] ?? 0;
      const bl = Math.hypot(ex - pbx, ey - pby) || 1;
      const backX = (ex - pbx) / bl;
      const backY = (ey - pby) / bl;
      const tnx = -backY;
      const tny = backX;
      const flutter = Math.sin(k.phase - SPINE * 0.55) * 0.35;
      const tailLength = k.length * 0.24;
      ctx.globalAlpha = 0.62;
      ctx.fillStyle = v.base;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      for (const side of [1, -1]) {
        const tipX = ex + backX * tailLength + tnx * (side * 0.55 + flutter) * tailLength;
        const tipY = ey + backY * tailLength + tny * (side * 0.55 + flutter) * tailLength;
        ctx.quadraticCurveTo(ex + backX * tailLength * 0.5 + tnx * side * tailLength * 0.15, ey + backY * tailLength * 0.5 + tny * side * tailLength * 0.15, tipX, tipY);
        ctx.quadraticCurveTo(ex + backX * tailLength * 0.55, ey + backY * tailLength * 0.55, ex, ey);
      }
      ctx.fill();

      // Body with a soft light along the back and the variety's patches clipped inside
      ctx.globalAlpha = 1;
      traceBody(ctx, k);
      const head = { x: k.x[0] ?? 0, y: k.y[0] ?? 0 };
      const gradient = ctx.createLinearGradient(head.x + nx * k.width * 0.5, head.y + ny * k.width * 0.5, head.x - nx * k.width * 0.5, head.y - ny * k.width * 0.5);
      gradient.addColorStop(0, v.base);
      gradient.addColorStop(0.5, v.belly);
      gradient.addColorStop(1, v.base);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.save();
      ctx.clip();
      for (const patch of k.patches) {
        const at = patch.at * (SPINE - 1);
        const i = Math.floor(at);
        const f = at - i;
        const px = (k.x[i] ?? 0) * (1 - f) + (k.x[i + 1] ?? 0) * f;
        const py = (k.y[i] ?? 0) * (1 - f) + (k.y[i + 1] ?? 0) * f;
        const w = ((k.lx[i] ?? 0) - (k.rx[i] ?? 0)) / 2;
        const h = ((k.ly[i] ?? 0) - (k.ry[i] ?? 0)) / 2;
        const cx = px + w * patch.side;
        const cy = py + h * patch.side;
        const radius = k.width * 0.5 * patch.size;
        const spot = ctx.createRadialGradient(cx, cy, radius * 0.55, cx, cy, radius);
        spot.addColorStop(0, patch.color);
        spot.addColorStop(1, `${patch.color}00`);
        ctx.fillStyle = spot;
        ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      }
      ctx.restore();
      // Dorsal line and a fine darker rim give the body its volume
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = k.width * 0.12;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(k.x[1] ?? 0, k.y[1] ?? 0);
      for (let i = 2; i < SPINE - 3; i++) ctx.lineTo(k.x[i] ?? 0, k.y[i] ?? 0);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const drawPad = (pad: Pad) => {
      const bob = Math.sin(clock * 0.6 + pad.seed) * 0.015;
      const angle = pad.notch + Math.sin(clock * 0.15 + pad.seed) * 0.08 + pad.spin * clock * 0.02;
      const r = pad.r * (1 + bob);
      const shape = (c: CanvasRenderingContext2D, x: number, y: number) => {
        c.beginPath();
        c.moveTo(x, y);
        c.arc(x, y, r, angle + 0.22, angle - 0.22 + Math.PI * 2);
        c.closePath();
      };
      ctx.fillStyle = "rgba(4, 18, 16, 0.28)";
      shape(ctx, pad.x + r * 0.12, pad.y + r * 0.18);
      ctx.fill();
      const leaf = ctx.createRadialGradient(pad.x - r * 0.2, pad.y - r * 0.25, r * 0.1, pad.x, pad.y, r);
      leaf.addColorStop(0, "#6a9a4b");
      leaf.addColorStop(0.7, "#40723a");
      leaf.addColorStop(1, "#2e5a2e");
      ctx.fillStyle = leaf;
      shape(ctx, pad.x, pad.y);
      ctx.fill();
      ctx.strokeStyle = "rgba(18, 44, 20, 0.45)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.strokeStyle = "rgba(210, 235, 190, 0.14)";
      ctx.beginPath();
      for (let n = 1; n < 9; n++) {
        const a = angle + 0.22 + (n / 9) * (Math.PI * 2 - 0.44);
        ctx.moveTo(pad.x, pad.y);
        ctx.lineTo(pad.x + Math.cos(a) * r * 0.9, pad.y + Math.sin(a) * r * 0.9);
      }
      ctx.stroke();
      if (pad.flower) {
        const fx = pad.x + Math.cos(angle + Math.PI) * r * 0.35;
        const fy = pad.y + Math.sin(angle + Math.PI) * r * 0.35;
        const petal = r * 0.42;
        for (let layer = 0; layer < 2; layer++) {
          ctx.fillStyle = layer === 0 ? "#f1b9c6" : "#fbe4ea";
          for (let n = 0; n < 8; n++) {
            const a = (n / 8) * Math.PI * 2 + layer * 0.39 + clock * 0.02;
            const size = petal * (layer === 0 ? 1 : 0.68);
            ctx.beginPath();
            ctx.ellipse(fx + Math.cos(a) * size * 0.45, fy + Math.sin(a) * size * 0.45, size * 0.5, size * 0.2, a, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.fillStyle = "#f2c94c";
        ctx.beginPath();
        ctx.arc(fx, fy, petal * 0.16, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawWater = () => {
      if (!gl || !program || !water) return;
      const s = settings.current;
      gl.useProgram(program);
      gl.uniform2f(uniform.uRes ?? null, water.width, water.height);
      gl.uniform1f(uniform.uTime ?? null, reduce ? 6 : clock);
      gl.uniform1f(uniform.uCaustic ?? null, clamp01(s.caustics));
      gl.uniform1f(uniform.uRipple ?? null, clamp01(s.ripples));
      gl.uniform4fv(uniform.uDrops ?? null, drops);
      gl.uniform1f(uniform.uIntro ?? null, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const draw = () => {
      drawWater();
      // The fish and pads surface with the intro
      life.style.opacity = String(intro);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const k of koi) outline(k);

      // Soft shadows on the floor: silhouettes drawn small and scaled up, so they blur for free
      if (sctx) {
        sctx.setTransform(1, 0, 0, 1, 0, 0);
        sctx.clearRect(0, 0, shadowCanvas.width, shadowCanvas.height);
        sctx.setTransform(shadowCanvas.width / width, 0, 0, shadowCanvas.height / height, 0, 0);
        sctx.fillStyle = "#000";
        for (const k of koi) {
          traceBody(sctx, k);
          sctx.fill();
        }
        ctx.globalAlpha = 0.3;
        ctx.imageSmoothingEnabled = true;
        const offset = Math.min(width, height) * 0.025;
        ctx.drawImage(shadowCanvas, offset * 0.6, offset, width, height);
        ctx.globalAlpha = 1;
      }

      for (const pellet of pellets) {
        const age = clock - pellet.born;
        ctx.globalAlpha = Math.max(0, 1 - age / 8) * 0.9;
        ctx.fillStyle = "#e3c896";
        ctx.beginPath();
        ctx.arc(pellet.x + Math.sin(age + pellet.born) * 2, pellet.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const k of koi) drawKoi(k);
      if (settings.current.lilyPads) for (const pad of pads) drawPad(pad);

      // Surface rings drawn on top: ripples live on the water, above the fish
      const strength = clamp01(settings.current.ripples);
      if (strength > 0) {
        ctx.lineWidth = 1.2;
        for (let n = 0; n < DROPS; n++) {
          const age = clock - (drops[n * 4 + 2] ?? -100);
          if (age < 0 || age > 3) continue;
          const x = (drops[n * 4] ?? 0) * width;
          const y = (1 - (drops[n * 4 + 1] ?? 0)) * height;
          const power = drops[n * 4 + 3] ?? 0;
          const radius = age * height * 0.16;
          for (let ring = 0; ring < 2; ring++) {
            const rr = radius - ring * height * 0.025;
            if (rr <= 0) continue;
            ctx.globalAlpha = Math.exp(-age * 1.2) * 0.32 * power * strength * (1 - ring * 0.4);
            ctx.strokeStyle = "#e8f4ef";
            ctx.beginPath();
            ctx.arc(x, y, rr, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }
    };

    const tick = (now: number) => {
      if (intro < 1) {
        introStart ||= now;
        const t = clamp01((now - introStart) / INTRO_MS);
        intro = t * t * t * (t * (t * 6 - 15) + 10);
      }
      if (settings.current.paused) {
        draw();
        frame = intro < 1 ? requestAnimationFrame(tick) : 0;
        return;
      }
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      clock += dt;
      for (const k of koi) steer(k, dt);
      for (let n = pellets.length - 1; n >= 0; n--) if (clock - (pellets[n]?.born ?? 0) > 8) pellets.splice(n, 1);
      if (clock > nextKiss) {
        // Now and then a koi breaks the surface for a breath
        const k = koi[Math.floor(Math.random() * koi.length)];
        if (k) drop(k.x[0] ?? 0, k.y[0] ?? 0, 0.35);
        nextKiss = clock + 3 + Math.random() * 4;
      }
      draw();
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    refresh.current = (withColors = false) => {
      if (withColors) recolor();
      play();
      draw();
    };

    const inside = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return { x, y, hit: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
    };
    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || event.pointerType === "touch") return;
      const at = inside(event);
      pointer.inside = at.hit;
      if (!at.hit) return;
      pointer.x = at.x;
      pointer.y = at.y;
      pointer.at = clock;
    };
    const onDown = (event: PointerEvent) => {
      if (!settings.current.interactive || reduce) return;
      if ((event.target as Element | null)?.closest?.("a, button")) return;
      const at = inside(event);
      if (!at.hit) return;
      for (let n = 0; n < 5; n++) {
        pellets.push({ x: at.x + (Math.random() - 0.5) * 40, y: at.y + (Math.random() - 0.5) * 40, born: clock });
      }
      if (pellets.length > 30) pellets.splice(0, pellets.length - 30);
      drop(at.x, at.y, 1);
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    play();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
      if (gl) {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [reduce, count, palette]);

  useEffect(() => {
    refresh.current(true);
  }, [waterColor]);

  useEffect(() => {
    refresh.current(false);
  }, [lilyPads, caustics, ripples, curiosity, speed, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: waterColor }}>
      <canvas ref={waterRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      <canvas ref={lifeRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
