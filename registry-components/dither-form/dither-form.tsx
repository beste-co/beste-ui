"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

type Shape = "torus" | "blobs" | "rings";
type Pattern = "bayer4" | "bayer8";

export interface DitherFormProps {
  /** Color of the lit dots. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color behind the dots. */
  paperColor?: string;
  /** Size of one dithered pixel in CSS pixels. */
  pixelSize?: number;
  /** The form being rendered. */
  shape?: Shape;
  /** Ordered dither matrix: bayer4 reads coarse and graphic, bayer8 finer. */
  pattern?: Pattern;
  /** Brightness of the form, 0 (dark) to 1 (bright). */
  exposure?: number;
  /** Faint dotted glow behind the form, 0 to 1. */
  backdrop?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** Turn toward the cursor. */
  interactive?: boolean;
  /** How far the form turns toward the cursor, 0 to 1. */
  tilt?: number;
  /** Freeze the form on its current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const ditherFormDemo: DitherFormProps = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  pixelSize: 3,
  shape: "torus",
  pattern: "bayer8",
  exposure: 0.5,
  backdrop: 0.5,
  speed: 1,
  interactive: true,
  tilt: 0.5,
  className: "min-h-[32rem]",
};

const SHAPES: Record<Shape, number> = { torus: 0, blobs: 1, rings: 2 };

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uTilt;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform float uShape;
uniform float uBayer8;
uniform float uExposure;
uniform float uBackdrop;
uniform float uIntro;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float torus(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
float map(vec3 p){
  p.yz*=rot(uTilt.y+uTime*.21);
  p.xz*=rot(uTilt.x+uTime*.33);
  float a=length(p-vec3(sin(uTime*.8)*.95,cos(uTime*.6)*.45,0.))-.46;
  float b=length(p+vec3(0.,sin(uTime*.7)*.8,cos(uTime*.9)*.6))-.34;
  if(uShape<.5){
    return smin(smin(torus(p,vec2(1.,.3)),a,.45),b,.4);
  }
  if(uShape<1.5){
    float c=length(p-vec3(cos(uTime*.5)*.7,sin(uTime*.9)*.5,sin(uTime*.4)*.6))-.52;
    return smin(smin(a,b,.5),c,.5);
  }
  vec3 q=p;
  q.xy*=rot(1.5708);
  q.x-=.55;
  return min(torus(p+vec3(.55,0.,0.),vec2(.8,.2)),torus(q,vec2(.8,.2)));
}
vec3 normal(vec3 p){
  vec2 e=vec2(.002,0.);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));
}
float bayer2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
float bayer4(vec2 a){return bayer2(.5*a)*.25+bayer2(a);}
float bayer8(vec2 a){return bayer4(.5*a)*.25+bayer2(a);}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);
  // During the intro the form drifts forward out of the distance
  vec3 ro=vec3(0.,0.,mix(7.,3.6,uIntro));
  vec3 rd=normalize(vec3(uv,-1.45));
  float d=0.;
  float hit=0.;
  for(int i=0;i<72;i++){
    float h=map(ro+rd*d);
    if(h<.001){hit=1.;break;}
    d+=h;
    if(d>11.)break;
  }
  float lum=.22*uBackdrop*smoothstep(1.,0.,length(uv));
  if(hit>.5){
    vec3 p=ro+rd*d;
    vec3 n=normal(p);
    float diff=max(dot(n,normalize(vec3(.6,.7,.5))),0.);
    float rim=pow(1.-max(dot(n,-rd),0.),2.);
    lum=(.06+.78*diff+.4*rim)*mix(.6,1.4,uExposure);
  }
  float threshold=mix(bayer4(gl_FragCoord.xy),bayer8(gl_FragCoord.xy),uBayer8);
  // The intro dissolves the image in through the same Bayer order, starting from bare paper
  float on=step(threshold,lum)*step(threshold,uIntro*1.0001-.0001);
  gl_FragColor=vec4(mix(uPaper,uInk,on),1.);
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

export function DitherForm({
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  pixelSize = 3,
  shape = "torus",
  pattern = "bayer8",
  exposure = 0.5,
  backdrop = 0.5,
  speed = 1,
  interactive = true,
  tilt = 0.5,
  paused = false,
  className,
  children,
}: DitherFormProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ inkColor, paperColor, pixelSize, shape, pattern, exposure, backdrop, speed, interactive, tilt, paused });
  settings.current = { inkColor, paperColor, pixelSize, shape, pattern, exposure, backdrop, speed, interactive, tilt, paused };
  const redraw = useRef<(options?: { recolor?: boolean; resize?: boolean }) => void>(() => {});

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
    const uTilt = u("uTilt");
    const uInk = u("uInk");
    const uPaper = u("uPaper");
    const uShape = u("uShape");
    const uBayer8 = u("uBayer8");
    const uExposure = u("uExposure");
    const uBackdrop = u("uBackdrop");
    const uIntro = u("uIntro");

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let time = 2.4;
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
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uTilt, current.x, current.y);
      gl.uniform1f(uShape, SHAPES[s.shape] ?? 0);
      gl.uniform1f(uBayer8, s.pattern === "bayer4" ? 0 : 1);
      gl.uniform1f(uExposure, clamp01(s.exposure));
      gl.uniform1f(uBackdrop, clamp01(s.backdrop));
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // A slower device gets chunkier pixels rather than dropped frames
    const resize = () => {
      const size = Math.max(1, settings.current.pixelSize) / quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth / size));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight / size));
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
      const active = now - lastMove < 1500 || Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.01 || intro < 1;
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

    redraw.current = (options = {}) => {
      if (options.recolor) recolor();
      if (options.resize) resize();
      play();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      const s = settings.current;
      if (!s.interactive || event.pointerType === "touch") return;
      const rect = root.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) {
        target.x = 0;
        target.y = 0;
        return;
      }
      const reach = clamp01(s.tilt) * 4.8;
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * reach;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * reach;
      lastMove = performance.now();
      if (reduce || s.paused) {
        current.x = target.x;
        current.y = target.y;
        draw();
      }
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
    const mo = new MutationObserver(() => requestAnimationFrame(() => redraw.current({ recolor: true })));
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
    redraw.current({ recolor: true });
  }, [inkColor, paperColor]);

  useEffect(() => {
    redraw.current({ resize: true });
  }, [pixelSize]);

  useEffect(() => {
    redraw.current();
  }, [shape, pattern, exposure, backdrop, speed, interactive, tilt, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-size:6px_6px] [mask-image:radial-gradient(circle,black_20%,transparent_65%)]"
          style={{ backgroundImage: `radial-gradient(circle, ${inkColor} 1px, transparent 1.5px)` }}
        />
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full transition-opacity duration-300 [image-rendering:pixelated]", ready ? "opacity-100" : "opacity-0")} />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
