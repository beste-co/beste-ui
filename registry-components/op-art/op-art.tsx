"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface OpArtProps {
  /** Color of the lines. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color between the lines. */
  paperColor?: string;
  /** Number of lines across the height. */
  lines?: number;
  /** Rotation of the line field, in degrees. */
  angle?: number;
  /** How far the lines ripple, 0 to 1. */
  wave?: number;
  /** Average line thickness, 0 (hairline) to 1 (solid). */
  weight?: number;
  /** How much lines swell from thin to heavy across the field, 0 to 1. */
  contrast?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** Lines bulge around the cursor; a wandering focus takes over when it leaves. */
  interactive?: boolean;
  /** Strength of the bulge, 0 to 1. */
  pull?: number;
  /** Freeze the field on its current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const opArtDemo: OpArtProps = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  lines: 34,
  angle: 0,
  wave: 0.5,
  weight: 0.1,
  contrast: 0.5,
  speed: 1,
  interactive: true,
  pull: 0.5,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPull;
uniform float uLines;
uniform float uAngle;
uniform float uWave;
uniform float uWeight;
uniform float uContrast;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform float uIntro;

void main(){
  vec2 uv=gl_FragCoord.xy/uRes.y;
  vec2 d=uv-uPointer;
  float bump=exp(-dot(d,d)*14.)*uPull;
  vec2 c=uv-vec2(.5*uRes.x/uRes.y,.5);
  float ca=cos(uAngle),sa=sin(uAngle);
  vec2 r=vec2(ca*c.x-sa*c.y,sa*c.x+ca*c.y)+vec2(.5*uRes.x/uRes.y,.5);
  float t=uTime;
  float wave=sin(r.x*2.3+t*.35)*.9+sin(r.x*5.1-r.y*1.7+t*.23)*.35+sin(r.y*3.1+t*.17)*.25;
  // On load the lines swell out of bare paper and the waves build from straight rows
  float v=r.y*uLines+wave*3.4*uWave*uIntro+bump*3.2;
  float width=clamp(uWeight+uContrast*.5*sin(r.x*1.7-t*.28+r.y*.9)+bump*.22,.02,.98)*uIntro;
  float aa=fwidth(v)*.9;
  float dist=abs(fract(v)-.5);
  float ink=1.-smoothstep(width*.5-aa,width*.5+aa,dist);
  gl_FragColor=vec4(mix(uPaper,uInk,ink*uIntro),1.);
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

export function OpArt({
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  lines = 34,
  angle = 0,
  wave = 0.5,
  weight = 0.1,
  contrast = 0.5,
  speed = 1,
  interactive = true,
  pull = 0.5,
  paused = false,
  className,
  children,
}: OpArtProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ inkColor, paperColor, lines, angle, wave, weight, contrast, speed, interactive, pull, paused });
  settings.current = { inkColor, paperColor, lines, angle, wave, weight, contrast, speed, interactive, pull, paused };
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
    const uPointer = u("uPointer");
    const uPull = u("uPull");
    const uLines = u("uLines");
    const uAngle = u("uAngle");
    const uWave = u("uWave");
    const uWeight = u("uWeight");
    const uContrast = u("uContrast");
    const uIntro = u("uIntro");
    const uInk = u("uInk");
    const uPaper = u("uPaper");

    const target = { x: 0.5, y: 0.5, pull: 0.6 };
    const current = { x: 0.5, y: 0.5, pull: 0.6 };
    let hovering = false;
    let time = 6;
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
    };

    const draw = () => {
      const s = settings.current;
      const aspect = canvas.width / Math.max(1, canvas.height);
      if (!hovering) {
        target.x = aspect * (0.5 + Math.sin(time * 0.21) * 0.3);
        target.y = 0.5 + Math.sin(time * 0.33) * 0.25;
        target.pull = 0.6;
      }
      const k = reduce || s.paused ? 1 : 0.06;
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      current.pull += (target.pull - current.pull) * k;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uPointer, current.x, current.y);
      gl.uniform1f(uPull, current.pull * clamp01(s.pull) * 2);
      gl.uniform1f(uLines, Math.max(2, s.lines));
      gl.uniform1f(uAngle, (s.angle * Math.PI) / 180);
      gl.uniform1f(uWave, clamp01(s.wave));
      gl.uniform1f(uWeight, clamp01(s.weight));
      gl.uniform1f(uContrast, clamp01(s.contrast));
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;
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
        const k = Math.min(1, (now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      if (settings.current.paused) {
        draw();
        frame = intro < 1 ? requestAnimationFrame(loop) : 0;
        return;
      }
      time += (delta / 1000) * settings.current.speed;
      // The field drifts slowly, so idle frames alternate; the cursor gets full rate
      const active = now - lastMove < 1500 || Math.abs(target.pull - current.pull) > 0.02;
      if (active || intro < 1 || tick % 2 === 0) draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden) frame = requestAnimationFrame(loop);
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
      if (!inside) {
        hovering = false;
        return;
      }
      hovering = true;
      target.x = (event.clientX - rect.left) / rect.height;
      target.y = (rect.bottom - event.clientY) / rect.height;
      target.pull = 1;
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
  }, [inkColor, paperColor]);

  useEffect(() => {
    redraw.current(false);
  }, [lines, angle, wave, weight, contrast, speed, interactive, pull, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: `repeating-linear-gradient(${170 + angle}deg, ${inkColor} 0 7px, transparent 7px 18px)` }}
        />
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
