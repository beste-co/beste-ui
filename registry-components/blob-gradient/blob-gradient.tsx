"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface BlobGradientProps {
  /** Blob colors, 1 to 6. Any CSS color, tokens included. Blobs take them in turn. */
  colors?: string[];
  /** Color behind the blobs. */
  backgroundColor?: string;
  /** How many blobs float in the field, 1 to 10. Changes grow and shrink blobs in. */
  count?: number;
  /** Blob size, 0.5 to 2. */
  size?: number;
  /** Edge of the blobs, 0 (soft glowing orbs) to 1 (crisp liquid). */
  goo?: number;
  /** Halo around the blobs and light along their edges, 0 to 1. */
  glow?: number;
  /** How fast the blobs move, 0 (still) to 3. */
  speed?: number;
  /** 0 lets the blobs float freely, 1 makes them rise and sink like a lava lamp. */
  rise?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). 1 keeps the colors as given. */
  saturation?: number;
  /** Film grain over the field, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` or `backgroundColor` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** Picks a different set of blob sizes and paths. */
  seed?: number;
  /** The cursor becomes one more blob that merges with the others. */
  interactive?: boolean;
  /** Size of the cursor blob, 0.5 to 2. */
  cursorSize?: number;
  /** Hold the blobs still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const blobGradientDemo: BlobGradientProps = {
  colors: ["#ff5a36", "#ff9d2e", "#ff3d7f", "#ffd166"],
  backgroundColor: "#2a0f3d",
  count: 7,
  size: 1,
  goo: 0.6,
  glow: 0.5,
  speed: 1,
  rise: 0.7,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  seed: 2,
  interactive: true,
  cursorSize: 1,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#ff5a36", "#ff9d2e", "#ff3d7f", "#ffd166"];
const DEFAULT_BACKGROUND = "#2a0f3d";
const SLOTS = 6;
const MAX = 10;
const INTRO_MS = 2400;

const vertex = `
attribute vec2 aPos;
void main(){gl_Position=vec4(aPos,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uPixel;
uniform vec3 uBlob[${MAX}];
uniform vec3 uCursorColor;
uniform vec3 uBg;
uniform float uCount;
uniform float uSize;
uniform float uGoo;
uniform float uGlow;
uniform float uRise;
uniform float uSaturation;
uniform float uGrain;
uniform float uGrainSize;
uniform float uGrainTime;
uniform float uSeed;
uniform vec4 uMouse;
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
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 q=(gl_FragCoord.xy/uRes-.5)*vec2(aspect,1.);
  float t=uTime;
  float field=0.;
  vec3 tint=vec3(0.);
  float weight=0.;
  for(int i=0;i<${MAX};i++){
    float fi=float(i);
    // Blobs past the count shrink away, so a changing count grows them in and out
    float present=clamp(uCount-fi,0.,1.);
    if(present<=0.)break;
    float h1=hash(vec2(fi*7.13+uSeed,uSeed*3.1+1.7));
    float h2=hash(vec2(fi*3.71+uSeed*1.3,9.2));
    float h3=hash(vec2(fi*1.93,uSeed+4.4));
    float rb=uSize*(.09+.09*h1);
    float r=rb*(1.+.08*sin(t*(.6+h2)+fi))*present;
    vec2 roam=vec2(sin(t*(.13+.09*h2)+h1*6.28)*(.5*aspect-.05),cos(t*(.11+.08*h3)+h2*6.28)*.42);
    // Lamp mode: half the blobs rise and half sink, wrapping far enough offscreen that the jump never shows
    float span=1.+rb*10.;
    float dir=h2>.5?1.:-1.;
    float lift=mod(h3*span+t*(.035+.03*h1)*dir,span)-span*.5;
    vec2 lamp=vec2((h1-.5)*aspect*.8+sin(t*.23+fi*1.7)*.08,lift);
    r*=mix(1.,smoothstep(span*.5,span*.5-rb*3.,abs(lift)),uRise);
    r*=uIntro;
    vec2 p=mix(roam,lamp,uRise);
    vec2 d=q-p;
    float f=r*r/(dot(d,d)+1e-5);
    field+=f;
    float w=f*f;
    tint+=uBlob[i]*w;
    weight+=w;
  }
  vec2 dm=q-uMouse.xy;
  float rc=.12*uMouse.w*uMouse.z*uIntro;
  float fc=rc*rc/(dot(dm,dm)+1e-5);
  field+=fc;
  tint+=uCursorColor*fc*fc*.6;
  weight+=fc*fc*.6;
  vec3 blob=tint/max(weight,1e-6);
  float soft=mix(.95,.015,uGoo);
  float body=smoothstep(1.-soft,1.+soft,field);
  float halo=uGlow*.45*smoothstep(0.,1.,field)*(1.-body);
  float rim=uGlow*body*(1.-smoothstep(1.,1.8+soft*2.,field));
  vec3 lab=mix(uBg,blob,clamp(body+halo,0.,1.));
  lab.x+=rim*.1;
  lab.yz*=uSaturation;
  vec3 col=toSrgb(lab);
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=g*uGrain*.2;
  // The intro grows the blobs, glow and grain out of the flat background
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

// Colors blend in Oklab, so where two blobs merge the mix stays bright instead of going muddy
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

export function BlobGradient({
  colors = DEFAULT_COLORS,
  backgroundColor = DEFAULT_BACKGROUND,
  count = 7,
  size = 1,
  goo = 0.6,
  glow = 0.5,
  speed = 1,
  rise = 0.7,
  saturation = 1,
  grain = 0.2,
  grainSize = 1,
  grainMotion = true,
  transition = 1.2,
  seed = 2,
  interactive = true,
  cursorSize = 1,
  paused = false,
  className,
  children,
}: BlobGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${backgroundColor}`;
  const settings = useRef({ colors: list, backgroundColor, count, size, goo, glow, speed, rise, saturation, grain, grainSize, grainMotion, transition, seed, interactive, cursorSize, paused });
  settings.current = { colors: list, backgroundColor, count, size, goo, glow, speed, rise, saturation, grain, grainSize, grainMotion, transition, seed, interactive, cursorSize, paused };
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
      blob: at("uBlob[0]"),
      cursorColor: at("uCursorColor"),
      bg: at("uBg"),
      count: at("uCount"),
      size: at("uSize"),
      goo: at("uGoo"),
      glow: at("uGlow"),
      rise: at("uRise"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      mouse: at("uMouse"),
      intro: at("uIntro"),
    };

    // Six palette slots plus the background; a shorter palette repeats so any two can fade into each other
    const LENGTH = (SLOTS + 1) * 3;
    const shown = new Float32Array(LENGTH);
    let from = new Float32Array(LENGTH);
    let to = new Float32Array(LENGTH);
    const blobs = new Float32Array(MAX * 3);
    let fadeStart = 0;
    let fadeLength = 0;
    let fading = false;
    let colored = false;
    let shownCount = clamp(settings.current.count, 1, MAX);

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
    const targetCount = () => clamp(Math.round(settings.current.count), 1, MAX);

    const recolor = () => {
      const s = settings.current;
      const next = new Float32Array(LENGTH);
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
      for (let i = 0; i < MAX; i++) blobs.set(shown.subarray((i % SLOTS) * 3, (i % SLOTS) * 3 + 3), i * 3);
      const cursorSlot = (Math.round(shownCount) % SLOTS) * 3;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, time + s.seed * 11.7);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.blob, blobs);
      gl.uniform3f(u.cursorColor, shown[cursorSlot] ?? 0, shown[cursorSlot + 1] ?? 0, shown[cursorSlot + 2] ?? 0);
      gl.uniform3f(u.bg, shown[SLOTS * 3] ?? 0, shown[SLOTS * 3 + 1] ?? 0, shown[SLOTS * 3 + 2] ?? 0);
      gl.uniform1f(u.count, shownCount);
      gl.uniform1f(u.size, clamp(s.size, 0.5, 2));
      gl.uniform1f(u.goo, clamp(s.goo, 0, 1));
      gl.uniform1f(u.glow, clamp(s.glow, 0, 1));
      gl.uniform1f(u.rise, clamp(s.rise, 0, 1));
      gl.uniform1f(u.saturation, clamp(s.saturation, 0, 2));
      gl.uniform1f(u.grain, clamp(s.grain, 0, 1));
      gl.uniform1f(u.grainSize, clamp(s.grainSize, 1, 4));
      gl.uniform1f(u.grainTime, s.grainMotion && !reduce && !s.paused ? Math.floor(performance.now() / 42) % 4096 : 0);
      gl.uniform1f(u.seed, s.seed);
      gl.uniform4f(u.mouse, mouse.x, mouse.y, mouse.power, clamp(s.cursorSize, 0.5, 2));
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
      const goal = targetCount();
      shownCount += (goal - shownCount) * Math.min(1, delta / 400);
      if (Math.abs(goal - shownCount) < 0.002) shownCount = goal;
      mouse.power += (mouse.target - mouse.power) * 0.06;
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      draw();
      const easing =
        Math.abs(mouse.target - mouse.power) > 0.002 ||
        (mouse.power > 0.01 && Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > 0.001) ||
        shownCount !== goal;
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
      if (reduce) shownCount = targetCount();
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
        // The cursor blob grows in where the pointer enters instead of sliding over from the last spot
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
  }, [count, size, goo, glow, speed, rise, saturation, grain, grainSize, grainMotion, seed, interactive, cursorSize, paused]);

  // Soft glowing pools of the blob colors, shown only without WebGL
  const spots = ["30% 70%", "68% 35%", "50% 85%", "20% 25%", "80% 75%", "55% 15%"];
  const fallback = list.map((color, index) => `radial-gradient(22% 30% at ${spots[index % spots.length]}, ${color} 0%, transparent 100%)`).join(", ");

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
