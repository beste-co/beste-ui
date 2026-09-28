"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface CloudSkyProps {
  /** Sky color overhead. Any CSS color. */
  skyTop?: string;
  /** Sky color at the horizon, where the sun sits low. */
  skyHorizon?: string;
  /** Color of the sunlight on the cloud edges and the sun glow. */
  sunColor?: string;
  /** Horizontal position of the sun, 0 (left) to 1 (right). */
  sunX?: number;
  /** Height of the sun, 0 (bottom) to 1 (top). */
  sunY?: number;
  /** How much of the sky the clouds cover, 0 to 1. */
  coverage?: number;
  /** Softness of the cloud edges, 0 (crisp) to 1 (misty). */
  softness?: number;
  /** Drift speed, 1 is the default pace. */
  speed?: number;
  /** Cloud layers at different depths, 1 to 4. */
  layers?: number;
  /** The view steers slightly with the cursor. */
  interactive?: boolean;
  /** Freeze the sky where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const cloudSkyDemo: CloudSkyProps = {
  skyTop: "#5d6f96",
  skyHorizon: "#f3c79a",
  sunColor: "#fff1d6",
  sunX: 0.72,
  sunY: 0.34,
  coverage: 0.55,
  softness: 0.5,
  speed: 1,
  layers: 4,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uSun;
uniform vec2 uSunPos;
uniform float uCoverage;
uniform float uSoft;
uniform float uLayers;
uniform vec2 uLook;
uniform float uIntro;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}
  return v;
}
// Billowy cumulus density: a warped fbm, with puffy tops from a folded first octave
float cloud(vec2 p,float t){
  vec2 w=vec2(noise(p*.6+vec2(t*.2,0.)),noise(p*.6+vec2(5.2,1.3)-t*.15))-.5;
  p+=w*.9;
  float puff=1.-abs(noise(p*.8+vec2(-t*.1,3.1))*2.-1.);
  return fbm(p)*.78+puff*.22;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float aspect=uRes.x/uRes.y;
  vec2 sp=vec2(uv.x*aspect,uv.y);
  vec2 sun=vec2(uSunPos.x*aspect,uSunPos.y);

  // Sky: overhead color into a warm horizon, a soft sun glow and a wider halo
  float h=smoothstep(-.05,1.,uv.y);
  vec3 col=mix(uHorizon,uTop,pow(h,.85));
  float sd=length(sp-sun);
  col+=uSun*(exp(-sd*9.)*.9+exp(-sd*2.6)*.25);

  vec2 lightDir=normalize(sun-sp+vec2(.0001));
  // During the intro the threshold eases down, so clouds condense out of clear sky
  float thr=mix(.78,.36,uCoverage)+(1.-uIntro)*.3;
  float soft=mix(.04,.3,uSoft);

  for(int i=0;i<4;i++){
    float fi=float(i);
    if(fi>=uLayers)break;
    float depth=(fi+1.)/uLayers;            // 0 far .. 1 near
    float freq=mix(3.2,1.25,depth);         // near clouds are larger
    float band=mix(.42,.62,depth);          // far clouds sit near the horizon
    float mask=smoothstep(band-.5,band-.18,uv.y)*(1.-smoothstep(band+.2,band+.62,uv.y));
    mask=mix(mask,1.,depth*depth*.55);

    vec2 p=sp*freq+vec2(fi*17.3,fi*5.1);
    p+=vec2(uTime*mix(.015,.07,depth),uTime*.004)+uLook*depth*.35;

    float t=uTime*.03;
    float d=cloud(p,t);
    float c=smoothstep(thr,thr+soft,d)*mask;
    if(c<.002)continue;

    // Light: density falls away toward the sun on the lit side
    float dl=cloud(p+lightDir*.09*freq,t);
    float lit=clamp((d-dl)*5.5+.55,0.,1.);
    float thick=smoothstep(thr,thr+soft+.25,d);

    vec3 shadow=mix(uTop,uHorizon,.35)*mix(.7,.95,1.-depth*.4);
    vec3 cloudCol=mix(shadow,uSun,lit*.9);
    // Silver lining where thin cloud edges face the low sun
    float rim=(1.-thick)*(1.-smoothstep(0.,.45,sd));
    cloudCol+=uSun*rim*.55;
    // Distance haze pulls far clouds toward the horizon color
    cloudCol=mix(cloudCol,mix(uHorizon,uTop,h*.6),(1.-depth)*.45);
    col=mix(col,cloudCol,c*mix(.75,.96,depth));
  }

  col+=(hash(gl_FragCoord.xy+fract(uTime))-.5)*(1.5/255.);
  col=mix(mix(uHorizon,uTop,uv.y),col,uIntro);
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

export function CloudSky({
  skyTop = "#5d6f96",
  skyHorizon = "#f3c79a",
  sunColor = "#fff1d6",
  sunX = 0.72,
  sunY = 0.34,
  coverage = 0.55,
  softness = 0.5,
  speed = 1,
  layers = 4,
  interactive = true,
  paused = false,
  className,
  children,
}: CloudSkyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ skyTop, skyHorizon, sunColor, sunX, sunY, coverage, softness, speed, layers, interactive, paused });
  settings.current = { skyTop, skyHorizon, sunColor, sunX, sunY, coverage, softness, speed, layers, interactive, paused };
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
    const uTop = u("uTop");
    const uHorizon = u("uHorizon");
    const uSun = u("uSun");
    const uSunPos = u("uSunPos");
    const uCoverage = u("uCoverage");
    const uSoft = u("uSoft");
    const uLayers = u("uLayers");
    const uLook = u("uLook");
    const uIntro = u("uIntro");

    // The gentle parallax steer that follows the cursor
    const target = { lx: 0, ly: 0 };
    const current = { lx: 0, ly: 0 };
    let time = 40;
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
      gl.uniform3f(uTop, ...resolveColor(root, s.skyTop));
      gl.uniform3f(uHorizon, ...resolveColor(root, s.skyHorizon));
      gl.uniform3f(uSun, ...resolveColor(root, s.sunColor));
    };

    const draw = () => {
      const s = settings.current;
      const still = reduce || s.paused;
      current.lx += (target.lx - current.lx) * (still ? 1 : 0.03);
      current.ly += (target.ly - current.ly) * (still ? 1 : 0.03);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uSunPos, clamp01(s.sunX), clamp01(s.sunY));
      gl.uniform1f(uCoverage, clamp01(s.coverage));
      gl.uniform1f(uSoft, clamp01(s.softness));
      gl.uniform1f(uLayers, Math.max(1, Math.min(4, Math.round(s.layers))));
      gl.uniform2f(uLook, current.lx, current.ly);
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      // Clouds are soft, so a reduced buffer stretched by CSS reads the same and costs far less
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6 * quality;
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
      // Clouds drift slowly, so idle frames alternate; the cursor gets full rate
      const active = now - lastMove < 1500 || Math.abs(target.lx - current.lx) + Math.abs(target.ly - current.ly) > 0.002 || intro < 1;
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
      if (!inside) {
        target.lx = 0;
        target.ly = 0;
        return;
      }
      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      const y = (rect.bottom - event.clientY) / Math.max(1, rect.height);
      target.lx = (x - 0.5) * 0.6;
      target.ly = (y - 0.5) * 0.3;
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
  }, [skyTop, skyHorizon, sunColor]);

  useEffect(() => {
    redraw.current(false);
  }, [sunX, sunY, coverage, softness, speed, layers, interactive, paused]);

  const sunLeft = `${clamp01(sunX) * 100}%`;
  const sunTop = `${(1 - clamp01(sunY)) * 100}%`;

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={{ background: `linear-gradient(to bottom, ${skyTop}, ${skyHorizon})` }}
    >
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${sunLeft} ${sunTop}, ${sunColor} 0%, transparent 28%), radial-gradient(60% 30% at 30% 70%, rgba(255,255,255,0.55), transparent 70%), radial-gradient(50% 25% at 75% 58%, rgba(255,255,255,0.45), transparent 70%)`,
          }}
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
