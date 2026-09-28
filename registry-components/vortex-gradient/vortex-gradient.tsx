"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface VortexGradientProps {
  /** The colors wound into the spiral, 1 to 6. Any CSS color, tokens included. */
  colors?: string[];
  /** Color around the vortex, and the frame the intro grows out of. */
  baseColor?: string;
  /** Spiral arms, 1 to 8. */
  arms?: number;
  /** How tightly the arms wind toward the center, 0 (loose sweep) to 1 (tight coil). */
  tightness?: number;
  /** How far the color reaches from the center, 0.3 to 2 frame heights. */
  spread?: number;
  /** How much the whirlpool darkens as it falls toward the center, 0 to 1. */
  depth?: number;
  /** Ragged, fractal ripples along the arms, 0 (clean) to 1 (stormy). */
  turbulence?: number;
  /** A bright eye at the center, 0 (none) to 1 (large and glowing). */
  eye?: number;
  /** Horizontal position of the center, 0 (left) to 1 (right). */
  centerX?: number;
  /** Vertical position of the center, 0 (top) to 1 (bottom). */
  centerY?: number;
  /** Turning direction. */
  direction?: "clockwise" | "counterclockwise";
  /** How fast the vortex turns, 0 (still) to 3. */
  speed?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). 1 keeps the colors as given. */
  saturation?: number;
  /** Film grain over the gradient, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` or `baseColor` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** Picks a different pattern of ripples. */
  seed?: number;
  /** The center leans a little toward the cursor. */
  interactive?: boolean;
  /** Hold the vortex still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const vortexGradientDemo: VortexGradientProps = {
  colors: ["#f4c8d0", "#d9c8f2", "#bcd3f5", "#c5e6dc", "#f7dfc4", "#ebc3e3"],
  baseColor: "#f4eff3",
  arms: 3,
  tightness: 0.55,
  spread: 1,
  depth: 0.35,
  turbulence: 0.4,
  eye: 0.35,
  centerX: 0.5,
  centerY: 0.5,
  direction: "clockwise",
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

const DEFAULT_COLORS = ["#f4c8d0", "#d9c8f2", "#bcd3f5", "#c5e6dc", "#f7dfc4", "#ebc3e3"];
const POINTS = 6;
const INTRO_MS = 2400;

const vertex = `
attribute vec2 aPos;
void main(){gl_Position=vec4(aPos,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uPixel;
uniform vec3 uColors[${POINTS}];
uniform vec3 uBase;
uniform vec2 uCenter;
uniform float uArms;
uniform float uTight;
uniform float uSpread;
uniform float uDepth;
uniform float uTurb;
uniform float uEye;
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
// Cyclic ramp through the six colors; neighboring weights always sum to one
vec3 ramp(float v){
  float x=fract(v)*${POINTS}.;
  vec3 sum=vec3(0.);
  for(int i=0;i<${POINTS};i++){
    float d=abs(mod(x-float(i)+${POINTS / 2}.,${POINTS}.)-${POINTS / 2}.);
    sum+=uColors[i]*(1.-smoothstep(0.,1.,clamp(d,0.,1.)));
  }
  return sum;
}
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 p=(gl_FragCoord.xy/uRes-uCenter)*vec2(aspect,1.);
  float t=uTime;
  float r=length(p);
  float a=atan(p.y,p.x);
  float lr=log(max(r,.004));
  // Log spiral phase: arms around, winding inward, turning with time
  float phase=a*uArms/6.2831853+lr*(.25+uTight*1.6)+t*.12;
  vec2 swirlPos=vec2(cos(a),sin(a))*(lr*.9)+vec2(uSeed*3.1,uSeed*1.7);
  phase+=(fbm(swirlPos*1.6+vec2(-t*.15,t*.1))-.5)*uTurb*.9*uIntro;
  vec3 lab=ramp(phase);
  lab.x+=cos(phase*6.2831853)*.035;
  // The pit darkens and blurs toward one mean color, then the eye lights it
  float pit=exp(-r*r/(.1+.25*uDepth));
  vec3 mean=(uColors[0]+uColors[1]+uColors[2]+uColors[3]+uColors[4]+uColors[5])/6.;
  lab=mix(lab,mean,smoothstep(.12,.0,r)*.8);
  lab.x*=1.-uDepth*.75*pit;
  float eyeR=.015+uEye*.09;
  float glow=uEye*exp(-r*r/(eyeR*eyeR));
  lab=mix(lab,vec3(.97,lab.yz*.25),clamp(glow,0.,1.));
  lab.yz*=uSaturation;
  vec3 col=toSrgb(lab);
  float reach=uSpread*mix(.3,1.,uIntro);
  float body=1.-smoothstep(reach*.45,reach,r);
  col=mix(toSrgb(uBase),col,body);
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=g*uGrain*.2;
  // The intro grows the vortex, grain included, out of the flat base
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
  const given = (colors ?? []).filter(Boolean).slice(0, POINTS);
  return given.length > 0 ? given : DEFAULT_COLORS;
};

export function VortexGradient({
  colors = DEFAULT_COLORS,
  baseColor = "#f4eff3",
  arms = 3,
  tightness = 0.55,
  spread = 1,
  depth = 0.35,
  turbulence = 0.4,
  eye = 0.35,
  centerX = 0.5,
  centerY = 0.5,
  direction = "clockwise",
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
}: VortexGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${baseColor}`;
  const current = { colors: list, baseColor, arms, tightness, spread, depth, turbulence, eye, centerX, centerY, direction, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
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
      time: at("uTime"),
      pixel: at("uPixel"),
      colors: at("uColors[0]"),
      base: at("uBase"),
      center: at("uCenter"),
      arms: at("uArms"),
      tight: at("uTight"),
      spread: at("uSpread"),
      depth: at("uDepth"),
      turb: at("uTurb"),
      eye: at("uEye"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      intro: at("uIntro"),
    };

    // Six color slots plus the base, faded together so a new palette never snaps
    const SLOTS = (POINTS + 1) * 3;
    const shown = new Float32Array(SLOTS);
    let from = new Float32Array(SLOTS);
    let to = new Float32Array(SLOTS);
    let fadeStart = 0;
    let fadeLength = 0;
    let fading = false;
    let colored = false;
    const baseLab = new Float32Array(3);

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
      for (let i = 0; i < POINTS; i++) next.set(labs[i % labs.length] ?? [0, 0, 0], i * 3);
      next.set(toOklab(resolveColor(root, s.baseColor)), POINTS * 3);
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
      baseLab.set(shown.subarray(POINTS * 3));
      const aspect = canvas.width / Math.max(1, canvas.height);
      // The center leans a fifth of the way toward the cursor
      const cx = clamp(s.centerX, 0, 1) + (mouse.x / aspect) * 0.2 * mouse.power;
      const cy = 1 - clamp(s.centerY, 0, 1) + mouse.y * 0.2 * mouse.power;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, (s.direction === "counterclockwise" ? -1 : 1) * time + s.seed * 3.7);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown.subarray(0, POINTS * 3));
      gl.uniform3fv(u.base, baseLab);
      gl.uniform2f(u.center, cx, cy);
      gl.uniform1f(u.arms, Math.round(clamp(s.arms, 1, 8)));
      gl.uniform1f(u.tight, clamp(s.tightness, 0, 1));
      gl.uniform1f(u.spread, clamp(s.spread, 0.3, 2));
      gl.uniform1f(u.depth, clamp(s.depth, 0, 1));
      gl.uniform1f(u.turb, clamp(s.turbulence, 0, 1));
      gl.uniform1f(u.eye, clamp(s.eye, 0, 1));
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
      if (moving()) time += (delta / 1000) * clamp(s.speed, 0, 3);
      mouse.power += (mouse.target - mouse.power) * 0.05;
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
        const s = settings.current;
        mouse.tx = ((event.clientX - rect.left) / rect.width - clamp(s.centerX, 0, 1)) * aspect;
        mouse.ty = clamp(s.centerY, 0, 1) - (event.clientY - rect.top) / rect.height;
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
  }, [arms, tightness, spread, depth, turbulence, eye, centerX, centerY, direction, speed, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // A CSS conic sweep of the same colors, shown only without WebGL
  const x = `${clamp(centerX, 0, 1) * 100}%`;
  const y = `${clamp(centerY, 0, 1) * 100}%`;
  const fallback = `radial-gradient(circle at ${x} ${y}, transparent 0%, transparent 35%, ${baseColor} 75%), conic-gradient(from 0deg at ${x} ${y}, ${[...list, list[0]].join(", ")})`;

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
