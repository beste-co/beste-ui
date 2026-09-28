"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface ReededLightProps {
  /** Darkest tone of the field, also used for the veil and vignette. */
  groundColor?: string;
  /** Soft glow pooled in the corner the light comes from. */
  glowColor?: string;
  /** Broad haze band across the field. */
  hazeColor?: string;
  /** Narrow bright band, crisp on its leading edge. */
  accentColor?: string;
  /** Direction the light runs across the field, in degrees (0 is left to right, 90 is top to bottom). */
  angle?: number;
  /** Where the accent band crosses the field, 0 to 1. */
  band?: number;
  /** Width of one glass reed, in CSS pixels. */
  reedWidth?: number;
  /** How much each reed magnifies the light behind it, 0 to 1. */
  magnify?: number;
  /** Slow sway in the reeds, like hand-cast glass, 0 (straight) to 1. */
  ripple?: number;
  /** Shadow on each reed's flank and glint on its edge, 0 to 1. */
  shading?: number;
  /** Film grain, 0 to 1. It also keeps long gradients from banding. */
  grain?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** A warm lamp behind the glass follows the cursor. */
  interactive?: boolean;
  /** Strength of that lamp, 0 to 1. */
  lamp?: number;
  /** Center of a darker veil that keeps copy readable, 0 to 1 on each axis (y runs down). */
  veilX?: number;
  veilY?: number;
  /** Strength of the veil, 0 (off) to 1. */
  veil?: number;
  /** Freeze the light where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const reededLightDemo: ReededLightProps = {
  groundColor: "#07080f",
  glowColor: "#f2dccb",
  hazeColor: "#34397e",
  accentColor: "#e2457a",
  angle: 35,
  band: 0.66,
  reedWidth: 34,
  magnify: 0.5,
  ripple: 0.35,
  shading: 0.6,
  grain: 0.5,
  speed: 1,
  interactive: true,
  lamp: 0.6,
  veilX: 0.5,
  veilY: 0.5,
  veil: 0.25,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uPointer;
uniform vec3 uGround;
uniform vec3 uGlow;
uniform vec3 uHaze;
uniform vec3 uAccent;
uniform vec2 uDir;
uniform float uBand;
uniform float uReed;
uniform float uMag;
uniform float uShade;
uniform float uGrain;
uniform float uLamp;
uniform vec3 uVeil;
uniform float uRipple;
uniform float uIntro;

float hash(vec2 p){
  p=fract(p*vec2(443.897,441.423));
  p+=dot(p,p.yx+19.19);
  return fract((p.x+p.y)*p.x);
}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.07+vec2(5.3,11.7);a*=.5;}
  return v;
}

float t;
float aspect;
float bend;

// The light behind the glass: a glow pooled at the source corner, a broad haze,
// a dark ground and a narrow accent band, all laid out along uDir
vec3 field(vec2 p){
  vec2 q=(p-.5)*vec2(aspect,1.);
  vec2 side=vec2(-uDir.y,uDir.x);
  float span=abs(uDir.x)*aspect+abs(uDir.y);
  float d=dot(q,uDir)/span+.5+bend;
  float across=dot(q,side);

  vec3 col=uGround;

  float haze=exp(-pow((d-(uBand-.34))/.19,2.))*(.72+.28*sin(across*2.2+t*1.1));
  col=mix(col,uHaze,clamp(haze,0.,1.)*.88);

  vec2 g=q+uDir*span*.56+.03*vec2(sin(t*.8),cos(t*.65));
  vec2 gl=vec2(dot(g,uDir),dot(g,side))/vec2(.26,.62);
  col=mix(col,uGlow,smoothstep(0.,1.,exp(-dot(gl,gl))));

  float e=d-(uBand+.04*sin(t*.23)+(1.-uIntro)*.3+.018*sin(t*.7+across*1.8));
  float lead=exp(-pow(e/(e<0.?.032:.08),2.));
  col=mix(col,uAccent*.32,exp(-pow((e-.1)/.085,2.))*.55);
  col=mix(col,uAccent,clamp(lead,0.,1.));

  vec2 l=(p-uPointer.xy)*vec2(aspect,1.);
  return col+uPointer.z*uLamp*exp(-dot(l,l)/.045)*vec3(.24,.16,.11);
}

vec2 through(float i,float f,vec2 uv,float drift){
  return vec2(((i+.5)+(f-.5)*uMag)*uReed/uRes.x+drift,uv.y+(f-.5)*.016);
}

void main(){
  aspect=uRes.x/max(uRes.y,1.);
  t=uTime;
  vec2 uv=vec2(gl_FragCoord.x/uRes.x,1.-gl_FragCoord.y/uRes.y);
  bend=(fbm(vec2(uv.x*aspect,uv.y)*1.3+vec2(t*.3,-t*.2))-.5)*.15;

  // Each reed shows a magnified, slightly tipped slice of the field behind it
  float sway=sin(uv.y*aspect*3.1+t*.32)+.45*sin(uv.y*aspect*7.3-t*.21+1.7);
  float s=(gl_FragCoord.x+sway*uRipple*uIntro*uReed*.42)/uReed;
  float i=floor(s);
  float f=s-i;
  float drift=(uPointer.x-.5)*uPointer.z*.01;
  vec3 col=field(through(i,f,uv,drift));

  // Blend across each seam with the neighbouring reed's view so joins stay soft
  float dirn=f<.5?-1.:1.;
  vec3 next=field(through(i+dirn,f-dirn,uv,drift));
  float seam=min(f,1.-f)*uReed;
  col=mix(col,next,.5*(1.-smoothstep(0.,1.8,seam)));

  // Rounded reed: a shaded flank on the left, a fine glint near the right edge
  col*=mix(1.-.3*uShade,1.,smoothstep(0.,.45,f))*mix(1.,1.-.05*uShade,smoothstep(.72,1.,f));
  float lum=dot(col,vec3(.299,.587,.114));
  col+=exp(-pow((f-.82)/.05,2.))*.06*uShade*(.3+lum);

  vec2 v=(uv-uVeil.xy)*vec2(aspect/1.5,1.)/vec2(.4,.3);
  col=mix(col,uGround,exp(-dot(v,v))*uVeil.z);

  vec2 c=uv-.5;
  col*=1.-.3*pow(length(c*vec2(1.,1.1))*1.35,2.2);

  // Static triangular grain, strongest in the mids; it also dithers the gradients
  float n=hash(gl_FragCoord.xy)+hash(gl_FragCoord.yx+31.7)-1.;
  lum=dot(col,vec3(.299,.587,.114));
  col+=n*.06*uGrain*(.35+lum*(1.-lum)*2.6);

  // The light comes up out of the flat ground, grain included
  gl_FragColor=vec4(mix(uGround,clamp(col,0.,1.),uIntro),1.);
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

export function ReededLight({
  groundColor = "#07080f",
  glowColor = "#f2dccb",
  hazeColor = "#34397e",
  accentColor = "#e2457a",
  angle = 35,
  band = 0.66,
  reedWidth = 34,
  magnify = 0.5,
  ripple = 0.35,
  shading = 0.6,
  grain = 0.5,
  speed = 1,
  interactive = true,
  lamp = 0.6,
  veilX = 0.5,
  veilY = 0.5,
  veil = 0.25,
  paused = false,
  className,
  children,
}: ReededLightProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ groundColor, glowColor, hazeColor, accentColor, angle, band, reedWidth, magnify, ripple, shading, grain, speed, interactive, lamp, veilX, veilY, veil, paused });
  settings.current = { groundColor, glowColor, hazeColor, accentColor, angle, band, reedWidth, magnify, ripple, shading, grain, speed, interactive, lamp, veilX, veilY, veil, paused };
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
    const uGround = u("uGround");
    const uGlow = u("uGlow");
    const uHaze = u("uHaze");
    const uAccent = u("uAccent");
    const uDir = u("uDir");
    const uBand = u("uBand");
    const uReed = u("uReed");
    const uMag = u("uMag");
    const uShade = u("uShade");
    const uGrain = u("uGrain");
    const uLamp = u("uLamp");
    const uVeil = u("uVeil");
    const uRipple = u("uRipple");
    const uIntro = u("uIntro");

    const target = { x: 0.5, y: 0.5, on: 0 };
    const current = { x: 0.5, y: 0.5, on: 0 };
    let time = 0;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let lastMove = -10000;
    let tick = 0;
    let settled = 0;
    // The light comes up out of the dark ground once, starting the first time it is on screen
    const INTRO_MS = 2400;
    let introStart = 0;
    let intro = reduce ? 1 : 0;

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uGround, ...resolveColor(root, s.groundColor));
      gl.uniform3f(uGlow, ...resolveColor(root, s.glowColor));
      gl.uniform3f(uHaze, ...resolveColor(root, s.hazeColor));
      gl.uniform3f(uAccent, ...resolveColor(root, s.accentColor));
    };

    const draw = () => {
      const s = settings.current;
      const still = reduce || s.paused;
      const k = still ? 1 : 0.07;
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      current.on += (target.on - current.on) * (still ? 1 : 0.05);
      const radians = (s.angle * Math.PI) / 180;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, still ? 6 : time);
      gl.uniform3f(uPointer, current.x, current.y, s.interactive ? current.on : 0);
      gl.uniform2f(uDir, Math.cos(radians), Math.sin(radians));
      gl.uniform1f(uBand, clamp01(s.band));
      gl.uniform1f(uReed, Math.max(8, s.reedWidth) * dpr);
      gl.uniform1f(uMag, 1.4 + clamp01(s.magnify) * 2.4);
      gl.uniform1f(uShade, clamp01(s.shading));
      gl.uniform1f(uGrain, clamp01(s.grain));
      gl.uniform1f(uLamp, clamp01(s.lamp));
      gl.uniform3f(uVeil, clamp01(s.veilX), clamp01(s.veilY), clamp01(s.veil));
      gl.uniform1f(uRipple, clamp01(s.ripple));
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;
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
      const arriving = intro < 1;
      if (arriving) {
        introStart ||= now;
        const k = clamp01((now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      const paused = settings.current.paused;
      if (!paused) time += (delta / 1000) * 0.9 * settings.current.speed;
      // The light drifts slowly, so idle frames alternate; the cursor gets full rate
      const active = now - lastMove < 1500 || Math.abs(target.on - current.on) > 0.02 || arriving;
      if (active || tick % 2 === 0) draw();
      frame = paused && !arriving ? 0 : requestAnimationFrame(loop);
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
      target.on = inside ? 1 : 0;
      if (!inside) return;
      target.x = (event.clientX - rect.left) / Math.max(1, rect.width);
      target.y = (event.clientY - rect.top) / Math.max(1, rect.height);
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
  }, [groundColor, glowColor, hazeColor, accentColor]);

  useEffect(() => {
    redraw.current(false);
  }, [angle, band, reedWidth, magnify, ripple, shading, grain, speed, interactive, lamp, veilX, veilY, veil, paused]);

  // The same light as a CSS gradient, only when WebGL is missing; otherwise the ground holds until the light comes up
  const fallback = `radial-gradient(55% 60% at ${50 - Math.cos((angle * Math.PI) / 180) * 50}% ${50 - Math.sin((angle * Math.PI) / 180) * 50}%, ${glowColor}, transparent 70%), linear-gradient(${angle + 90}deg, transparent 12%, ${hazeColor} 30%, ${groundColor} 50%, ${accentColor} ${Math.round(band * 100)}%, ${groundColor} 82%), ${groundColor}`;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ background: failed ? fallback : groundColor }}>
      {!failed && (
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
