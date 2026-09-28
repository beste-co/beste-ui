"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface OrbGradientProps {
  /** Colors swirling across the orb, 1 to 6, in order. Any CSS color, tokens included. */
  colors?: string[];
  /** Color of the space around the orb. */
  baseColor?: string;
  /** Diameter of the orb as a share of the frame height, 0.2 to 3. Large values make a horizon. */
  size?: number;
  /** Horizontal center, 0 (left edge) to 1 (right edge). Values outside push the orb off frame. */
  positionX?: number;
  /** Vertical center, 0 (top) to 1 (bottom). Values past 1 sink the orb below the frame. */
  positionY?: number;
  /** Strength of the atmosphere glowing around the orb, 0 to 1. */
  glow?: number;
  /** Light along the orb's edge, 0 to 1. */
  rim?: number;
  /** How much the colors swirl and fold across the surface, 0 (calm bands) to 1 (storms). */
  swirl?: number;
  /** Direction the light comes from, in degrees (0 = right, 90 = top). */
  lightAngle?: number;
  /** How fast the surface turns and drifts, 0 (still) to 3. */
  speed?: number;
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
  /** Picks a different surface pattern. */
  seed?: number;
  /** The light and the turn of the orb lean softly toward the cursor. */
  interactive?: boolean;
  /** Hold the surface still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const orbGradientDemo: OrbGradientProps = {
  colors: ["#3b2cff", "#8f3dff", "#ff4fa3", "#ff7a45", "#ffc24b", "#2fd3c4"],
  baseColor: "#07060f",
  size: 0.8,
  positionX: 0.5,
  positionY: 0.5,
  glow: 0.6,
  rim: 0.6,
  swirl: 0.5,
  lightAngle: 120,
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

const DEFAULT_COLORS = ["#3b2cff", "#8f3dff", "#ff4fa3", "#ff7a45", "#ffc24b", "#2fd3c4"];
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
uniform vec3 uRimColor;
uniform float uSize;
uniform vec2 uPos;
uniform float uGlow;
uniform float uRim;
uniform float uSwirl;
uniform vec2 uLight;
uniform vec2 uTilt;
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
float fbm(vec2 p){
  float v=0.;float a=.5;
  for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}
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
vec3 ramp(float x){
  x=clamp(x,0.,1.)*${STOPS - 1}.;
  vec3 c=uColors[0];
  for(int i=1;i<${STOPS};i++){c=mix(c,uColors[i],smoothstep(0.,1.,clamp(x-float(i-1),0.,1.)));}
  return c;
}
void main(){
  float px=1./uRes.y;
  // Frame in height units, y up; the orb rises a little into place during the intro
  vec2 center=vec2(uPos.x*uRes.x,(1.-uPos.y)*uRes.y)*px-vec2(0.,(1.-uIntro)*.06);
  vec2 p=gl_FragCoord.xy*px-center;
  float R=uSize*.5*mix(.86,1.,uIntro);
  float d=length(p);
  float t=uTime;
  vec3 L=normalize(vec3(uLight+uTilt*.5,.75));
  vec3 rimLab=uRimColor;
  rimLab.yz*=uSaturation;

  vec3 sphere=uBase;
  float cover=0.;
  if(d<R+2.*px){
    vec2 q=p/R;
    float z=sqrt(max(0.,1.-dot(q,q)));
    vec3 n=vec3(q,z);
    // Longitude turns with time; the surface pattern swirls in latitude bands
    float lon=atan(n.x,n.z)+t*.05+uTilt.x*.35;
    float lat=asin(clamp(n.y+uTilt.y*.08,-1.,1.));
    vec2 s=vec2(lon*1.1,lat*2.2)+uSeed*3.1;
    float sw=uSwirl*uIntro;
    vec2 w=vec2(fbm(s*1.3+vec2(t*.04,0.)),fbm(s*1.3+vec2(4.7,t*.03)))-.5;
    float f=lat*.55+.5+(fbm(s+w*2.4*sw)-.5)*mix(.25,1.1,sw)+sin(lat*9.+w.x*6.*sw+t*.1)*.035*sw;
    vec3 lab=ramp(f);
    float wrap=dot(n,L)*.5+.5;
    lab.x*=mix(.42,1.06,pow(wrap,1.25));
    lab.yz*=mix(.72,1.,wrap)*uSaturation;
    float fres=pow(1.-z,2.6);
    lab=mix(lab,rimLab,clamp(fres*uRim*(.35+.65*wrap),0.,1.)*.85);
    sphere=lab;
    cover=smoothstep(R+px,R-px,d);
  }
  // Atmosphere: a halo that falls off outside the edge, brighter on the lit side
  float side=dot(normalize(p+1e-5),normalize(L.xy+1e-5))*.5+.5;
  float halo=exp(-max(d-R,0.)/(R*.18+.04))*uGlow*uIntro*mix(.35,1.,side);
  vec3 space=mix(uBase,rimLab,clamp(halo,0.,1.)*.8);
  vec3 col=toSrgb(mix(space,sphere,cover));
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=g*uGrain*.2;
  // The intro grows the orb, its glow and the grain out of the flat base color
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

export function OrbGradient({
  colors = DEFAULT_COLORS,
  baseColor = "#07060f",
  size = 0.8,
  positionX = 0.5,
  positionY = 0.5,
  glow = 0.6,
  rim = 0.6,
  swirl = 0.5,
  lightAngle = 120,
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
}: OrbGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${baseColor}`;
  const settings = useRef({ colors: list, baseColor, size, positionX, positionY, glow, rim, swirl, lightAngle, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused });
  settings.current = { colors: list, baseColor, size, positionX, positionY, glow, rim, swirl, lightAngle, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
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
      rimColor: at("uRimColor"),
      size: at("uSize"),
      pos: at("uPos"),
      glow: at("uGlow"),
      rim: at("uRim"),
      swirl: at("uSwirl"),
      light: at("uLight"),
      tilt: at("uTilt"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      intro: at("uIntro"),
    };

    // Six ramp stops, then the base and the rim color, all faded together in Oklab
    const SLOTS = (STOPS + 2) * 3;
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
      const labs = s.colors.map((color) => toOklab(resolveColor(root, color)));
      // Resample any palette length into six evenly spaced stops
      for (let i = 0; i < STOPS; i++) {
        const spot = (i / (STOPS - 1)) * (labs.length - 1);
        const a = labs[Math.floor(spot)] ?? labs[0] ?? [0, 0, 0];
        const b = labs[Math.min(labs.length - 1, Math.floor(spot) + 1)] ?? a;
        const k = spot - Math.floor(spot);
        next.set([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k], i * 3);
      }
      next.set(toOklab(resolveColor(root, s.baseColor)), STOPS * 3);
      // The rim glows in the lightest color of the palette
      const rimLab = labs.reduce((best, lab) => (lab[0] > best[0] ? lab : best), labs[0] ?? [1, 0, 0]);
      next.set(rimLab, (STOPS + 1) * 3);
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
      const angle = (s.lightAngle * Math.PI) / 180;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, time + s.seed * 5.17);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown.subarray(0, STOPS * 3));
      gl.uniform3f(u.base, shown[STOPS * 3] ?? 0, shown[STOPS * 3 + 1] ?? 0, shown[STOPS * 3 + 2] ?? 0);
      gl.uniform3f(u.rimColor, shown[(STOPS + 1) * 3] ?? 1, shown[(STOPS + 1) * 3 + 1] ?? 0, shown[(STOPS + 1) * 3 + 2] ?? 0);
      gl.uniform1f(u.size, clamp(s.size, 0.2, 3));
      gl.uniform2f(u.pos, s.positionX, s.positionY);
      gl.uniform1f(u.glow, clamp(s.glow, 0, 1));
      gl.uniform1f(u.rim, clamp(s.rim, 0, 1));
      gl.uniform1f(u.swirl, clamp(s.swirl, 0, 1));
      gl.uniform2f(u.light, Math.cos(angle), Math.sin(angle));
      gl.uniform2f(u.tilt, mouse.x * mouse.power, mouse.y * mouse.power);
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
        mouse.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.ty = 1 - ((event.clientY - rect.top) / rect.height) * 2;
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
  }, [size, positionX, positionY, glow, rim, swirl, lightAngle, speed, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // A soft CSS sphere in the same colors, shown only without WebGL
  const fallback = `radial-gradient(circle at ${positionX * 100}% ${positionY * 100}%, ${list.slice().reverse().join(", ")} ${Math.round(size * 32)}vmin, transparent ${Math.round(size * 40)}vmin)`;

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
