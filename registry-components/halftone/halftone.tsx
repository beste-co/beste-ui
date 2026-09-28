"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface HalftoneProps {
  /** Photo printed as a halftone. Loaded with CORS so WebGL can read it. */
  src: string;
  /** Description of the photo for screen readers. */
  alt?: string;
  /** Color of the dots. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color of the paper behind the dots. */
  paperColor?: string;
  /** Distance between dots, in CSS pixels. */
  dotSize?: number;
  /** Angle of the dot screen, in degrees. */
  angle?: number;
  /** How much the traveling wave swells the dots, 0 to 1. */
  wave?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** Contrast of the print, 0 (soft) to 1 (punchy). */
  contrast?: number;
  /** How far the print swells toward the viewer under the cursor, 0 (flat) to 1. */
  bulge?: number;
  /** Size of the swell, 0 to 1. */
  bulgeSize?: number;
  /** Strength of the ripples that run through the dots as the cursor moves, 0 to 1. */
  ripples?: number;
  /** The swell follows the cursor; otherwise it drifts on its own and ripples now and then. */
  interactive?: boolean;
  /** Freeze the print on its current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const halftoneDemo: HalftoneProps = {
  src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?w=2000&q=80",
  alt: "A woman with short hair looking back over her shoulder against a clear sky",
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  dotSize: 8,
  angle: 45,
  wave: 0.5,
  speed: 1,
  contrast: 0.5,
  bulge: 0.6,
  bulgeSize: 0.5,
  ripples: 0.6,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uTexRes;
uniform sampler2D uTex;
uniform float uTime;
uniform float uCell;
uniform float uAngle;
uniform float uWave;
uniform float uGain;
uniform vec2 uPointer;
uniform float uBulge;
uniform float uRadius;
uniform float uRipple;
uniform vec4 uDrops[5];
uniform vec3 uInk;
uniform vec3 uPaper;
uniform float uInvert;
uniform float uIntro;

vec2 cover(vec2 uv){
  float ra=uRes.x/uRes.y,ta=uTexRes.x/uTexRes.y;
  vec2 s=ra>ta?vec2(1.,ta/ra):vec2(ra/ta,1.);
  return (uv-.5)*s+.5;
}
vec2 rot(vec2 v,float a){float c=cos(a),s=sin(a);return vec2(c*v.x-s*v.y,s*v.x+c*v.y);}
float luma(vec2 frag){
  vec3 c=texture2D(uTex,cover(clamp(frag/uRes,0.,1.))).rgb;
  return dot(c,vec3(.299,.587,.114));
}
float amount(float l){
  float a=mix(1.-l,l,uInvert);
  return clamp((a-.08)*uGain,0.,1.);
}
void main(){
  vec2 frag=gl_FragCoord.xy;
  vec2 dv=frag-uPointer;
  float t=clamp(1.-length(dv)/max(uRadius,1.),0.,1.);
  float dome=t*t*(3.-2.*t)*uBulge*uIntro;
  vec2 p=uPointer+dv*(1.-dome*.42);
  float rings=0.;
  for(int i=0;i<5;i++){
    vec4 d=uDrops[i];
    float age=uTime-d.z;
    if(age<0.||age>3.)continue;
    vec2 dd=frag-d.xy;
    float dist=length(dd)+.001;
    float front=age*uRes.y*.32;
    float env=exp(-abs(dist-front)/(uCell*4.))*exp(-age*1.1)*d.w*uRipple;
    float w=sin((dist-front)/uCell*1.3);
    p+=dd/dist*w*env*uCell*.5;
    rings+=w*env;
  }
  vec2 g=rot(p,uAngle)/uCell;
  vec2 cell=floor(g)+.5;
  vec2 center=rot(cell*uCell,-uAngle);
  float o=uCell*.25;
  float l=(luma(center+vec2(o,o))+luma(center+vec2(-o,o))+luma(center+vec2(o,-o))+luma(center+vec2(-o,-o)))*.25;
  float swell=sin(dot(center/uRes.y,vec2(7.,4.5))-uTime*.8);
  float r=sqrt(amount(l))*.74*(1.+uWave*swell)*(1.+dome*.3+rings*.35)*uIntro;
  float aa=.9/uCell;
  float ink=1.-smoothstep(r-aa,r+aa,length(g-cell));
  vec3 col=mix(uPaper,uInk,ink);
  float slope=dot(dv/max(length(dv),.001),vec2(-.7071,.7071))*sin(3.1416*t)*uBulge;
  col=mix(col,uPaper,max(slope,0.)*.3);
  col=mix(col,uInk,max(-slope,0.)*.14);
  // The dots grow out of the bare paper on arrival
  col=mix(uPaper,col,uIntro);
  gl_FragColor=vec4(col,1.);
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

export function Halftone({
  src,
  alt,
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  dotSize = 8,
  angle = 45,
  wave = 0.5,
  speed = 1,
  contrast = 0.5,
  bulge = 0.6,
  bulgeSize = 0.5,
  ripples = 0.6,
  interactive = true,
  paused = false,
  className,
  children,
}: HalftoneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ inkColor, paperColor, dotSize, angle, wave, speed, contrast, bulge, bulgeSize, ripples, interactive, paused });
  settings.current = { inkColor, paperColor, dotSize, angle, wave, speed, contrast, bulge, bulgeSize, ripples, interactive, paused };
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
    const uTexRes = u("uTexRes");
    const uTime = u("uTime");
    const uCell = u("uCell");
    const uAngle = u("uAngle");
    const uWave = u("uWave");
    const uGain = u("uGain");
    const uPointer = u("uPointer");
    const uBulge = u("uBulge");
    const uRadius = u("uRadius");
    const uRipple = u("uRipple");
    const uDrops = u("uDrops");
    const uInk = u("uInk");
    const uPaper = u("uPaper");
    const uInvert = u("uInvert");
    const uIntro = u("uIntro");

    const texture = gl.createTexture();
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let hovering = false;
    let loaded = false;
    let radius = 0;
    let lift = 0;
    const drops = new Float32Array(20).fill(-100);
    let nextDrop = 0;
    let lastDrop = { x: -1e4, y: -1e4, at: -10 };
    let nextIdle = 2;
    let time = 2;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let settled = 0;
    let introStart = 0;
    let intro = reduce ? 1 : 0;

    const recolor = () => {
      const s = settings.current;
      const ink = resolveColor(root, s.inkColor);
      const paper = resolveColor(root, s.paperColor);
      const luma = (c: [number, number, number]) => c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114;
      gl.uniform3f(uInk, ink[0], ink[1], ink[2]);
      gl.uniform3f(uPaper, paper[0], paper[1], paper[2]);
      gl.uniform1f(uInvert, luma(paper) < luma(ink) ? 1 : 0);
    };

    const drop = (x: number, y: number, strength: number) => {
      const i = nextDrop * 4;
      drops[i] = x;
      drops[i + 1] = y;
      drops[i + 2] = time;
      drops[i + 3] = strength;
      nextDrop = (nextDrop + 1) % 5;
    };

    const draw = () => {
      if (!loaded) return;
      const s = settings.current;
      const still = reduce || s.paused;
      if (!hovering) {
        target.x = canvas.width * (0.5 + Math.sin(time * 0.29) * 0.26);
        target.y = canvas.height * (0.55 + Math.sin(time * 0.41 + 0.8) * 0.2);
      }
      const k = still ? 1 : 0.12;
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      const size = Math.min(canvas.width, canvas.height) * (0.12 + clamp01(s.bulgeSize) * 0.3);
      radius += (size - radius) * (still ? 1 : 0.08);
      lift += (clamp01(s.bulge) * (hovering ? 1 : 0.6) - lift) * (still ? 1 : 0.06);
      if (!still && !hovering && time > nextIdle) {
        drop(current.x, current.y, 0.6);
        nextIdle = time + 2.4 + Math.random() * 1.6;
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uCell, Math.max(3, s.dotSize) * dpr);
      gl.uniform1f(uAngle, (s.angle * Math.PI) / 180);
      gl.uniform1f(uWave, clamp01(s.wave) * 0.32);
      gl.uniform1f(uGain, 0.6 + clamp01(s.contrast) * 1.16);
      gl.uniform2f(uPointer, current.x, current.y);
      gl.uniform1f(uRadius, radius);
      gl.uniform1f(uBulge, lift);
      gl.uniform1f(uRipple, clamp01(s.ripples));
      gl.uniform4fv(uDrops, drops);
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (!hovering) {
        current.x = target.x = canvas.width * 0.5;
        current.y = target.y = canvas.height * 0.55;
      }
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
      draw();
      frame = !settings.current.paused || intro < 1 ? requestAnimationFrame(loop) : 0;
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (loaded && !reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    redraw.current = (withColors = false) => {
      if (withColors) recolor();
      play();
      draw();
    };

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform2f(uTexRes, image.naturalWidth, image.naturalHeight);
      loaded = true;
      recolor();
      draw();
      setReady(true);
      play();
    };
    image.onerror = () => setFailed(true);
    image.src = src;

    const onMove = (event: PointerEvent) => {
      const s = settings.current;
      if (!s.interactive || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      hovering = inside;
      if (inside) {
        const scale = canvas.width / Math.max(1, rect.width);
        target.x = (event.clientX - rect.left) * scale;
        target.y = (rect.bottom - event.clientY) * scale;
        const gap = Math.max(3, s.dotSize) * dpr * 4;
        if (time - lastDrop.at > 0.12 && Math.hypot(target.x - lastDrop.x, target.y - lastDrop.y) > gap) {
          lastDrop = { x: target.x, y: target.y, at: time };
          drop(target.x, target.y, 1);
        }
      }
      if (reduce || s.paused) draw();
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

    return () => {
      cancelAnimationFrame(frame);
      redraw.current = () => {};
      image.onload = null;
      image.onerror = null;
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src, reduce]);

  useEffect(() => {
    redraw.current(true);
  }, [inkColor, paperColor]);

  useEffect(() => {
    redraw.current(false);
  }, [dotSize, angle, wave, speed, contrast, bulge, bulgeSize, ripples, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      {alt && <span className="sr-only">{alt}</span>}
      {failed ? (
        <img src={src} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover contrast-125 grayscale" />
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
