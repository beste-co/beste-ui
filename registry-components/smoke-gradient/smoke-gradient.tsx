"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface SmokeGradientProps {
  /** Smoke colors from the base of a plume to its tip, 1 to 6. Any CSS color, tokens included. */
  colors?: string[];
  /** Color behind the smoke. */
  baseColor?: string;
  /** How thick the smoke is, 0 (a trace) to 1 (heavy). */
  density?: number;
  /** Number of plumes rising from the bottom edge, 1 to 5. */
  plumes?: number;
  /** How far the plumes reach up the frame, 0.2 to 1. */
  height?: number;
  /** How fast the smoke rises, 0 (still) to 3. */
  rise?: number;
  /** How much the smoke curls and folds, 0 (straight) to 1. */
  curl?: number;
  /** Edge of the smoke, 0 (crisp wisps) to 1 (soft haze). */
  softness?: number;
  /** Size of the smoke's detail, 0.5 (fine) to 2 (broad). */
  scale?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). */
  saturation?: number;
  /** Film grain over the frame, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` or `baseColor` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** Picks a different arrangement of plumes. */
  seed?: number;
  /** The smoke parts gently around the cursor. */
  interactive?: boolean;
  /** Hold the smoke still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const smokeGradientDemo: SmokeGradientProps = {
  colors: ["#3a1638", "#8a2f5a", "#e0603a", "#ffb86b", "#f6e0c0"],
  baseColor: "#0d0a10",
  density: 0.6,
  plumes: 3,
  height: 0.8,
  rise: 1,
  curl: 0.6,
  softness: 0.6,
  scale: 1,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  seed: 4,
  interactive: true,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#3a1638", "#8a2f5a", "#e0603a", "#ffb86b", "#f6e0c0"];
const STOPS = 6;
const INTRO_MS = 2400;

const vertex = `
attribute vec2 aPos;
void main(){gl_Position=vec4(aPos,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uPixel;
uniform vec3 uColors[${STOPS}];
uniform vec3 uBase;
uniform float uDensity;
uniform float uPlumes;
uniform float uHeight;
uniform float uCurl;
uniform float uSoftness;
uniform float uScale;
uniform float uSaturation;
uniform float uGrain;
uniform float uGrainSize;
uniform float uGrainTime;
uniform float uSeed;
uniform vec3 uMouse;
uniform float uIntro;

float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.;float a=.5;
  for(int i=0;i<5;i++){v+=a*noise(p);p=mat2(1.6,1.2,-1.2,1.6)*p+17.1;a*=.5;}
  return v;
}
vec3 toSrgb(vec3 c){
  float l=c.x+.3963377774*c.y+.2158037573*c.z;
  float m=c.x-.1055613458*c.y-.0638541728*c.z;
  float s=c.x-.0894841775*c.y-1.291485548*c.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  vec3 lin=clamp(vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s),0.,1.);
  return mix(lin*12.92,1.055*pow(lin,vec3(1./2.4))-.055,step(.0031308,lin));
}
vec3 ramp(float k){
  k=clamp(k,0.,1.)*${STOPS - 1}.;
  vec3 c=uColors[0];
  for(int i=1;i<${STOPS};i++){c=mix(c,uColors[i],clamp(k-float(i-1),0.,1.));}
  return c;
}
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 uv=gl_FragCoord.xy/uRes;
  // x centered in frame-height units, y from 0 at the bottom edge to 1 at the top
  vec2 p=vec2((uv.x-.5)*aspect,uv.y);
  float t=uTime;
  vec2 dm=p-vec2(uMouse.x,uMouse.y+.5);
  float near=exp(-dot(dm,dm)*14.)*uMouse.z;
  // The cursor pushes the smoke aside rather than cutting through it
  p+=normalize(dm+1e-4)*near*.12;
  float reach=uHeight*mix(.25,1.,uIntro);
  vec2 q=p/uScale*1.4;
  vec2 warp=vec2(fbm(q*1.1+vec2(0.,-t*.35)+uSeed),fbm(q*1.1+vec2(4.3,1.7)+vec2(0.,-t*.35)+uSeed))-.5;
  q+=warp*uCurl*1.6*uIntro*(.3+p.y);
  float body=fbm(q*1.8+vec2(0.,-t*.9));
  float wisp=fbm(q*4.2+vec2(1.7,-t*1.5)+body*1.5);
  float env=0.;
  for(int i=0;i<5;i++){
    float fi=float(i);
    if(fi>=uPlumes)break;
    float home=uPlumes>1.?(fi/(uPlumes-1.)-.5)*aspect*.75:0.;
    home+=(hash(vec2(fi,uSeed))-.5)*.18;
    float sway=sin(p.y*3.1+t*.6+fi*2.3)*.1*p.y+(warp.x)*.2*p.y*uCurl;
    float spread=.07+p.y*.32;
    float dx=p.x-home-sway;
    env+=exp(-dx*dx/(spread*spread));
  }
  env=min(env,1.2);
  env*=1.-smoothstep(reach*.55,reach+.12,p.y);
  env+=(1.-smoothstep(0.,.28,p.y))*.45;
  float raw=env*(body*.9+wisp*.5)*(.4+uDensity*1.3);
  float lo=mix(.32,.05,uSoftness);
  float d=smoothstep(lo,lo+mix(.12,.85,uSoftness),raw);
  d*=1.-near*.5;
  d*=uIntro;
  vec3 lab=ramp(p.y/max(reach,.2)*.75+d*.3);
  lab.yz*=uSaturation;
  vec3 col=toSrgb(mix(uBase,lab,d));
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  col+=(hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.)*uGrain*.2;
  // The intro grows the plumes, and the grain, out of the flat base
  col=mix(toSrgb(uBase),col,uIntro);
  col+=(hash(gl_FragCoord.xy+17.)-.5)/255.;
  gl_FragColor=vec4(col,1.);
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

function toOklab([r, g, b]: [number, number, number]): [number, number, number] {
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
  const given = (colors ?? []).filter(Boolean).slice(0, STOPS);
  return given.length > 0 ? given : DEFAULT_COLORS;
};

export function SmokeGradient({
  colors = DEFAULT_COLORS,
  baseColor = "#0d0a10",
  density = 0.6,
  plumes = 3,
  height = 0.8,
  rise = 1,
  curl = 0.6,
  softness = 0.6,
  scale = 1,
  saturation = 1,
  grain = 0.2,
  grainSize = 1,
  grainMotion = true,
  transition = 1.2,
  seed = 4,
  interactive = true,
  paused = false,
  className,
  children,
}: SmokeGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${baseColor}`;
  const settings = useRef({ colors: list, baseColor, density, plumes, height, rise, curl, softness, scale, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused });
  settings.current = { colors: list, baseColor, density, plumes, height, rise, curl, softness, scale, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
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
      time: at("uTime"),
      pixel: at("uPixel"),
      colors: at("uColors[0]"),
      base: at("uBase"),
      density: at("uDensity"),
      plumes: at("uPlumes"),
      height: at("uHeight"),
      curl: at("uCurl"),
      softness: at("uSoftness"),
      scale: at("uScale"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      mouse: at("uMouse"),
      intro: at("uIntro"),
    };

    // Six ramp stops plus the base, all in Oklab, so any palette fades into any other
    const SLOTS = (STOPS + 1) * 3;
    const shown = new Float32Array(SLOTS);
    let from = new Float32Array(SLOTS);
    let to = new Float32Array(SLOTS);
    let fadeStart = 0;
    let fadeLength = 0;
    let fading = false;
    let colored = false;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, power: 0, target: 0 };
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

    const moving = () => !reduce && !settings.current.paused && settings.current.rise > 0;

    const recolor = () => {
      const s = settings.current;
      const labs = s.colors.map((color) => toOklab(resolveColor(root, color)));
      const next = new Float32Array(SLOTS);
      // Resample the palette into evenly spaced stops up the plume
      for (let i = 0; i < STOPS; i++) {
        const pos = labs.length > 1 ? (i / (STOPS - 1)) * (labs.length - 1) : 0;
        const lo = Math.floor(pos);
        const k = pos - lo;
        const a = labs[lo] ?? labs[0] ?? [0, 0, 0];
        const b = labs[Math.min(lo + 1, labs.length - 1)] ?? a;
        next.set([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k], i * 3);
      }
      next.set(toOklab(resolveColor(root, s.baseColor)), STOPS * 3);
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

    const draw = () => {
      const s = settings.current;
      if (fading) {
        const k = clamp((performance.now() - fadeStart) / fadeLength, 0, 1);
        const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
        for (let i = 0; i < shown.length; i++) shown[i] = (from[i] ?? 0) + ((to[i] ?? 0) - (from[i] ?? 0)) * e;
        if (k >= 1) fading = false;
      }
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, time + s.seed * 3.71);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown.subarray(0, STOPS * 3));
      gl.uniform3f(u.base, shown[STOPS * 3] ?? 0, shown[STOPS * 3 + 1] ?? 0, shown[STOPS * 3 + 2] ?? 0);
      gl.uniform1f(u.density, clamp(s.density, 0, 1));
      gl.uniform1f(u.plumes, Math.round(clamp(s.plumes, 1, 5)));
      gl.uniform1f(u.height, clamp(s.height, 0.2, 1));
      gl.uniform1f(u.curl, clamp(s.curl, 0, 1));
      gl.uniform1f(u.softness, clamp(s.softness, 0, 1));
      gl.uniform1f(u.scale, clamp(s.scale, 0.5, 2));
      gl.uniform1f(u.saturation, clamp(s.saturation, 0, 2));
      gl.uniform1f(u.grain, clamp(s.grain, 0, 1));
      gl.uniform1f(u.grainSize, clamp(s.grainSize, 1, 4));
      gl.uniform1f(u.grainTime, s.grainMotion && !reduce && !s.paused ? Math.floor(performance.now() / 42) % 4096 : 0);
      gl.uniform1f(u.seed, s.seed);
      gl.uniform3f(u.mouse, mouse.x, mouse.y, mouse.power);
      gl.uniform1f(u.intro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      pixel = Math.min(window.devicePixelRatio || 1, 2) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * pixel));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * pixel));
      gl.viewport(0, 0, canvas.width, canvas.height);
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
      if (moving()) time += (delta / 1000) * clamp(s.rise, 0, 3) * 0.5;
      mouse.power += (mouse.target - mouse.power) * 0.04;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      draw();
      const easing = Math.abs(mouse.target - mouse.power) > 0.002 || (mouse.power > 0.01 && Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > 0.001);
      const grainOnly = s.grainMotion && s.grain > 0 && !reduce && !s.paused;
      if (moving() || fading || easing || grainOnly || intro < 1) frame = requestAnimationFrame(loop);
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
      draw();
      play();
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || reduce || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      mouse.target = inside ? 1 : 0;
      if (inside) {
        const aspect = rect.width / Math.max(1, rect.height);
        mouse.tx = ((event.clientX - rect.left) / rect.width - 0.5) * aspect;
        mouse.ty = 0.5 - (event.clientY - rect.top) / rect.height;
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
  }, [density, plumes, height, rise, curl, softness, scale, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // Soft CSS plumes of the same colors, shown only without WebGL
  const fallback = [...list, ...list]
    .slice(1, 4)
    .map((color, index) => `radial-gradient(28% 70% at ${25 + index * 25}% 100%, ${color} 0%, transparent 75%)`)
    .join(", ");

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: baseColor }}>
      {failed ? (
        <div aria-hidden="true" className="absolute inset-0 opacity-70 blur-xl" style={{ background: fallback }} />
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
