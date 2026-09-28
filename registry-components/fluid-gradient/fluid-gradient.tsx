"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface FluidGradientProps {
  /** The color ramp, 2 to 6 stops in order. Any CSS color, tokens included. */
  colors?: string[];
  /** Size of the swirls, 0.5 (fine) to 2.5 (broad). */
  scale?: number;
  /** How far the paint folds into itself, 0 (soft waves) to 1 (deep marbling). */
  warp?: number;
  /** Fine streaks inside the streams, 0 (smooth) to 1 (detailed). */
  detail?: number;
  /** Direction the paint flows, in degrees (0 = right, 90 = up). */
  flow?: number;
  /** How much the streams are drawn out along the flow, 0 to 1. */
  stretch?: number;
  /** How many times the ramp repeats across the paint, 1 to 4. Repeats mirror, so there is no hard seam. */
  repeat?: number;
  /** How fast the paint moves, 0 (still) to 3. */
  speed?: number;
  /** Separation between the ramp colors, 0 (blended) to 1 (bold). */
  contrast?: number;
  /** A soft glossy highlight along the folds, 0 to 1. */
  sheen?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). 1 keeps the colors as given. */
  saturation?: number;
  /** Film grain over the paint, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** Picks a different pour. */
  seed?: number;
  /** The paint bends softly toward the cursor, as if seen through a lens. */
  interactive?: boolean;
  /** Strength of that bend, 0 to 1. */
  pull?: number;
  /** Hold the paint still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const fluidGradientDemo: FluidGradientProps = {
  colors: ["#0b1d3a", "#1f4e8c", "#f2e8d5", "#e8793c", "#b8321f"],
  scale: 1,
  warp: 0.6,
  detail: 0.5,
  flow: 20,
  stretch: 0.3,
  repeat: 1,
  speed: 1,
  contrast: 0.5,
  sheen: 0.35,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  seed: 2,
  interactive: true,
  pull: 0.5,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#0b1d3a", "#1f4e8c", "#f2e8d5", "#e8793c", "#b8321f"];
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
uniform float uScale;
uniform float uWarp;
uniform float uOctaves;
uniform float uStreaks;
uniform vec2 uFlow;
uniform float uStretch;
uniform float uRepeat;
uniform float uContrast;
uniform float uSheen;
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
  for(int i=0;i<7;i++){
    if(float(i)>=uOctaves)break;
    v+=a*noise(p);p=mat2(1.6,1.2,-1.2,1.6)*p+17.1;a*=.5;
  }
  return v/(1.-pow(.5,uOctaves));
}
vec3 ramp(float v){
  float x=clamp(v,0.,1.)*${STOPS - 1}.;
  vec3 c=uColors[0];
  for(int i=0;i<${STOPS - 1};i++)c=mix(c,uColors[i+1],clamp(x-float(i),0.,1.));
  return c;
}
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
  vec2 uv=(gl_FragCoord.xy/uRes-.5)*vec2(aspect,1.);
  // The cursor draws the paint toward itself with a slight turn, a soft lens that never builds up
  vec2 dm=uv-uMouse.xy;
  float fall=exp(-dot(dm,dm)*6.)*uMouse.z;
  float cs=cos(fall*.7);float sn=sin(fall*.7);
  uv=uMouse.xy+mat2(cs,-sn,sn,cs)*dm*(1.-fall*.45);
  // Into flow space: x runs along the flow, drawn out by stretch
  vec2 p=vec2(dot(uv,uFlow),dot(uv,vec2(-uFlow.y,uFlow.x)));
  p.x*=1.-uStretch*.65;
  p=p*1.8/uScale+uSeed*vec2(3.1,1.7);
  float t=uTime;
  p.x-=t*.12;
  float wp=uWarp*uIntro;
  vec2 q=vec2(fbm(p+vec2(0.,t*.05)),fbm(p+vec2(5.2,1.3)-t*.04));
  vec2 r=vec2(fbm(p+4.*wp*q+vec2(1.7,9.2)+t*.09),fbm(p+4.*wp*q+vec2(8.3,2.8)-t*.07));
  float f=fbm(p+4.*wp*r);
  float v=f+(r.x-.5)*.35*wp;
  v+=(noise(p*14.+r*6.)-.5)*uStreaks*uIntro;
  v=(v-.5)*mix(.9,3.2,uContrast)+.5;
  float x=clamp(v,0.,1.)*uRepeat;
  v=1.-abs(mod(x,2.)-1.);
  vec3 lab=ramp(v);
  lab.yz*=uSaturation;
  // A soft highlight where the folds tilt toward a light up and to the left
  vec3 n=normalize(vec3((r-.5)*2.4,1.));
  float gloss=pow(max(dot(n,normalize(vec3(-.45,.55,1.))),0.),22.);
  lab.x+=gloss*uSheen*.35;
  vec3 col=toSrgb(lab);
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=g*uGrain*.2;
  // The intro unfolds the paint, sheen and grain out of the flat first color
  col=mix(toSrgb(uColors[0]),col,uIntro);
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

// The ramp blends in Oklab, so the step between two hues stays bright instead of going muddy
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

export function FluidGradient({
  colors = DEFAULT_COLORS,
  scale = 1,
  warp = 0.6,
  detail = 0.5,
  flow = 20,
  stretch = 0.3,
  repeat = 1,
  speed = 1,
  contrast = 0.5,
  sheen = 0.35,
  saturation = 1,
  grain = 0.2,
  grainSize = 1,
  grainMotion = true,
  transition = 1.2,
  seed = 2,
  interactive = true,
  pull = 0.5,
  paused = false,
  className,
  children,
}: FluidGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = list.join("|");
  const settings = useRef({ colors: list, scale, warp, detail, flow, stretch, repeat, speed, contrast, sheen, saturation, grain, grainSize, grainMotion, transition, seed, interactive, pull, paused });
  settings.current = { colors: list, scale, warp, detail, flow, stretch, repeat, speed, contrast, sheen, saturation, grain, grainSize, grainMotion, transition, seed, interactive, pull, paused };
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
      scale: at("uScale"),
      warp: at("uWarp"),
      octaves: at("uOctaves"),
      streaks: at("uStreaks"),
      flow: at("uFlow"),
      stretch: at("uStretch"),
      repeat: at("uRepeat"),
      contrast: at("uContrast"),
      sheen: at("uSheen"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      mouse: at("uMouse"),
      intro: at("uIntro"),
    };

    // Every palette is resampled to six even ramp stops, so any two palettes can fade into each other
    const shown = new Float32Array(STOPS * 3);
    let from = new Float32Array(STOPS * 3);
    let to = new Float32Array(STOPS * 3);
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

    const moving = () => !reduce && !settings.current.paused && settings.current.speed > 0;

    const recolor = () => {
      const s = settings.current;
      const labs = s.colors.map((color) => toOklab(resolveColor(root, color)));
      const next = new Float32Array(STOPS * 3);
      for (let j = 0; j < STOPS; j++) {
        const pos = (j / (STOPS - 1)) * (labs.length - 1);
        const i = Math.floor(pos);
        const a: [number, number, number] = labs[i] ?? [0, 0, 0];
        const b: [number, number, number] = labs[Math.min(i + 1, labs.length - 1)] ?? a;
        const k = pos - i;
        next.set([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k], j * 3);
      }
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
      const angle = (s.flow * Math.PI) / 180;
      const d = clamp(s.detail, 0, 1);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, time);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown);
      gl.uniform1f(u.scale, clamp(s.scale, 0.5, 2.5));
      gl.uniform1f(u.warp, clamp(s.warp, 0, 1));
      gl.uniform1f(u.octaves, 3 + Math.round(d * 4));
      gl.uniform1f(u.streaks, d * 0.09);
      gl.uniform2f(u.flow, Math.cos(angle), Math.sin(angle));
      gl.uniform1f(u.stretch, clamp(s.stretch, 0, 1));
      gl.uniform1f(u.repeat, clamp(s.repeat, 1, 4));
      gl.uniform1f(u.contrast, clamp(s.contrast, 0, 1));
      gl.uniform1f(u.sheen, clamp(s.sheen, 0, 1));
      gl.uniform1f(u.saturation, clamp(s.saturation, 0, 2));
      gl.uniform1f(u.grain, clamp(s.grain, 0, 1));
      gl.uniform1f(u.grainSize, clamp(s.grainSize, 1, 4));
      gl.uniform1f(u.grainTime, s.grainMotion && !reduce && !s.paused ? Math.floor(performance.now() / 42) % 4096 : 0);
      gl.uniform1f(u.seed, s.seed);
      gl.uniform3f(u.mouse, mouse.x, mouse.y, mouse.power * clamp(s.pull, 0, 1) * 2 * intro);
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
      mouse.power += (mouse.target - mouse.power) * 0.05;
      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;
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
        // The lens fades in where the pointer enters instead of sliding over from the last spot
        if (mouse.power < 0.02) {
          mouse.x = mouse.tx;
          mouse.y = mouse.ty;
        }
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
  }, [scale, warp, detail, flow, stretch, repeat, speed, contrast, sheen, saturation, grain, grainSize, grainMotion, seed, interactive, pull, paused]);

  // A plain ramp along the flow, shown only without WebGL
  const fallback = list.length > 1 ? `linear-gradient(${90 - flow}deg, ${list.join(", ")})` : undefined;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: list[0] }}>
      {failed ? (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: fallback }} />
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
