"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export type LightLeakEdges = "all" | "corners" | "top" | "bottom" | "sides";

export interface LightLeakProps {
  /** Colors of the leaks, 1 to 6. Any CSS color, tokens included. Leaks take them in turn. */
  colors?: string[];
  /** The unexposed frame behind the light. Dark reads as film, light bases turn the leaks into warm stains. */
  baseColor?: string;
  /** How many leaks burn in, 1 to 6. */
  leaks?: number;
  /** Where the light can get in. */
  edges?: LightLeakEdges;
  /** Size of each bloom, 0.4 to 2. */
  size?: number;
  /** Brightness of the light, 0 to 1.5. */
  intensity?: number;
  /** An overexposed core that clips toward warm cream where the light is strongest, 0 to 1. */
  burn?: number;
  /** Chromatic fringing at the edge of each leak, 0 to 1. */
  fringe?: number;
  /** A gentle exposure flicker, 0 to 1. */
  flicker?: number;
  /** How fast the leaks swell, drift and fade, 0 (still) to 3. */
  speed?: number;
  /** Color intensity of the leaks, 0 (grey) to 2 (vivid). */
  saturation?: number;
  /** Film grain over the frame, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` or `baseColor` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** Picks a different arrangement of the leaks. */
  seed?: number;
  /** The nearest leak leans toward the cursor and brightens a little. */
  interactive?: boolean;
  /** Hold the light still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const lightLeakDemo: LightLeakProps = {
  colors: ["#ff5a1f", "#ffb03a", "#ff2e63", "#ffd9a0"],
  baseColor: "#0d0a09",
  leaks: 4,
  edges: "all",
  size: 1,
  intensity: 1,
  burn: 0.5,
  fringe: 0.4,
  flicker: 0.3,
  speed: 1,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.4,
  seed: 2,
  interactive: true,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#ff5a1f", "#ffb03a", "#ff2e63", "#ffd9a0"];
const SLOTS = 6;
const INTRO_MS = 2400;

const vertex = `
attribute vec2 aPos;
void main(){gl_Position=vec4(aPos,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uPixel;
uniform vec3 uColors[${SLOTS}];
uniform vec4 uLeaks[${SLOTS}];
uniform vec3 uBase;
uniform float uFringe;
uniform float uBurn;
uniform float uSaturation;
uniform float uGrain;
uniform float uGrainSize;
uniform float uGrainTime;
uniform float uIntro;

float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
vec3 toLinear(vec3 c){
  float l=c.x+.3963377774*c.y+.2158037573*c.z;
  float m=c.x-.1055613458*c.y-.0638541728*c.z;
  float s=c.x-.0894841775*c.y-1.291485548*c.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  return vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s);
}
vec3 toSrgb(vec3 lin){
  lin=clamp(lin,0.,1.);
  return mix(lin*12.92,1.055*pow(lin,vec3(1./2.4))-.055,step(.0031308,lin));
}
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 p=(gl_FragCoord.xy/uRes-.5)*vec2(aspect,1.);
  vec3 light=vec3(0.);
  for(int i=0;i<${SLOTS};i++){
    vec4 leak=uLeaks[i];
    vec2 c=(leak.xy-.5)*vec2(aspect,1.);
    float d=length(p-c)/max(leak.z,.001);
    // Each channel spreads a little differently, which fringes the rim of the bloom
    vec3 dd=d*vec3(1.-uFringe*.16,1.,1.+uFringe*.16);
    vec3 glow=exp(-dd*dd*1.9)+.22/(1.+dd*dd*5.);
    vec3 lab=uColors[i];
    lab.yz*=uSaturation;
    light+=max(toLinear(lab),0.)*glow*leak.w;
  }
  vec3 base=max(toLinear(uBase),0.);
  float lum=dot(light,vec3(.2126,.7152,.0722));
  float peak=max(max(light.r,light.g),max(light.b,1e-4));
  // Dark frames take the light additively; light frames take it as a warm stain
  vec3 added=base+light*(1.-base*.5);
  vec3 stained=base*mix(vec3(1.),light/peak,(1.-exp(-lum*1.6))*.9);
  float bright=dot(base,vec3(.2126,.7152,.0722));
  vec3 col=mix(added,stained,smoothstep(.3,.75,bright));
  col=mix(col,vec3(1.,.93,.8)*max(1.,lum),uBurn*smoothstep(.45,1.4,lum)*.85);
  vec3 th=max(base,vec3(.8));
  vec3 over=max(col-th,0.);
  col=min(col,th)+over/(1.+over/max(1.-th,.02));
  vec3 srgb=toSrgb(col);
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  srgb+=g*uGrain*.2;
  // The intro grows the light, grain included, out of the flat base color
  srgb=mix(toSrgb(base),srgb,uIntro);
  srgb+=(hash(gl_FragCoord.xy+17.)-.5)/255.;
  gl_FragColor=vec4(srgb,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Resolves any CSS color (tokens and oklch included) to 0-1 sRGB
function resolveColor(el: HTMLElement, color: string): [number, number, number] {
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  el.style.color = "";
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0, 0, 0];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [(data[0] ?? 0) / 255, (data[1] ?? 0) / 255, (data[2] ?? 0) / 255];
}

// Colors crossfade in Oklab, so a new palette passes through clean hues instead of mud
function toOklab([r, g, b]: [number, number, number]) {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lr = lin(r);
  const lg = lin(g);
  const lb = lin(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363020684 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const palette = (colors?: string[]) => {
  const given = (colors ?? []).filter(Boolean).slice(0, SLOTS);
  return given.length > 0 ? given : DEFAULT_COLORS;
};
const rand = (i: number, k: number, seed: number) => {
  const x = Math.sin((i + 1) * 12.9898 + seed * 78.233 + k * 37.719) * 43758.5453;
  return x - Math.floor(x);
};
const DEG = Math.PI / 180;

// Where leak i sits around the frame, as an angle from the center (0 = right, 90 = top)
function homeAngle(i: number, edges: LightLeakEdges, seed: number) {
  const r = rand(i, 0, seed);
  switch (edges) {
    case "top":
      return (55 + 70 * r) * DEG;
    case "bottom":
      return (235 + 70 * r) * DEG;
    case "sides":
      return (i % 2 === 0 ? -30 + 60 * r : 150 + 60 * r) * DEG;
    case "corners":
      return (45 + 90 * (i % 4) + (r - 0.5) * 16) * DEG;
    default:
      return (r * 360 + i * 97) * DEG;
  }
}

export function LightLeak({
  colors = DEFAULT_COLORS,
  baseColor = "#0d0a09",
  leaks = 4,
  edges = "all",
  size = 1,
  intensity = 1,
  burn = 0.5,
  fringe = 0.4,
  flicker = 0.3,
  speed = 1,
  saturation = 1,
  grain = 0.2,
  grainSize = 1,
  grainMotion = true,
  transition = 1.4,
  seed = 2,
  interactive = true,
  paused = false,
  className,
  children,
}: LightLeakProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${baseColor}`;
  const current = { colors: list, baseColor, leaks, edges, size, intensity, burn, fringe, flicker, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
  const settings = useRef(current);
  settings.current = current;
  const refresh = useRef<(recolor?: boolean) => void>(() => {});

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
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!canvas || !root || !gl) return setFailed(true);
    const vs = compile(gl, gl.VERTEX_SHADER, vertex);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return setFailed(true);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return setFailed(true);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const at = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      res: at("uRes"),
      pixel: at("uPixel"),
      colors: at("uColors[0]"),
      leaks: at("uLeaks[0]"),
      base: at("uBase"),
      fringe: at("uFringe"),
      burn: at("uBurn"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      intro: at("uIntro"),
    };

    // Six leak colors plus the base in one array, so a palette and a base fade together
    const shown = new Float32Array((SLOTS + 1) * 3);
    let from = new Float32Array(shown.length);
    let to = new Float32Array(shown.length);
    let fadeStart = 0;
    let fadeLength = 0;
    let fading = false;
    let colored = false;

    // Each leak glides toward where it wants to be, so edge, size and cursor changes never jump
    const state = new Float32Array(SLOTS * 4);
    const packed = new Float32Array(SLOTS * 4);
    const presence = new Float32Array(SLOTS);
    const glide = { intensity: 1, burn: 0.5, size: 1 };
    let placed = false;
    let settledShape = true;

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, power: 0, target: 0 };
    let time = 0;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let settled = 0;
    let pixel = 1;
    let introStart = 0;
    let intro = reduce ? 1 : 0;

    const moving = () => !reduce && !settings.current.paused && settings.current.speed > 0;

    const recolor = () => {
      const s = settings.current;
      const next = new Float32Array(shown.length);
      const labs = s.colors.map((color) => toOklab(resolveColor(root, color)));
      for (let i = 0; i < SLOTS; i++) next.set(labs[i % labs.length] ?? [0, 0, 0], i * 3);
      next.set(toOklab(resolveColor(root, s.baseColor)), SLOTS * 3);
      if (!colored || s.transition <= 0 || reduce) {
        shown.set(next);
        fading = false;
      } else {
        from = new Float32Array(shown);
        to = next;
        fadeStart = performance.now();
        fadeLength = s.transition * 1000;
        fading = true;
      }
      colored = true;
    };

    const shape = () => {
      const s = settings.current;
      const count = Math.round(clamp(s.leaks, 1, SLOTS));
      const snap = !placed || reduce;
      const k = snap ? 1 : 0.045;
      glide.intensity += (clamp(s.intensity, 0, 1.5) - glide.intensity) * k;
      glide.burn += (clamp(s.burn, 0, 1) - glide.burn) * k;
      glide.size += (clamp(s.size, 0.4, 2) - glide.size) * k;
      let nearest = -1;
      let nearestDistance = Infinity;
      for (let i = 0; i < count; i++) {
        const distance = Math.hypot(mouse.x - (state[i * 4] ?? 0), mouse.y - (state[i * 4 + 1] ?? 0));
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = i;
        }
      }
      let drift = 0;
      for (let i = 0; i < SLOTS; i++) {
        const r1 = rand(i, 1, s.seed);
        const r2 = rand(i, 2, s.seed);
        const sway = s.edges === "corners" ? 0.12 : s.edges === "all" ? 0.35 : 0.22;
        const angle = homeAngle(i, s.edges, s.seed) + Math.sin(time * (0.11 + 0.06 * r1) + r2 * 6.283) * sway;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        // A point on the frame's edge, pushed outside so only the bloom bleeds in
        const edge = 0.5 / Math.max(Math.abs(dx), Math.abs(dy));
        const push = 1.12 + 0.3 * rand(i, 3, s.seed);
        const tx = 0.5 + dx * edge * push;
        const ty = 0.5 + dy * edge * push;
        const radius = glide.size * (0.42 + 0.3 * rand(i, 4, s.seed)) * (1 + 0.16 * Math.sin(time * (0.17 + 0.08 * r1) + r2 * 9));
        const breathe = 0.5 - 0.5 * Math.cos(time * (0.07 + 0.05 * r2) + r1 * 6.283);
        const flick = 1 - clamp(s.flicker, 0, 1) * 0.28 * (0.5 + 0.5 * Math.sin(time * 21 * (1 + r1)) * Math.sin(time * 6.7 + r2 * 5));
        const strength = (0.3 + 0.7 * breathe) * flick;
        presence[i] = (presence[i] ?? 0) + ((i < count ? 1 : 0) - (presence[i] ?? 0)) * k;
        const o = i * 4;
        const cx = state[o] ?? tx;
        const cy = state[o + 1] ?? ty;
        const lean = i === nearest ? mouse.power : 0;
        const gx = tx + (mouse.x - tx) * 0.2 * lean;
        const gy = ty + (mouse.y - ty) * 0.2 * lean;
        const nx = snap ? gx : cx + (gx - cx) * 0.05;
        const ny = snap ? gy : cy + (gy - cy) * 0.05;
        drift += Math.abs(nx - cx) + Math.abs(ny - cy);
        state[o] = nx;
        state[o + 1] = ny;
        state[o + 2] = radius * (0.6 + 0.4 * intro);
        state[o + 3] = strength * (presence[i] ?? 0) * (1 + 0.3 * lean) * glide.intensity * 1.6 * intro;
      }
      placed = true;
      const presenceGap = presence.reduce((sum, value, i) => sum + Math.abs((i < count ? 1 : 0) - value), 0);
      settledShape =
        drift < 0.0005 &&
        presenceGap < 0.002 &&
        Math.abs(glide.intensity - clamp(s.intensity, 0, 1.5)) < 0.002 &&
        Math.abs(glide.burn - clamp(s.burn, 0, 1)) < 0.002 &&
        Math.abs(glide.size - clamp(s.size, 0.4, 2)) < 0.002;
      packed.set(state);
    };

    const draw = () => {
      const s = settings.current;
      if (fading) {
        const k = clamp((performance.now() - fadeStart) / fadeLength, 0, 1);
        const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
        for (let i = 0; i < shown.length; i++) shown[i] = (from[i] ?? 0) + ((to[i] ?? 0) - (from[i] ?? 0)) * e;
        if (k >= 1) fading = false;
      }
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown.subarray(0, SLOTS * 3));
      gl.uniform3f(u.base, shown[SLOTS * 3] ?? 0, shown[SLOTS * 3 + 1] ?? 0, shown[SLOTS * 3 + 2] ?? 0);
      gl.uniform4fv(u.leaks, packed);
      gl.uniform1f(u.fringe, clamp(s.fringe, 0, 1));
      gl.uniform1f(u.burn, glide.burn);
      gl.uniform1f(u.saturation, clamp(s.saturation, 0, 2));
      gl.uniform1f(u.grain, clamp(s.grain, 0, 1));
      gl.uniform1f(u.grainSize, clamp(s.grainSize, 1, 4));
      gl.uniform1f(u.grainTime, s.grainMotion && !reduce && !s.paused ? Math.floor(performance.now() / 42) % 4096 : 0);
      gl.uniform1f(u.intro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      pixel = Math.min(window.devicePixelRatio || 1, 2) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * pixel));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * pixel));
      gl.viewport(0, 0, canvas.width, canvas.height);
      shape();
      draw();
    };

    const loop = (now: number) => {
      const s = settings.current;
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      average += (delta - average) * 0.05;
      lastFrame = now;
      tick++;
      if (tick % 60 === 0) {
        if (average > 22 && quality > 0.5) {
          ceiling = Math.max(0.5, quality - 0.05);
          quality = Math.max(0.5, quality - 0.15);
          settled = 0;
          resize();
        } else if (average < 17.5 && quality < ceiling) {
          settled += 60;
          if (settled >= 300) {
            quality = Math.min(ceiling, quality + 0.1);
            settled = 0;
            resize();
          }
        }
      }
      if (intro < 1) {
        introStart ||= now;
        const k = clamp((now - introStart) / INTRO_MS, 0, 1);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      if (moving()) time += (delta / 1000) * clamp(s.speed, 0, 3) * 0.6;
      mouse.power += (mouse.target - mouse.power) * 0.04;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      shape();
      draw();
      const easing = Math.abs(mouse.target - mouse.power) > 0.002 || (mouse.power > 0.01 && Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > 0.001);
      const grainOnly = s.grainMotion && s.grain > 0 && !reduce && !s.paused;
      if (moving() || fading || easing || grainOnly || intro < 1 || !settledShape) frame = requestAnimationFrame(loop);
      else frame = 0;
    };

    const play = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    refresh.current = (withColors = false) => {
      if (withColors) recolor();
      if (!settings.current.interactive) mouse.target = 0;
      shape();
      draw();
      play();
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || reduce || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      mouse.target = inside ? 1 : 0;
      if (inside) {
        mouse.tx = (event.clientX - rect.left) / rect.width;
        mouse.ty = 1 - (event.clientY - rect.top) / rect.height;
      }
      if (!frame) play();
    };
    const onLeave = () => {
      mouse.target = 0;
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => requestAnimationFrame(() => refresh.current(true)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    resize();
    setReady(true);
    play();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [reduce]);

  useEffect(() => {
    refresh.current(true);
  }, [colorKey]);

  useEffect(() => {
    refresh.current(false);
  }, [leaks, edges, size, intensity, burn, fringe, flicker, speed, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // Warm corner blooms in the same colors, shown only without WebGL
  const corners = ["0% 0%", "100% 100%", "100% 0%", "0% 100%", "50% 0%", "50% 100%"];
  const fallback = list
    .slice(0, Math.max(1, Math.round(clamp(leaks, 1, SLOTS))))
    .map((color, index) => `radial-gradient(55% 60% at ${corners[index % corners.length]}, ${color} 0%, transparent 70%)`)
    .join(", ");

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: baseColor }}>
      {failed ? (
        <div aria-hidden="true" className="absolute inset-0 opacity-80" style={{ background: fallback }} />
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 size-full transition-opacity duration-300", ready ? "opacity-100" : "opacity-0")}
        />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
