"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface BokehGradientProps {
  /** Colors of the light discs, 1 to 6. Any CSS color, tokens included. */
  colors?: string[];
  /** The dark (or light) ground behind the lights. */
  backgroundColor?: string;
  /** Number of light discs, 4 to 40. */
  count?: number;
  /** Size of the discs, 0.5 to 2. */
  size?: number;
  /** Lens focus, 0 (dreamy soft edges) to 1 (crisp discs with a bright rim). */
  focus?: number;
  /** Disc shape, 0 (round) to 1 (the polygon of the aperture blades). */
  aperture?: number;
  /** Aperture blades when `aperture` is above 0, 5 to 9. */
  blades?: number;
  /** How bright the lights glow, 0 to 1. */
  brightness?: number;
  /** A soft wash of the palette over the ground, 0 (none) to 1. */
  wash?: number;
  /** How fast the lights drift, 0 (still) to 3. */
  speed?: number;
  /** Parallax between near and far lights, 0 (flat) to 1 (deep). */
  depth?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). */
  saturation?: number;
  /** Film grain over the frame, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` or `backgroundColor` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** Picks a different scatter of lights. */
  seed?: number;
  /** The layers shift with parallax toward the cursor. */
  interactive?: boolean;
  /** Hold the lights still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const bokehGradientDemo: BokehGradientProps = {
  colors: ["#ffb37a", "#ff6f91", "#8f7bff", "#5ec8ff", "#ffe29a", "#ff9f6b"],
  backgroundColor: "#0b0a14",
  count: 24,
  size: 1,
  focus: 0.35,
  aperture: 0,
  blades: 6,
  brightness: 0.7,
  wash: 0.35,
  speed: 1,
  depth: 0.5,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  seed: 4,
  interactive: true,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#ffb37a", "#ff6f91", "#8f7bff", "#5ec8ff", "#ffe29a", "#ff9f6b"];
const SLOTS = 6;
const MAX_DISCS = 40;
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
uniform vec3 uBg;
uniform float uCount;
uniform float uSize;
uniform float uFocus;
uniform float uAperture;
uniform float uBlades;
uniform float uBrightness;
uniform float uWash;
uniform float uDepth;
uniform float uSaturation;
uniform float uGrain;
uniform float uGrainSize;
uniform float uGrainTime;
uniform float uSeed;
uniform vec2 uMouse;
uniform float uIntro;

float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
vec3 pick(float k){vec3 c=uColors[0];for(int j=1;j<${SLOTS};j++){if(float(j)==k)c=uColors[j];}return c;}
vec3 ramp(float x){float k=fract(x)*${SLOTS}.;float i0=floor(k);return mix(pick(i0),pick(mod(i0+1.,${SLOTS}.)),smoothstep(0.,1.,fract(k)));}
vec3 toLinear(vec3 c){
  float l=c.x+.3963377774*c.y+.2158037573*c.z;
  float m=c.x-.1055613458*c.y-.0638541728*c.z;
  float s=c.x-.0894841775*c.y-1.291485548*c.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  return clamp(vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s),0.,1.);
}
vec3 toGamma(vec3 lin){return mix(lin*12.92,1.055*pow(lin,vec3(1./2.4))-.055,step(.0031308,lin));}
vec3 vivid(vec3 lab){return vec3(lab.x,lab.yz*uSaturation);}
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(uv-.5)*vec2(aspect,1.);
  float t=uTime;
  // The ground: a soft diagonal wash of the palette over the background, mixed in Oklab
  float g=uv.y*.55+uv.x*.25+.08*sin(t*.12+uSeed);
  vec3 lab=mix(uBg,ramp(g),uWash*.55*(.35+.65*uv.y));
  vec3 col=toLinear(vivid(lab));
  float seg=6.2831853/uBlades;
  for(int i=0;i<${MAX_DISCS};i++){
    float fi=float(i);
    if(fi>=uCount)break;
    float h1=hash(vec2(fi*7.13+uSeed,3.1));
    float h2=hash(vec2(fi*3.77,uSeed+9.4));
    float h3=hash(vec2(uSeed*1.9+fi,17.2));
    float h4=hash(vec2(fi+41.,uSeed*2.3));
    float d=h3;
    float r=uSize*mix(.045,.17,d*d)*mix(.45,1.,uIntro);
    float y=mix(-.5-r,.5+r,fract(h2+t*.012*(.4+d)));
    vec2 pos=vec2((h1-.5)*aspect*1.1+sin(t*.18*(.5+h4)+h1*6.28)*.05,y);
    pos+=uMouse*uDepth*(d-.35)*.14;
    vec2 q=p-pos;
    float a=atan(q.y,q.x)+h4*6.2831853;
    float poly=cos(seg*.5)/cos(mod(a,seg)-seg*.5);
    float nd=length(q)/(r*mix(1.,poly,uAperture));
    float e=mix(.7,.05,uFocus)*mix(1.25,.75,d);
    float disc=1.-smoothstep(1.-e,1.,nd);
    float rim=smoothstep(1.-e*2.-.2,1.-e*.4,nd);
    float glow=disc*(.5+.5*rim)*uBrightness*mix(.35,.85,h4)*mix(.7,1.,d)*uIntro;
    vec3 light=toLinear(vivid(pick(mod(fi,${SLOTS}.))));
    col=1.-(1.-col)*(1.-light*glow);
  }
  col=toGamma(col);
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float n=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=n*uGrain*.2;
  // The intro grows the lights, grain included, out of the flat background
  col=mix(toGamma(toLinear(uBg)),col,uIntro);
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

export function BokehGradient({
  colors = DEFAULT_COLORS,
  backgroundColor = "#0b0a14",
  count = 24,
  size = 1,
  focus = 0.35,
  aperture = 0,
  blades = 6,
  brightness = 0.7,
  wash = 0.35,
  speed = 1,
  depth = 0.5,
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
}: BokehGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${backgroundColor}`;
  const settings = useRef({ colors: list, backgroundColor, count, size, focus, aperture, blades, brightness, wash, speed, depth, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused });
  settings.current = { colors: list, backgroundColor, count, size, focus, aperture, blades, brightness, wash, speed, depth, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
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
      bg: at("uBg"),
      count: at("uCount"),
      size: at("uSize"),
      focus: at("uFocus"),
      aperture: at("uAperture"),
      blades: at("uBlades"),
      brightness: at("uBrightness"),
      wash: at("uWash"),
      depth: at("uDepth"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      mouse: at("uMouse"),
      intro: at("uIntro"),
    };

    // Six palette slots plus the background; a shorter palette repeats so any two can fade into each other
    const shown = new Float32Array((SLOTS + 1) * 3);
    let from = new Float32Array(shown.length);
    let to = new Float32Array(shown.length);
    let fadeStart = 0;
    let fadeLength = 0;
    let fading = false;
    let colored = false;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
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
      next.set(toOklab(resolveColor(root, s.backgroundColor)), SLOTS * 3);
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
      gl.uniform1f(u.time, time + s.seed * 13.7);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown.subarray(0, SLOTS * 3));
      gl.uniform3f(u.bg, shown[SLOTS * 3] ?? 0, shown[SLOTS * 3 + 1] ?? 0, shown[SLOTS * 3 + 2] ?? 0);
      gl.uniform1f(u.count, Math.round(clamp(s.count, 4, MAX_DISCS)));
      gl.uniform1f(u.size, clamp(s.size, 0.5, 2));
      gl.uniform1f(u.focus, clamp(s.focus, 0, 1));
      gl.uniform1f(u.aperture, clamp(s.aperture, 0, 1));
      gl.uniform1f(u.blades, Math.round(clamp(s.blades, 5, 9)));
      gl.uniform1f(u.brightness, clamp(s.brightness, 0, 1));
      gl.uniform1f(u.wash, clamp(s.wash, 0, 1));
      gl.uniform1f(u.depth, clamp(s.depth, 0, 1));
      gl.uniform1f(u.saturation, clamp(s.saturation, 0, 2));
      gl.uniform1f(u.grain, clamp(s.grain, 0, 1));
      gl.uniform1f(u.grainSize, clamp(s.grainSize, 1, 4));
      gl.uniform1f(u.grainTime, s.grainMotion && !reduce && !s.paused ? Math.floor(performance.now() / 42) % 4096 : 0);
      gl.uniform1f(u.seed, s.seed);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
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
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      draw();
      const easing = Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > 0.001;
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
      if (!settings.current.interactive) {
        mouse.tx = 0;
        mouse.ty = 0;
      }
      draw();
      play();
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || reduce || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      mouse.tx = inside ? ((event.clientX - rect.left) / rect.width) * 2 - 1 : 0;
      mouse.ty = inside ? 1 - ((event.clientY - rect.top) / rect.height) * 2 : 0;
      if (!frame) play();
    };
    const onLeave = () => {
      mouse.tx = 0;
      mouse.ty = 0;
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
  }, [count, size, focus, aperture, blades, brightness, wash, speed, depth, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // Soft CSS circles of the same colors, shown only without WebGL
  const spots = ["16% 30%", "38% 68%", "62% 24%", "84% 60%", "50% 88%", "26% 12%"];
  const fallback = list
    .map((color, index) => `radial-gradient(circle at ${spots[index % spots.length]}, color-mix(in oklab, ${color} 55%, transparent) 0, transparent 9rem)`)
    .join(", ");

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor }}>
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
