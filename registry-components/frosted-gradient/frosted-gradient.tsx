"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface FrostedGradientProps {
  /** Colors of the shapes behind the glass, 1 to 6. Any CSS color, tokens included. */
  colors?: string[];
  /** Color seen through the glass between the shapes, and the frame the intro grows out of. */
  backgroundColor?: string;
  /** Shapes drifting behind the glass, 1 to 8. Even ones are round, odd ones are soft bars. */
  shapes?: number;
  /** Size of the shapes, 0.5 to 2. */
  size?: number;
  /** How far the glass softens the shapes, 0 (nearly clear) to 1 (deep haze). */
  blur?: number;
  /** Sandblasted texture of the glass, 0 (smooth) to 1 (coarse). */
  frost?: number;
  /** Refraction and a thin highlight along the edges of the pane, 0 to 1. */
  bevel?: number;
  /** Vertical flutes pressed into the glass. 0 keeps it flat; 4 to 40 sets how many span the frame. */
  flutes?: number;
  /** How fast the shapes drift, 0 (still) to 3. */
  speed?: number;
  /** Color intensity, 0 (grey) to 2 (vivid). 1 keeps the colors as given. */
  saturation?: number;
  /** Film grain over the glass, 0 to 1. */
  grain?: number;
  /** Size of one grain in CSS pixels, 1 to 4. */
  grainSize?: number;
  /** Let the grain flicker like film instead of holding still. */
  grainMotion?: boolean;
  /** Seconds a change of `colors` or `backgroundColor` takes to fade through. 0 swaps at once. */
  transition?: number;
  /** Picks a different arrangement of the shapes. */
  seed?: number;
  /** The first shape drifts after the cursor behind the glass. */
  interactive?: boolean;
  /** Hold the shapes still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const frostedGradientDemo: FrostedGradientProps = {
  colors: ["#ff6b4a", "#ffc75f", "#4d7cff", "#b28dff", "#1fc8a9", "#ff8fc7"],
  backgroundColor: "var(--background)",
  shapes: 6,
  size: 1,
  blur: 0.6,
  frost: 0.5,
  bevel: 0.5,
  flutes: 0,
  speed: 1,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  seed: 1,
  interactive: true,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#ff6b4a", "#ffc75f", "#4d7cff", "#b28dff", "#1fc8a9", "#ff8fc7"];
const POINTS = 6;
const MAX_SHAPES = 8;
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
uniform vec3 uBg;
uniform float uCount;
uniform float uSize;
uniform float uBlur;
uniform float uFrost;
uniform float uBevel;
uniform float uFlutes;
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
vec3 toSrgb(vec3 c){
  float l=c.x+.3963377774*c.y+.2158037573*c.z;
  float m=c.x-.1055613458*c.y-.0638541728*c.z;
  float s=c.x-.0894841775*c.y-1.291485548*c.z;
  l=l*l*l;m=m*m*m;s=s*s*s;
  vec3 lin=clamp(vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s),0.,1.);
  return mix(lin*12.92,1.055*pow(lin,vec3(1./2.4))-.055,step(.0031308,lin));
}
vec3 paletteAt(float k){
  vec3 c=uColors[0];
  for(int j=0;j<${POINTS};j++){if(float(j)==k)c=uColors[j];}
  return c;
}
float capsule(vec2 p,vec2 a,vec2 b,float r){
  vec2 pa=p-a;vec2 ba=b-a;
  float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  return length(pa-ba*h)-r;
}
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(uv-.5)*vec2(aspect,1.);
  // Distance to the nearest edge of the pane, in frame heights
  float dx=min(uv.x,1.-uv.x)*aspect;
  float dy=min(uv.y,1.-uv.y);
  float edge=min(dx,dy);
  vec2 inward=dx<dy?vec2(uv.x<.5?1.:-1.,0.):vec2(0.,uv.y<.5?1.:-1.);
  p+=inward*uBevel*.06*exp(-edge/.045)*uIntro;
  float fl=0.;
  if(uFlutes>.5){
    fl=fract(uv.x*uFlutes);
    p.x+=(fl-.5)*.09*(1./max(uFlutes*.1,1.));
  }
  // Sandblasted glass scatters each pixel's view a little
  vec2 cell=floor(gl_FragCoord.xy/uPixel);
  p+=(vec2(hash(cell),hash(cell+19.7))-.5)*uFrost*.045;
  float t=uTime;
  float soft=.015+uBlur*.3;
  vec3 lab=uBg;
  for(int i=0;i<${MAX_SHAPES};i++){
    float fi=float(i);
    if(fi>=uCount)break;
    float a=uSeed*2.1+fi*2.39996;
    vec2 home=vec2(cos(a),sin(a))*(.12+.3*fract(fi*.618+uSeed*.21))*vec2(max(aspect,1.)*.95,.95);
    vec2 pos=home+vec2(sin(t*(.55+fi*.07)+a*2.),cos(t*(.47+fi*.08)+a*3.))*.24;
    if(i==0)pos=mix(pos,uMouse.xy,uMouse.z*.85);
    float r=(.13+.1*fract(fi*.37+uSeed*.53))*uSize*mix(.35,1.,uIntro)*(1.+.12*sin(t*.8+fi*1.7));
    float d;
    if(mod(fi,2.)<.5){
      d=length(p-pos)-r;
    }else{
      float ang=a+t*.2*(mod(fi,4.)<1.5?1.:-1.);
      vec2 dir=vec2(cos(ang),sin(ang))*r*1.5;
      d=capsule(p,pos-dir,pos+dir,r*.42);
    }
    float cover=1.-smoothstep(-soft,soft,d);
    lab=mix(lab,paletteAt(mod(fi,${POINTS}.)),cover*.92*uIntro);
  }
  lab.yz*=uSaturation;
  // Static frosted tooth, a soft rim shadow and a thin highlight on the upper left edges
  float tooth=noise(gl_FragCoord.xy/(uPixel*1.5))+noise(gl_FragCoord.xy/(uPixel*4.)+7.)*.6-.8;
  lab.x+=tooth*uFrost*.03;
  lab.x-=uBevel*.05*exp(-edge/.03);
  float lit=dx<dy?(uv.x<.5?1.:.35):(uv.y>.5?1.:.35);
  lab.x+=uBevel*.16*exp(-edge/.006)*lit;
  if(uFlutes>.5)lab.x+=(.25-abs(fl-.5))*.08-(1.-smoothstep(0.,.06,fl))*.03;
  vec3 col=toSrgb(lab);
  vec2 gcell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(gcell+jitter)+hash(gcell.yx+jitter.yx+71.)-1.;
  col+=g*uGrain*.2;
  // The intro grows the shapes, the glass and the grain out of the flat background
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

export function FrostedGradient({
  colors = DEFAULT_COLORS,
  backgroundColor = "var(--background)",
  shapes = 6,
  size = 1,
  blur = 0.6,
  frost = 0.5,
  bevel = 0.5,
  flutes = 0,
  speed = 1,
  saturation = 1,
  grain = 0.2,
  grainSize = 1,
  grainMotion = true,
  transition = 1.2,
  seed = 1,
  interactive = true,
  paused = false,
  className,
  children,
}: FrostedGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  // Bumped when the browser drops the context (too many on the page), so a fresh canvas takes a new one
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${backgroundColor}`;
  const current = { colors: list, backgroundColor, shapes, size, blur, frost, bevel, flutes, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
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
      bg: at("uBg"),
      count: at("uCount"),
      size: at("uSize"),
      blur: at("uBlur"),
      frost: at("uFrost"),
      bevel: at("uBevel"),
      flutes: at("uFlutes"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      mouse: at("uMouse"),
      intro: at("uIntro"),
    };

    // Six color slots plus the background, faded together so a new palette never snaps
    const SLOTS = (POINTS + 1) * 3;
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
      for (let i = 0; i < POINTS; i++) next.set(labs[i % labs.length] ?? [0, 0, 0], i * 3);
      next.set(toOklab(resolveColor(root, s.backgroundColor)), POINTS * 3);
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
      gl.uniform1f(u.time, time + s.seed * 5.3);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown.subarray(0, POINTS * 3));
      gl.uniform3fv(u.bg, shown.subarray(POINTS * 3));
      gl.uniform1f(u.count, Math.round(clamp(s.shapes, 1, MAX_SHAPES)));
      gl.uniform1f(u.size, clamp(s.size, 0.5, 2));
      gl.uniform1f(u.blur, clamp(s.blur, 0, 1));
      gl.uniform1f(u.frost, clamp(s.frost, 0, 1));
      gl.uniform1f(u.bevel, clamp(s.bevel, 0, 1));
      gl.uniform1f(u.flutes, s.flutes >= 1 ? Math.round(clamp(s.flutes, 4, 40)) : 0);
      gl.uniform1f(u.saturation, clamp(s.saturation, 0, 2));
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
      // Slow easing, so the shape glides after the cursor like something behind thick glass
      mouse.power += (mouse.target - mouse.power) * 0.04;
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
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
        if (mouse.power < 0.01) {
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
      if (attempt < 3) setAttempt(attempt + 1);
      else setFailed(true);
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
  }, [reduce, attempt]);

  useEffect(() => {
    refresh.current(true);
  }, [colorKey]);

  useEffect(() => {
    refresh.current(false);
  }, [shapes, size, blur, frost, bevel, flutes, speed, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // Soft blurred pools of the same colors, shown only without WebGL
  const spots = ["22% 30%", "74% 26%", "62% 74%", "28% 76%", "50% 50%", "86% 60%"];
  const fallback = list
    .map((color, index) => `radial-gradient(34% 40% at ${spots[index % spots.length]}, ${color} 0%, transparent 72%)`)
    .join(", ");

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor }}>
      {failed ? (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: fallback }} />
      ) : (
        <canvas
          key={attempt}
          ref={canvasRef}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 size-full transition-opacity duration-300", ready ? "opacity-100" : "opacity-0")}
        />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
