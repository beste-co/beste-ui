"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

type Scene = "lattice" | "sphere" | "torus" | "asterisk";
type Align = "left" | "center" | "right";

export interface AsciiRenderProps {
  /** Color of the glyphs. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color behind the glyphs. */
  paperColor?: string;
  /** Color the brightest glyphs and the cursor glow take on. */
  accentColor?: string;
  /** Glyph ramp from darkest to brightest. */
  glyphs?: string;
  /** Height of one character cell in CSS pixels. */
  cellSize?: number;
  /** The form drawn in characters. */
  scene?: Scene;
  /** Where the form sits across the surface. */
  align?: Align;
  /** Size of the form, 0 to 1. */
  size?: number;
  /** How fast the form turns, 1 is the default pace. */
  spin?: number;
  /** Overall motion speed, 1 is the default pace. */
  speed?: number;
  /** Drifting noise in the empty field, 0 to 1. */
  drift?: number;
  /** A slow scan line sweeps down the surface. */
  scanLine?: boolean;
  /** Brightness and punch of the form, 0 to 1. */
  contrast?: number;
  /** Cells light up around the cursor. */
  interactive?: boolean;
  /** Strength of that glow, 0 to 1. */
  glow?: number;
  /** Size of that glow, 0 to 1. */
  glowSize?: number;
  /** Freeze the surface on its current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const asciiRenderDemo: AsciiRenderProps = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  accentColor: "var(--primary)",
  glyphs: " .:-=+*#%@",
  cellSize: 14,
  scene: "lattice",
  align: "center",
  size: 0.5,
  spin: 1,
  speed: 1,
  drift: 0.5,
  scanLine: true,
  contrast: 0.5,
  interactive: true,
  glow: 0.6,
  glowSize: 0.5,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const sceneFragment = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uCell;
uniform float uTime;
uniform float uSpin;
uniform vec3 uPointer;
uniform vec3 uCenter;
uniform float uShape;
uniform float uDrift;
uniform float uScan;
uniform float uGain;
uniform float uGlowSize;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float bar(vec2 p){
  vec2 q=abs(p)-vec2(.083,.833);
  return length(max(q,0.))+min(max(q.x,q.y),0.)-.167;
}
float asterisk(vec3 p){
  float d=bar(p.xy);
  d=min(d,bar(rot(1.0472)*p.xy));
  d=min(d,bar(rot(-1.0472)*p.xy));
  vec2 w=vec2(d,abs(p.z)-.16);
  return min(max(w.x,w.y),0.)+length(max(w,0.))-.03;
}
float map(vec3 p){
  if(uShape>2.5){
    p.xz*=rot(uSpin*.45);
    p.yz*=rot(sin(uSpin*.35)*.3);
    return asterisk(p);
  }
  p.xz*=rot(uSpin*.31);
  p.xy*=rot(uSpin*.17);
  if(uShape>1.5)return length(vec2(length(p.xz)-.85,p.y))-.32;
  float sphere=length(p)-1.;
  if(uShape>.5)return sphere;
  vec3 q=p*3.4;
  float gyroid=abs(dot(sin(q),cos(q.zxy)))/3.4-.05;
  return max(sphere,gyroid*.75);
}
vec3 normal(vec3 p){
  vec2 k=vec2(1.,-1.)*.003;
  return normalize(k.xyy*map(p+k.xyy)+k.yyx*map(p+k.yyx)+k.yxy*map(p+k.yxy)+k.xxx*map(p+k.xxx));
}
void main(){
  vec2 uv=(gl_FragCoord.xy*uCell-.5*uRes)/uRes.y;
  float t=uTime;
  float n=noise(uv*vec2(3.,5.)+vec2(t*.05,-t*.12))*.6+noise(uv*9.+vec2(-t*.1,t*.07))*.4;
  float b=smoothstep(.5,.95,n)*.6*uDrift;
  float accent=0.;
  vec2 q=(uv-uCenter.xy)/uCenter.z;
  vec3 ro=vec3(0.,0.,3.2);
  vec3 rd=normalize(vec3(q,-1.6));
  float d=0.;
  float hit=0.;
  for(int i=0;i<64;i++){
    float h=map(ro+rd*d);
    if(h<.002){hit=1.;break;}
    d+=h;
    if(d>6.)break;
  }
  if(hit>.5){
    vec3 p=ro+rd*d;
    vec3 nn=normal(p);
    float diff=max(dot(nn,normalize(vec3(.5,.7,.6))),0.);
    float rim=1.-max(dot(nn,-rd),0.);
    float depth=clamp(length(p)*1.15,0.,1.);
    b=(.1+.72*diff*depth+.3*rim*rim)*uGain;
    accent=smoothstep(.84,.97,b);
  }
  float s=uv.y-(.65-fract(t*.06)*1.3);
  b+=.14*exp(-s*s*500.)*uScan;
  vec2 pd=uv-uPointer.xy;
  float glow=exp(-dot(pd,pd)*uGlowSize)*uPointer.z;
  b+=glow;
  accent=max(accent,glow*1.4);
  gl_FragColor=vec4(clamp(b,0.,1.),clamp(accent,0.,1.),0.,1.);
}`;

const glyphFragment = `
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uAtlas;
uniform vec2 uCell;
uniform vec2 uGrid;
uniform float uCount;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uAccent;
void main(){
  vec2 c=gl_FragCoord.xy/uCell;
  vec2 cell=floor(c);
  vec2 f=fract(c);
  vec4 s=texture2D(uScene,(cell+.5)/uGrid);
  float idx=floor(clamp(s.r,0.,.999)*uCount);
  float g=texture2D(uAtlas,vec2((idx+f.x)/uCount,f.y)).r;
  vec3 ink=mix(uInk,uAccent,s.g);
  gl_FragColor=vec4(mix(uPaper,ink,g*mix(.45,1.,s.r)),1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function link(gl: WebGLRenderingContext, fragment: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vertex);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "p");
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
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
const SHAPES: Record<Scene, number> = { lattice: 0, sphere: 1, torus: 2, asterisk: 3 };
const ALIGN: Record<Align, number> = { left: 0.28, center: 0.5, right: 0.72 };

export function AsciiRender({
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  accentColor = "var(--primary)",
  glyphs = " .:-=+*#%@",
  cellSize = 14,
  scene = "lattice",
  align = "center",
  size = 0.5,
  spin = 1,
  speed = 1,
  drift = 0.5,
  scanLine = true,
  contrast = 0.5,
  interactive = true,
  glow = 0.6,
  glowSize = 0.5,
  paused = false,
  className,
  children,
}: AsciiRenderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ inkColor, paperColor, accentColor, scene, align, size, spin, speed, drift, scanLine, contrast, interactive, glow, glowSize, paused });
  settings.current = { inkColor, paperColor, accentColor, scene, align, size, spin, speed, drift, scanLine, contrast, interactive, glow, glowSize, paused };
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
    const sceneProgram = link(gl, sceneFragment);
    const glyphProgram = link(gl, glyphFragment);
    if (!sceneProgram || !glyphProgram) return setFailed(true);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const s = (name: string) => gl.getUniformLocation(sceneProgram, name);
    const g = (name: string) => gl.getUniformLocation(glyphProgram, name);
    const sRes = s("uRes");
    const sCell = s("uCell");
    const sTime = s("uTime");
    const sSpin = s("uSpin");
    const sPointer = s("uPointer");
    const sCenter = s("uCenter");
    const sShape = s("uShape");
    const sDrift = s("uDrift");
    const sScan = s("uScan");
    const sGain = s("uGain");
    const sGlowSize = s("uGlowSize");
    const gCell = g("uCell");
    const gGrid = g("uGrid");
    const gCount = g("uCount");
    const gInk = g("uInk");
    const gPaper = g("uPaper");
    const gAccent = g("uAccent");
    gl.useProgram(glyphProgram);
    gl.uniform1i(g("uScene"), 0);
    gl.uniform1i(g("uAtlas"), 1);

    const ramp = Array.from(glyphs.length > 1 ? glyphs : " .:-=+*#%@");
    const count = ramp.length;
    const sceneTex = gl.createTexture();
    const atlasTex = gl.createTexture();
    const fbo = gl.createFramebuffer();
    const atlas = document.createElement("canvas");
    const setTexParams = () => {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    const cell = { w: 8, h: 14 };
    const grid = { cols: 1, rows: 1 };
    const center = { x: 0, y: 0, scale: 1 };
    const target = { x: 0, y: 0, strength: 0 };
    const pointer = { x: 0, y: 0, strength: 0 };
    let time = 7;
    let spinTime = 7;
    let frame = 0;
    let visible = true;
    let broken = false;
    let sized = false;
    let dpr = 1;
    let quality = 1;
    let average = 16.7;
    let lastFrame = 0;
    let lastMove = -10000;
    let tick = 0;

    const buildAtlas = () => {
      atlas.width = cell.w * count;
      atlas.height = cell.h;
      const ctx = atlas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, atlas.width, atlas.height);
      ctx.fillStyle = "#fff";
      ctx.font = `500 ${Math.round(cell.h * 0.8)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ramp.forEach((char, index) => ctx.fillText(char, index * cell.w + cell.w / 2, cell.h * 0.54));
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, atlasTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
      setTexParams();
    };

    const recolor = () => {
      const c = settings.current;
      gl.useProgram(glyphProgram);
      gl.uniform3f(gInk, ...resolveColor(root, c.inkColor));
      gl.uniform3f(gPaper, ...resolveColor(root, c.paperColor));
      gl.uniform3f(gAccent, ...resolveColor(root, c.accentColor));
    };

    const place = () => {
      const c = settings.current;
      const w = canvas.width;
      const h = canvas.height;
      const scale = 0.5 + clamp01(c.size);
      if (w / h > 1.1) {
        center.x = ((ALIGN[c.align] ?? 0.5) * w - 0.5 * w) / h;
        center.y = 0.02;
        center.scale = (Math.min(0.36 * h, 0.22 * w) / h / 0.5) * scale;
      } else {
        center.x = 0;
        center.y = c.align === "center" ? 0 : (-0.5 * h + 210 * dpr) / h;
        center.scale = (Math.min(170 * dpr, 0.42 * w) / h / 0.5) * scale;
      }
    };

    const draw = () => {
      if (broken || !sized) return;
      const c = settings.current;
      pointer.x += (target.x - pointer.x) * 0.12;
      pointer.y += (target.y - pointer.y) * 0.12;
      pointer.strength += (target.strength - pointer.strength) * 0.06;
      place();

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, grid.cols, grid.rows);
      gl.useProgram(sceneProgram);
      gl.uniform2f(sRes, canvas.width, canvas.height);
      gl.uniform2f(sCell, cell.w, cell.h);
      gl.uniform1f(sTime, time);
      gl.uniform1f(sSpin, spinTime);
      gl.uniform3f(sPointer, pointer.x, pointer.y, c.interactive ? pointer.strength * clamp01(c.glow) : 0);
      gl.uniform3f(sCenter, center.x, center.y, center.scale);
      gl.uniform1f(sShape, SHAPES[c.scene] ?? 0);
      gl.uniform1f(sDrift, clamp01(c.drift));
      gl.uniform1f(sScan, c.scanLine ? 1 : 0);
      gl.uniform1f(sGain, 0.6 + clamp01(c.contrast) * 0.8);
      gl.uniform1f(sGlowSize, Math.max(5, 80 - clamp01(c.glowSize) * 100));
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(glyphProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sceneTex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, atlasTex);
      gl.uniform2f(gCell, cell.w, cell.h);
      gl.uniform2f(gGrid, grid.cols, grid.rows);
      gl.uniform1f(gCount, count);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      // A slower device gets larger cells: fewer to raymarch, same look
      cell.h = Math.max(6, Math.round((Math.max(6, cellSize) * dpr) / quality));
      cell.w = Math.max(4, Math.round(cell.h * 0.6));
      grid.cols = Math.ceil(canvas.width / cell.w);
      grid.rows = Math.ceil(canvas.height / cell.h);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sceneTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, grid.cols, grid.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      setTexParams();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0);
      const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      if (!complete) {
        broken = true;
        cancelAnimationFrame(frame);
        setFailed(true);
        return;
      }
      buildAtlas();
      sized = true;
      draw();
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      average += (delta - average) * 0.05;
      lastFrame = now;
      tick++;
      if (tick % 90 === 0 && average > 22 && quality > 0.6) {
        quality = Math.max(0.6, quality - 0.2);
        resize();
      }
      const c = settings.current;
      const step = (delta / 1000) * c.speed;
      time += step;
      spinTime += step * c.spin;
      // Glyphs change in steps anyway, so idle frames alternate; the cursor gets full rate
      const active = now - lastMove < 1500 || Math.abs(target.strength - pointer.strength) > 0.02;
      if (active || tick % 2 === 0) draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && !settings.current.paused && visible && !document.hidden && !broken) frame = requestAnimationFrame(loop);
    };

    redraw.current = (withColors = false) => {
      if (withColors) recolor();
      play();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || reduce || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) {
        target.strength = 0;
        return;
      }
      const scale = canvas.width / Math.max(1, rect.width);
      target.x = ((event.clientX - rect.left) * scale - 0.5 * canvas.width) / canvas.height;
      target.y = ((rect.bottom - event.clientY) * scale - 0.5 * canvas.height) / canvas.height;
      if (pointer.strength < 0.02) {
        pointer.x = target.x;
        pointer.y = target.y;
      }
      target.strength = 1;
      lastMove = performance.now();
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      broken = true;
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
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(sceneTex);
      gl.deleteTexture(atlasTex);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(sceneProgram);
      gl.deleteProgram(glyphProgram);
    };
  }, [glyphs, cellSize, reduce]);

  useEffect(() => {
    redraw.current(true);
  }, [inkColor, paperColor, accentColor]);

  useEffect(() => {
    redraw.current(false);
  }, [scene, align, size, spin, speed, drift, scanLine, contrast, interactive, glow, glowSize, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle,currentColor_1px,transparent_1.5px)] [background-size:9px_14px] opacity-40 [mask-image:radial-gradient(40%_50%_at_50%_50%,black,transparent)]"
          style={{ color: inkColor }}
        />
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full [image-rendering:pixelated]" />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
