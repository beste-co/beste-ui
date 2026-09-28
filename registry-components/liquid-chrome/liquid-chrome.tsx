"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface LiquidChromeProps {
  /** Color of the deep folds. Any CSS color, tokens included (e.g. "var(--foreground)"). */
  shadowColor?: string;
  /** Color the surface reflects at its brightest. */
  highlightColor?: string;
  /** Strength of the rainbow film on the edges, 0 to 1. */
  iridescence?: number;
  /** Rotates the rainbow film's hues, 0 to 1. */
  hue?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** Size of the folds; higher packs more folds in. */
  scale?: number;
  /** Swell toward the cursor. */
  interactive?: boolean;
  /** How strongly the surface rises under the cursor, 0 to 1. */
  pull?: number;
  /** Film grain, 0 to 1. */
  grain?: number;
  /** Darkening toward the edges, 0 to 1. */
  vignette?: number;
  /** Freeze the surface on its current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const liquidChromeDemo: LiquidChromeProps = {
  shadowColor: "#09090b",
  highlightColor: "#d1d6e0",
  iridescence: 0.75,
  hue: 0,
  speed: 1,
  scale: 1.7,
  interactive: true,
  pull: 0.45,
  grain: 0.5,
  vignette: 0.55,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPull;
uniform float uScale;
uniform vec3 uShadow;
uniform vec3 uHighlight;
uniform float uIridescence;
uniform float uHue;
uniform float uGrain;
uniform float uVignette;
uniform float uIntro;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}
  return v;
}
float height(vec2 p){
  float t=uTime*.07;
  vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*1.4),fbm(p+3.*q+vec2(8.3,2.8)));
  float d=length(p-uPointer);
  return fbm(p+2.4*r)+uPull*exp(-d*d*2.5);
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 p=uv*uScale;
  float e=.012;
  float h=height(p);
  // The relief rises from a flat sheet during the intro
  vec3 n=normalize(vec3((height(p-vec2(e,0.))-height(p+vec2(e,0.)))*uIntro,(height(p-vec2(0.,e))-height(p+vec2(0.,e)))*uIntro,e*2.6));
  vec3 r=reflect(vec3(0.,0.,-1.),n);
  float fres=pow(1.-max(n.z,0.),2.2);
  float sky=smoothstep(-.35,.9,r.y);
  vec3 chrome=mix(uShadow,uHighlight,sky*.85);
  chrome=mix(chrome,uShadow*.6,smoothstep(.15,.0,abs(r.x+.2))*.6);
  vec3 film=.5+.5*cos(6.2831*(h*1.3+fres*.9+vec3(0.,.33,.67)+uHue)+uTime*.12);
  vec3 col=mix(chrome,film*mix(.35,1.,sky),clamp(fres*1.3,0.,1.)*uIridescence);
  col+=pow(max(dot(r,normalize(vec3(-.45,.6,.65))),0.),48.)*1.4;
  col*=1.-uVignette*dot(uv*.9,uv*.9);
  col+=(hash(gl_FragCoord.xy+fract(uTime))-.5)*.07*uGrain;
  col=mix(uShadow,col,uIntro);
  gl_FragColor=vec4(col,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Resolves any CSS color (tokens and oklch included) to linear 0-1 RGB
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

export function LiquidChrome({
  shadowColor = "#09090b",
  highlightColor = "#d1d6e0",
  iridescence = 0.75,
  hue = 0,
  speed = 1,
  scale = 1.7,
  interactive = true,
  pull = 0.45,
  grain = 0.5,
  vignette = 0.55,
  paused = false,
  className,
  children,
}: LiquidChromeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ shadowColor, highlightColor, iridescence, hue, speed, scale, interactive, pull, grain, vignette, paused });
  settings.current = { shadowColor, highlightColor, iridescence, hue, speed, scale, interactive, pull, grain, vignette, paused };
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
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uPointer = u("uPointer");
    const uPull = u("uPull");
    const uScale = u("uScale");
    const uShadow = u("uShadow");
    const uHighlight = u("uHighlight");
    const uIridescence = u("uIridescence");
    const uHue = u("uHue");
    const uGrain = u("uGrain");
    const uVignette = u("uVignette");
    const uIntro = u("uIntro");

    const target = { x: 0.4, y: -0.1, pull: 0 };
    const current = { x: 0.4, y: -0.1, pull: 0 };
    let time = 18;
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
      gl.uniform3f(uShadow, ...resolveColor(root, s.shadowColor));
      gl.uniform3f(uHighlight, ...resolveColor(root, s.highlightColor));
    };

    const draw = () => {
      const s = settings.current;
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      current.pull += (target.pull - current.pull) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uPointer, current.x, current.y);
      gl.uniform1f(uPull, current.pull * clamp01(s.pull));
      gl.uniform1f(uScale, Math.max(0.2, s.scale));
      gl.uniform1f(uIridescence, clamp01(s.iridescence));
      gl.uniform1f(uHue, s.hue);
      gl.uniform1f(uGrain, clamp01(s.grain));
      gl.uniform1f(uVignette, clamp01(s.vignette));
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
      setReady(true);
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
      const introducing = intro < 1;
      if (introducing) {
        introStart ||= now;
        const k = clamp01((now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      const paused = settings.current.paused;
      if (!paused) time += (delta / 1000) * settings.current.speed;
      // The surface drifts slowly, so idle frames alternate; the cursor and the intro get full rate
      const active = introducing || now - lastMove < 1500 || Math.abs(target.pull - current.pull) > 0.02;
      if (active || tick % 2 === 0) draw();
      frame = !paused || intro < 1 ? requestAnimationFrame(loop) : 0;
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
        target.pull = 0;
        return;
      }
      const s = Math.max(0.2, settings.current.scale);
      target.x = ((event.clientX - rect.left - rect.width / 2) / rect.height) * s;
      target.y = ((rect.height / 2 - (event.clientY - rect.top)) / rect.height) * s;
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
    // Themes can be scoped to any wrapper, not just <html>, so every ancestor is watched for token changes
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        redraw.current(true);
      });
    });
    for (let node = root.parentElement; node; node = node.parentElement) {
      mo.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    play();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
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
  }, [shadowColor, highlightColor]);

  useEffect(() => {
    redraw.current(false);
  }, [iridescence, hue, speed, scale, interactive, pull, grain, vignette, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: shadowColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: `radial-gradient(120% 80% at 70% 30%, ${highlightColor} 0%, color-mix(in oklab, ${highlightColor} 25%, ${shadowColor}) 35%, ${shadowColor} 70%)` }}
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
