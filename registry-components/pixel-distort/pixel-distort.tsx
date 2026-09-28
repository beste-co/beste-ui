"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface PixelDistortProps {
  /** Photo to distort. Loaded with CORS so WebGL can read it. */
  src: string;
  /** Description of the photo for screen readers. */
  alt?: string;
  /** Cells across the width of the grid, 12 to 72. Fewer cells make chunkier pixels. */
  grid?: number;
  /** How far a sweep of the cursor drags the cells, 0 to 1. */
  strength?: number;
  /** Size of the area the cursor drags, 0 to 1. */
  radius?: number;
  /** How quickly the cells ease back into place, 0 (slow) to 1 (quick). */
  relax?: number;
  /** Red and blue split at the edges of displaced cells, 0 to 1. */
  aberration?: number;
  /** How coarse displaced cells turn, 0 (smooth) to 1 (blocky). */
  pixelate?: number;
  /** The photo resolves from big pixels into the sharp image on arrival. */
  intro?: boolean;
  /** Film grain, 0 to 1. */
  grain?: number;
  /** The cursor drags the grid. */
  interactive?: boolean;
  /** Freeze the picture where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const pixelDistortDemo: PixelDistortProps = {
  src: "https://images.unsplash.com/photo-1697128951362-e704be45d3da?w=2000&q=80",
  alt: "Raised hands in silhouette against blue stage light at a concert",
  grid: 36,
  strength: 0.6,
  radius: 0.5,
  relax: 0.5,
  aberration: 0.5,
  pixelate: 0.6,
  intro: true,
  grain: 0.4,
  interactive: true,
  className: "min-h-[32rem]",
};

// How far a cell may be displaced, as a share of the frame; also the scale of the byte encoding
const RANGE = 0.2;
const INTRO_MS = 2400;

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Each cell of the grid carries its own offset (red and green of a small texture, blocky on purpose).
// Displaced cells sample the photo from where the drag came from, break into coarser pixels and split
// their color a little; still cells show the photo untouched
const fragment = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uTexRes;
uniform sampler2D uTex;
uniform sampler2D uDisp;
uniform vec2 uGrid;
uniform float uRange;
uniform float uAberration;
uniform float uPixelate;
uniform float uIntro;
uniform float uGrain;
uniform float uReveal;

vec2 cover(vec2 uv){
  float ra=uRes.x/uRes.y,ta=uTexRes.x/uTexRes.y;
  vec2 s=ra>ta?vec2(1.,ta/ra):vec2(ra/ta,1.);
  return clamp((uv-.5)*s+.5,0.,1.);
}
float hash(vec2 p){return fract(sin(dot(mod(p,1024.),vec2(127.1,311.7)))*43758.5453);}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 cell=floor(uv*uGrid);
  vec4 enc=texture2D(uDisp,(cell+.5)/uGrid);
  vec2 d=(enc.rg*255.-128.)/127.*uRange;
  float amount=clamp(length(d)/(uRange*.35),0.,1.);

  // Displaced cells turn coarse; on arrival the whole photo starts as big blocks
  float coarse=max(amount*uPixelate,1.-uIntro);
  vec2 q=uv-d;
  if(coarse>.01){
    float sub=mix(64.,3.,coarse);
    vec2 n=uGrid*sub/8.;
    q=(floor(q*n)+.5)/n;
  }
  float o=amount*.012*uAberration;
  vec3 col;
  col.r=texture2D(uTex,cover(q+vec2(o,0.))).r;
  col.g=texture2D(uTex,cover(q)).g;
  col.b=texture2D(uTex,cover(q-vec2(o,0.))).b;

  col+=(hash(gl_FragCoord.xy)-.5)*.035*uGrain;
  vec2 v=uv-.5;
  col*=1.-.4*dot(v,v);
  // The photo grows out of the flat neutral-950 ground
  gl_FragColor=vec4(mix(vec3(10./255.),col,uReveal),1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function PixelDistort({
  src,
  alt,
  grid = 36,
  strength = 0.6,
  radius = 0.5,
  relax = 0.5,
  aberration = 0.5,
  pixelate = 0.6,
  intro = true,
  grain = 0.4,
  interactive = true,
  paused = false,
  className,
  children,
}: PixelDistortProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ strength, radius, relax, aberration, pixelate, intro, grain, interactive, paused });
  settings.current = { strength, radius, relax, aberration, pixelate, intro, grain, interactive, paused };
  const redraw = useRef<() => void>(() => {});

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false });
    if (!canvas || !gl) return setFailed(true);
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
    const uTexRes = u("uTexRes");
    const uGrid = u("uGrid");
    const uRange = u("uRange");
    const uAberration = u("uAberration");
    const uPixelate = u("uPixelate");
    const uIntro = u("uIntro");
    const uGrain = u("uGrain");
    const uReveal = u("uReveal");
    gl.uniform1i(u("uTex"), 0);
    gl.uniform1i(u("uDisp"), 1);

    const makeTexture = (unit: number, filter: number) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    };
    const photo = makeTexture(0, gl.LINEAR);
    // Nearest filtering keeps each cell's offset whole, which is what makes the grid read as pixels
    const dispTexture = makeTexture(1, gl.NEAREST);

    // The grid: one offset per cell, in frame units, eased back toward zero every frame
    let cols = 1;
    let rows = 1;
    let dx = new Float32Array(1);
    let dy = new Float32Array(1);
    let bytes = new Uint8Array(4);
    let loaded = false;
    let introStart = 0;
    let moving = false;
    let frame = 0;
    let visible = true;
    let lastFrame = 0;
    const cursor = { x: 0, y: 0, has: false };

    const buildGrid = () => {
      const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
      cols = Math.max(12, Math.min(72, Math.round(grid)));
      rows = Math.max(6, Math.round(cols / Math.max(0.3, aspect)));
      dx = new Float32Array(cols * rows);
      dy = new Float32Array(cols * rows);
      bytes = new Uint8Array(cols * rows * 4);
      moving = false;
    };

    const uploadGrid = () => {
      let any = false;
      for (let i = 0; i < cols * rows; i++) {
        const x = dx[i] ?? 0;
        const y = dy[i] ?? 0;
        if (x !== 0 || y !== 0) any = true;
        bytes[i * 4] = Math.round(128 + Math.max(-1, Math.min(1, x / RANGE)) * 127);
        bytes[i * 4 + 1] = Math.round(128 + Math.max(-1, Math.min(1, y / RANGE)) * 127);
        bytes[i * 4 + 2] = 0;
        bytes[i * 4 + 3] = 255;
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, dispTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
      return any;
    };

    // Both start on the first frame the loaded photo is on screen
    const introAt = (now: number) => {
      const s = settings.current;
      if (!s.intro || reduce) return 1;
      if (!introStart) return 0;
      return 1 - (1 - clamp01((now - introStart) / 1900)) ** 3;
    };
    const revealAt = (now: number) => {
      if (reduce) return 1;
      if (!introStart) return 0;
      const k = clamp01((now - introStart) / INTRO_MS);
      return k * k * k * (k * (k * 6 - 15) + 10);
    };

    const draw = () => {
      if (!loaded) return;
      const s = settings.current;
      moving = uploadGrid();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uGrid, cols, rows);
      gl.uniform1f(uRange, RANGE);
      gl.uniform1f(uAberration, clamp01(s.aberration));
      gl.uniform1f(uPixelate, clamp01(s.pixelate));
      gl.uniform1f(uIntro, introAt(performance.now()));
      gl.uniform1f(uGrain, clamp01(s.grain) * 2);
      gl.uniform1f(uReveal, revealAt(performance.now()));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      buildGrid();
      draw();
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      lastFrame = now;
      introStart ||= now;
      const s = settings.current;
      const arriving = introAt(now) < 1 || revealAt(now) < 1;
      if (s.paused) {
        draw();
        frame = arriving ? requestAnimationFrame(loop) : 0;
        return;
      }
      // Every cell eases home; quicker relax settings pull harder
      const keep = (0.88 + (1 - clamp01(s.relax)) * 0.1) ** (delta / 16.7);
      for (let i = 0; i < cols * rows; i++) {
        const x = (dx[i] ?? 0) * keep;
        const y = (dy[i] ?? 0) * keep;
        dx[i] = Math.abs(x) < 0.0004 ? 0 : x;
        dy[i] = Math.abs(y) < 0.0004 ? 0 : y;
      }
      // Draw only while something is still moving or the arrival is playing
      if (moving || arriving) draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      const arriving = !introStart || revealAt(performance.now()) < 1;
      if (loaded && !reduce && (!settings.current.paused || arriving) && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    redraw.current = () => {
      play();
      draw();
    };

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, photo);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.uniform2f(uTexRes, image.naturalWidth, image.naturalHeight);
      loaded = true;
      draw();
      setReady(true);
      play();
    };
    image.onerror = () => setFailed(true);
    image.src = src;

    // A sweep of the cursor drags the cells it passes over, more the faster it moves
    const onMove = (event: PointerEvent) => {
      const s = settings.current;
      if (!s.interactive || s.paused || reduce || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      const y = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      if (!inside) {
        cursor.has = false;
        return;
      }
      if (cursor.has) {
        const mx = x - cursor.x;
        const my = y - cursor.y;
        const reach = 1.5 + clamp01(s.radius) * 5;
        const push = 0.6 + clamp01(s.strength) * 2.4;
        const cx = x * cols;
        const cy = y * rows;
        const r = Math.ceil(reach * 2);
        for (let gy = Math.max(0, Math.floor(cy) - r); gy <= Math.min(rows - 1, Math.floor(cy) + r); gy++) {
          for (let gx = Math.max(0, Math.floor(cx) - r); gx <= Math.min(cols - 1, Math.floor(cx) + r); gx++) {
            const ox = gx + 0.5 - cx;
            const oy = gy + 0.5 - cy;
            const fall = Math.exp(-(ox * ox + oy * oy) / (reach * reach));
            if (fall < 0.02) continue;
            const i = gy * cols + gx;
            dx[i] = Math.max(-RANGE, Math.min(RANGE, (dx[i] ?? 0) + mx * push * fall));
            dy[i] = Math.max(-RANGE, Math.min(RANGE, (dy[i] ?? 0) + my * push * fall));
          }
        }
        moving = true;
      }
      cursor.x = x;
      cursor.y = y;
      cursor.has = true;
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
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      redraw.current = () => {};
      image.onload = null;
      image.onerror = null;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(photo);
      gl.deleteTexture(dispTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src, grid, reduce]);

  useEffect(() => {
    redraw.current();
  }, [strength, radius, relax, aberration, pixelate, intro, grain, interactive, paused]);

  return (
    <div className={cn("relative isolate w-full overflow-hidden bg-neutral-950", className)}>
      {alt && <span className="sr-only">{alt}</span>}
      {failed ? (
        <img src={src} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
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
