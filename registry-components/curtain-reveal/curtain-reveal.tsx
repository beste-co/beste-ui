"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

/** Anything with a get() that returns 0 to 1, such as a framer-motion MotionValue. It is read every frame without re-rendering. */
export interface CurtainProgressSource {
  get(): number;
}

export interface CurtainRevealProps {
  /** The photograph behind the curtain */
  imageSrc?: string;
  imageAlt?: string;
  /** Velvet color, any CSS color */
  color?: string;
  /** Color of the light caught along the fold edges */
  sheenColor?: string;
  /** Folds across each half of the curtain when it is closed */
  folds?: number;
  /** Strength of the velvet sheen, 0 to 1 */
  sheen?: number;
  /** Depth of the gathered swags across the top, 0 to 0.25 of the height; 0 removes them */
  valance?: number;
  /** Width each half keeps at the side once fully open, 0 to 0.2; 0 draws them out of view */
  frame?: number;
  /** Film grain, 0 to 1 */
  grain?: number;
  /** How far open, 0 closed to 1 open. A number, or a live source such as a scroll MotionValue */
  progress?: number | CurtainProgressSource;
  /** Open, hold and close on a slow loop. On by default when no progress is given; when on, it wins over progress */
  autoplay?: boolean;
  /** Pace of the loop and of the fabric's breathing */
  speed?: number;
  /** The fabric sways where the cursor brushes past it */
  interactive?: boolean;
  /** Freeze the fabric where it is */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const curtainRevealDemo: CurtainRevealProps = {
  imageSrc: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=2400&q=80",
  imageAlt: "Violinists of an orchestra playing under warm stage light",
  color: "#6a0d1b",
  sheenColor: "#ec6a78",
  folds: 12,
  sheen: 0.7,
  valance: 0.1,
  frame: 0.06,
  grain: 0.4,
  speed: 1,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uW;
uniform float uLag;
uniform float uGather;
uniform float uFolds;
uniform float uSheen;
uniform float uValance;
uniform float uSwags;
uniform float uSway;
uniform float uSwayX;
uniform float uBreath;
uniform float uGrain;
uniform vec3 uColor;
uniform vec3 uSheenCol;

const float TAU=6.2831853;

float hash(vec2 p){
  p=fract(p*vec2(443.897,441.423));
  p+=dot(p,p.yx+19.19);
  return fract((p.x+p.y)*p.x);
}
float vnoise(vec2 p){
  vec2 i=floor(p);
  vec2 f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y)*2.-1.;
}
// Slightly asymmetric fold profile and its slope
float prof(float a){return sin(a)+.28*sin(2.*a+1.3);}
float dprof(float a){return cos(a)+.56*cos(2.*a+1.3);}

// Velvet: faces turned to the viewer stay deep, faces turned away catch a soft rim of light
vec3 velvet(vec3 N,float cav,vec2 uv,float aspect){
  vec3 L=normalize(vec3(.12,-.5,1.));
  float ndl=max(dot(N,L),0.);
  float rim=pow(1.-N.z,1.5);
  float pool=clamp(1.08-.6*length((uv-vec2(.5,.4))*vec2(.85,1.1)),.32,1.);
  float ao=mix(.42,1.,smoothstep(-1.2,.75,cav));
  float mott=.72+.56*(vnoise(uv*vec2(aspect*6.,9.))*.5+.5);
  vec3 c=uColor*(.2+.95*ndl)*ao*pool;
  c+=uSheenCol*rim*uSheen*(.3+.8*ndl)*pool*mott*mix(.6,1.,ao);
  return c;
}

void main(){
  vec2 fc=gl_FragCoord.xy;
  vec2 uv=vec2(fc.x/uRes.x,1.-fc.y/uRes.y);
  float aspect=uRes.x/uRes.y;
  float y=uv.y;
  float right=step(.5,uv.x);
  float d=mix(uv.x,1.-uv.x,right);
  float dir=mix(1.,-1.,right);

  // Pointer sway and slow breathing shift the folds sideways; the bottom moves more than the top
  float swayMask=exp(-pow((uv.x-uSwayX)*2.4,2.));
  float hang=.2+.8*y;
  float sway=uSway*swayMask*hang;
  float breath=uBreath*hang*(sin(uTime*.37+y*2.1+d*5.)*.6+sin(uTime*.23+y*3.7+right*2.)*.4);

  // Leading edge: the bottom trails the top while the curtain travels
  float E=max(uW+uLag*y*y+sway*.01,1e-4);
  float s=d/E;

  float ny=y*1.2+3.1*right;
  float w0=vnoise(vec2(s*uFolds*.55,ny))*1.7*hang;
  float w1=vnoise(vec2(s*uFolds*.55,ny+.012))*1.7*(hang+.008);
  float ph=s*uFolds*TAU+w0+breath+sway*1.6;
  float amp=mix(.95,2.5,uGather)*(.82+.3*vnoise(vec2(s*uFolds*.3,7.3+right*5.)));
  float dp=dprof(ph);
  float sx=amp*dp*dir;
  float sy=amp*dp*((w1-w0)/.01)*E*uRes.x/(uFolds*TAU*uRes.y);
  vec3 N=normalize(vec3(-sx,-sy,1.));
  float cav=prof(ph);
  vec3 col=velvet(N,cav,uv,aspect);

  // Fine vertical pile
  float pile=vnoise(vec2(fc.x*.9/uDpr,fc.y*.05/uDpr));
  col*=.94+.09*pile;

  // Turned leading edge with a thin caught highlight
  float edgePx=(E-d)*uRes.x;
  col*=mix(.45,1.,smoothstep(0.,10.*uDpr,edgePx));
  col+=uSheenCol*.2*uSheen*exp(-pow((edgePx-4.*uDpr)/(1.6*uDpr),2.));
  float a=smoothstep(0.,1.5*uDpr,edgePx);

  // Weighted hem that lifts as the fabric gathers and sweeps up toward the leading edge
  float hemY=1.015-uGather*.035-abs(uLag)*.25-smoothstep(.55,1.,s)*.04*uGather+cav*.006*(.4+uGather);
  float hemPx=(hemY-y)*uRes.y;
  col*=mix(.55,1.,smoothstep(0.,14.*uDpr,hemPx));
  col+=uSheenCol*.12*uSheen*exp(-pow((hemPx-16.*uDpr)/(2.*uDpr),2.));
  a*=smoothstep(0.,1.5*uDpr,hemPx);

  // Soft shadow the curtain casts on the stage behind it
  float sh=0.;
  if(edgePx<0.)sh=.6*exp(edgePx/(uRes.x*.035));
  else if(hemPx<0.)sh=.4*exp(hemPx/(uRes.y*.02));
  sh*=clamp(uW*40.,0.,1.);

  vec3 C=vec3(0.);
  float A=sh;
  C=col*a+C*(1.-a);
  A=a+A*(1.-a);

  // Gathered swags across the top, folds running in arcs
  if(uValance>0.){
    float ax=uv.x*uSwags;
    float sa=fract(ax);
    float idx=floor(ax);
    float bottom=uValance*(.62+.38*sin(3.14159*sa));
    float vPx=(bottom-y)*uRes.y;
    float vsh=.5*exp(min(vPx,0.)/(uRes.y*.025))*step(vPx,0.);
    C*=1.-vsh;
    A=vsh+A*(1.-vsh);
    if(vPx>-2.){
      float t=clamp(y/bottom,0.,1.);
      float vph=t*4.5*TAU+vnoise(vec2(sa*3.+idx*7.,t*2.))*1.2+breath*.3;
      float vamp=mix(1.4,2.2,t)*(1.-.5*pow(abs(sa-.5)*2.,3.));
      float vdp=dprof(vph);
      float db=uValance*.38*3.14159*cos(3.14159*sa)*uSwags;
      float dtdx=-y*db/(bottom*bottom);
      vec3 Nv=normalize(vec3(-vamp*vdp*bottom*uRes.y*dtdx/uRes.x,-vamp*vdp,1.));
      vec3 vcol=velvet(Nv,prof(vph),uv,aspect);
      vcol*=mix(.5,1.,smoothstep(0.,.2,min(sa,1.-sa)));
      vcol*=.94+.09*pile;
      vcol*=mix(.5,1.,smoothstep(0.,8.*uDpr,vPx));
      vcol+=uSheenCol*.14*uSheen*exp(-pow((vPx-3.*uDpr)/(1.4*uDpr),2.));
      float va=smoothstep(0.,1.5*uDpr,vPx);
      C=vcol*va+C*(1.-va);
      A=va+A*(1.-va);
    }
  }

  float n=hash(fc)+hash(fc.yx+31.7)-1.;
  C+=n*.045*uGrain*A;
  gl_FragColor=vec4(clamp(C,0.,1.),A);
}`;

type Vec3 = [number, number, number];

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Resolves any CSS color (tokens and oklch included) to 0-1 RGB
function resolveColor(el: HTMLElement, color: string): Vec3 {
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  el.style.color = "";
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0.42, 0.05, 0.1];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [(data[0] ?? 0) / 255, (data[1] ?? 0) / 255, (data[2] ?? 0) / 255];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x));
const readProgress = (value: number | CurtainProgressSource | undefined) =>
  value === undefined ? undefined : clamp01(typeof value === "number" ? value : value.get());

// Closed, opening, open, closing across one loop
function loopProgress(t: number) {
  if (t < 0.14) return 0;
  if (t < 0.44) return easeInOut((t - 0.14) / 0.3);
  if (t < 0.72) return 1;
  if (t < 0.98) return 1 - easeInOut((t - 0.72) / 0.26);
  return 0;
}

const UNIFORMS = ["uRes", "uDpr", "uTime", "uW", "uLag", "uGather", "uFolds", "uSheen", "uValance", "uSwags", "uSway", "uSwayX", "uBreath", "uGrain", "uColor", "uSheenCol"] as const;

export function CurtainReveal({
  imageSrc = "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=2400&q=80",
  imageAlt = "",
  color = "#6a0d1b",
  sheenColor = "#ec6a78",
  folds = 12,
  sheen = 0.7,
  valance = 0.1,
  frame = 0.06,
  grain = 0.4,
  progress,
  autoplay,
  speed = 1,
  interactive = true,
  paused = false,
  className,
  children,
}: CurtainRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [glReady, setGlReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ color, sheenColor, folds, sheen, valance, frame, grain, progress, autoplay, speed, interactive, paused });
  settings.current = { color, sheenColor, folds, sheen, valance, frame, grain, progress, autoplay, speed, interactive, paused };
  const recolorRef = useRef<() => void>(() => {});

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
    if (!canvas || !root) return;

    const context = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
    const vs = context && compile(context, context.VERTEX_SHADER, vertex);
    const fs = context && compile(context, context.FRAGMENT_SHADER, fragment);
    const program = context?.createProgram() ?? null;
    if (context && vs && fs && program) {
      context.attachShader(program, vs);
      context.attachShader(program, fs);
      context.linkProgram(program);
    }
    const gl = context && vs && fs && program && context.getProgramParameter(program, context.LINK_STATUS) ? context : null;
    const buffer = gl?.createBuffer() ?? null;
    const loc: Partial<Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>> = {};
    if (gl && program) {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const attr = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);
      gl.clearColor(0, 0, 0, 0);
      for (const name of UNIFORMS) loc[name] = gl.getUniformLocation(program, name);
    }
    let glOk = !!gl;

    let base: Vec3 = [0.42, 0.05, 0.1];
    let glint: Vec3 = [0.92, 0.42, 0.47];
    const recolor = () => {
      base = resolveColor(root, settings.current.color);
      glint = resolveColor(root, settings.current.sheenColor);
      const fill = settings.current.color;
      for (const side of [leftRef.current, rightRef.current]) if (side) side.style.backgroundColor = fill;
    };
    recolorRef.current = () => {
      recolor();
      forceDraw = true;
    };

    let dpr = 1;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let frameId = 0;
    let last = 0;
    let clock = 0;
    let breathClock = 0;
    let loopClock = 0;
    let visible = true;
    let current = -1;
    let width = 0.506;
    let lag = 0;
    let sway = 0;
    let swayVel = 0;
    let swayX = 0.5;
    let pointerX = -1;
    let lastPointerX = -1;
    let drift = 0;
    let forceDraw = true;
    let skip = false;
    let drawn = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(root.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(root.clientHeight * dpr));
      gl?.viewport(0, 0, canvas.width, canvas.height);
      forceDraw = true;
    };

    const target = () => {
      const s = settings.current;
      const given = readProgress(s.progress);
      if (reduce) return typeof s.progress === "number" ? (given ?? 1) : 1;
      const auto = s.autoplay ?? given === undefined;
      if (auto) {
        const period = 15 / Math.max(0.1, s.speed);
        return loopProgress((loopClock % period) / period);
      }
      return given ?? 0;
    };

    const draw = () => {
      const s = settings.current;
      const open = easeInOut(current);
      const edge = Math.min(0.2, Math.max(0, s.frame));
      const photo = photoRef.current;
      const dim = dimRef.current;
      // The house lights come up on the stage as the curtain opens
      if (dim) dim.style.opacity = ((1 - open) * 0.6).toFixed(3);
      if (photo) {
        photo.style.transform = `translate3d(${drift.toFixed(3)}%,0,0) scale(${(1.08 - open * 0.06).toFixed(4)})`;
      }
      const left = leftRef.current;
      const right = rightRef.current;
      if (left && right) {
        const pct = `${(width * 100).toFixed(2)}%`;
        left.style.width = pct;
        right.style.width = pct;
      }
      if (!glOk || !gl) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(loc.uRes ?? null, canvas.width, canvas.height);
      gl.uniform1f(loc.uDpr ?? null, dpr);
      gl.uniform1f(loc.uTime ?? null, breathClock);
      gl.uniform1f(loc.uW ?? null, width);
      gl.uniform1f(loc.uLag ?? null, lag);
      gl.uniform1f(loc.uGather ?? null, clamp01((0.506 - width) / Math.max(0.05, 0.506 - edge)));
      gl.uniform1f(loc.uFolds ?? null, Math.max(3, Math.min(30, s.folds)));
      gl.uniform1f(loc.uSheen ?? null, clamp01(s.sheen));
      gl.uniform1f(loc.uValance ?? null, Math.min(0.25, Math.max(0, s.valance)));
      gl.uniform1f(loc.uSwags ?? null, Math.max(2, Math.round((canvas.width / Math.max(1, canvas.height)) * 1.7)));
      gl.uniform1f(loc.uSway ?? null, sway);
      gl.uniform1f(loc.uSwayX ?? null, swayX);
      gl.uniform1f(loc.uBreath ?? null, reduce ? 0 : 0.22);
      gl.uniform1f(loc.uGrain ?? null, clamp01(s.grain));
      gl.uniform3f(loc.uColor ?? null, base[0], base[1], base[2]);
      gl.uniform3f(loc.uSheenCol ?? null, glint[0], glint[1], glint[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!drawn) {
        drawn = true;
        setGlReady(true);
      }
    };

    const loop = (now: number) => {
      frameId = requestAnimationFrame(loop);
      const delta = last ? Math.min(100, now - last) : 16.7;
      last = now;
      const dt = delta / 1000;
      const s = settings.current;
      const running = !reduce && !s.paused;
      clock += dt;
      if (running) {
        breathClock += dt * Math.max(0.1, s.speed);
        loopClock += dt;
      }

      const goal = target();
      const before = current;
      if (current < 0 || reduce) current = goal;
      else current += (goal - current) * (1 - Math.exp(-delta / 110));
      if (Math.abs(goal - current) < 0.0003) current = goal;

      const edge = Math.min(0.2, Math.max(0, s.frame));
      const nextWidth = 0.506 + (edge - 0.506) * easeInOut(current);
      const velocity = dt > 0 ? (nextWidth - width) / dt : 0;
      width = nextWidth;
      // The hem trails the top by a little, relative to how fast the curtain travels
      const lagGoal = reduce ? 0 : Math.max(-0.08, Math.min(0.08, -velocity * 0.22));
      lag += (lagGoal - lag) * (1 - Math.exp(-delta / 260));

      // Damped spring for the sway the cursor leaves in the fabric
      if (running) {
        swayVel += (-16 * sway - 3.4 * swayVel) * dt;
        sway = Math.max(-1.4, Math.min(1.4, sway + swayVel * dt));
        if (pointerX >= 0) swayX += (pointerX - swayX) * (1 - Math.exp(-delta / 180));
      }
      const driftGoal = pointerX >= 0 && s.interactive && !reduce ? (0.5 - swayX) * 1.2 : 0;
      const driftStep = (driftGoal - drift) * (1 - Math.exp(-delta / 400));
      drift = Math.abs(driftStep) < 0.0005 ? driftGoal : drift + driftStep;

      const moving = Math.abs(current - before) > 0.00005 || Math.abs(lag) > 0.0005 || Math.abs(sway) > 0.002 || Math.abs(swayVel) > 0.002 || Math.abs(driftStep) > 0.0005;
      // The breathing alone is slow enough to draw at 30fps
      skip = !skip;
      if (!forceDraw && !moving && (!running || skip)) return;
      forceDraw = false;
      draw();

      average += (delta - average) * 0.05;
      if (moving && clock > 1.5) {
        if (average > 22 && quality > 0.5) {
          ceiling = Math.max(0.5, quality - 0.05);
          quality = Math.max(0.5, quality - 0.15);
          average = 16.7;
          resize();
        } else if (average < 17 && quality < ceiling) {
          quality = Math.min(ceiling, quality + 0.05);
          resize();
        }
      }
    };

    const play = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
      last = 0;
      if (visible && !document.hidden) frameId = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || reduce) return;
      const rect = root.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside || rect.width < 1) {
        pointerX = -1;
        lastPointerX = -1;
        return;
      }
      const x = (event.clientX - rect.left) / rect.width;
      if (lastPointerX >= 0) swayVel += Math.max(-0.25, Math.min(0.25, x - lastPointerX)) * 9;
      lastPointerX = x;
      pointerX = x;
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      glOk = false;
      setGlReady(false);
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    // Themes can be scoped to any wrapper, not just <html>, so every ancestor is watched for token changes
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        recolorRef.current();
      });
    });
    for (let node = root.parentElement; node; node = node.parentElement) {
      mo.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    resize();
    play();

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(pending);
      recolorRef.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      if (context) {
        context.deleteBuffer(buffer);
        context.deleteProgram(program);
        context.deleteShader(vs);
        context.deleteShader(fs);
      }
    };
  }, [reduce]);

  useEffect(() => {
    recolorRef.current();
  }, [color, sheenColor]);

  // Stand-in curtain while WebGL starts, and the fallback if it cannot
  const drape =
    "repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.08) 14px, rgba(255,255,255,0.1) 24px, rgba(0,0,0,0.12) 34px, rgba(0,0,0,0.5) 48px)";

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden bg-black", className)}>
      <img
        ref={photoRef}
        src={imageSrc}
        alt={imageAlt}
        decoding="async"
        className="absolute inset-0 size-full object-cover will-change-transform"
        style={{ transform: "scale(1.08)" }}
      />
      <div ref={dimRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-60" />
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", glReady && "invisible")}>
        <div ref={leftRef} className="absolute inset-y-0 left-0 w-[50.6%]" style={{ backgroundColor: color, backgroundImage: drape }} />
        <div ref={rightRef} className="absolute inset-y-0 right-0 w-[50.6%]" style={{ backgroundColor: color, backgroundImage: drape }} />
      </div>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
