"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface RippleGradientProps {
  /** Colors the rings cycle through as they spread, 1 to 6. Any CSS color, tokens included. */
  colors?: string[];
  /** The calm water the rings spread over. */
  baseColor?: string;
  /** Points the rings spread from, 1 to 6. */
  sources?: number;
  /** Ring density, 0 (wide swells) to 1 (tight rings). */
  frequency?: number;
  /** How fast the rings travel outward, 0 (still) to 3. */
  speed?: number;
  /** Ring shape, 0 (thin crisp lines) to 1 (soft swells). */
  softness?: number;
  /** How quickly the rings fade with distance, 0 (reach the edges) to 1 (stay close). */
  decay?: number;
  /** How strongly crossing rings reinforce and cancel, 0 to 1. */
  interference?: number;
  /** How much the rings color the base, 0 to 1. */
  intensity?: number;
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
  /** Picks a different placement of the sources. */
  seed?: number;
  /** Hold the rings still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const rippleGradientDemo: RippleGradientProps = {
  colors: ["#2b59c3", "#57c4e5", "#f7b267", "#f25f5c", "#6c4ab6", "#1b998b"],
  baseColor: "#f4efe6",
  sources: 3,
  frequency: 0.45,
  speed: 1,
  softness: 0.6,
  decay: 0.45,
  interference: 0.5,
  intensity: 0.8,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  seed: 2,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#2b59c3", "#57c4e5", "#f7b267", "#f25f5c", "#6c4ab6", "#1b998b"];
const SLOTS = 6;
const INTRO_MS = 2400;

const vertex = `
attribute vec2 aPos;
void main(){gl_Position=vec4(aPos,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uPixel;
uniform vec3 uColors[${SLOTS}];
uniform vec3 uBase;
uniform float uSources;
uniform float uFreq;
uniform float uSharp;
uniform float uDecay;
uniform float uInterference;
uniform float uIntensity;
uniform float uSaturation;
uniform float uGrain;
uniform float uGrainSize;
uniform float uGrainTime;
uniform float uSeed;
uniform float uIntro;

float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
vec3 pick(float k){vec3 c=uColors[0];for(int j=1;j<${SLOTS};j++){if(float(j)==k)c=uColors[j];}return c;}
vec3 ramp(float x){float k=fract(x)*${SLOTS}.;float i0=floor(k);return mix(pick(i0),pick(mod(i0+1.,${SLOTS}.)),smoothstep(0.,1.,fract(k)));}
vec3 toSrgb(vec3 c){
  float l=c.x+.3963377774*c.y+.2158037573*c.z;
  float m=c.x-.1055613458*c.y-.0638541728*c.z;
  float s=c.x-.0894841775*c.y-1.291485548*c.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  vec3 lin=clamp(vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s),0.,1.);
  return mix(lin*12.92,1.055*pow(lin,vec3(1./2.4))-.055,step(.0031308,lin));
}
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 p=(gl_FragCoord.xy/uRes-.5)*vec2(aspect,1.);
  float t=uTime;
  float density=mix(4.,22.,uFreq);
  // During the intro the rings spread out from their sources to fill the frame
  float reach=uIntro*2.8-.4;
  vec3 sumC=vec3(0.);
  float sumR=0.;float sumW=0.;float sumA=0.;
  for(int i=0;i<${SLOTS};i++){
    float fi=float(i);
    if(fi>=uSources)continue;
    float amp=1.;
    float h1=hash(vec2(fi*5.31+uSeed,1.7));
    float h2=hash(vec2(uSeed*2.7,fi*3.9+8.1));
    vec2 src=vec2((h1-.5)*aspect*.85,(h2-.5)*.75)+vec2(sin(t*.07+fi*2.1),cos(t*.06+fi*1.3))*.05;
    float d=length(p-src);
    float ph=d*density*6.2831853-t*2.4+fi*1.7;
    float ring=pow(.5+.5*cos(ph),uSharp);
    amp*=exp(-d*mix(.2,3.5,uDecay))*smoothstep(0.,.05,d)*smoothstep(reach,reach-.5,d);
    sumC+=ramp(ph/(6.2831853*${SLOTS}.)+fi*.17)*ring*amp;
    sumR+=ring*amp;
    sumW+=cos(ph)*amp;
    sumA+=amp;
  }
  vec3 lab=sumC/max(sumR,1e-4);
  lab.yz*=uSaturation;
  float cover=clamp(sumR,0.,1.);
  float agree=.5+.5*sumW/max(sumA,1e-4);
  cover=mix(cover,clamp(cover*smoothstep(.15,.9,agree)*1.5,0.,1.),uInterference);
  vec3 col=toSrgb(mix(uBase,lab,cover*uIntensity));
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float n=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=n*uGrain*.2;
  // The intro grows the rings, grain included, out of the flat base color
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

// Colors blend in Oklab, so a mix between two hues stays bright instead of going muddy
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

export function RippleGradient({
  colors = DEFAULT_COLORS,
  baseColor = "#f4efe6",
  sources = 3,
  frequency = 0.45,
  speed = 1,
  softness = 0.6,
  decay = 0.45,
  interference = 0.5,
  intensity = 0.8,
  saturation = 1,
  grain = 0.2,
  grainSize = 1,
  grainMotion = true,
  transition = 1.2,
  seed = 2,
  paused = false,
  className,
  children,
}: RippleGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${baseColor}`;
  const settings = useRef({ colors: list, baseColor, sources, frequency, speed, softness, decay, interference, intensity, saturation, grain, grainSize, grainMotion, transition, seed, paused });
  settings.current = { colors: list, baseColor, sources, frequency, speed, softness, decay, interference, intensity, saturation, grain, grainSize, grainMotion, transition, seed, paused };
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
      sources: at("uSources"),
      freq: at("uFreq"),
      sharp: at("uSharp"),
      decay: at("uDecay"),
      interference: at("uInterference"),
      intensity: at("uIntensity"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      intro: at("uIntro"),
    };

    // Six palette slots plus the base; a shorter palette repeats so any two can fade into each other
    const shown = new Float32Array((SLOTS + 1) * 3);
    let from = new Float32Array(shown.length);
    let to = new Float32Array(shown.length);
    let fadeStart = 0;
    let fadeLength = 0;
    let fading = false;
    let colored = false;

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

    const draw = () => {
      const s = settings.current;
      if (fading) {
        const k = clamp((performance.now() - fadeStart) / fadeLength, 0, 1);
        const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
        for (let i = 0; i < shown.length; i++) shown[i] = (from[i] ?? 0) + ((to[i] ?? 0) - (from[i] ?? 0)) * e;
        if (k >= 1) fading = false;
      }
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, time + s.seed * 5.3);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown.subarray(0, SLOTS * 3));
      gl.uniform3f(u.base, shown[SLOTS * 3] ?? 0, shown[SLOTS * 3 + 1] ?? 0, shown[SLOTS * 3 + 2] ?? 0);
      gl.uniform1f(u.sources, Math.round(clamp(s.sources, 1, SLOTS)));
      gl.uniform1f(u.freq, clamp(s.frequency, 0, 1));
      gl.uniform1f(u.sharp, 1 + (1 - clamp(s.softness, 0, 1)) * 9);
      gl.uniform1f(u.decay, clamp(s.decay, 0, 1));
      gl.uniform1f(u.interference, clamp(s.interference, 0, 1));
      gl.uniform1f(u.intensity, clamp(s.intensity, 0, 1));
      gl.uniform1f(u.saturation, clamp(s.saturation, 0, 2));
      gl.uniform1f(u.grain, clamp(s.grain, 0, 1));
      gl.uniform1f(u.grainSize, clamp(s.grainSize, 1, 4));
      gl.uniform1f(u.grainTime, s.grainMotion && !reduce && !s.paused ? Math.floor(performance.now() / 42) % 4096 : 0);
      gl.uniform1f(u.seed, s.seed);
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
      if (moving()) time += (delta / 1000) * clamp(s.speed, 0, 3) * 0.5;
      draw();
      const grainOnly = s.grainMotion && s.grain > 0 && !reduce && !s.paused;
      if (moving() || fading || grainOnly || intro < 1) frame = requestAnimationFrame(loop);
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
      draw();
      play();
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
    // Themes can be scoped to any wrapper, not just <html>, so every ancestor is watched for token changes
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        refresh.current(true);
      });
    });
    for (let node = root.parentElement; node; node = node.parentElement) {
      mo.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    }
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    resize();
    setReady(true);
    play();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
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
  }, [sources, frequency, speed, softness, decay, interference, intensity, saturation, grain, grainSize, grainMotion, seed, paused]);

  // Concentric CSS rings in the same colors, shown only without WebGL
  const fallback = `repeating-radial-gradient(circle at 35% 55%, ${list
    .map((color, index) => `color-mix(in oklab, ${color} 45%, ${baseColor}) ${index * 1.5}rem`)
    .join(", ")}, color-mix(in oklab, ${list[0]} 45%, ${baseColor}) ${list.length * 1.5}rem)`;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: baseColor }}>
      {failed ? (
        <div aria-hidden="true" className="absolute inset-0 opacity-60" style={{ background: fallback }} />
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
