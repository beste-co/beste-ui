"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface HorizonGradientProps {
  /** Sky colors from the zenith down to the horizon, 1 to 6. Any CSS color, tokens included. */
  colors?: string[];
  /** Color of the sun or moon and its glow. */
  sunColor?: string;
  /** Size of the sun, 0 (a small moon) to 1 (a large setting sun). */
  sunSize?: number;
  /** Where the sun sits across the frame, 0 (left) to 1 (right). */
  sunX?: number;
  /** Height of the horizon line from the bottom, 0 to 1. */
  horizon?: number;
  /** Bloom around the sun and along the horizon, 0 to 1. */
  glow?: number;
  /** Atmospheric haze that softens the horizon, 0 to 1. */
  haze?: number;
  /** Thin cloud streaks drifting across the sky, 0 to 1. */
  streaks?: number;
  /** A slow time-of-day drift that eases the sky up and down its colors, 0 to 1. */
  drift?: number;
  /** How fast the clouds and the drift move, 0 (still) to 3. */
  speed?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). 1 keeps the colors as given. */
  saturation?: number;
  /** Film grain over the sky, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` or `sunColor` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** Picks a different arrangement of the clouds. */
  seed?: number;
  /** The sun leans a little toward the cursor. */
  interactive?: boolean;
  /** Hold the sky still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const horizonGradientDemo: HorizonGradientProps = {
  colors: ["#1d2a5b", "#3f4f9a", "#8e7cc3", "#f29e9a", "#ffc58f", "#ffe3b8"],
  sunColor: "#fff1d6",
  sunSize: 0.45,
  sunX: 0.5,
  horizon: 0.3,
  glow: 0.6,
  haze: 0.5,
  streaks: 0.4,
  drift: 0.3,
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

const DEFAULT_COLORS = ["#1d2a5b", "#3f4f9a", "#8e7cc3", "#f29e9a", "#ffc58f", "#ffe3b8"];
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
uniform vec3 uSun;
uniform float uHorizon;
uniform float uSunSize;
uniform float uSunX;
uniform float uGlow;
uniform float uHaze;
uniform float uStreaks;
uniform float uDrift;
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
  for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}
  return v;
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
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 uv=gl_FragCoord.xy/uRes;
  float t=uTime;
  float y=uv.y-uHorizon;
  vec2 q=vec2((uv.x-.5)*aspect,y);
  float hw=.003+uHaze*.025;
  // The day drifts slowly up and down the palette
  float shift=uDrift*.22*sin(t*.045+uSeed);
  float v=clamp(y/max(1.-uHorizon,.05),0.,1.);
  vec3 sky=ramp(clamp(1.-v+shift,0.,1.));
  float vb=clamp(-y/max(uHorizon,.05),0.,1.);
  vec3 ground=ramp(clamp(1.-vb*.35+shift,0.,1.));
  ground.x*=mix(1.,.7,vb);
  vec3 lab=mix(ground,sky,smoothstep(-hw,hw,y));
  lab.yz*=uSaturation;
  vec3 lin=toLinear(lab);
  vec3 sunLab=uSun;sunLab.yz*=uSaturation;
  vec3 sunLin=toLinear(sunLab);
  float sunR=mix(.035,.2,uSunSize);
  vec2 sc=vec2((uSunX-.5)*aspect,sunR*.35-(1.-uIntro)*sunR*2.4);
  sc.x+=(uMouse.x-sc.x)*.12*uMouse.z;
  vec2 d=q-sc;
  float dist=length(d);
  // Cloud streaks, stretched wide and lit warmer near the sun
  float n=fbm(vec2(q.x*1.1+t*.018+uSeed*3.1,y*13.+uSeed));
  float band=smoothstep(.015,.1,y)*(1.-smoothstep(.2,.7,v));
  float streak=smoothstep(.52,.78,n)*band*uStreaks*uIntro;
  vec3 lit=lin*.55+sunLin*.9*exp(-dist*2.5);
  lin=mix(lin,lit,streak*.75);
  vec3 hazeLin=toLinear(ramp(1.))*1.1;
  lin=mix(lin,hazeLin,uHaze*.55*exp(-abs(y)*mix(45.,9.,uHaze)));
  float disc=(1.-smoothstep(sunR*.94,sunR,dist))*smoothstep(-hw*.5,hw,y);
  float halo=exp(-dist/(sunR*mix(1.2,4.5,uGlow)))*uGlow;
  float bloom=exp(-abs(y)*28.)*exp(-abs(d.x)/(sunR*7.))*uGlow*.7;
  float trail=step(y,0.)*exp(-abs(d.x)/(sunR*.7))*exp(y*5.)*uGlow*(.45+.55*noise(vec2(q.x*26.,y*90.+t*.8)));
  lin+=sunLin*(halo+bloom+trail*.6)*uIntro;
  lin=mix(lin,sunLin*1.15+.05,disc);
  vec3 col=encode(lin);
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=g*uGrain*.2;
  // The intro grows the sky, the sun and the grain out of the flat first color
  col=mix(encode(toLinear(uColors[0])),col,uIntro);
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

// Any palette becomes six evenly spaced stops, so the ends stay exact and palettes of any length crossfade
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

export function HorizonGradient({
  colors = DEFAULT_COLORS,
  sunColor = "#fff1d6",
  sunSize = 0.45,
  sunX = 0.5,
  horizon = 0.3,
  glow = 0.6,
  haze = 0.5,
  streaks = 0.4,
  drift = 0.3,
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
}: HorizonGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${sunColor}`;
  const settings = useRef({ colors: list, sunColor, sunSize, sunX, horizon, glow, haze, streaks, drift, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused });
  settings.current = { colors: list, sunColor, sunSize, sunX, horizon, glow, haze, streaks, drift, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
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
      sun: at("uSun"),
      horizon: at("uHorizon"),
      sunSize: at("uSunSize"),
      sunX: at("uSunX"),
      glow: at("uGlow"),
      haze: at("uHaze"),
      streaks: at("uStreaks"),
      drift: at("uDrift"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      mouse: at("uMouse"),
      intro: at("uIntro"),
    };

    // Six sky stops plus the sun, all in Oklab, faded together on a palette change
    const SLOTS = (STOPS + 1) * 3;
    const shown = new Float32Array(SLOTS);
    let from = new Float32Array(SLOTS);
    let to = new Float32Array(SLOTS);
    let fadeStart = 0;
    let fadeLength = 0;
    let fading = false;
    let colored = false;

    const mouse = { x: 0, tx: 0, power: 0, target: 0 };
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
      next.set(toOklab(resolveColor(root, s.sunColor)), STOPS * 3);
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
      gl.uniform3fv(u.colors, shown.subarray(0, STOPS * 3));
      gl.uniform3f(u.sun, shown[STOPS * 3] ?? 1, shown[STOPS * 3 + 1] ?? 0, shown[STOPS * 3 + 2] ?? 0);
      gl.uniform1f(u.horizon, clamp(s.horizon, 0, 1));
      gl.uniform1f(u.sunSize, clamp(s.sunSize, 0, 1));
      gl.uniform1f(u.sunX, clamp(s.sunX, 0, 1));
      gl.uniform1f(u.glow, clamp(s.glow, 0, 1));
      gl.uniform1f(u.haze, clamp(s.haze, 0, 1));
      gl.uniform1f(u.streaks, clamp(s.streaks, 0, 1));
      gl.uniform1f(u.drift, clamp(s.drift, 0, 1));
      gl.uniform1f(u.saturation, clamp(s.saturation, 0, 2));
      gl.uniform1f(u.grain, clamp(s.grain, 0, 1));
      gl.uniform1f(u.grainSize, clamp(s.grainSize, 1, 4));
      gl.uniform1f(u.grainTime, s.grainMotion && !reduce && !s.paused ? Math.floor(performance.now() / 42) % 4096 : 0);
      gl.uniform1f(u.seed, s.seed);
      gl.uniform3f(u.mouse, mouse.x, 0, mouse.power);
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
      draw();
      const easing = Math.abs(mouse.target - mouse.power) > 0.002 || (mouse.power > 0.01 && Math.abs(mouse.tx - mouse.x) > 0.001);
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
      if (inside) mouse.tx = ((event.clientX - rect.left) / rect.width - 0.5) * (rect.width / Math.max(1, rect.height));
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
  }, [sunSize, sunX, horizon, glow, haze, streaks, drift, speed, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // A plain CSS sky with a sun, shown only without WebGL
  const sunTop = `${Math.round((1 - clamp(horizon, 0, 1)) * 100)}%`;
  const fallback = `radial-gradient(${Math.round(8 + sunSize * 14)}% ${Math.round(8 + sunSize * 14)}% at ${Math.round(sunX * 100)}% ${sunTop}, ${sunColor} 0%, transparent 70%), linear-gradient(to bottom, ${list.join(", ")}${list.length === 1 ? `, ${list[0]}` : ""})`;

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
