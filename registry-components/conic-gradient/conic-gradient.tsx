"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface ConicGradientProps {
  /** Colors swept around the center, 1 to 6, in order. Any CSS color, tokens included. */
  colors?: string[];
  /** Color outside the glow, and behind it while the canvas loads. */
  backgroundColor?: string;
  /** Horizontal position of the center, 0 (left) to 1 (right). */
  centerX?: number;
  /** Vertical position of the center, 0 (top) to 1 (bottom). */
  centerY?: number;
  /** How many times the colors go around, 1 to 6. */
  repeat?: number;
  /** Starting angle of the sweep in degrees. */
  angle?: number;
  /** Turning speed, -3 to 3. 1 is one turn every 40 seconds; negative turns counterclockwise. */
  rotation?: number;
  /** Radius of the glow as a share of the frame height, 0.1 to 2. Above 1 it fills the frame. */
  radius?: number;
  /** Shape of the glow, 0 (a full disc) to 1 (a thin ring). */
  ring?: number;
  /** How softly the edges fade into the background, 0 (crisp) to 1 (haze). */
  falloff?: number;
  /** Softens the seams between colors, 0 to 1. Strongest near the center. */
  blur?: number;
  /** Bends the sweep into a spiral, -1 to 1. */
  twist?: number;
  /** A soft light at the center, 0 to 1. */
  core?: number;
  /** A slow swell of the radius and a ripple through the sweep, 0 to 1. */
  breathe?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). 1 keeps the colors as given. */
  saturation?: number;
  /** Film grain over the gradient, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` or `backgroundColor` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** The center leans toward the cursor. */
  interactive?: boolean;
  /** Hold the sweep still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const conicGradientDemo: ConicGradientProps = {
  colors: ["#7b5cff", "#2fd4ff", "#ff5fa2", "#ffb347"],
  backgroundColor: "#07060d",
  centerX: 0.5,
  centerY: 0.5,
  repeat: 1,
  angle: 0,
  rotation: 1,
  radius: 0.75,
  ring: 0,
  falloff: 0.6,
  blur: 0.5,
  twist: 0.2,
  core: 0.3,
  breathe: 0.4,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  interactive: true,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#7b5cff", "#2fd4ff", "#ff5fa2", "#ffb347"];
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
uniform vec3 uBg;
uniform vec2 uCenter;
uniform float uAngle;
uniform float uTime;
uniform float uRepeat;
uniform float uRadius;
uniform float uRing;
uniform float uFalloff;
uniform float uBlur;
uniform float uTwist;
uniform float uCore;
uniform float uBreathe;
uniform float uSaturation;
uniform float uGrain;
uniform float uGrainSize;
uniform float uGrainTime;
uniform float uIntro;

float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
vec3 toSrgb(vec3 c){
  float l=c.x+.3963377774*c.y+.2158037573*c.z;
  float m=c.x-.1055613458*c.y-.0638541728*c.z;
  float s=c.x-.0894841775*c.y-1.291485548*c.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  vec3 lin=clamp(vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s),0.,1.);
  return mix(lin*12.92,1.055*pow(lin,vec3(1./2.4))-.055,step(.0031308,lin));
}
vec3 ramp(float a){
  float f=fract(a)*${SLOTS}.;
  float i0=floor(f);
  float k=f-i0;
  float i1=mod(i0+1.,${SLOTS}.);
  vec3 c0=vec3(0.);vec3 c1=vec3(0.);
  for(int i=0;i<${SLOTS};i++){float fi=float(i);if(fi==i0)c0=uColors[i];if(fi==i1)c1=uColors[i];}
  return mix(c0,c1,k*k*(3.-2.*k));
}
void main(){
  vec2 p=gl_FragCoord.xy/uRes.y-uCenter;
  float r=length(p);
  float radius=uRadius*mix(.4,1.,uIntro)*(1.+uBreathe*.08*sin(uTime*.9));
  float a=atan(p.y,p.x)/6.2831853+.5+uAngle;
  a+=uTwist*r*1.2/max(radius,.05)+uBreathe*.02*sin(r*6.-uTime*1.3);
  // Angular blur taps widen toward the center, where the seams would otherwise pinch into a point
  float spread=uBlur*(.03+.02/(r+.08));
  vec3 sweep=vec3(0.);
  for(int j=-2;j<=2;j++){float fj=float(j);sweep+=ramp((a+fj*spread)*uRepeat)*(3.-abs(fj));}
  sweep/=9.;
  sweep.yz*=uSaturation;
  float feather=mix(.02,.6,uFalloff)*radius;
  float width=mix(radius,radius*.1,uRing);
  float inner=radius-width;
  float env=1.-smoothstep(radius-feather,radius+feather,r);
  if(inner>.001){float f2=min(feather,width*.9+.01);env*=smoothstep(inner-f2,inner+f2,r);}
  vec3 lab=mix(uBg,sweep,env);
  float core=uCore*uIntro*exp(-r*r/(radius*radius*.05+1e-4));
  lab.x+=core*.35;
  lab.yz*=1.-core*.5;
  vec3 col=toSrgb(lab);
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=g*uGrain*.2;
  // The intro grows the glow, grain included, out of the flat background
  col=mix(toSrgb(uBg),col,uIntro);
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

// Colors blend in Oklab, so the sweep between two hues stays bright instead of going muddy
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
  const given = (colors ?? []).filter(Boolean).slice(0, SLOTS);
  return given.length > 0 ? given : DEFAULT_COLORS;
};

export function ConicGradient({
  colors = DEFAULT_COLORS,
  backgroundColor = "#07060d",
  centerX = 0.5,
  centerY = 0.5,
  repeat = 1,
  angle = 0,
  rotation = 1,
  radius = 0.75,
  ring = 0,
  falloff = 0.6,
  blur = 0.5,
  twist = 0.2,
  core = 0.3,
  breathe = 0.4,
  saturation = 1,
  grain = 0.2,
  grainSize = 1,
  grainMotion = true,
  transition = 1.2,
  interactive = true,
  paused = false,
  className,
  children,
}: ConicGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${backgroundColor}`;
  const values = { colors: list, backgroundColor, centerX, centerY, repeat, angle, rotation, radius, ring, falloff, blur, twist, core, breathe, saturation, grain, grainSize, grainMotion, transition, interactive, paused };
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
      pixel: at("uPixel"),
      colors: at("uColors[0]"),
      bg: at("uBg"),
      center: at("uCenter"),
      angle: at("uAngle"),
      time: at("uTime"),
      repeat: at("uRepeat"),
      radius: at("uRadius"),
      ring: at("uRing"),
      falloff: at("uFalloff"),
      blur: at("uBlur"),
      twist: at("uTwist"),
      core: at("uCore"),
      breathe: at("uBreathe"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      intro: at("uIntro"),
    };

    // Six evenly spaced slots around the circle plus the background, so any two palettes fade into each other
    const size = SLOTS * 3 + 3;
    const shown = new Float32Array(size);
    let from = new Float32Array(size);
    let to = new Float32Array(size);
    let fadeStart = 0;
    let fadeLength = 0;
    let fading = false;
    let colored = false;

    // Radius, core, speed and center ease toward new values, so a prop change glides instead of jumping
    const live = { radius: 0, core: 0, rotation: 0, x: 0.5, y: 0.5, primed: false };
    const mouse = { x: 0.5, y: 0.5, power: 0, target: 0 };
    let turn = 0;
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

    const targets = () => {
      const s = settings.current;
      const pull = mouse.power * 0.3;
      return {
        radius: clamp(s.radius, 0.1, 2),
        core: clamp(s.core, 0, 1),
        rotation: clamp(s.rotation, -3, 3),
        x: clamp(s.centerX, 0, 1) + (mouse.x - clamp(s.centerX, 0, 1)) * pull,
        y: clamp(s.centerY, 0, 1) + (mouse.y - clamp(s.centerY, 0, 1)) * pull,
      };
    };
    const snap = () => {
      Object.assign(live, targets());
      live.primed = true;
    };
    const easeLive = () => {
      const t = targets();
      let still = true;
      for (const key of ["radius", "core", "rotation", "x", "y"] as const) {
        const diff = t[key] - live[key];
        if (Math.abs(diff) > 0.0005) still = false;
        live[key] += diff * 0.07;
      }
      return !still;
    };
    const animating = () => {
      const s = settings.current;
      return !reduce && !s.paused && (Math.abs(live.rotation) > 0.001 || s.breathe > 0);
    };

    const recolor = () => {
      const s = settings.current;
      const labs = s.colors.map((color) => toOklab(resolveColor(root, color)));
      const next = new Float32Array(size);
      const n = labs.length;
      for (let i = 0; i < SLOTS; i++) {
        const pos = (i / SLOTS) * n;
        const j = Math.floor(pos);
        const k = pos - j;
        const a = labs[j % n] ?? [0, 0, 0];
        const b = labs[(j + 1) % n] ?? a;
        for (let c = 0; c < 3; c++) next[i * 3 + c] = (a[c] ?? 0) + ((b[c] ?? 0) - (a[c] ?? 0)) * k;
      }
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
      if (!live.primed) snap();
      if (fading) {
        const k = clamp((performance.now() - fadeStart) / fadeLength, 0, 1);
        const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
        for (let i = 0; i < shown.length; i++) shown[i] = (from[i] ?? 0) + ((to[i] ?? 0) - (from[i] ?? 0)) * e;
        if (k >= 1) fading = false;
      }
      const aspect = canvas.width / Math.max(1, canvas.height);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown.subarray(0, SLOTS * 3));
      gl.uniform3f(u.bg, shown[SLOTS * 3] ?? 0, shown[SLOTS * 3 + 1] ?? 0, shown[SLOTS * 3 + 2] ?? 0);
      gl.uniform2f(u.center, live.x * aspect, 1 - live.y);
      gl.uniform1f(u.angle, s.angle / 360 + turn);
      gl.uniform1f(u.time, time);
      gl.uniform1f(u.repeat, Math.round(clamp(s.repeat, 1, 6)));
      gl.uniform1f(u.radius, live.radius);
      gl.uniform1f(u.ring, clamp(s.ring, 0, 1));
      gl.uniform1f(u.falloff, clamp(s.falloff, 0, 1));
      gl.uniform1f(u.blur, clamp(s.blur, 0, 1));
      gl.uniform1f(u.twist, clamp(s.twist, -1, 1));
      gl.uniform1f(u.core, live.core);
      gl.uniform1f(u.breathe, clamp(s.breathe, 0, 1));
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
      mouse.power += (mouse.target - mouse.power) * 0.05;
      let easing = false;
      if (reduce) snap();
      else easing = easeLive() || Math.abs(mouse.target - mouse.power) > 0.002;
      if (animating()) {
        turn = (turn + ((delta / 1000) * live.rotation) / 40) % 1;
        time += delta / 1000;
      }
      draw();
      const grainOnly = s.grainMotion && s.grain > 0 && !reduce && !s.paused;
      if (animating() || fading || easing || grainOnly || intro < 1) frame = requestAnimationFrame(loop);
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
      if (reduce) snap();
      draw();
      play();
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || reduce || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      mouse.target = inside ? 1 : 0;
      if (inside) {
        mouse.x = (event.clientX - rect.left) / rect.width;
        mouse.y = (event.clientY - rect.top) / rect.height;
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
    snap();
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
  }, [centerX, centerY, repeat, angle, rotation, radius, ring, falloff, blur, twist, core, breathe, saturation, grain, grainSize, grainMotion, interactive, paused]);

  // A CSS conic sweep under a radial fade, shown only without WebGL
  const reps = Math.round(clamp(repeat, 1, 6));
  const stops = Array.from({ length: reps }, () => list.join(", ")).join(", ");
  const at = `${clamp(centerX, 0, 1) * 100}% ${clamp(centerY, 0, 1) * 100}%`;
  const reach = `${clamp(radius, 0.1, 2) * 100}vmin`;
  const fallback = `radial-gradient(circle ${reach} at ${at}, transparent 20%, ${backgroundColor} 100%), conic-gradient(from ${angle}deg at ${at}, ${stops}, ${list[0]})`;

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
