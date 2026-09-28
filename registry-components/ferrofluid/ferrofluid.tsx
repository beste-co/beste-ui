"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface FerrofluidProps {
  /** Color of the magnetic fluid. Any CSS color. */
  fluidColor?: string;
  /** Color of the matte surface the dish sits on. Any CSS color, tokens included. */
  surfaceColor?: string;
  /** Color of the studio lights reflected in the fluid. */
  highlightColor?: string;
  /** Size of the pool, 0 to 1. */
  size?: number;
  /** How many spikes the crown packs in, 0 (few, wide) to 1 (many, fine). */
  density?: number;
  /** How tall the spikes grow, 0 to 1. */
  spikeHeight?: number;
  /** How far the magnet's pull reaches across the pool, 0 to 1. */
  reach?: number;
  /** How quickly the fluid answers the magnet, 0 (slow, heavy) to 1 (quick). */
  response?: number;
  /** Sharpness of the reflections, 0 (satin) to 1 (mirror). */
  gloss?: number;
  /** Brightness of the reflected studio lights, 0 to 1. */
  highlight?: number;
  /** An invisible magnet drifts over the pool when nobody is pointing. */
  idleMagnet?: boolean;
  /** The cursor acts as the magnet. */
  interactive?: boolean;
  /** Freeze the fluid where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const ferrofluidDemo: FerrofluidProps = {
  fluidColor: "#08080a",
  surfaceColor: "var(--background)",
  highlightColor: "#ffffff",
  size: 0.6,
  density: 0.5,
  spikeHeight: 0.6,
  reach: 0.5,
  response: 0.5,
  gloss: 0.7,
  highlight: 0.8,
  idleMagnet: true,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Orthographic camera 32 degrees above the table: low enough that the spikes stand in profile
// against the surface behind the pool. The height field is ray-marched along the view ray.
const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uMagnet;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uSpacing;
uniform float uSpike;
uniform float uReach;
uniform float uBlur;
uniform float uLight;
uniform vec3 uFluid;
uniform vec3 uSurface;
uniform vec3 uHigh;

const float SA=.530;
const float CA=.848;

float fluidHeight(vec2 p){
  float r=length(p);
  float edge=clamp(1.-r*r/(uRadius*uRadius),0.,1.);
  if(edge<=0.)return 0.;
  // A liquid lens: rounded edge, gently domed top
  float mound=.055*pow(edge,.45);
  vec2 m=uMagnet.xy;
  float s=uMagnet.z;
  vec2 gp=p/uSpacing;
  vec2 a=mod(gp,vec2(1.,1.732))-vec2(.5,.866);
  vec2 b=mod(gp-vec2(.5,.866),vec2(1.,1.732))-vec2(.5,.866);
  vec2 off=dot(a,a)<dot(b,b)?a:b;
  vec2 q=p-off*uSpacing;
  vec2 dq=q-m;
  float g=exp(-dot(dq,dq)/(uReach*uReach))*s*smoothstep(uRadius,uRadius*.72,length(q));
  vec2 lean=(m-q)/(length(m-q)+.0001)*uSpacing*.2*g;
  float cell=uSpacing*.52;
  float d0=length(p-q)/cell;
  float d=length(p-q-lean*clamp(1.-d0,0.,1.))/cell;
  // Concave flanks and a needle tip, the Rosensweig spike profile
  float cone=pow(clamp(1.-d,0.,1.),1.6);
  float breathe=1.+.035*sin(uTime*2.1+q.x*23.+q.y*17.);
  vec2 dm=p-m;
  float lift=.04*exp(-dot(dm,dm)/(uReach*uReach*1.8))*s;
  return mound+(lift+cone*g*uSpike*breathe)*smoothstep(0.,.2,edge);
}
float dishHeight(vec2 p){
  float r=length(p);
  float rim=(r-uRadius*1.14)/(uRadius*.035);
  float plate=(1.-smoothstep(uRadius*1.12,uRadius*1.17,r))*.006;
  return plate+.012*exp(-rim*rim);
}
float height(vec2 p){return max(fluidHeight(p),dishHeight(p));}
vec2 ground(vec2 uv,float h){return vec2(uv.x,(uv.y-h*CA)/SA)-uCenter;}
float soft(float d,float w){return 1.-smoothstep(-w,w,d);}
// Studio: an overhead key softbox, a tall strip light on the left, a bright rim band low behind
vec3 env(vec3 r){
  vec3 c=uFluid*.45+vec3(.04)*smoothstep(-.1,.6,r.z);
  vec2 k=abs(r.xy-vec2(-.18,.2))-vec2(.34,.2);
  float key=soft(max(k.x,k.y),uBlur)*smoothstep(.5,.7,r.z);
  float az=atan(r.x,r.y);
  vec2 st=abs(vec2(az,r.z)-vec2(-1.15,.42))-vec2(.1,.32);
  float strip=soft(max(st.x,st.y),uBlur);
  float rim=smoothstep(.0,.08,r.z)*(1.-smoothstep(.18,.34,r.z))*smoothstep(-.1,.5,r.y);
  return c+uHigh*(key*1.35+strip*.95+rim*.75)*uLight;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  float hMax=uSpike+.12;
  float stepH=hMax/88.;
  float h=hMax;
  float hit=0.;
  for(int i=0;i<88;i++){
    if(height(ground(uv,h))>=h){hit=1.;break;}
    h-=stepH;
  }
  if(hit>.5){
    float lo=h;
    float hi=h+stepH;
    for(int j=0;j<6;j++){
      float mid=(lo+hi)*.5;
      if(height(ground(uv,mid))>=mid)lo=mid;else hi=mid;
    }
    h=lo;
  }else{
    h=0.;
  }
  vec2 p=ground(uv,h);
  float e=.0018;
  vec3 n=normalize(vec3(height(p-vec2(e,0.))-height(p+vec2(e,0.)),height(p-vec2(0.,e))-height(p+vec2(0.,e)),2.*e));
  float r=length(p);
  vec3 col;
  if(fluidHeight(p)>dishHeight(p)&&r<uRadius){
    vec3 v=vec3(0.,CA,-SA);
    vec3 refl=reflect(v,n);
    float fres=pow(1.-max(dot(n,-v),0.),4.);
    col=uFluid*.3+env(refl)*(.3+.7*fres);
  }else{
    float light=clamp(dot(n,normalize(vec3(-.35,.25,.9))),0.,1.);
    float onDish=1.-smoothstep(uRadius*1.13,uRadius*1.17,r);
    vec3 base=mix(uSurface,mix(uSurface,uFluid,.07),onDish);
    col=base*(.8+.2*light);
    // Soft contact shadow of the dish on the table, cast slightly toward the viewer
    float c=max(length(p-vec2(0.,-.02))-uRadius*1.12,0.)/(uRadius*.22);
    col*=1.-.3*exp(-c*c)*(1.-onDish);
  }
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
const SIN_TILT = 0.53;
const POOL_Y = -0.12;

export function Ferrofluid({
  fluidColor = "#08080a",
  surfaceColor = "var(--background)",
  highlightColor = "#ffffff",
  size = 0.6,
  density = 0.5,
  spikeHeight = 0.6,
  reach = 0.5,
  response = 0.5,
  gloss = 0.7,
  highlight = 0.8,
  idleMagnet = true,
  interactive = true,
  paused = false,
  className,
  children,
}: FerrofluidProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ fluidColor, surfaceColor, highlightColor, size, density, spikeHeight, reach, response, gloss, highlight, idleMagnet, interactive, paused });
  settings.current = { fluidColor, surfaceColor, highlightColor, size, density, spikeHeight, reach, response, gloss, highlight, idleMagnet, interactive, paused };
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
    const uMagnet = u("uMagnet");
    const uCenter = u("uCenter");
    const uRadius = u("uRadius");
    const uSpacing = u("uSpacing");
    const uSpike = u("uSpike");
    const uReach = u("uReach");
    const uBlur = u("uBlur");
    const uLight = u("uLight");
    const uFluid = u("uFluid");
    const uSurface = u("uSurface");
    const uHigh = u("uHigh");

    // Magnet position and pull, spring-smoothed here so the spikes never flicker
    const magnet = { x: 0, y: 0, vx: 0, vy: 0, pull: 0 };
    const goal = { x: 0, y: 0, pull: 0 };
    let hovering = false;
    let time = 0;
    let frame = 0;
    let visible = true;
    let dirty = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let settled = 0;

    const radius = () => {
      const aspect = canvas.width / Math.max(1, canvas.height);
      return Math.min(0.16 + clamp01(settings.current.size) * 0.3, aspect * 0.4);
    };

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uFluid, ...resolveColor(root, s.fluidColor));
      gl.uniform3f(uSurface, ...resolveColor(root, s.surfaceColor));
      gl.uniform3f(uHigh, ...resolveColor(root, s.highlightColor));
      dirty = true;
    };

    const draw = () => {
      const s = settings.current;
      const r = radius();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform3f(uMagnet, magnet.x, magnet.y, magnet.pull);
      gl.uniform2f(uCenter, 0, POOL_Y / SIN_TILT);
      gl.uniform1f(uRadius, r);
      gl.uniform1f(uSpacing, (0.06 - clamp01(s.density) * 0.038) * (r / 0.288));
      gl.uniform1f(uSpike, 0.05 + clamp01(s.spikeHeight) * 0.2);
      gl.uniform1f(uReach, (0.08 + clamp01(s.reach) * 0.24) * (r / 0.288));
      gl.uniform1f(uBlur, 0.1 - clamp01(s.gloss) * 0.088);
      gl.uniform1f(uLight, clamp01(s.highlight));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      dirty = false;
    };

    const aim = () => {
      const s = settings.current;
      const r = radius();
      if (hovering && s.interactive) {
        goal.pull = 1;
      } else if (s.idleMagnet) {
        // The idle magnet stays over the pool, so a crown is always standing
        goal.x = r * 0.32 * Math.sin(time * 0.31);
        goal.y = r * 0.22 * Math.sin(time * 0.47 + 1);
        goal.pull = 0.85;
      } else {
        goal.pull = 0;
      }
    };

    const settle = (dt: number) => {
      const k = (0.02 + clamp01(settings.current.response) * 0.12) * dt * 60;
      const damp = Math.min(1, 0.25 * dt * 60);
      magnet.vx = magnet.vx * (1 - damp) + (goal.x - magnet.x) * k;
      magnet.vy = magnet.vy * (1 - damp) + (goal.y - magnet.y) * k;
      magnet.x += magnet.vx;
      magnet.y += magnet.vy;
      magnet.pull += (goal.pull - magnet.pull) * Math.min(1, (0.02 + clamp01(settings.current.response) * 0.08) * dt * 60);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (reduce) {
        const r = radius();
        magnet.x = r * 0.2;
        magnet.y = r * 0.1;
        magnet.pull = 0.85;
      }
      draw();
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      lastFrame = now;
      const dt = delta / 1000;
      time += dt;
      aim();
      settle(dt);
      // A smooth, empty pool with nothing pulling on it doesn't need to be drawn again
      const moving = Math.abs(magnet.vx) + Math.abs(magnet.vy) > 1e-5 || Math.abs(goal.pull - magnet.pull) > 1e-3 || magnet.pull > 0.002;
      if (moving || dirty) {
        average += (delta - average) * 0.05;
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
        draw();
      }
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    redraw.current = (withColors = false) => {
      if (withColors) recolor();
      dirty = true;
      play();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      hovering = inside;
      if (!inside) return;
      const ux = (event.clientX - rect.left - rect.width / 2) / rect.height;
      const uy = (rect.height / 2 - (event.clientY - rect.top)) / rect.height;
      // Keep the magnet over the pool, so pointing anywhere raises a crown that leans your way
      const gx = ux;
      const gy = (uy - POOL_Y) / SIN_TILT;
      const limit = radius() * 0.78;
      const span = Math.hypot(gx, gy);
      const k = span > limit ? limit / span : 1;
      goal.x = gx * k;
      goal.y = gy * k;
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
  }, [fluidColor, surfaceColor, highlightColor]);

  useEffect(() => {
    redraw.current(false);
  }, [size, density, spikeHeight, reach, response, gloss, highlight, idleMagnet, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: surfaceColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[55%] aspect-[2/1] w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.5)]"
          style={{ background: `radial-gradient(60% 50% at 40% 35%, ${highlightColor} 0%, ${fluidColor} 28%, ${fluidColor} 100%)` }}
        />
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
