"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface AuroraSkyProps {
  /** Color of the sky high overhead. Any CSS color. */
  skyColor?: string;
  /** Color of the sky low at the horizon. */
  horizonColor?: string;
  /** Color at the lower edge of the curtains. */
  lowColor?: string;
  /** Color the curtains fade into higher up. */
  highColor?: string;
  /** Color of the highest, farthest curtain. */
  fringeColor?: string;
  /** Color of the thin fringe along the curtains' lower edge. */
  edgeColor?: string;
  /** Brightness of the aurora, 0 to 1. */
  intensity?: number;
  /** Number of curtains, 1 to 4. */
  curtains?: number;
  /** How high the curtains hang in the sky, 0 to 1. */
  height?: number;
  /** Definition of the vertical rays, 0 (a soft glow) to 1 (sharp rays). */
  rays?: number;
  /** How many stars show, 0 to 1. */
  stars?: number;
  /** How much the stars twinkle, 0 to 1. */
  twinkle?: number;
  /** Draw two mountain ridges along the bottom. */
  mountains?: boolean;
  /** Color of the near ridge; the far ridge blends it toward the horizon. */
  mountainColor?: string;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** The curtains lean with the cursor like wind. */
  interactive?: boolean;
  /** How far the curtains lean, 0 to 1. */
  wind?: number;
  /** Freeze the sky on its current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const auroraSkyDemo: AuroraSkyProps = {
  skyColor: "#020409",
  horizonColor: "#09121c",
  lowColor: "#33ff94",
  highColor: "#2e80ff",
  fringeColor: "#c74df2",
  edgeColor: "#ff5973",
  intensity: 0.5,
  curtains: 4,
  height: 0.5,
  rays: 0.5,
  stars: 0.5,
  twinkle: 0.5,
  mountains: true,
  mountainColor: "#010204",
  speed: 1,
  interactive: true,
  wind: 0.5,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uWind;
uniform vec3 uSky;
uniform vec3 uHorizon;
uniform vec3 uLow;
uniform vec3 uHigh;
uniform vec3 uFringe;
uniform vec3 uEdge;
uniform vec3 uMountain;
uniform float uIntensity;
uniform float uCurtains;
uniform float uHeight;
uniform float uRays;
uniform float uStars;
uniform float uTwinkle;
uniform float uMountains;
uniform float uIntro;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}
  return v;
}
float stars(vec2 frag,float t){
  vec2 g=frag/3.;
  vec2 id=floor(g);
  float h=hash(id);
  vec2 o=vec2(hash(id+7.1),hash(id+3.3))*.5-.25;
  float d=length(fract(g)-.5-o);
  float tw=1.-uTwinkle*(.5-.5*sin(t*(.8+h*2.6)+h*60.));
  return step(1.-.0065*uStars,h)*tw*(1.-smoothstep(0.,.45,d))*(.35+.65*fract(h*113.));
}
vec3 curtains(vec2 p,float t){
  vec3 acc=vec3(0.);
  for(int i=0;i<4;i++){
    float fi=float(i);
    if(fi>=uCurtains)break;
    float drift=t*(.03+fi*.011);
    float x=p.x+uWind*(.06+fi*.03);
    float fold=fbm(vec2(x*.85+fi*4.3,drift*2.))-.5;
    float base=uHeight+fi*.07+fold*.3+.045*sin(x*2.1+drift*6.+fi*1.7);
    float h=p.y-base;
    float edge=smoothstep(-.014,.012,h);
    float body=exp(-max(h,0.)*(3.+fi*1.4));
    float fx=x*(6.+fi*2.)+fold*7.;
    float n=.6*noise(vec2(fx*3.,p.y*.7-drift*7.))+.4*noise(vec2(fx*9.+fi*5.,p.y*.4-drift*13.));
    float rays=mix(1.,pow(n,1.7)*1.8+.12,uRays);
    float pulse=.62+.38*sin(t*.37+fi*2.1+x*1.2);
    vec3 high=mix(uHigh,uFringe,fi/3.);
    vec3 c=mix(uLow,high,smoothstep(.03,.34,h));
    c=mix(uEdge,c,smoothstep(-.012,.02,h));
    acc+=c*edge*body*rays*pulse*(.6-fi*.1);
  }
  return acc*uIntensity*uIntro;
}
float ridge(float x,float seed,float amp,float base){
  float n=fbm(vec2(x*1.2+seed,seed));
  float r=1.-abs(noise(vec2(x*4.+seed,seed*2.))*2.-1.);
  return base+amp*(n-.5)+amp*.28*r;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float asp=uRes.x/uRes.y;
  vec2 p=vec2((uv.x-.5)*asp,uv.y);
  float t=uTime;
  vec3 col=mix(uHorizon,uSky,smoothstep(.1,.95,uv.y));
  col+=stars(gl_FragCoord.xy,t)*vec3(.82,.88,1.)*smoothstep(.22,.55,uv.y)*uIntro;
  vec3 au=curtains(p,t);
  col+=au;
  col+=uLow*.16*exp(-max(uv.y-.2,0.)*6.)*.5*uIntensity;
  if(uMountains>.5){
    float far=ridge(p.x,3.1,.17,.25);
    float near=ridge(p.x*1.35+1.,7.7,.19,.12);
    float aa=1.5/uRes.y;
    vec3 farC=mix(uMountain,uHorizon,.55)+au*.08;
    col=mix(col,farC,1.-smoothstep(far-aa,far+aa,uv.y));
    col=mix(col,uMountain,1.-smoothstep(near-aa,near+aa,uv.y));
  }
  col=1.-exp(-col*1.35);
  col+=(hash(gl_FragCoord.xy+fract(t))-.5)*.01;
  // The intro grows the sky out of the flat sky color the wrapper paints
  col=mix(uSky,col,uIntro);
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

export function AuroraSky({
  skyColor = "#020409",
  horizonColor = "#09121c",
  lowColor = "#33ff94",
  highColor = "#2e80ff",
  fringeColor = "#c74df2",
  edgeColor = "#ff5973",
  intensity = 0.5,
  curtains = 4,
  height = 0.5,
  rays = 0.5,
  stars = 0.5,
  twinkle = 0.5,
  mountains = true,
  mountainColor = "#010204",
  speed = 1,
  interactive = true,
  wind = 0.5,
  paused = false,
  className,
  children,
}: AuroraSkyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({
    skyColor, horizonColor, lowColor, highColor, fringeColor, edgeColor, intensity, curtains, height, rays, stars, twinkle, mountains, mountainColor, speed, interactive, wind, paused,
  });
  settings.current = {
    skyColor, horizonColor, lowColor, highColor, fringeColor, edgeColor, intensity, curtains, height, rays, stars, twinkle, mountains, mountainColor, speed, interactive, wind, paused,
  };
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
    const uWind = u("uWind");
    const uSky = u("uSky");
    const uHorizon = u("uHorizon");
    const uLow = u("uLow");
    const uHigh = u("uHigh");
    const uFringe = u("uFringe");
    const uEdge = u("uEdge");
    const uMountain = u("uMountain");
    const uIntensity = u("uIntensity");
    const uCurtains = u("uCurtains");
    const uHeight = u("uHeight");
    const uRays = u("uRays");
    const uStars = u("uStars");
    const uTwinkle = u("uTwinkle");
    const uMountains = u("uMountains");
    const uIntro = u("uIntro");

    let lean = 0;
    let leanTarget = 0;
    let time = 42;
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
      gl.uniform3f(uSky, ...resolveColor(root, s.skyColor));
      gl.uniform3f(uHorizon, ...resolveColor(root, s.horizonColor));
      gl.uniform3f(uLow, ...resolveColor(root, s.lowColor));
      gl.uniform3f(uHigh, ...resolveColor(root, s.highColor));
      gl.uniform3f(uFringe, ...resolveColor(root, s.fringeColor));
      gl.uniform3f(uEdge, ...resolveColor(root, s.edgeColor));
      gl.uniform3f(uMountain, ...resolveColor(root, s.mountainColor));
    };

    const draw = () => {
      const s = settings.current;
      const still = reduce || s.paused;
      lean += (leanTarget - lean) * (still ? 1 : 0.03);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uWind, s.interactive ? lean * clamp01(s.wind) * 2 : 0);
      gl.uniform1f(uIntensity, clamp01(s.intensity) * 2);
      gl.uniform1f(uCurtains, Math.min(4, Math.max(1, Math.round(s.curtains))));
      gl.uniform1f(uHeight, 0.2 + clamp01(s.height) * 0.32);
      gl.uniform1f(uRays, clamp01(s.rays) * 2);
      gl.uniform1f(uStars, clamp01(s.stars) * 2);
      gl.uniform1f(uTwinkle, clamp01(s.twinkle) * 1.8);
      gl.uniform1f(uMountains, s.mountains ? 1 : 0);
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      // The sky is soft, so it renders at a reduced scale and is stretched by CSS
      const scale = Math.min(window.devicePixelRatio || 1, 1) * 0.62 * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      average += (delta - average) * 0.05;
      lastFrame = now;
      tick++;
      if (tick % 60 === 0) {
        if (average > 22 && quality > 0.6) {
          ceiling = Math.max(0.6, quality - 0.05);
          quality = Math.max(0.6, quality - 0.15);
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
      // The curtains drift slowly, so idle frames alternate; a leaning cursor gets full rate
      const active = now - lastMove < 1500 || Math.abs(leanTarget - lean) > 0.02 || intro < 1;
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
      leanTarget = inside ? ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2 : 0;
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
  }, [skyColor, horizonColor, lowColor, highColor, fringeColor, edgeColor, mountainColor]);

  useEffect(() => {
    redraw.current(false);
  }, [intensity, curtains, height, rays, stars, twinkle, mountains, speed, interactive, wind, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: skyColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(90% 55% at 40% 45%, color-mix(in oklab, ${lowColor} 32%, transparent) 0%, color-mix(in oklab, ${highColor} 18%, transparent) 45%, transparent 75%), linear-gradient(to bottom, ${skyColor}, ${horizonColor})`,
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
