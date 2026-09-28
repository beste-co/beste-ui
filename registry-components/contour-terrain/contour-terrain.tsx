"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface ContourTerrainProps {
  /** Color of the contour lines. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color of the ground between the lines and of the distance haze. */
  paperColor?: string;
  /** Color the highest ground takes on. */
  accentColor?: string;
  /** How strongly the summits take the accent color, 0 to 1. */
  summits?: number;
  /** Number of contour levels from valley floor to peak. */
  lines?: number;
  /** Draw every fifth line heavier, the way survey maps mark index contours. */
  indexLines?: boolean;
  /** Camera angle, 0 (the map seen straight from above) to 1 (the map tilted away into the distance). */
  tilt?: number;
  /** How strongly the slopes are modeled in light and shade, 0 to 1. */
  relief?: number;
  /** How quickly distant ground fades into the paper, 0 to 1. */
  haze?: number;
  /** Light and shadow on the slopes, 0 to 1. */
  shading?: number;
  /** Speed of the slow flight over the land, 1 is the default pace. */
  speed?: number;
  /** The lines swell softly around the cursor, as if under a lens. */
  interactive?: boolean;
  /** Strength of that swell, 0 to 1. */
  pull?: number;
  /** Freeze the land where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const contourTerrainDemo: ContourTerrainProps = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  accentColor: "var(--primary)",
  summits: 0.5,
  lines: 22,
  indexLines: true,
  tilt: 0.35,
  relief: 0.6,
  haze: 0.5,
  shading: 0.5,
  speed: 1,
  interactive: true,
  pull: 0.5,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uPitch;
uniform float uRelief;
uniform float uLines;
uniform float uIndex;
uniform float uHaze;
uniform float uShade;
uniform float uSummit;
uniform vec3 uPointer;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uAccent;
uniform float uIntro;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
vec2 hill;
float ground(vec2 p){
  vec2 q=p*.8+vec2(0.,uTime*.06);
  return .55*noise(q)+.28*noise(q*2.07+vec2(4.1,1.7))+.17*noise(q*4.13+vec2(7.3,2.9));
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  float a=uPitch;
  vec3 ro=vec3(0.,-3.2*cos(a),3.2*sin(a));
  vec3 fw=normalize(-ro);
  vec3 rt=normalize(cross(fw,vec3(0.,0.,1.)));
  vec3 up=cross(rt,fw);
  vec3 rd=normalize(fw*1.5+uv.x*rt+uv.y*up);
  vec3 pr=normalize(fw*1.5+uPointer.x*rt+uPointer.y*up);
  hill=pr.z<-.001?(ro+pr*(-ro.z/pr.z)).xy:vec2(99.);
  // Exact intersection with the ground plane: no marching, so lines never break
  float t=rd.z<-.0005?-ro.z/rd.z:60.;
  t=min(t,60.);
  vec2 p=(ro+rd*t).xy;
  // The cursor bends the existing lines outward like a soft lens instead of raising a peak, so no rings pop in or out
  vec2 d=p-hill;
  p-=d*uPointer.z*.55*exp(-dot(d,d)*1.3);
  // During the intro the land rises out of flat paper, so contour lines multiply as it grows
  float h=ground(p)*mix(.3,1.,uIntro);
  float v=h*uLines;
  float w=max(fwidth(v),1e-4);
  float line=1.-smoothstep(.05,1.05,abs(fract(v-.5)-.5)/w);
  float vi=v*.2;
  float wi=max(fwidth(vi),1e-4);
  float idx=(1.-smoothstep(.5,1.5,abs(fract(vi-.5)-.5)/wi))*uIndex;
  float crowd=1.-smoothstep(.2,.5,w);
  float e=.015;
  vec2 g=vec2(ground(p+vec2(e,0.))-h,ground(p+vec2(0.,e))-h)/e;
  float light=clamp(dot(normalize(vec3(-g*uRelief,1.)),normalize(vec3(-.5,.45,.75))),0.,1.);
  vec3 ink=mix(uInk,uAccent,smoothstep(.75,.95,h)*uSummit);
  vec3 col=mix(uPaper,uInk,(1.-light)*.18*uShade);
  col=mix(col,ink,max(line*.5,idx*.85)*crowd);
  float fog=t>=59.?1.:clamp(1.-exp(-t*t*.01*uHaze),0.,1.);
  gl_FragColor=vec4(mix(uPaper,mix(col,uPaper,fog),uIntro),1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Resolves any CSS color (tokens and oklch included) to 0-1 RGB
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

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const INTRO_MS = 2400;

export function ContourTerrain({
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  accentColor = "var(--primary)",
  summits = 0.5,
  lines = 22,
  indexLines = true,
  tilt = 0.35,
  relief = 0.6,
  haze = 0.5,
  shading = 0.5,
  speed = 1,
  interactive = true,
  pull = 0.5,
  paused = false,
  className,
  children,
}: ContourTerrainProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ inkColor, paperColor, accentColor, summits, lines, indexLines, tilt, relief, haze, shading, speed, interactive, pull, paused });
  settings.current = { inkColor, paperColor, accentColor, summits, lines, indexLines, tilt, relief, haze, shading, speed, interactive, pull, paused };
  const redraw = useRef<(recolor?: boolean) => void>(() => {});

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
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false });
    if (!canvas || !root || !gl || !gl.getExtension("OES_standard_derivatives")) return setFailed(true);
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
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uPitch = u("uPitch");
    const uRelief = u("uRelief");
    const uLines = u("uLines");
    const uIndex = u("uIndex");
    const uHaze = u("uHaze");
    const uShade = u("uShade");
    const uSummit = u("uSummit");
    const uPointer = u("uPointer");
    const uInk = u("uInk");
    const uPaper = u("uPaper");
    const uAccent = u("uAccent");
    const uIntro = u("uIntro");

    const target = { x: 0.3, y: -0.2, lift: 0 };
    const current = { x: 0.3, y: -0.2, lift: 0 };
    let hovering = false;
    let time = 0;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let lastMove = -10000;
    let tick = 0;
    let settled = 0;
    let introStart = 0;
    let intro = reduce ? 1 : 0;

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uInk, ...resolveColor(root, s.inkColor));
      gl.uniform3f(uPaper, ...resolveColor(root, s.paperColor));
      gl.uniform3f(uAccent, ...resolveColor(root, s.accentColor));
    };

    const draw = () => {
      const s = settings.current;
      const still = reduce || s.paused;
      if (!hovering) {
        target.x = 0.35 * Math.sin(time * 0.17);
        target.y = -0.18 + 0.08 * Math.sin(time * 0.23);
        target.lift = 0.35;
      }
      const k = still ? 1 : 0.045;
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      current.lift += (target.lift - current.lift) * (still ? 1 : 0.03);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, still ? 4 : time);
      gl.uniform1f(uPitch, 1.52 - clamp01(s.tilt) * 0.97);
      gl.uniform1f(uRelief, 0.3 + clamp01(s.relief) * 1.4);
      gl.uniform1f(uLines, Math.max(4, s.lines));
      gl.uniform1f(uIndex, s.indexLines ? 1 : 0);
      gl.uniform1f(uHaze, clamp01(s.haze) * 2.2);
      gl.uniform1f(uShade, clamp01(s.shading));
      gl.uniform1f(uSummit, clamp01(s.summits));
      gl.uniform3f(uPointer, current.x, current.y, s.interactive ? Math.min(1, current.lift * clamp01(s.pull) * 1.6) : 0);
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    };

    const loop = (now: number) => {
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
        const k = clamp01((now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      if (!settings.current.paused) time += (delta / 1000) * settings.current.speed;
      // The land drifts slowly, so idle frames alternate; the cursor gets full rate
      const active = now - lastMove < 1500 || Math.abs(target.lift - current.lift) > 0.02 || intro < 1;
      if (active || tick % 2 === 0) draw();
      frame = !settings.current.paused || intro < 1 ? requestAnimationFrame(loop) : 0;
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if ((!reduce && !settings.current.paused) || intro < 1) {
        if (visible && !document.hidden) frame = requestAnimationFrame(loop);
      }
    };

    redraw.current = (withColors = false) => {
      if (withColors) recolor();
      play();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      hovering = inside;
      if (!inside) return;
      target.x = (event.clientX - rect.left - rect.width / 2) / rect.height;
      target.y = (rect.height / 2 - (event.clientY - rect.top)) / rect.height;
      target.lift = 1;
      lastMove = performance.now();
      if (reduce || settings.current.paused) draw();
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
    const mo = new MutationObserver(() => requestAnimationFrame(() => redraw.current(true)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    resize();
    setReady(true);
    play();

    return () => {
      cancelAnimationFrame(frame);
      redraw.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [reduce]);

  useEffect(() => {
    redraw.current(true);
  }, [inkColor, paperColor, accentColor]);

  useEffect(() => {
    redraw.current(false);
  }, [summits, lines, indexLines, tilt, relief, haze, shading, speed, interactive, pull, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[repeating-radial-gradient(ellipse_at_62%_70%,transparent_0_26px,color-mix(in_oklab,currentColor_18%,transparent)_26px_27px)]"
          style={{ color: inkColor }}
        />
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
