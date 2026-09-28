"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface WaterReflectionProps {
  /** Photo shown above the water and mirrored in it. Loaded with CORS so WebGL can read it. */
  src: string;
  /** Description of the photo for screen readers. */
  alt?: string;
  /** Height of the waterline from the bottom, 0 to 1. */
  horizon?: number;
  /** Share of the photo's bottom cut away before it meets the water, 0 to 0.9. */
  crop?: number;
  /** Color of the water itself, seen where it reflects less. Any CSS color. */
  waterColor?: string;
  /** How much of the landscape the water mirrors, 0 to 1. */
  reflectivity?: number;
  /** Strength of the rolling swell, 0 to 1. */
  waves?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** Sparkle of light on the wave crests, 0 to 1. */
  glints?: number;
  /** How often drops land on their own, 0 (never) to 1 (a light shower). */
  rain?: number;
  /** Ripples follow the cursor across the water. */
  interactive?: boolean;
  /** Strength of every ripple ring, 0 to 1. */
  ripples?: number;
  /** Freeze the water on its current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const waterReflectionDemo: WaterReflectionProps = {
  src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2400&q=80",
  alt: "Snowy peaks under the Milky Way above a dark line of pines",
  horizon: 0.42,
  crop: 0.12,
  waterColor: "#070b14",
  reflectivity: 0.85,
  waves: 0.6,
  speed: 1,
  glints: 0.6,
  rain: 0.4,
  interactive: true,
  ripples: 0.7,
  className: "min-h-[32rem]",
};

const DROPS = 6;

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uTexRes;
uniform sampler2D uTex;
uniform float uTime;
uniform float uHorizon;
uniform float uCrop;
uniform float uWaves;
uniform float uReflect;
uniform float uGlint;
uniform float uRipple;
uniform vec3 uWater;
uniform float uIntro;
uniform vec4 uDrops[${DROPS}];

vec3 land(vec2 q){
  float ra=uRes.x/(uRes.y*(1.-uHorizon));
  float ta=uTexRes.x/(uTexRes.y*(1.-uCrop));
  vec2 s=ra>ta?vec2(1.,ta/ra):vec2(ra/ta,1.);
  vec2 l=(q-.5)*s+.5;
  return texture2D(uTex,vec2(l.x,uCrop+clamp(l.y,0.,1.)*(1.-uCrop))).rgb;
}
vec2 plane(vec2 uv,float aspect){
  float z=1./((uHorizon-uv.y)/uHorizon+.035);
  return vec2((uv.x-.5)*aspect*z,z)*.35;
}
float swell(vec2 w,float t){
  float h=sin(w.y*6.+t*1.1)*.5;
  h+=sin(dot(w,vec2(.35,.94))*9.-t*1.5)*.3;
  h+=sin(dot(w,vec2(-.5,.87))*13.+t*1.9)*.18;
  h+=sin(dot(w,vec2(.8,.6))*21.-t*2.6)*.1;
  h+=sin(dot(w,vec2(-.2,.98))*34.+t*3.2)*.06;
  return h;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float hz=uHorizon;
  if(uv.y>=hz){
    gl_FragColor=vec4(mix(uWater,land(vec2(uv.x,(uv.y-hz)/(1.-hz))),uIntro),1.);
    return;
  }
  float aspect=uRes.x/uRes.y;
  float depth=(hz-uv.y)/hz;
  vec2 w=plane(uv,aspect);
  float e=.02;
  float h0=swell(w,uTime);
  vec2 n=vec2(swell(w+vec2(e,0.),uTime)-h0,swell(w+vec2(0.,e),uTime)-h0)/e*uWaves;
  for(int i=0;i<${DROPS};i++){
    vec4 d=uDrops[i];
    float age=uTime-d.z;
    if(age<0.||age>4.)continue;
    vec2 dp=w-plane(d.xy,aspect);
    float r=length(dp)+.0001;
    float front=age*.35;
    float ring=sin((r-front)*60.)*exp(-age*1.1)*exp(-abs(r-front)*14.)*d.w;
    n+=dp/r*ring*2.5*uRipple;
  }
  vec2 off=vec2(n.x*.012,n.y*.03)*(.35+depth*.65);
  float my=(hz-uv.y)/(1.-hz);
  vec2 q=vec2(uv.x+off.x,clamp(my+off.y,0.,1.));
  vec3 refl=(land(q)+land(q+vec2(0.,.008+depth*.01))+land(q-vec2(0.,.006)))/3.;
  float mirror=mix(.95,.55,depth)*uReflect;
  vec3 col=mix(uWater,refl*vec3(.9,.94,.98),mirror);
  float lum=dot(refl,vec3(.3,.59,.11));
  col+=pow(clamp(n.y*.35+.5,0.,1.),14.)*(.25+lum)*uGlint*(1.-depth*.4);
  col*=mix(.55,1.,smoothstep(0.,.02,depth));
  // The scene grows out of the flat water color the wrapper shows before the first frame
  gl_FragColor=vec4(mix(uWater,col,uIntro),1.);
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

export function WaterReflection({
  src,
  alt,
  horizon = 0.42,
  crop = 0.12,
  waterColor = "#070b14",
  reflectivity = 0.85,
  waves = 0.6,
  speed = 1,
  glints = 0.6,
  rain = 0.4,
  interactive = true,
  ripples = 0.7,
  paused = false,
  className,
  children,
}: WaterReflectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ horizon, crop, waterColor, reflectivity, waves, speed, glints, rain, interactive, ripples, paused });
  settings.current = { horizon, crop, waterColor, reflectivity, waves, speed, glints, rain, interactive, ripples, paused };
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
    const uHorizon = u("uHorizon");
    const uCrop = u("uCrop");
    const uWaves = u("uWaves");
    const uReflect = u("uReflect");
    const uGlint = u("uGlint");
    const uRipple = u("uRipple");
    const uWater = u("uWater");
    const uIntro = u("uIntro");
    const uDrops = u("uDrops");

    const drops = new Float32Array(DROPS * 4).fill(-100);
    const texture = gl.createTexture();
    let nextDrop = 0;
    let lastDrop = { x: -1, y: -1, at: -10 };
    let lastPointer = -10;
    let nextRain = 1.2;
    let time = 0;
    let loaded = false;
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

    const drop = (x: number, y: number, strength: number) => {
      const i = nextDrop * 4;
      drops[i] = x;
      drops[i + 1] = y;
      drops[i + 2] = time;
      drops[i + 3] = strength;
      nextDrop = (nextDrop + 1) % DROPS;
    };

    const recolor = () => {
      gl.uniform3f(uWater, ...resolveColor(root, settings.current.waterColor));
    };

    const draw = () => {
      if (!loaded) return;
      const s = settings.current;
      const hz = Math.min(0.9, Math.max(0.1, s.horizon));
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduce ? 3 : time);
      gl.uniform1f(uHorizon, hz);
      gl.uniform1f(uCrop, Math.min(0.9, Math.max(0, s.crop)));
      gl.uniform1f(uWaves, clamp01(s.waves) * 1.6 * intro);
      gl.uniform1f(uIntro, intro);
      gl.uniform1f(uReflect, clamp01(s.reflectivity));
      gl.uniform1f(uGlint, clamp01(s.glints));
      gl.uniform1f(uRipple, clamp01(s.ripples));
      gl.uniform4fv(uDrops, drops);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
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
      const s = settings.current;
      if (intro < 1) {
        introStart ||= now;
        const p = clamp01((now - introStart) / INTRO_MS);
        intro = p * p * p * (p * (p * 6 - 15) + 10);
      }
      if (s.paused) {
        draw();
        frame = intro < 1 ? requestAnimationFrame(loop) : 0;
        return;
      }
      time += (delta / 1000) * s.speed;
      const shower = clamp01(s.rain);
      if (shower > 0 && time > nextRain && time - lastPointer > 1.2) {
        const hz = Math.min(0.9, Math.max(0.1, s.horizon));
        drop(0.08 + Math.random() * 0.84, hz * (0.08 + Math.random() * 0.8), 0.45 + Math.random() * 0.4);
        nextRain = time + (6 - shower * 5.4) * (0.6 + Math.random() * 0.8);
      }
      draw();
      frame = requestAnimationFrame(loop);
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
      if (!s.interactive || reduce || s.paused) return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (rect.bottom - event.clientY) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y >= Math.min(0.9, Math.max(0.1, s.horizon))) return;
      lastPointer = time;
      if (time - lastDrop.at < 0.12 || Math.hypot(x - lastDrop.x, y - lastDrop.y) < 0.03) return;
      lastDrop = { x, y, at: time };
      drop(x, y, 1);
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
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src, reduce]);

  useEffect(() => {
    redraw.current(true);
  }, [waterColor]);

  useEffect(() => {
    redraw.current(false);
  }, [horizon, crop, reflectivity, waves, speed, glints, rain, interactive, ripples, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: waterColor }}>
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
