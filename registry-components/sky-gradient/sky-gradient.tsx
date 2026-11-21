"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SkyPreset = "dawn" | "haze" | "azure" | "dusk" | "mist" | "apricot" | "lilac" | "sage" | "stone" | "night";

export interface SkyGradientProps {
  /** A tuned look; any prop below overrides it */
  preset?: SkyPreset;
  /** Sky colors from the top down, 2 to 4, as hex */
  colors?: string[];
  /** A warm haze rising from the bottom corner, as hex */
  warmColor?: string;
  /** Color of the soft clouds, as hex */
  cloudColor?: string;
  /** How much cloud there is, 0 (clear) to 1 */
  clouds?: number;
  /** Where the cloud bank sits, 0 to 1 from the left and from the top */
  cloudX?: number;
  cloudY?: number;
  /** Size of the cloud bank, 0.2 to 1.5 */
  cloudSize?: number;
  /** Loose puffs scattered across the whole sky, 0 (none) to 1 */
  scatter?: number;
  /** Drift speed, 0 (still) to 8 */
  speed?: number;
  /** Film grain over the sky, 0 to 1 */
  grain?: number;
  /** How strongly the sky shows over whatever is behind it, 0 to 1; lower lets the page ground through, lighter on light themes and darker on dark ones */
  opacity?: number;
  /** Picks a different arrangement of the clouds */
  seed?: number;
  /** Hold the sky still */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export interface SkyLook {
  colors: string[];
  warmColor: string;
  cloudColor: string;
  clouds: number;
  cloudX: number;
  cloudY: number;
  cloudSize: number;
  /** A second, smaller bank; size 0 leaves it out */
  cloudX2: number;
  cloudY2: number;
  cloudSize2: number;
  scatter: number;
  grain: number;
  seed: number;
}

// The first five are measured from the stage photographs (stage-dawn, stage-haze, stage-sand as azure, stage-dusk, stage-mist):
// clear sky from the darkest pixels of each row, cloud colour and position from the bright ones. The rest extend the family.
export const skyPresets: Record<SkyPreset, SkyLook> = {
  dawn: { colors: ["#91b7e7", "#b1cbec", "#d8dbe2", "#f8dcc6"], warmColor: "#f5ddca", cloudColor: "#f8f6f2", clouds: 0.88, cloudX: 0.76, cloudY: 0.3, cloudSize: 0.62, cloudX2: 0, cloudY2: 0, cloudSize2: 0, scatter: 0.15, grain: 0.35, seed: 3 },
  haze: { colors: ["#669ddf", "#89b5e6", "#b3d0ef", "#deeaf5"], warmColor: "#fafbfc", cloudColor: "#f9fbfe", clouds: 0.95, cloudX: 0.8, cloudY: 0.3, cloudSize: 0.58, cloudX2: 0.62, cloudY2: 1, cloudSize2: 0.55, scatter: 0.2, grain: 0.35, seed: 7 },
  azure: { colors: ["#4a84d2", "#6fa0df", "#9cc0eb", "#cedff2"], warmColor: "#dde8f5", cloudColor: "#f6f9fd", clouds: 0.95, cloudX: 0.8, cloudY: 0.55, cloudSize: 0.55, cloudX2: 0, cloudY2: 0, cloudSize2: 0.18, scatter: 0.1, grain: 0.35, seed: 11 },
  dusk: { colors: ["#8286cb", "#b39dc6", "#e6a7a1", "#fba776"], warmColor: "#f9c8b3", cloudColor: "#efe2e8", clouds: 0.72, cloudX: 0.3, cloudY: 0.1, cloudSize: 0.45, cloudX2: 0.88, cloudY2: 0.92, cloudSize2: 0.4, scatter: 0.55, grain: 0.35, seed: 5 },
  mist: { colors: ["#cdc7e5", "#d6cae0", "#ecd5d4", "#f9dbc5"], warmColor: "#f7dac7", cloudColor: "#fbf6f3", clouds: 0.9, cloudX: 0.58, cloudY: 0.16, cloudSize: 0.75, cloudX2: 0.12, cloudY2: 0.62, cloudSize2: 0.42, scatter: 0.5, grain: 0.35, seed: 9 },
  apricot: { colors: ["#efbf9c", "#f4d0b4", "#f8e1cf", "#fbefe5"], warmColor: "#f5b088", cloudColor: "#fffaf5", clouds: 0.75, cloudX: 0.25, cloudY: 0.28, cloudSize: 0.6, cloudX2: 0.9, cloudY2: 0.8, cloudSize2: 0.3, scatter: 0.3, grain: 0.35, seed: 13 },
  lilac: { colors: ["#a59fdb", "#c1b5e2", "#e0cfe6", "#f4e6ee"], warmColor: "#f1d4e3", cloudColor: "#fbf6fb", clouds: 0.85, cloudX: 0.7, cloudY: 0.38, cloudSize: 0.6, cloudX2: 0.1, cloudY2: 0.15, cloudSize2: 0.25, scatter: 0.35, grain: 0.35, seed: 17 },
  sage: { colors: ["#98c3bb", "#b6d6cc", "#d8e7db", "#f1f0e4"], warmColor: "#ece3c9", cloudColor: "#fbfcf8", clouds: 0.8, cloudX: 0.72, cloudY: 0.26, cloudSize: 0.58, cloudX2: 0, cloudY2: 0, cloudSize2: 0, scatter: 0.3, grain: 0.35, seed: 19 },
  stone: { colors: ["#d8d4cc", "#e5e2db", "#efede8", "#f8f6f2"], warmColor: "#f2e2d4", cloudColor: "#ffffff", clouds: 0.85, cloudX: 0.7, cloudY: 0.3, cloudSize: 0.62, cloudX2: 0.15, cloudY2: 0.9, cloudSize2: 0.3, scatter: 0.25, grain: 0.3, seed: 23 },
  night: { colors: ["#1d2748", "#2f3b68", "#565c8c", "#9389ad"], warmColor: "#c69aa6", cloudColor: "#b4b3d0", clouds: 0.55, cloudX: 0.7, cloudY: 0.32, cloudSize: 0.6, cloudX2: 0.2, cloudY2: 0.85, cloudSize2: 0.35, scatter: 0.35, grain: 0.4, seed: 29 },
};

export const skyGradientDemo: SkyGradientProps = {
  preset: "dawn",
  speed: 2.5,
  className: "aspect-5/4 w-full rounded-3xl",
};

/* ---------- One WebGL context for every sky on the page ---------- */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uSky0, uSky1, uSky2, uSky3;
uniform vec3 uWarm, uCloud;
uniform float uAmount, uSize, uSize2, uScatter, uSeed;
uniform vec2 uCenter, uCenter2;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(11.7, 4.3); a *= 0.5; }
  return v;
}
vec3 sky(float t){
  vec3 c = mix(uSky0, uSky1, smoothstep(0.0, 0.34, t));
  c = mix(c, uSky2, smoothstep(0.30, 0.68, t));
  return mix(c, uSky3, smoothstep(0.62, 1.0, t));
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.y = 1.0 - uv.y;
  float aspect = uRes.x / uRes.y;
  vec3 col = sky(uv.y);
  // warm haze rising from the lower right
  float warm = smoothstep(0.45, 1.0, uv.y) * smoothstep(0.15, 1.0, uv.x);
  col = mix(col, uWarm, warm * 0.55);

  float t = uTime * 0.018;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.4 + uSeed * 7.31;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  float n = fbm(p + 1.6 * q + vec2(t * 1.4, t * 0.4));

  // a soft bank of cloud around the centre, broken up by the noise
  vec2 d = (uv - uCenter) * vec2(aspect * 0.75, 1.0) / uSize;
  float bank = 1.0 - smoothstep(0.15, 1.05, length(d));
  if (uSize2 > 0.0) {
    vec2 d2 = (uv - uCenter2) * vec2(aspect * 0.75, 1.0) / uSize2;
    bank = max(bank, 1.0 - smoothstep(0.15, 1.05, length(d2)));
  }
  float cloud = smoothstep(0.38, 0.78, n * 0.75 + bank * 0.62 - 0.22);
  // loose puffs across the sky; more scatter lowers their threshold and raises their weight
  float puffs = smoothstep(0.62 - uScatter * 0.16, 0.9 - uScatter * 0.08, n) * (0.3 + uScatter * 0.6);
  cloud = max(cloud, puffs);
  col = mix(col, uCloud, cloud * uAmount);
  gl_FragColor = vec4(col, 1.0);
}`;

interface Instance {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  look: SkyLook;
  speed: number;
  paused: boolean;
  visible: boolean;
  drawn: boolean;
  width: number;
  height: number;
  clock: number;
}

interface Renderer {
  gl: WebGLRenderingContext;
  surface: HTMLCanvasElement;
  uniforms: Record<string, WebGLUniformLocation | null>;
  /** The browser took the context back; skies hold their last frame until it returns */
  lost: boolean;
}

// Clouds are soft enough to draw at a quarter of their size and scale up without a visible loss
const RESOLUTION = 0.25;
const MAX_SIDE = 512;
const FRAME_MS = 1000 / 30;

let renderer: Renderer | null | undefined;
const instances = new Set<Instance>();
let frame = 0;
let lastTick = 0;
let reducedMotion = false;

function rgb(color: string): [number, number, number] {
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;
  const value = Number.parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(value)) return [1, 1, 1];
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

// Builds the program on a context; run again on the same context after the browser restores it
function setupProgram(gl: WebGLRenderingContext): Record<string, WebGLUniformLocation | null> | null {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vert = compile(gl.VERTEX_SHADER, VERT);
  const frag = compile(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vert || !frag || !program) return null;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL call, not a React hook
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const names = ["uRes", "uTime", "uSky0", "uSky1", "uSky2", "uSky3", "uWarm", "uCloud", "uAmount", "uSize", "uSize2", "uScatter", "uSeed", "uCenter", "uCenter2"];
  return Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)]));
}

function getRenderer(): Renderer | null {
  if (renderer !== undefined) return renderer;
  renderer = null;
  try {
    const surface = document.createElement("canvas");
    surface.width = MAX_SIDE;
    surface.height = MAX_SIDE;
    const gl = surface.getContext("webgl", { antialias: false, alpha: false, depth: false, stencil: false, preserveDrawingBuffer: true });
    if (!gl) return null;
    const uniforms = setupProgram(gl);
    if (!uniforms) return null;
    const created: Renderer = { gl, surface, uniforms, lost: false };

    // Too many contexts on a page and the browser drops the oldest; preventDefault asks for it back
    surface.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      created.lost = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    });
    surface.addEventListener("webglcontextrestored", () => {
      const restored = setupProgram(gl);
      if (!restored) return;
      created.uniforms = restored;
      created.lost = false;
      for (const item of instances) item.drawn = false;
      lastTick = 0;
      wake();
    });
    renderer = created;
  } catch {
    renderer = null;
  }
  return renderer;
}

function draw(r: Renderer, item: Instance) {
  const { gl, uniforms, surface } = r;
  const { look } = item;
  const sky = [0, 1, 2, 3].map((i) => rgb(look.colors[Math.min(i, look.colors.length - 1)] ?? "#ffffff"));
  gl.viewport(0, 0, item.width, item.height);
  gl.uniform2f(uniforms.uRes ?? null, item.width, item.height);
  gl.uniform1f(uniforms.uTime ?? null, item.clock);
  sky.forEach((c, i) => {
    gl.uniform3f(uniforms[`uSky${i}`] ?? null, c[0], c[1], c[2]);
  });
  gl.uniform3f(uniforms.uWarm ?? null, ...rgb(look.warmColor));
  gl.uniform3f(uniforms.uCloud ?? null, ...rgb(look.cloudColor));
  gl.uniform1f(uniforms.uAmount ?? null, look.clouds);
  gl.uniform1f(uniforms.uSize ?? null, look.cloudSize);
  gl.uniform1f(uniforms.uSeed ?? null, look.seed);
  gl.uniform2f(uniforms.uCenter ?? null, look.cloudX, look.cloudY);
  gl.uniform1f(uniforms.uSize2 ?? null, look.cloudSize2);
  gl.uniform2f(uniforms.uCenter2 ?? null, look.cloudX2, look.cloudY2);
  gl.uniform1f(uniforms.uScatter ?? null, look.scatter);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  // The drawing sits in the bottom-left corner of the shared surface; copy just that corner out
  item.ctx.drawImage(surface, 0, surface.height - item.height, item.width, item.height, 0, 0, item.width, item.height);
  item.drawn = true;
}

function moving(item: Instance) {
  return item.visible && !item.paused && item.speed > 0 && !reducedMotion;
}

function tick(now: number) {
  frame = 0;
  const r = getRenderer();
  // While the context is lost every sky keeps its last frame; the restore handler wakes the loop
  if (!r || r.lost) return;
  const delta = lastTick ? Math.min(now - lastTick, 100) : 0;
  if (now - lastTick >= FRAME_MS || !lastTick) {
    lastTick = now;
    for (const item of instances) {
      if (!item.visible || document.hidden) continue;
      if (moving(item)) item.clock += (delta / 1000) * item.speed;
      if (moving(item) || !item.drawn) draw(r, item);
    }
  }
  if ([...instances].some((item) => moving(item) || (item.visible && !item.drawn))) frame = requestAnimationFrame(tick);
}

function wake() {
  if (!frame) frame = requestAnimationFrame(tick);
}

/* ---------- Component ---------- */

export function SkyGradient({
  preset = "dawn",
  colors,
  warmColor,
  cloudColor,
  clouds,
  cloudX,
  cloudY,
  cloudSize,
  scatter,
  speed = 2.5,
  opacity = 1,
  grain,
  seed,
  paused = false,
  className,
  children,
}: SkyGradientProps) {
  const base = skyPresets[preset];
  const look: SkyLook = {
    colors: colors && colors.length >= 2 ? colors : base.colors,
    warmColor: warmColor ?? base.warmColor,
    cloudColor: cloudColor ?? base.cloudColor,
    clouds: clouds ?? base.clouds,
    cloudX: cloudX ?? base.cloudX,
    cloudY: cloudY ?? base.cloudY,
    cloudSize: cloudSize ?? base.cloudSize,
    cloudX2: base.cloudX2,
    cloudY2: base.cloudY2,
    cloudSize2: base.cloudSize2,
    scatter: scatter ?? base.scatter,
    grain: grain ?? base.grain,
    seed: seed ?? base.seed,
  };
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const itemRef = useRef<Instance | null>(null);
  const grainId = `sky-grain-${useId().replace(/:/g, "")}`;
  const [ready, setReady] = useState(false);

  // The instance is created once on mount; prop changes are pushed into it by the effect below
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once by design
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx || !getRenderer()) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = motion.matches;
    const item: Instance = { canvas, ctx, look, speed, paused, visible: false, drawn: false, width: 1, height: 1, clock: look.seed * 10 };
    itemRef.current = item;
    instances.add(item);
    setReady(true);

    const resize = () => {
      const rect = root.getBoundingClientRect();
      item.width = Math.max(1, Math.min(MAX_SIDE, Math.round(rect.width * RESOLUTION)));
      item.height = Math.max(1, Math.min(MAX_SIDE, Math.round(rect.height * RESOLUTION)));
      canvas.width = item.width;
      canvas.height = item.height;
      item.drawn = false;
      wake();
    };
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(root);
    const viewObserver = new IntersectionObserver(([entry]) => {
      item.visible = Boolean(entry?.isIntersecting);
      wake();
    });
    viewObserver.observe(root);
    const onMotion = () => {
      reducedMotion = motion.matches;
      wake();
    };
    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", wake);
    resize();

    return () => {
      instances.delete(item);
      itemRef.current = null;
      sizeObserver.disconnect();
      viewObserver.disconnect();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", wake);
    };
  }, []);

  const lookKey = JSON.stringify(look);
  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;
    item.look = JSON.parse(lookKey) as SkyLook;
    item.speed = speed;
    item.paused = paused;
    item.drawn = false;
    wake();
  }, [lookKey, speed, paused]);

  // Before WebGL is ready (or without it) the same sky shows as a CSS gradient
  const fallback = `linear-gradient(180deg, ${look.colors.join(", ")})`;

  return (
    <div ref={rootRef} className={cn("relative isolate overflow-hidden", className)}>
      {/* Every sky layer sits in one wrapper, so opacity fades the sky and never the content on it */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ opacity: Math.min(1, Math.max(0, opacity)) }}>
        <div className="absolute inset-0" style={{ background: fallback }} />
        <canvas ref={canvasRef} className={cn("absolute inset-0 size-full transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")} />
        {look.grain > 0 && (
          <svg className="absolute inset-0 size-full mix-blend-soft-light" style={{ opacity: look.grain }}>
            <filter id={grainId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${grainId})`} />
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}
