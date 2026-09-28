"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface FoldGradientProps {
  /** The printed gradient, 1 to 6 colors in order. Any CSS color, tokens included. */
  colors?: string[];
  /** The flat color the sheet unfolds from on load, and the wrapper background. */
  baseColor?: string;
  /** How many pleats cross the frame, 4 to 40. */
  folds?: number;
  /** How deep the pleats are and how strongly they shade, 0 (flat) to 1. */
  depth?: number;
  /** Direction the pleats run, in degrees (90 = vertical pleats). */
  angle?: number;
  /** Direction the light comes from, in degrees (0 = right, 90 = top). */
  lightAngle?: number;
  /** How much the pleats open and close as a slow wave passes across them, 0 to 1. */
  breathe?: number;
  /** A gentle sway travelling along each pleat, 0 to 1. */
  wave?: number;
  /** Highlight along the ridges, 0 to 1. */
  sheen?: number;
  /** Direction of the printed gradient, in degrees (0 = left to right, 90 = bottom to top). */
  gradientAngle?: number;
  /** How fast the sheet breathes and sways, 0 (still) to 3. */
  speed?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). */
  saturation?: number;
  /** Film grain over the sheet, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** Picks a different phase for the breathing and the sway. */
  seed?: number;
  /** The pleats under the cursor ease open and the light leans toward it. */
  interactive?: boolean;
  /** Hold the sheet still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const foldGradientDemo: FoldGradientProps = {
  colors: ["#ff7a59", "#ffb86b", "#f6e3c6", "#9cc8ff", "#6a78ff", "#b98cff"],
  baseColor: "#f2ede4",
  folds: 14,
  depth: 0.55,
  angle: 90,
  lightAngle: 135,
  breathe: 0.35,
  wave: 0.3,
  sheen: 0.4,
  gradientAngle: 20,
  speed: 1,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  seed: 2,
  interactive: true,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#ff7a59", "#ffb86b", "#f6e3c6", "#9cc8ff", "#6a78ff", "#b98cff"];
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
uniform vec3 uStops[${STOPS}];
uniform vec3 uBase;
uniform float uFolds;
uniform float uDepth;
uniform float uAngle;
uniform float uLight;
uniform float uBreathe;
uniform float uWave;
uniform float uSheen;
uniform float uGradAngle;
uniform float uSaturation;
uniform float uGrain;
uniform float uGrainSize;
uniform float uGrainTime;
uniform vec3 uMouse;
uniform float uIntro;

float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
vec3 toLinear(vec3 c){
  float l=c.x+.3963377774*c.y+.2158037573*c.z;
  float m=c.x-.1055613458*c.y-.0638541728*c.z;
  float s=c.x-.0894841775*c.y-1.291485548*c.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  return clamp(vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s),0.,1.);
}
vec3 gammaOut(vec3 lin){lin=clamp(lin,0.,1.);return mix(lin*12.92,1.055*pow(lin,vec3(1./2.4))-.055,step(.0031308,lin));}
vec3 ramp(float g){
  float x=clamp(g,0.,1.)*${STOPS - 1}.;
  vec3 c=uStops[0];
  for(int i=1;i<${STOPS};i++){c=mix(c,uStops[i],clamp(x-float(i-1),0.,1.));}
  return c;
}
float softAbs(float x,float r){return sqrt(x*x+r*r)-r;}
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 p=(gl_FragCoord.xy/uRes-.5)*vec2(aspect,1.);
  float t=uTime;
  vec2 along=vec2(cos(uAngle),sin(uAngle));
  vec2 across=vec2(along.y,-along.x);
  float span=abs(across.x)*aspect+abs(across.y);
  float f=uFolds/span;
  float u=dot(p,across);
  float v=dot(p,along);
  // Each pleat sways a little along its length, as a wave travelling down the sheet
  float sway=sin(v*2.1+t*.9)*.5+sin(v*3.7-t*.6+u*1.3)*.25;
  float x=u*f+sway*uWave*.35;
  // Folds open and close as a slow swell crosses them; the cursor eases the nearest ones open
  float swell=.5+.5*sin(u*2.4-t*.8);
  vec2 dm=p-uMouse.xy;
  float near=exp(-dot(dm,dm)*6.)*uMouse.z;
  float amp=uDepth*(1.-uBreathe*.55*swell)*(1.-near*.45)*uIntro;
  float s=fract(x)*2.-1.;
  float r=.07;
  float peak=sqrt(1.+r*r)-r;
  float height=1.-softAbs(s,r)/peak;
  float slope=amp*1.4*(s/sqrt(s*s+r*r));
  vec3 n=normalize(vec3(across*slope,1.));
  float lightA=uLight-uMouse.z*.3*clamp(uMouse.x,-1.,1.);
  vec3 l=normalize(vec3(cos(lightA),sin(lightA),1.1));
  float diff=dot(n,l);
  float occ=mix(1.,.55+.45*smoothstep(0.,.75,height),clamp(amp*1.6,0.,1.));
  vec3 h=normalize(l+vec3(0.,0.,1.));
  float spec=pow(max(dot(n,h),0.),38.)*smoothstep(.72,1.,height)*uSheen;
  vec2 gdir=vec2(cos(uGradAngle),sin(uGradAngle));
  float half_=.5*(abs(gdir.x)*aspect+abs(gdir.y));
  float g=dot(p,gdir)/(2.*half_)+.5;
  g+=.06*sin(dot(p,vec2(-gdir.y,gdir.x))*2.3+t*.25);
  vec3 lab=ramp(g);
  lab.yz*=uSaturation;
  vec3 lin=toLinear(lab);
  float flat_=dot(vec3(0.,0.,1.),l);
  float shade=mix(1.,(.5+.62*diff)/(.5+.62*flat_),clamp(amp*1.8,0.,1.));
  lin=lin*shade*occ+vec3(1.,.98,.94)*spec*.55;
  vec3 col=gammaOut(lin);
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float gr=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=gr*uGrain*.2;
  // The sheet grows out of the flat base color, then its pleats fold in
  col=mix(uBase,col,uIntro);
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
const rad = (deg: number) => (deg * Math.PI) / 180;
const palette = (colors?: string[]) => {
  const given = (colors ?? []).filter(Boolean).slice(0, STOPS);
  return given.length > 0 ? given : DEFAULT_COLORS;
};

export function FoldGradient({
  colors = DEFAULT_COLORS,
  baseColor = "#f2ede4",
  folds = 14,
  depth = 0.55,
  angle = 90,
  lightAngle = 135,
  breathe = 0.35,
  wave = 0.3,
  sheen = 0.4,
  gradientAngle = 20,
  speed = 1,
  saturation = 1,
  grain = 0.2,
  grainSize = 1,
  grainMotion = true,
  transition = 1.2,
  seed = 2,
  interactive = true,
  paused = false,
  className,
  children,
}: FoldGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${baseColor}`;
  const values = { colors: list, baseColor, folds, depth, angle, lightAngle, breathe, wave, sheen, gradientAngle, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
  const settings = useRef(values);
  settings.current = values;
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
      stops: at("uStops[0]"),
      base: at("uBase"),
      folds: at("uFolds"),
      depth: at("uDepth"),
      angle: at("uAngle"),
      light: at("uLight"),
      breathe: at("uBreathe"),
      wave: at("uWave"),
      sheen: at("uSheen"),
      gradAngle: at("uGradAngle"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      mouse: at("uMouse"),
      intro: at("uIntro"),
    };

    // The palette is resampled to six even stops so any two palettes fade into each other; the base rides along
    const SIZE = STOPS * 3 + 3;
    const shown = new Float32Array(SIZE);
    let from = new Float32Array(SIZE);
    let to = new Float32Array(SIZE);
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
      const next = new Float32Array(SIZE);
      const labs = s.colors.map((color) => toOklab(resolveColor(root, color)));
      for (let i = 0; i < STOPS; i++) {
        const x = labs.length > 1 ? (i / (STOPS - 1)) * (labs.length - 1) : 0;
        const a = labs[Math.floor(x)] ?? labs[0] ?? [0, 0, 0];
        const b = labs[Math.min(labs.length - 1, Math.floor(x) + 1)] ?? a;
        const k = x - Math.floor(x);
        next.set([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k], i * 3);
      }
      next.set(resolveColor(root, s.baseColor), STOPS * 3);
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
      gl.uniform1f(u.time, time + s.seed * 7.31);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.stops, shown.subarray(0, STOPS * 3));
      gl.uniform3f(u.base, shown[STOPS * 3] ?? 0, shown[STOPS * 3 + 1] ?? 0, shown[STOPS * 3 + 2] ?? 0);
      gl.uniform1f(u.folds, clamp(s.folds, 4, 40));
      gl.uniform1f(u.depth, clamp(s.depth, 0, 1));
      gl.uniform1f(u.angle, rad(s.angle));
      gl.uniform1f(u.light, rad(s.lightAngle));
      gl.uniform1f(u.breathe, clamp(s.breathe, 0, 1));
      gl.uniform1f(u.wave, clamp(s.wave, 0, 1));
      gl.uniform1f(u.sheen, clamp(s.sheen, 0, 1));
      gl.uniform1f(u.gradAngle, rad(s.gradientAngle));
      gl.uniform1f(u.saturation, clamp(s.saturation, 0, 2));
      gl.uniform1f(u.grain, clamp(s.grain, 0, 1));
      gl.uniform1f(u.grainSize, clamp(s.grainSize, 1, 4));
      gl.uniform1f(u.grainTime, s.grainMotion && !reduce && !s.paused ? Math.floor(performance.now() / 42) % 4096 : 0);
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
      if (moving()) time += (delta / 1000) * clamp(s.speed, 0, 3) * 0.6;
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
      cancelAnimationFrame(pending);
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
  }, [folds, depth, angle, lightAngle, breathe, wave, sheen, gradientAngle, speed, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // Without WebGL: the printed gradient under soft CSS pleat stripes
  const pleat = 100 / clamp(folds, 4, 40);
  const fallback = `repeating-linear-gradient(${180 - angle}deg, rgba(0,0,0,0.14) 0%, rgba(255,255,255,0.12) ${pleat / 2}%, rgba(0,0,0,0.14) ${pleat}%), linear-gradient(${90 - gradientAngle}deg, ${list.length > 1 ? list.join(", ") : `${list[0]}, ${list[0]}`})`;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: baseColor }}>
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
