"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface SunBlindsProps {
  /** Plaster wall the light falls on. Any CSS color. */
  wallColor?: string;
  /** Color of the afternoon light. */
  lightColor?: string;
  /** Number of blind slats inside the window of light. */
  slats?: number;
  /** How soft the slat edges are, 0 (crisp) to 1 (diffuse). */
  softness?: number;
  /** How much the slats sway in the breeze, 0 to 1. */
  sway?: number;
  /** A potted plant casts its leaves into the light. */
  leaves?: boolean;
  /** Dust drifting through the beam, 0 (none) to 1. */
  dust?: number;
  /** The sun shifts a little toward the cursor. */
  interactive?: boolean;
  /** How far the sun follows the cursor, 0 to 1. */
  follow?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** Freeze the light where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const sunBlindsDemo: SunBlindsProps = {
  wallColor: "#d4bfa8",
  lightColor: "#ffcc8c",
  slats: 12,
  softness: 0.5,
  sway: 0.5,
  leaves: true,
  dust: 0.5,
  interactive: true,
  follow: 0.5,
  speed: 1,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uSun;
uniform mat2 uInv;
uniform vec2 uOrigin;
uniform float uSlats;
uniform float uSoft;
uniform float uSway;
uniform float uLeaf;
uniform float uDust;
uniform vec3 uWall;
uniform vec3 uLight;
uniform float uIntro;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float leaf(vec2 p,vec2 c,float a,vec2 size){
  vec2 q=p-c;
  float cs=cos(a),sn=sin(a);
  q=vec2(cs*q.x+sn*q.y,-sn*q.x+cs*q.y);
  return length(q/size)-1.;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 q=(uv-.5)*vec2(uRes.x/uRes.y,1.);
  float t=uTime;

  vec2 w=uInv*(q-uOrigin-uSun);
  w.x+=.012*sin(t*.31+w.y*2.)*uSway*2.;
  float depth=clamp(w.y,0.,1.);
  float pen=.012+.035*depth;
  float win=smoothstep(-pen,pen,w.x)*(1.-smoothstep(1.-pen,1.+pen,w.x))*smoothstep(-pen,pen,w.y)*(1.-smoothstep(1.-pen,1.+pen,w.y));
  win*=mix(.1,1.,smoothstep(.008,.012+pen*1.4,abs(w.x-.5)));

  float sway=(.05*sin(t*.42+w.x*1.7)+.025*sin(t*1.1+w.x*4.3+1.3))*uSway*2.;
  float s=fract(w.y*uSlats+sway);
  float duty=.6+.07*sin(t*.23);
  float e=(.07+.2*depth)*uSoft;
  float slat=smoothstep(0.,e,s)*(1.-smoothstep(duty-e*.5,duty+e*.5,s));

  vec2 base=vec2(.88,1.1);
  vec2 stemDir=vec2(-.5,-.78);
  float plant=0.;
  for(int i=0;i<7;i++){
    float fi=float(i);
    vec2 c=base+stemDir*(fi*.14)+vec2(.06*sin(fi*2.3),.03*cos(fi*1.7));
    c+=vec2(.012*sin(t*.7+fi),.008*cos(t*.9+fi*1.3));
    float a=.9+.9*sin(fi*2.1)+.08*sin(t*.8+fi);
    float d=leaf(w,c,a,vec2(.13,.042)*(1.-fi*.06));
    plant=max(plant,1.-smoothstep(-.25,.35+depth*.3,d));
  }
  vec2 pa=w-base;
  float h=clamp(dot(pa,stemDir)/dot(stemDir,stemDir),0.,1.);
  plant=max(plant,1.-smoothstep(.004,.012+pen,length(pa-stemDir*h)));
  plant*=uLeaf;

  float light=win*slat*(1.-plant*.82)*uIntro;

  float grain=noise(gl_FragCoord.xy*.35)*.5+noise(q*9.)*.35+noise(q*38.)*.15;
  vec3 wall=uWall*(.95+.07*grain);
  wall*=1.-.2*length(q*vec2(.55,.8));
  float bloom=win*(.5+.5*slat)*.12;
  vec3 col=wall*(.78+light*.6*uLight+bloom*uLight);

  vec2 sd=vec2(.54,.84);
  vec2 pc=q-(uOrigin+uSun+vec2(.45,-.42));
  float along=dot(pc,sd);
  float across=dot(pc,vec2(-sd.y,sd.x));
  float beam=exp(-across*across*5.)*smoothstep(-.3,.4,along)*(1.-smoothstep(.4,1.6,along));
  col+=uLight*beam*.05;

  float motes=0.;
  for(int i=0;i<2;i++){
    float fi=float(i);
    vec2 g=q*(18.+fi*11.)+vec2(t*(.18+fi*.1),-t*(.1+fi*.07))+fi*7.3;
    vec2 cell=floor(g);
    vec2 f=fract(g)-.5;
    float r=hash(cell);
    vec2 o=vec2(r,hash(cell+3.1))-.5;
    o+=.25*vec2(sin(t*.6+r*6.28),cos(t*.5+hash(cell+1.)*6.28));
    float dm=length(f-o*.7);
    motes+=step(.72,hash(cell+9.7))*(1.-smoothstep(0.,.09-fi*.02,dm))*(.6+.4*sin(t*2.+r*20.));
  }
  col+=uLight*motes*(beam*.9+light*.5)*.55*uDust;
  col+=(hash(gl_FragCoord.xy+fract(t))-.5)*.02;
  // Light and wall grow out of the flat wall color the wrapper shows before the first frame
  col=mix(uWall,col,uIntro);
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

export function SunBlinds({
  wallColor = "#d4bfa8",
  lightColor = "#ffcc8c",
  slats = 12,
  softness = 0.5,
  sway = 0.5,
  leaves = true,
  dust = 0.5,
  interactive = true,
  follow = 0.5,
  speed = 1,
  paused = false,
  className,
  children,
}: SunBlindsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ wallColor, lightColor, slats, softness, sway, leaves, dust, interactive, follow, speed, paused });
  settings.current = { wallColor, lightColor, slats, softness, sway, leaves, dust, interactive, follow, speed, paused };
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
    const uSun = u("uSun");
    const uInv = u("uInv");
    const uOrigin = u("uOrigin");
    const uSlats = u("uSlats");
    const uSoft = u("uSoft");
    const uSway = u("uSway");
    const uLeaf = u("uLeaf");
    const uDust = u("uDust");
    const uWall = u("uWall");
    const uLight = u("uLight");
    const uIntro = u("uIntro");

    const inverse = new Float32Array(4);
    const sun = { x: 0, y: 0, tx: 0, ty: 0 };
    let clock = 12;
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

    const layout = () => {
      const aspect = canvas.width / Math.max(1, canvas.height);
      const wide = aspect > 1.1;
      const ox = wide ? -0.95 : -aspect * 0.5 - 0.2;
      const oy = wide ? 0.46 : 0.38;
      const ax = wide ? 1.45 : aspect + 0.5;
      const ay = -0.1;
      const bx = -0.32;
      const by = wide ? -0.98 : -0.82;
      const det = ax * by - bx * ay;
      inverse[0] = by / det;
      inverse[1] = -ay / det;
      inverse[2] = -bx / det;
      inverse[3] = ax / det;
      gl.uniformMatrix2fv(uInv, false, inverse);
      gl.uniform2f(uOrigin, ox, oy);
    };

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uWall, ...resolveColor(root, s.wallColor));
      gl.uniform3f(uLight, ...resolveColor(root, s.lightColor));
    };

    const draw = () => {
      const s = settings.current;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, clock);
      gl.uniform2f(uSun, sun.x, sun.y);
      gl.uniform1f(uSlats, Math.max(2, s.slats));
      gl.uniform1f(uSoft, 0.3 + clamp01(s.softness) * 1.4);
      gl.uniform1f(uSway, clamp01(s.sway));
      gl.uniform1f(uLeaf, s.leaves ? 1 : 0);
      gl.uniform1f(uDust, clamp01(s.dust) * 2);
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1) * 0.8 * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      layout();
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
      if (intro < 1) {
        introStart ||= now;
        const p = clamp01((now - introStart) / INTRO_MS);
        intro = p * p * p * (p * (p * 6 - 15) + 10);
      }
      if (settings.current.paused) {
        draw();
        frame = intro < 1 ? requestAnimationFrame(loop) : 0;
        return;
      }
      const dt = (delta / 1000) * settings.current.speed;
      clock += dt;
      const k = 1 - Math.exp(-1.2 * (delta / 1000));
      sun.x += (sun.tx + Math.sin(clock * 0.05) * 0.02 - sun.x) * k;
      sun.y += (sun.ty - sun.y) * k;
      // Light and slats move slowly, so idle frames alternate; the cursor gets full rate
      const active = intro < 1 || now - lastMove < 1500;
      if (active || tick % 2 === 0) draw();
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
      const s = settings.current;
      if (!s.interactive || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      const reach = clamp01(s.follow) * 2;
      if (inside) {
        sun.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 0.08 * reach;
        sun.ty = (0.5 - (event.clientY - rect.top) / rect.height) * 0.05 * reach;
        lastMove = performance.now();
      } else {
        sun.tx = 0;
        sun.ty = 0;
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
  }, [wallColor, lightColor]);

  useEffect(() => {
    redraw.current(false);
  }, [slats, softness, sway, leaves, dust, interactive, follow, speed, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: wallColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, color-mix(in oklab, ${wallColor} 70%, white) 0%, ${wallColor} 55%, color-mix(in oklab, ${wallColor} 85%, black) 100%)` }}
        >
          <div
            className="absolute inset-[-10%] [mask-image:radial-gradient(70%_60%_at_35%_45%,black,transparent)]"
            style={{ background: `repeating-linear-gradient(-8deg, color-mix(in oklab, ${lightColor} 55%, transparent) 0 26px, transparent 26px 48px)` }}
          />
        </div>
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
