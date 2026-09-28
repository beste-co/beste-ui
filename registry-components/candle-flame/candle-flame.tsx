"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface CandleFlameProps {
  /** Color of the flame's mantle. Any CSS color, tokens included. */
  flameColor?: string;
  /** Color of the bright core. */
  coreColor?: string;
  /** Color of the light the flame throws on the scene. */
  glowColor?: string;
  /** Color of the dark room around the candle. */
  groundColor?: string;
  /** Draw the wax pillar under the flame. */
  candle?: boolean;
  /** Color of the wax. */
  waxColor?: string;
  /** How much the flame flickers, 0 to 1. */
  flicker?: number;
  /** Gentle idle sway, 0 to 1. */
  sway?: number;
  /** How often a thin wisp of smoke curls up, 0 (never) to 1. */
  smoke?: number;
  /** Strength of the warm light around the flame, 0 to 1. */
  glow?: number;
  /** How strongly the cursor's breath bends the flame, 0 to 1. */
  breath?: number;
  /** Horizontal position of the candle, 0 (left) to 1 (right). */
  position?: number;
  /** Size of the candle and flame, 0 to 1. */
  size?: number;
  /** The flame answers the cursor. */
  interactive?: boolean;
  /** Freeze the flame where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const candleFlameDemo: CandleFlameProps = {
  flameColor: "#ff9a3c",
  coreColor: "#fff3d6",
  glowColor: "#ff8a2a",
  groundColor: "#120d0a",
  candle: true,
  waxColor: "#efe3cf",
  flicker: 0.5,
  sway: 0.5,
  smoke: 0.5,
  glow: 0.6,
  breath: 0.6,
  position: 0.5,
  size: 0.5,
  interactive: true,
  className: "aspect-[4/5] w-full max-w-md",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uPos;
uniform float uScale;
uniform float uBend;
uniform float uGutter;
uniform float uSmoke;
uniform float uFlicker;
uniform float uGlow;
uniform float uCandle;
uniform vec3 uFlame;
uniform vec3 uCore;
uniform vec3 uGlowColor;
uniform vec3 uGround;
uniform vec3 uWax;

float hash(float n){return fract(sin(n)*43758.5453);}
float noise(float x){float i=floor(x);float f=fract(x);float u=f*f*(3.-2.*f);return mix(hash(i),hash(i+1.),u);}

void main(){
  vec2 frag=gl_FragCoord.xy;
  vec2 uv=(frag-vec2(uPos*uRes.x,0.4*uRes.y))/uRes.y*uScale;
  float t=uTime;
  float n=noise(t*2.1)*.6+noise(t*5.3+7.)*.28+noise(t*11.+3.)*.12;
  float h=.62*(1.+uFlicker*(n-.5)*.35-uGutter*.3);

  // Flame space: the tip leans further than the base, with a faint ripple
  vec2 q=uv;
  float yr=clamp(q.y/h,0.,1.4);
  q.x-=uBend*pow(yr,1.6)*.26;
  q.x+=sin(q.y*16.-t*8.)*.005*(uFlicker+uGutter*2.)*yr;
  float yn=q.y/h;
  float wid=.07*(.5+1.25*clamp(yn,0.,1.))*pow(max(1.-yn,0.),.85);
  wid+=.03*(1.-smoothstep(0.,.28,yn))*smoothstep(-.12,.04,yn);
  wid*=1.-uGutter*.25;
  float bx=q.x/max(wid,.0001);
  float body=exp(-bx*bx)*smoothstep(-.12,.02,yn)*(1.-smoothstep(.86,1.03,yn));
  float core=pow(body,3.)*(1.-smoothstep(.55,.9,yn));
  float blue=(1.-smoothstep(0.,.2,yn))*smoothstep(-.12,0.,yn)*(1.-core);
  vec3 flame=uFlame*body*1.15+uCore*core*1.6+vec3(.18,.32,1.)*blue*body*.7;

  // Warm light thrown on the room, breathing with the flame
  vec2 gc=uv-vec2(uBend*.05,h*.35);
  float glow=exp(-dot(gc,gc)*2.2)*uGlow*(.85+.3*(n-.5));
  float wide=exp(-dot(gc,gc)*.35)*uGlow*.35;
  vec3 col=uGround+uGlowColor*(glow*.55+wide*.25);

  if(uCandle>.5){
    float R=.24;
    float nx=uv.x/R;
    float capY=-.035;
    float ellH=.045;
    float s=sqrt(max(1.-nx*nx,0.));
    float side=step(abs(nx),1.)*step(uv.y,capY);
    float cy=(uv.y-capY)/ellH;
    float capD=nx*nx+cy*cy;
    float cap=1.-smoothstep(.97,1.,capD);
    float lit=exp((uv.y-capY)*4.5);
    vec3 wax=uWax*(.32+.5*s)*(.55+.45*lit)+uGlowColor*.3*exp((uv.y-capY)*6.)*s;
    vec3 pool=uWax*.82+uGlowColor*.22;
    pool=mix(pool,uWax*1.02,smoothstep(.72,.95,capD));
    float py=uv.y-capY-.012;
    pool+=vec3(1.,.85,.6)*exp(-(uv.x*uv.x/.0025+py*py/.0003))*.35;
    col=mix(col,wax,side*(1.-cap));
    col=mix(col,pool,cap);
    float wick=(1.-smoothstep(.004,.008,abs(uv.x-uBend*.012)))*step(capY-.004,uv.y)*step(uv.y,.05);
    vec3 wickCol=mix(vec3(.07,.05,.04),vec3(1.,.42,.12)*.9,smoothstep(.02,.05,uv.y));
    col=mix(col,wickCol,wick);
  }

  // A thin wisp of smoke curling up from the tip now and then
  float sy=uv.y-h*.95;
  float px=sin(sy*7.-t*1.3)*.035*sy+sin(sy*3.+t*.6)*.02*sy+uBend*.1*sy;
  float sw=.004+.018*max(sy,0.);
  float wx=(uv.x-px)/sw;
  float wisp=exp(-wx*wx)*smoothstep(0.,.06,sy)*(1.-smoothstep(.35,1.3,sy))*uSmoke;
  col=mix(col,vec3(.55,.52,.5),wisp*.35);

  col=col*(1.-min(body,1.)*.7)+flame;
  vec2 v=frag/uRes-.5;
  col*=1.-.35*dot(v,v);
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

export function CandleFlame({
  flameColor = "#ff9a3c",
  coreColor = "#fff3d6",
  glowColor = "#ff8a2a",
  groundColor = "#120d0a",
  candle = true,
  waxColor = "#efe3cf",
  flicker = 0.5,
  sway = 0.5,
  smoke = 0.5,
  glow = 0.6,
  breath = 0.6,
  position = 0.5,
  size = 0.5,
  interactive = true,
  paused = false,
  className,
  children,
}: CandleFlameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ flameColor, coreColor, glowColor, groundColor, candle, waxColor, flicker, sway, smoke, glow, breath, position, size, interactive, paused });
  settings.current = { flameColor, coreColor, glowColor, groundColor, candle, waxColor, flicker, sway, smoke, glow, breath, position, size, interactive, paused };
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
    const uPos = u("uPos");
    const uScale = u("uScale");
    const uBend = u("uBend");
    const uGutter = u("uGutter");
    const uSmoke = u("uSmoke");
    const uFlicker = u("uFlicker");
    const uGlow = u("uGlow");
    const uCandle = u("uCandle");
    const uFlame = u("uFlame");
    const uCore = u("uCore");
    const uGlowColor = u("uGlowColor");
    const uGround = u("uGround");
    const uWax = u("uWax");

    let time = 3;
    let frame = 0;
    let visible = true;
    let lastFrame = 0;
    let average = 16.7;
    let quality = 1;
    let tick = 0;
    // Breath: a spring bends the flame away from the cursor; fast movement makes it gutter
    let bend = 0;
    let bendVel = 0;
    let bendTarget = 0;
    let gutter = 0;
    let gutterTarget = 0;
    let smokeLevel = 0;
    let smokeAge = 99;
    let nextSmoke = 5 + Math.random() * 6;
    const pointer = { x: 0, y: 0, t: 0, has: false };

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uFlame, ...resolveColor(root, s.flameColor));
      gl.uniform3f(uCore, ...resolveColor(root, s.coreColor));
      gl.uniform3f(uGlowColor, ...resolveColor(root, s.glowColor));
      gl.uniform3f(uGround, ...resolveColor(root, s.groundColor));
      gl.uniform3f(uWax, ...resolveColor(root, s.waxColor));
    };

    const draw = () => {
      const s = settings.current;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uPos, clamp01(s.position));
      gl.uniform1f(uScale, 3 / (0.5 + clamp01(s.size)));
      gl.uniform1f(uBend, bend);
      gl.uniform1f(uGutter, gutter);
      gl.uniform1f(uSmoke, smokeLevel);
      gl.uniform1f(uFlicker, clamp01(s.flicker));
      gl.uniform1f(uGlow, clamp01(s.glow) * 1.4);
      gl.uniform1f(uCandle, s.candle ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    };

    const step = (dt: number) => {
      const s = settings.current;
      time += dt;
      const idle = (Math.sin(time * 0.7) * 0.16 + Math.sin(time * 1.9 + 1) * 0.05) * clamp01(s.sway);
      bendVel += ((bendTarget + idle - bend) * 40 - bendVel * 7.5) * dt;
      bend += bendVel * dt;
      bendTarget *= Math.exp(-dt * 1.5);
      gutterTarget *= Math.exp(-dt * 3);
      gutter += (gutterTarget - gutter) * Math.min(1, dt * 10);
      if (gutter > 0.45 && smokeAge > 3) smokeAge = 0;
      if (clamp01(s.smoke) > 0 && time > nextSmoke) {
        smokeAge = 0;
        nextSmoke = time + (14 - clamp01(s.smoke) * 9) * (0.7 + Math.random() * 0.6);
      }
      smokeAge += dt;
      const rise = Math.min(1, smokeAge / 1.2);
      const fall = Math.exp(-Math.max(0, smokeAge - 1.2) / 1.8);
      smokeLevel = clamp01(s.smoke) > 0 ? rise * fall : 0;
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      average += (delta - average) * 0.05;
      lastFrame = now;
      tick++;
      if (tick % 90 === 0 && average > 22 && quality > 0.6) {
        quality = Math.max(0.6, quality - 0.15);
        resize();
      }
      step(delta / 1000);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    redraw.current = (withColors = false) => {
      if (withColors) recolor();
      play();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      const s = settings.current;
      if (!s.interactive || reduce || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        pointer.has = false;
        return;
      }
      const now = performance.now();
      const x = (event.clientX - rect.left) / rect.height;
      const y = (rect.bottom - event.clientY) / rect.height;
      const fx = (clamp01(s.position) * rect.width) / rect.height;
      const fy = 0.47;
      const dx = x - fx;
      const dy = y - fy;
      const near = Math.exp(-(dx * dx + dy * dy) / 0.06);
      const strength = clamp01(s.breath);
      bendTarget = (dx < 0 ? 1 : -1) * near * strength * 1.3;
      if (pointer.has) {
        const speed = Math.hypot(x - pointer.x, y - pointer.y) / Math.max(0.008, (now - pointer.t) / 1000);
        gutterTarget = Math.max(gutterTarget, clamp01(speed * near * strength * 0.35));
      }
      pointer.x = x;
      pointer.y = y;
      pointer.t = now;
      pointer.has = true;
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
  }, [flameColor, coreColor, glowColor, groundColor, waxColor]);

  useEffect(() => {
    redraw.current(false);
  }, [candle, flicker, sway, smoke, glow, breath, position, size, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: groundColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at ${clamp01(position) * 100}% 48%, ${glowColor} 0%, transparent 38%)`, opacity: 0.55 }}
        />
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
