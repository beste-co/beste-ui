"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface MosaicGradientProps {
  /** Colors of the gradient flowing under the tiles, 1 to 6. Any CSS color, tokens included. */
  colors?: string[];
  /** Color of the grout between the tiles; also the wrapper background. */
  backgroundColor?: string;
  /** Tiles across the width, 4 to 80. Rows follow so the tiles stay square. */
  cells?: number;
  /** Width of the gap between tiles as a share of a tile, 0 to 0.5. */
  gap?: number;
  /** Tile rounding, 0 (square) to 1 (round). */
  radius?: number;
  /** Each tile's own slow glint, 0 to 1. */
  shimmer?: number;
  /** Bevel and shadow that make the tiles read as raised, 0 (flat) to 1. */
  depth?: number;
  /** Strength of the slow light waves passing across the grid, 0 to 1. */
  wave?: number;
  /** How fast the gradient flows and the waves pass, 0 (still) to 3. */
  speed?: number;
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
  /** Picks a different arrangement of the gradient and the glints. */
  seed?: number;
  /** Tiles near the cursor lift and brighten softly. */
  interactive?: boolean;
  /** Hold the gradient still. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const mosaicGradientDemo: MosaicGradientProps = {
  colors: ["#0f3b5f", "#1f7a8c", "#58b4ae", "#f2c14e", "#e76f51", "#f7ede2"],
  backgroundColor: "#12100e",
  cells: 24,
  gap: 0.14,
  radius: 0.35,
  shimmer: 0.4,
  depth: 0.5,
  wave: 0.5,
  speed: 1,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  transition: 1.2,
  seed: 3,
  interactive: true,
  className: "min-h-[32rem]",
};

const DEFAULT_COLORS = ["#0f3b5f", "#1f7a8c", "#58b4ae", "#f2c14e", "#e76f51", "#f7ede2"];
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
uniform vec3 uBg;
uniform float uCell;
uniform float uGap;
uniform float uRadius;
uniform float uShimmer;
uniform float uDepth;
uniform float uWave;
uniform float uSaturation;
uniform float uGrain;
uniform float uGrainSize;
uniform float uGrainTime;
uniform float uSeed;
uniform float uIntro;
uniform vec3 uMouse;

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
// The flowing gradient under the tiles: six drifting color points after a soft warp
vec3 field(vec2 q,float t){
  q+=(vec2(fbm(q*1.4+vec2(t*.06,-t*.05)+uSeed),fbm(q*1.4+vec2(5.2,1.3)-t*.05+uSeed))-.5)*.6;
  vec3 sum=vec3(0.);
  float total=0.;
  for(int i=0;i<${POINTS};i++){
    float fi=float(i);
    float a=uSeed*1.7+fi*2.39996;
    float reach=.18+.34*fract(fi*.618+uSeed*.137);
    vec2 home=vec2(cos(a),sin(a))*reach*vec2(max(uRes.x/uRes.y,1.)*.9,.9);
    vec2 drift=vec2(sin(t*(.31+fi*.07)+a*3.),cos(t*(.27+fi*.05)+a*2.))*.22;
    vec2 d=q-home-drift;
    float w=1./(pow(dot(d,d),2.2)+1e-4);
    sum+=uColors[i]*w;
    total+=w;
  }
  return sum/total;
}
float box(vec2 p,float h,float r){
  vec2 q=abs(p)-vec2(h-r);
  return length(max(q,0.))+min(max(q.x,q.y),0.)-r;
}
void main(){
  float t=uTime;
  vec2 cp=gl_FragCoord.xy/uCell;
  vec2 id=floor(cp);
  vec2 f=fract(cp)-.5;
  vec2 centerPx=(id+.5)*uCell;
  vec2 uv=centerPx/uRes;
  vec2 q=(uv-.5)*vec2(uRes.x/uRes.y,1.);
  float h=hash(id+uSeed*7.);
  // Each tile arrives on its own beat, from the center outward with a little jitter
  float delay=clamp(length(uv-.5)*1.1+h*.25,0.,1.);
  float arrive=smoothstep(delay*.5,delay*.5+.5,uIntro);
  float wv=pow(sin(dot(q,vec2(.8,.6))*4.2-t*1.1)*.5+.5,3.)*uWave;
  vec2 dm=(centerPx-uMouse.xy)/(uCell*3.5);
  float near=exp(-dot(dm,dm))*uMouse.z;
  float scale=arrive*(1.+wv*.05*uDepth+near*.12);
  float hs=max(.5-uGap*.5,.02)*scale;
  float r=clamp(uRadius,0.,1.)*hs;
  float aa=1./uCell;
  float sd=box(f,hs,r);
  float cover=smoothstep(aa,-aa,sd);
  vec3 lab=field(q,t);
  float glint=sin(t*1.6+h*6.2831)*.5+.5;
  lab.x+=(glint-.5)*.07*uShimmer+wv*.06+near*.07;
  float edge=1.-clamp(-sd/(hs*.45+1e-3),0.,1.);
  float lit=dot(normalize(f+1e-5),vec2(-.6,.8));
  lab.x+=edge*(lit*.08-.025)*uDepth;
  lab.yz*=uSaturation;
  // A soft shadow falls down and to the right into the grout
  float shade=smoothstep(.1,-.04,box(f-vec2(.05,-.07)*uDepth*scale,hs,r))*.35*uDepth*arrive;
  vec3 grout=uBg;
  grout.x*=1.-shade;
  vec3 col=toSrgb(mix(grout,lab,cover));
  vec2 cell=floor(gl_FragCoord.xy/(uPixel*uGrainSize));
  vec2 jitter=floor(fract(uGrainTime*vec2(.1731,.3197))*512.);
  float g=hash(cell+jitter)+hash(cell.yx+jitter.yx+71.)-1.;
  col+=g*uGrain*.2;
  // The intro grows every tile, its glints and the grain out of the flat grout color
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
  const given = (colors ?? []).filter(Boolean).slice(0, POINTS);
  return given.length > 0 ? given : DEFAULT_COLORS;
};

export function MosaicGradient({
  colors = DEFAULT_COLORS,
  backgroundColor = "#12100e",
  cells = 24,
  gap = 0.14,
  radius = 0.35,
  shimmer = 0.4,
  depth = 0.5,
  wave = 0.5,
  speed = 1,
  saturation = 1,
  grain = 0.2,
  grainSize = 1,
  grainMotion = true,
  transition = 1.2,
  seed = 3,
  interactive = true,
  paused = false,
  className,
  children,
}: MosaicGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const list = palette(colors);
  const colorKey = `${list.join("|")}|${backgroundColor}`;
  const settings = useRef({ colors: list, backgroundColor, cells, gap, radius, shimmer, depth, wave, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused });
  settings.current = { colors: list, backgroundColor, cells, gap, radius, shimmer, depth, wave, speed, saturation, grain, grainSize, grainMotion, transition, seed, interactive, paused };
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
      cell: at("uCell"),
      gap: at("uGap"),
      radius: at("uRadius"),
      shimmer: at("uShimmer"),
      depth: at("uDepth"),
      wave: at("uWave"),
      saturation: at("uSaturation"),
      grain: at("uGrain"),
      grainSize: at("uGrainSize"),
      grainTime: at("uGrainTime"),
      seed: at("uSeed"),
      intro: at("uIntro"),
      mouse: at("uMouse"),
    };

    // Six color slots plus the grout, faded together in Oklab; a shorter palette repeats around the slots
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
      gl.uniform1f(u.time, time + s.seed * 7.31);
      gl.uniform1f(u.pixel, pixel);
      gl.uniform3fv(u.colors, shown.subarray(0, POINTS * 3));
      gl.uniform3f(u.bg, shown[POINTS * 3] ?? 0, shown[POINTS * 3 + 1] ?? 0, shown[POINTS * 3 + 2] ?? 0);
      gl.uniform1f(u.cell, canvas.width / clamp(Math.round(s.cells), 4, 80));
      gl.uniform1f(u.gap, clamp(s.gap, 0, 0.5));
      gl.uniform1f(u.radius, clamp(s.radius, 0, 1));
      gl.uniform1f(u.shimmer, clamp(s.shimmer, 0, 1));
      gl.uniform1f(u.depth, clamp(s.depth, 0, 1));
      gl.uniform1f(u.wave, clamp(s.wave, 0, 1));
      gl.uniform1f(u.saturation, clamp(s.saturation, 0, 2));
      gl.uniform1f(u.grain, clamp(s.grain, 0, 1));
      gl.uniform1f(u.grainSize, clamp(s.grainSize, 1, 4));
      gl.uniform1f(u.grainTime, s.grainMotion && !reduce && !s.paused ? Math.floor(performance.now() / 42) % 4096 : 0);
      gl.uniform1f(u.seed, s.seed);
      gl.uniform1f(u.intro, intro);
      gl.uniform3f(u.mouse, mouse.x * canvas.width, mouse.y * canvas.height, mouse.power);
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
      mouse.power += (mouse.target - mouse.power) * 0.06;
      mouse.x += (mouse.tx - mouse.x) * 0.1;
      mouse.y += (mouse.ty - mouse.y) * 0.1;
      draw();
      const easing = Math.abs(mouse.target - mouse.power) > 0.002 || (mouse.power > 0.01 && Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > 0.0005);
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
        mouse.tx = (event.clientX - rect.left) / rect.width;
        mouse.ty = 1 - (event.clientY - rect.top) / rect.height;
        // Enter where the cursor is instead of sliding in from the last spot
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
  }, [cells, gap, radius, shimmer, depth, wave, speed, saturation, grain, grainSize, grainMotion, seed, interactive, paused]);

  // A linear blend of the colors, shown only without WebGL
  const fallback = `linear-gradient(135deg, ${list.length > 1 ? list.join(", ") : `${list[0]}, ${list[0]}`})`;

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
