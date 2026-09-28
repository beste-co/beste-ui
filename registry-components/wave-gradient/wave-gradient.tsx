"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface WaveGradientProps {
  /** The colors of the bands, bottom to top, 1 to 6. Any CSS color, tokens included. They repeat when there are more bands. */
  colors?: string[];
  /** Tilt of the bands in degrees; 0 runs them level, positive tilts them up to the right. */
  angle?: number;
  /** How many color bands stack across the frame, 2 to 9. */
  bands?: number;
  /** Height of the waves, 0 (flat stripes) to 1 (tall swells). */
  amplitude?: number;
  /** How tightly the waves undulate, 0 (long rollers) to 1 (short ripples). */
  frequency?: number;
  /** How fast the waves roll, 0 (still) to 3. */
  speed?: number;
  /** How softly one band melts into the next, 0 (crisp edge) to 1 (haze). */
  softness?: number;
  /** Soft light along the crest of every band, 0 to 1. */
  glow?: number;
  /** Shade under each band's edge, so the ribbons read as layered, 0 (flat) to 1. */
  depth?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). 1 keeps the colors as given. */
  saturation?: number;
  /** Film grain over the gradient, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors`, or of the wave shape, takes to ease through. 0 swaps at once. */
  transition?: number;
  /** Picks a different phase for every wave. */
  seed?: number;
  /** The bands lift into a soft swell under the cursor. */
  interactive?: boolean;
  /** Hold the waves still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const waveGradientDemo: WaveGradientProps = {
  colors: ["#0b1026", "#3b2bb5", "#ff5e8a", "#ffb86b", "#7de2ff", "#f6f1ff"],
  angle: -12,
  bands: 6,
  amplitude: 0.55,
  frequency: 0.45,
  speed: 1,
  softness: 0.35,
  glow: 0.4,
  depth: 0.5,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  seed: 2,
  interactive: true,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#0b1026", "#3b2bb5", "#ff5e8a", "#ffb86b", "#7de2ff", "#f6f1ff"];
const SLOTS = 6;
const MAX_BANDS = 9;
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
uniform float uAngle;
uniform float uBands;
uniform float uAmp;
uniform float uFreq;
uniform float uSoft;
uniform float uGlow;
uniform float uDepth;
uniform float uSaturation;
uniform float uGrain;
uniform float uGrainSize;
uniform float uGrainTime;
uniform float uSeed;
uniform vec3 uMouse;
uniform float uIntro;

float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
vec3 slot(int i){
  if(i==0)return uColors[0];
  if(i==1)return uColors[1];
  if(i==2)return uColors[2];
  if(i==3)return uColors[3];
  if(i==4)return uColors[4];
  return uColors[5];
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
  vec2 q=(gl_FragCoord.xy/uRes-.5)*vec2(aspect,1.);
  float ca=cos(uAngle);float sa=sin(uAngle);
  vec2 p=vec2(q.x*ca+q.y*sa,-q.x*sa+q.y*ca);
  vec2 m=vec2(uMouse.x*ca+uMouse.y*sa,-uMouse.x*sa+uMouse.y*ca);
  // Half the frame's extent across the bands, so they always fill it at any angle
  float ext=.5*(abs(sa)*aspect+abs(ca))+.04;
  float t=uTime;
  float soft=mix(.003,.14,uSoft);
  vec2 dm=p-m;
  float swell=uMouse.z*.1*exp(-dot(dm,dm)*7.);
  vec3 lab=slot(0);
  float light=0.;
  for(int k=0;k<${MAX_BANDS - 1};k++){
    float fk=float(k);
    if(fk>=uBands-1.)break;
    float ph=uSeed*1.37+fk*2.13;
    float f=(.6+uFreq*3.4)*(1.+.28*sin(fk*1.7+uSeed));
    float wave=sin(p.x*f+t*(.42+.11*fk)+ph)*.62+sin(p.x*f*1.87-t*(.29+.07*fk)+ph*1.7)*.38;
    float base=mix(-ext,ext,(fk+1.)/uBands);
    float d=p.y-(base+wave*uAmp*uIntro*ext*.55/uBands*3.+swell);
    float s=smoothstep(-soft,soft,d);
    vec3 next=slot(int(mod(fk+1.,${SLOTS}.)));
    lab=mix(lab,next,s);
    // Shade just above each edge, and a crest of light on it
    lab.x*=1.-uDepth*.32*exp(-max(d,0.)*10.)*s;
    light+=exp(-abs(d)/(soft+.012)*2.2)*(.6+.4*sin(p.x*f*.5+t*.6+ph));
  }
  lab.x+=light*uGlow*.12;
  lab.yz*=uSaturation*(1.-min(light*uGlow*.25,.4));
  vec3 col=toSrgb(lab);
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=g*uGrain*.2;
  // The intro raises the bands, grain included, out of the flat first color
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

// Colors blend in Oklab, so the seam between two bands stays bright instead of going muddy
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

type Shape = { angle: number; amplitude: number; frequency: number; softness: number; glow: number; depth: number; saturation: number };

export function WaveGradient({
  colors = DEFAULT_COLORS,
  angle = -12,
  bands = 6,
  amplitude = 0.55,
  frequency = 0.45,
  speed = 1,
  softness = 0.35,
  glow = 0.4,
  depth = 0.5,
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
}: WaveGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = list.join("|");
  const settings = useRef({ colors: list, angle, bands, amplitude, frequency, speed, softness, glow, depth, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused });
  settings.current = { colors: list, angle, bands, amplitude, frequency, speed, softness, glow, depth, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
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
      angle: at("uAngle"),
      bands: at("uBands"),
      amp: at("uAmp"),
      freq: at("uFreq"),
      soft: at("uSoft"),
      glow: at("uGlow"),
      depth: at("uDepth"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      mouse: at("uMouse"),
      intro: at("uIntro"),
    };

    // Six color slots; a shorter palette repeats around them so any two palettes can fade into each other
    const shown = new Float32Array(SLOTS * 3);
    let from = new Float32Array(SLOTS * 3);
    let to = new Float32Array(SLOTS * 3);
    let fadeStart = 0;
    let fadeLength = 0;
    let fading = false;
    let colored = false;

    // The wave shape eases toward its props too, so a hero can swap settings without a jump
    const target = (): Shape => {
      const s = settings.current;
      return {
        angle: (s.angle * Math.PI) / 180,
        amplitude: clamp(s.amplitude, 0, 1),
        frequency: clamp(s.frequency, 0, 1),
        softness: clamp(s.softness, 0, 1),
        glow: clamp(s.glow, 0, 1),
        depth: clamp(s.depth, 0, 1),
        saturation: clamp(s.saturation, 0, 2),
      };
    };
    const shape: Shape = target();
    const shapeKeys = Object.keys(shape) as (keyof Shape)[];

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
      const next = new Float32Array(SLOTS * 3);
      const labs = s.colors.map((color) => toOklab(resolveColor(root, color)));
      for (let i = 0; i < SLOTS; i++) next.set(labs[i % labs.length] ?? [0, 0, 0], i * 3);
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

    // Moves the shape toward its props; returns whether anything is still on its way
    const ease = (delta: number) => {
      const goal = target();
      const s = settings.current;
      const snap = reduce || s.transition <= 0;
      const k = snap ? 1 : 1 - Math.exp(-delta / 1000 / Math.max(0.05, s.transition * 0.3));
      let busy = false;
      for (const key of shapeKeys) {
        const gap = goal[key] - shape[key];
        shape[key] += gap * k;
        if (Math.abs(gap) > 0.001) busy = true;
      }
      return busy && !snap;
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
      gl.uniform1f(u.time, time + s.seed * 5.17);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown);
      gl.uniform1f(u.angle, shape.angle);
      gl.uniform1f(u.bands, Math.round(clamp(s.bands, 2, MAX_BANDS)));
      gl.uniform1f(u.amp, shape.amplitude);
      gl.uniform1f(u.freq, shape.frequency);
      gl.uniform1f(u.soft, shape.softness);
      gl.uniform1f(u.glow, shape.glow);
      gl.uniform1f(u.depth, shape.depth);
      gl.uniform1f(u.saturation, shape.saturation);
      gl.uniform1f(u.grain, clamp(s.grain, 0, 1));
      gl.uniform1f(u.grainSize, clamp(s.grainSize, 1, 4));
      gl.uniform1f(u.grainTime, s.grainMotion && !reduce && !s.paused ? Math.floor(performance.now() / 42) % 4096 : 0);
      gl.uniform1f(u.seed, s.seed);
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
      const shaping = ease(delta);
      mouse.power += (mouse.target - mouse.power) * 0.05;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      draw();
      const easing = Math.abs(mouse.target - mouse.power) > 0.002 || (mouse.power > 0.01 && Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > 0.001);
      const grainOnly = s.grainMotion && s.grain > 0 && !reduce && !s.paused;
      if (moving() || fading || shaping || easing || grainOnly || intro < 1) frame = requestAnimationFrame(loop);
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
      if (reduce) ease(0);
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
  }, [angle, bands, amplitude, frequency, speed, softness, glow, depth, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // A plain stepped linear gradient in the same colors, shown only without WebGL
  const count = Math.round(clamp(bands, 2, MAX_BANDS));
  const stops = Array.from({ length: count }, (_, index) => {
    const color = list[index % list.length] ?? list[0];
    return `${color} ${Math.round((index / (count - 1)) * 100)}%`;
  }).join(", ");

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: list[0] }}>
      {failed ? (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(${-angle}deg, ${stops})` }} />
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
