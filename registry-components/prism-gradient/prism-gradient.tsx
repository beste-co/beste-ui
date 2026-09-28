"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface PrismGradientProps {
  /** Palette the beams spread through, 1 to 6. Any CSS color, tokens included. */
  colors?: string[];
  /** Mix between the palette (0) and a physical rainbow (1). */
  spectrum?: number;
  /** Color behind the light. Dark bases glow; light bases take the light as a tint. */
  baseColor?: string;
  /** Number of dispersed beams leaving the prism, 1 to 5. */
  beams?: number;
  /** How wide each beam fans its colors, 0 (a thin line) to 1 (a broad fan). */
  spread?: number;
  /** Direction the beams travel, in degrees (0 = right, 90 = up). */
  angle?: number;
  /** Where the prism sits across the frame, 0 to 1. */
  sourceX?: number;
  /** Where the prism sits up the frame, 0 (bottom) to 1 (top). */
  sourceY?: number;
  /** Soft glow around the beams and the prism, 0 to 1. */
  bloom?: number;
  /** How crisp the beam edges are, 0 (soft) to 1 (sharp). */
  sharpness?: number;
  /** Caustic streaks running along the beams, 0 to 1. */
  caustics?: number;
  /** The white beam entering the prism from the other side, 0 (off) to 1. */
  whiteBeam?: number;
  /** How fast the beams sway and the streaks flow, 0 (still) to 3. */
  speed?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). 1 keeps the colors as given. */
  saturation?: number;
  /** Film grain over the light, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` or `baseColor` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** Picks a different sway and streak pattern. */
  seed?: number;
  /** The prism eases a little toward the cursor. */
  interactive?: boolean;
  /** Hold the light still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const prismGradientDemo: PrismGradientProps = {
  colors: ["#ff4d6d", "#ffb347", "#fff275", "#5cf2c7", "#4d8bff", "#b56cff"],
  spectrum: 0.5,
  baseColor: "#07060b",
  beams: 3,
  spread: 0.5,
  angle: -18,
  sourceX: 0.3,
  sourceY: 0.58,
  bloom: 0.5,
  sharpness: 0.5,
  caustics: 0.5,
  whiteBeam: 0.6,
  speed: 1,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  seed: 4,
  interactive: true,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#ff4d6d", "#ffb347", "#fff275", "#5cf2c7", "#4d8bff", "#b56cff"];
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
uniform float uSpectrum;
uniform float uBeams;
uniform float uSpread;
uniform float uAngle;
uniform vec2 uSource;
uniform float uBloom;
uniform float uSharp;
uniform float uCaustics;
uniform float uWhite;
uniform float uSaturation;
uniform float uGrain;
uniform float uGrainSize;
uniform float uGrainTime;
uniform float uSeed;
uniform float uIntro;

float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
vec3 toLinear(vec3 c){
  float l=c.x+.3963377774*c.y+.2158037573*c.z;
  float m=c.x-.1055613458*c.y-.0638541728*c.z;
  float s=c.x-.0894841775*c.y-1.291485548*c.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  return max(vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s),0.);
}
vec3 encode(vec3 lin){
  lin=clamp(lin,0.,1.);
  return mix(lin*12.92,1.055*pow(lin,vec3(1./2.4))-.055,step(.0031308,lin));
}
vec3 ramp(float p){
  float x=clamp(p,0.,1.)*${STOPS - 1}.;
  vec3 c=uColors[0];
  for(int i=0;i<${STOPS - 1};i++){c=mix(c,uColors[i+1],clamp(x-float(i),0.,1.));}
  return c;
}
float bump(float x,float c,float w){float k=(x-c)/w;return max(0.,1.-k*k);}
// A physical rainbow from red (0) to violet (1), in linear light
vec3 spectral(float x){
  return vec3(bump(x,.12,.28)+.3*bump(x,.96,.12),bump(x,.42,.24),bump(x,.74,.24))*1.15;
}
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 q=(gl_FragCoord.xy/uRes-.5)*vec2(aspect,1.);
  float t=uTime;
  vec2 d=q-uSource;
  float dist=length(d);
  float a=atan(d.y,d.x);
  float reach=uIntro*2.6;
  vec3 light=vec3(0.);
  for(int i=0;i<5;i++){
    float fi=float(i);
    if(fi>=uBeams)break;
    float dir=uAngle+(fi-(uBeams-1.)*.5)*.5+sin(t*.13+fi*1.7+uSeed)*.05;
    float w=mix(.05,.34,uSpread)*(1.+.08*sin(t*.2+fi*2.3));
    float da=atan(sin(a-dir),cos(a-dir));
    float s=da/w;
    float win=1.-smoothstep(1.-mix(.9,.08,uSharp),1.,abs(s));
    float h=clamp(s*.5+.5,0.,1.);
    vec3 lab=ramp(h);lab.yz*=uSaturation;
    vec3 c=mix(toLinear(lab),spectral(h)*mix(1.,uSaturation,.5),uSpectrum);
    float along=smoothstep(0.,.06,dist)*exp(-dist*.55)*(1.-smoothstep(reach-.6,reach,dist));
    float st=noise(vec2(s*9.+fi*13.+uSeed,dist*1.6-t*.35));
    float caus=mix(1.,.4+1.2*st*st,uCaustics);
    float soft=exp(-(da*da)/(w*w*6.));
    light+=c*along*(win*caus*1.1+soft*uBloom*.35);
  }
  // The white beam entering from the far side
  vec2 inDir=-vec2(cos(uAngle),sin(uAngle));
  float fwd=dot(d,inDir);
  float perp=abs(dot(d,vec2(-inDir.y,inDir.x)));
  float white=exp(-perp*perp/(.0005+.004*uBloom))*smoothstep(0.,.05,fwd)*(1.-smoothstep(reach*.9-.4,reach*.9,fwd));
  light+=vec3(1.,.98,.95)*white*uWhite*1.3;
  light+=vec3(1.,.97,.94)*(exp(-dist*dist*70.)*1.2+exp(-dist*4.)*.2)*uBloom*uIntro;
  light*=uIntro;
  vec3 base=toLinear(uBase);
  float lum=dot(light,vec3(.2126,.7152,.0722));
  vec3 hue=clamp(light/max(lum,1e-3)*.6,0.,1.);
  vec3 stain=base*mix(vec3(1.),hue,clamp(lum,0.,1.)*.85);
  vec3 lin=mix(base+light,stain,smoothstep(.6,.85,uBase.x));
  lin=mix(lin,.8+.2*(1.-exp(-(lin-.8)*5.)),step(.8,lin));
  vec3 col=encode(lin);
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=g*uGrain*.2;
  // The intro grows the beams and the grain out of the flat base color
  col=mix(encode(base),col,uIntro);
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

// Any palette becomes six evenly spaced stops across each beam's fan
function resample(labs: [number, number, number][]) {
  const out = new Float32Array(STOPS * 3);
  for (let i = 0; i < STOPS; i++) {
    const x = (i / (STOPS - 1)) * (labs.length - 1);
    const a = labs[Math.floor(x)] ?? [0, 0, 0];
    const b = labs[Math.min(labs.length - 1, Math.floor(x) + 1)] ?? a;
    const f = x - Math.floor(x);
    for (let k = 0; k < 3; k++) out[i * 3 + k] = (a[k] ?? 0) + ((b[k] ?? 0) - (a[k] ?? 0)) * f;
  }
  return out;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const palette = (colors?: string[]) => {
  const given = (colors ?? []).filter(Boolean).slice(0, STOPS);
  return given.length > 0 ? given : DEFAULT_COLORS;
};

export function PrismGradient({
  colors = DEFAULT_COLORS,
  spectrum = 0.5,
  baseColor = "#07060b",
  beams = 3,
  spread = 0.5,
  angle = -18,
  sourceX = 0.3,
  sourceY = 0.58,
  bloom = 0.5,
  sharpness = 0.5,
  caustics = 0.5,
  whiteBeam = 0.6,
  speed = 1,
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
}: PrismGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${baseColor}`;
  const settings = useRef({ colors: list, baseColor, spectrum, beams, spread, angle, sourceX, sourceY, bloom, sharpness, caustics, whiteBeam, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused });
  settings.current = { colors: list, baseColor, spectrum, beams, spread, angle, sourceX, sourceY, bloom, sharpness, caustics, whiteBeam, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
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
      spectrum: at("uSpectrum"),
      beams: at("uBeams"),
      spread: at("uSpread"),
      angle: at("uAngle"),
      source: at("uSource"),
      bloom: at("uBloom"),
      sharp: at("uSharp"),
      caustics: at("uCaustics"),
      white: at("uWhite"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      intro: at("uIntro"),
    };

    // Six palette stops plus the base, all in Oklab, faded together on a change
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

    const moving = () => !reduce && !settings.current.paused && settings.current.speed > 0;

    const recolor = () => {
      const s = settings.current;
      const next = new Float32Array(SLOTS);
      next.set(resample(s.colors.map((color) => toOklab(resolveColor(root, color)))));
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
      const aspect = canvas.width / Math.max(1, canvas.height);
      const sx = (clamp(s.sourceX, 0, 1) - 0.5) * aspect;
      const sy = clamp(s.sourceY, 0, 1) - 0.5;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, time + s.seed * 7.31);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown.subarray(0, STOPS * 3));
      gl.uniform3f(u.base, shown[STOPS * 3] ?? 0, shown[STOPS * 3 + 1] ?? 0, shown[STOPS * 3 + 2] ?? 0);
      gl.uniform1f(u.spectrum, clamp(s.spectrum, 0, 1));
      gl.uniform1f(u.beams, Math.round(clamp(s.beams, 1, 5)));
      gl.uniform1f(u.spread, clamp(s.spread, 0, 1));
      gl.uniform1f(u.angle, (s.angle * Math.PI) / 180);
      gl.uniform2f(u.source, sx + (mouse.x - sx) * 0.1 * mouse.power, sy + (mouse.y - sy) * 0.1 * mouse.power);
      gl.uniform1f(u.bloom, clamp(s.bloom, 0, 1));
      gl.uniform1f(u.sharp, clamp(s.sharpness, 0, 1));
      gl.uniform1f(u.caustics, clamp(s.caustics, 0, 1));
      gl.uniform1f(u.white, clamp(s.whiteBeam, 0, 1));
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
      if (moving()) time += (delta / 1000) * clamp(s.speed, 0, 3) * 0.6;
      mouse.power += (mouse.target - mouse.power) * 0.04;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
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
        mouse.tx = ((event.clientX - rect.left) / rect.width - 0.5) * (rect.width / Math.max(1, rect.height));
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
  }, [spectrum, beams, spread, angle, sourceX, sourceY, bloom, sharpness, caustics, whiteBeam, speed, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // A CSS fan of the same colors from the prism, shown only without WebGL
  const cssAngle = 90 - angle;
  const fallback = `radial-gradient(70% 70% at ${Math.round(sourceX * 100)}% ${Math.round((1 - sourceY) * 100)}%, transparent 0%, ${baseColor} 75%), conic-gradient(from ${Math.round(cssAngle - 25)}deg at ${Math.round(sourceX * 100)}% ${Math.round((1 - sourceY) * 100)}%, ${list.join(", ")}, transparent 50deg, transparent)`;

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
