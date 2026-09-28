"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

/** Anything with a get() that returns 0 to 1, such as a framer-motion MotionValue. It is read every frame without re-rendering. */
export interface ProgressSource {
  get(): number;
}

export interface PhotoDustProps {
  /** The photograph the dust settles into. Its host must allow cross-origin loading (Unsplash does). */
  imageSrc?: string;
  imageAlt?: string;
  /** Number of grains, 0 to 1 (about 60 to 250 thousand on a large screen). */
  density?: number;
  /** Strength of the wind that carries the loose dust, 0 to 1. */
  wind?: number;
  /** Film grain on the settled photo, 0 to 1. */
  grain?: number;
  /** Surface behind the dust. Any CSS color, tokens included (e.g. "var(--background)"). */
  groundColor?: string;
  /** 0 is a drifting cloud of dust, 1 is the finished photograph. A number, or a live source such as a scroll MotionValue. Leave it out to let autoplay run. */
  progress?: number | ProgressSource;
  /** Gather and scatter on a loop when no progress is given. */
  autoplay?: boolean;
  /** Pace of the drift and of autoplay. */
  speed?: number;
  /** The cursor blows the grains aside as it passes over the settled photo. */
  interactive?: boolean;
  /** Focal point of the crop, 0 to 1 on each axis. */
  focusX?: number;
  focusY?: number;
  /** Freeze the dust where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const photoDustDemo: PhotoDustProps = {
  imageSrc: "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=1600&q=80",
  imageAlt: "A clear glass perfume bottle and two small jars casting amber shadows on warm paper",
  density: 0.6,
  wind: 0.5,
  grain: 0.4,
  groundColor: "#0e0c0a",
  autoplay: true,
  speed: 1,
  interactive: true,
  focusX: 0.4,
  focusY: 0.5,
  className: "aspect-[4/5] w-full max-w-md",
};

const dustVertex = `
attribute vec2 aHome;
attribute vec4 aRand;
uniform vec2 uCrop;
uniform vec2 uOffset;
uniform float uAspect;
uniform float uP;
uniform float uTime;
uniform float uWind;
uniform float uCell;
uniform vec3 uPointer;
varying vec2 vUv;
varying float vSettle;
varying float vShade;
varying float vAlpha;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),u.x),u.y);
}
float fbm(vec2 p){return noise(p)*.65+noise(p*2.03+7.1)*.35;}
vec2 curl(vec2 p){
  float e=.06;
  float a=fbm(p+vec2(0.,e));float b=fbm(p-vec2(0.,e));
  float c=fbm(p+vec2(e,0.));float d=fbm(p-vec2(e,0.));
  return vec2(a-b,d-c)/(2.*e);
}

void main(){
  vec2 k=vec2(uAspect,1.);
  vec2 home=aHome*k;

  // Arrival order: a soft noise field, settling from the bottom up, with a little per-grain jitter
  float field=fbm(aHome*k*2.2+3.7);
  float start=clamp(field*.55+(1.-aHome.y)*.25+aRand.x*.2,0.,1.)*.62;
  float t=clamp((uP-start)/.28,0.,1.);
  float e=1.-pow(1.-t,3.);

  // Loose dust: scattered around its place and carried by a slowly moving curl wind
  vec2 s=home+(aRand.zw-.5)*vec2(.9*uAspect,.9);
  float w=uTime*(.035+.05*aRand.y);
  s+=curl(s*1.3+vec2(w*1.4,w*.6))*(.06+.12*uWind);
  s+=vec2(sin(uTime*.23+aRand.y*6.28),cos(uTime*.17+aRand.z*6.28))*(.02+.05*uWind)*(.4+aRand.w);

  // Each grain lifts a little before it lands
  vec2 pos=mix(s,home,e)+vec2(0.,-sin(t*3.14159)*(.02+.05*aRand.y));

  // The cursor blows settled grains aside
  vec2 d=pos-uPointer.xy*k;
  float f=exp(-dot(d,d)/.018)*uPointer.z*mix(.3,1.,e);
  pos+=normalize(d+1e-5)*f*.06+curl(pos*3.+uTime*.2)*f*.012;

  gl_Position=vec4(pos.x/uAspect*2.-1.,1.-pos.y*2.,0.,1.);
  float depth=aRand.w;
  gl_PointSize=max(1.,mix(uCell*(.55+depth*.9),uCell*1.04,e));
  vUv=uOffset+aHome*uCrop;
  vSettle=e;
  vShade=mix(.45+.6*depth,1.,e);
  float edge=smoothstep(-.02,.04,pos.x)*smoothstep(uAspect+.02,uAspect-.04,pos.x)*smoothstep(-.02,.04,pos.y)*smoothstep(1.02,.96,pos.y);
  vAlpha=mix((.3+.55*depth)*mix(1.,edge,1.-e),1.,e);
}`;

const dustFragment = `
precision mediump float;
uniform sampler2D uTex;
varying vec2 vUv;
varying float vSettle;
varying float vShade;
varying float vAlpha;
void main(){
  float r=length(gl_PointCoord-.5)*2.;
  float m=mix(1.-smoothstep(.5,1.,r),1.,smoothstep(.85,1.,vSettle));
  float a=m*vAlpha;
  if(a<.01)discard;
  vec3 col=texture2D(uTex,vUv).rgb;
  col=mix(col*1.15+.03,col,vSettle)*vShade;
  gl_FragColor=vec4(col,a);
}`;

const photoVertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// The real photo fades in over the settled grains for full detail, and opens where the cursor blows them aside
const photoFragment = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uCrop;
uniform vec2 uOffset;
uniform vec3 uPointer;
uniform float uAspect;
uniform float uCrisp;
uniform float uGrain;
float hash(vec2 p){p=fract(p*vec2(443.897,441.423));p+=dot(p,p.yx+19.19);return fract((p.x+p.y)*p.x);}
void main(){
  vec2 uv=vec2(gl_FragCoord.x/uRes.x,1.-gl_FragCoord.y/uRes.y);
  vec3 col=texture2D(uTex,uOffset+uv*uCrop).rgb;
  vec2 d=(uv-uPointer.xy)*vec2(uAspect,1.);
  float hole=exp(-dot(d,d)/.012)*uPointer.z;
  float n=hash(gl_FragCoord.xy)+hash(gl_FragCoord.yx+31.7)-1.;
  col+=n*.05*uGrain;
  gl_FragColor=vec4(col,uCrisp*(1.-clamp(hole*1.6,0.,1.)));
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function link(gl: WebGLRenderingContext, vs: WebGLShader | null, fs: WebGLShader | null) {
  const program = gl.createProgram();
  if (!program || !vs || !fs) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
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
  if (!ctx) return [0.055, 0.047, 0.04];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [(data[0] ?? 0) / 255, (data[1] ?? 0) / 255, (data[2] ?? 0) / 255];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const readProgress = (value: number | ProgressSource | undefined) =>
  value === undefined ? undefined : clamp01(typeof value === "number" ? value : value.get());

// Autoplay: loose dust, gathering, a long hold on the photo, then blown apart again
const AUTOPLAY_SECONDS = 15;
function autoplayAt(clock: number) {
  const t = (clock % AUTOPLAY_SECONDS) / AUTOPLAY_SECONDS;
  if (t < 0.08) return 0;
  if (t < 0.5) return (t - 0.08) / 0.42;
  if (t < 0.8) return 1;
  if (t < 0.95) return 1 - (t - 0.8) / 0.15;
  return 0;
}

export function PhotoDust({
  imageSrc = "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=1600&q=80",
  imageAlt = "",
  density = 0.6,
  wind = 0.5,
  grain = 0.4,
  groundColor = "#0e0c0a",
  progress,
  autoplay = true,
  speed = 1,
  interactive = true,
  focusX = 0.4,
  focusY = 0.5,
  paused = false,
  className,
  children,
}: PhotoDustProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ density, wind, grain, groundColor, progress, autoplay, speed, interactive, focusX, focusY, paused });
  settings.current = { density, wind, grain, groundColor, progress, autoplay, speed, interactive, focusX, focusY, paused };
  const wake = useRef<(recolor?: boolean) => void>(() => {});

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
    if (!canvas || !root || reduce) return;
    const context = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!context) {
      setFailed(true);
      return;
    }
    const gl = context;
    const dustVs = compile(gl, gl.VERTEX_SHADER, dustVertex);
    const dustFs = compile(gl, gl.FRAGMENT_SHADER, dustFragment);
    const photoVs = compile(gl, gl.VERTEX_SHADER, photoVertex);
    const photoFs = compile(gl, gl.FRAGMENT_SHADER, photoFragment);
    const dustProgram = link(gl, dustVs, dustFs);
    const photoProgram = link(gl, photoVs, photoFs);
    const cleanupGl = () => {
      gl.deleteProgram(dustProgram);
      gl.deleteProgram(photoProgram);
      for (const shader of [dustVs, dustFs, photoVs, photoFs]) gl.deleteShader(shader);
    };
    if (!dustProgram || !photoProgram) {
      cleanupGl();
      setFailed(true);
      return;
    }

    const grainBuffer = gl.createBuffer();
    const quadBuffer = gl.createBuffer();
    const texture = gl.createTexture();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const aHome = gl.getAttribLocation(dustProgram, "aHome");
    const aRand = gl.getAttribLocation(dustProgram, "aRand");
    const aQuad = gl.getAttribLocation(photoProgram, "p");
    const dustLoc: Record<string, WebGLUniformLocation | null> = {};
    for (const name of ["uCrop", "uOffset", "uAspect", "uP", "uTime", "uWind", "uCell", "uPointer", "uTex"]) {
      dustLoc[name] = gl.getUniformLocation(dustProgram, name);
    }
    const photoLoc: Record<string, WebGLUniformLocation | null> = {};
    for (const name of ["uTex", "uRes", "uCrop", "uOffset", "uPointer", "uAspect", "uCrisp", "uGrain"]) {
      photoLoc[name] = gl.getUniformLocation(photoProgram, name);
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let ground: [number, number, number] = [0.055, 0.047, 0.04];
    let count = 0;
    let cols = 0;
    let rows = 0;
    let builtAspect = 0;
    let builtDensity = -1;
    let texW = 1;
    let texH = 1;
    let loaded = false;
    let alive = true;
    let clock = 0;
    let drift = 0;
    let current = -1;
    let shown = -1;
    let frame = 0;
    let last = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let streak = 0;
    const pointer = { x: 0.5, y: 0.5, amount: 0, target: 0 };

    // One grain per cell of a grid shaped like the frame, so the settled grains tile the photo without gaps
    const build = () => {
      const s = settings.current;
      const w = Math.max(1, root.clientWidth);
      const h = Math.max(1, root.clientHeight);
      const aspect = w / h;
      const area = clamp01((w * h) / (1280 * 800));
      const wanted = (60000 + clamp01(s.density) * 190000) * Math.max(0.35, area);
      const nextCols = Math.max(8, Math.round(Math.sqrt(wanted * aspect)));
      const nextRows = Math.max(8, Math.round(wanted / nextCols));
      builtAspect = aspect;
      builtDensity = s.density;
      if (nextCols === cols && nextRows === rows) return;
      cols = nextCols;
      rows = nextRows;
      count = cols * rows;
      const data = new Float32Array(count * 6);
      let seed = 1234567;
      const random = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      let o = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          data[o++] = (x + 0.5) / cols;
          data[o++] = (y + 0.5) / rows;
          data[o++] = random();
          data[o++] = random();
          data[o++] = random();
          data[o++] = random();
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, grainBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    };

    const crop = () => {
      const s = settings.current;
      const ra = canvas.width / Math.max(1, canvas.height);
      const ta = texW / Math.max(1, texH);
      const cropX = ra > ta ? 1 : ra / ta;
      const cropY = ra > ta ? ta / ra : 1;
      return [cropX, cropY, clamp01(s.focusX) * (1 - cropX), clamp01(s.focusY) * (1 - cropY)] as const;
    };

    const draw = (p: number) => {
      const s = settings.current;
      gl.clearColor(ground[0], ground[1], ground[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (!loaded || count === 0) return;
      const aspect = canvas.width / Math.max(1, canvas.height);
      const [cropX, cropY, offX, offY] = crop();

      gl.useProgram(dustProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, grainBuffer);
      gl.enableVertexAttribArray(aHome);
      gl.vertexAttribPointer(aHome, 2, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(aRand);
      gl.vertexAttribPointer(aRand, 4, gl.FLOAT, false, 24, 8);
      gl.uniform2f(dustLoc.uCrop ?? null, cropX, cropY);
      gl.uniform2f(dustLoc.uOffset ?? null, offX, offY);
      gl.uniform1f(dustLoc.uAspect ?? null, aspect);
      gl.uniform1f(dustLoc.uP ?? null, p);
      gl.uniform1f(dustLoc.uTime ?? null, drift);
      gl.uniform1f(dustLoc.uWind ?? null, clamp01(s.wind));
      gl.uniform1f(dustLoc.uCell ?? null, canvas.width / Math.max(1, cols));
      gl.uniform3f(dustLoc.uPointer ?? null, pointer.x, pointer.y, pointer.amount);
      gl.uniform1i(dustLoc.uTex ?? null, 0);
      gl.drawArrays(gl.POINTS, 0, count);
      gl.disableVertexAttribArray(aHome);
      gl.disableVertexAttribArray(aRand);

      const crisp = clamp01((p - 0.9) / 0.1);
      if (crisp > 0) {
        gl.useProgram(photoProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        gl.enableVertexAttribArray(aQuad);
        gl.vertexAttribPointer(aQuad, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(photoLoc.uRes ?? null, canvas.width, canvas.height);
        gl.uniform2f(photoLoc.uCrop ?? null, cropX, cropY);
        gl.uniform2f(photoLoc.uOffset ?? null, offX, offY);
        gl.uniform3f(photoLoc.uPointer ?? null, pointer.x, pointer.y, pointer.amount);
        gl.uniform1f(photoLoc.uAspect ?? null, aspect);
        gl.uniform1f(photoLoc.uCrisp ?? null, crisp * crisp * (3 - 2 * crisp));
        gl.uniform1f(photoLoc.uGrain ?? null, clamp01(s.grain));
        gl.uniform1i(photoLoc.uTex ?? null, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.disableVertexAttribArray(aQuad);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const aspect = root.clientWidth / Math.max(1, root.clientHeight);
      if (Math.abs(aspect - builtAspect) > 0.02) build();
      shown = -1;
    };

    const goal = () => {
      const s = settings.current;
      const given = readProgress(s.progress);
      if (given !== undefined) return given;
      return s.autoplay ? autoplayAt(clock) : 1;
    };

    const loop = (now: number) => {
      const delta = last ? Math.min(100, now - last) : 16.7;
      last = now;
      const s = settings.current;
      const dt = delta / 1000;
      if (!s.paused) {
        drift += dt * Math.max(0, s.speed);
        if (s.progress === undefined && s.autoplay) clock += dt * Math.max(0.05, s.speed);
      }
      if (s.density !== builtDensity) build();
      const target = goal();
      if (current < 0 || s.paused) current = target;
      else current += (target - current) * (1 - Math.exp(-delta / 180));
      if (Math.abs(target - current) < 0.0005) current = target;
      const blow = s.interactive ? pointer.target : 0;
      pointer.amount += (blow - pointer.amount) * (1 - Math.exp(-delta / 260));
      if (pointer.amount < 0.002 && blow === 0) pointer.amount = 0;

      // Loose dust keeps drifting; a settled photo with a still cursor needs no redraw
      const still = current >= 1 && pointer.amount === 0 && shown >= 1;
      if (!still || shown < 0) {
        draw(current);
        shown = current;
        streak++;
        average += (delta - average) * 0.05;
        if (streak % 60 === 0) {
          if (average > 22 && quality > 0.5) {
            ceiling = Math.max(0.5, quality - 0.05);
            quality = Math.max(0.5, quality - 0.15);
            resize();
          } else if (average < 17.5 && quality < ceiling && streak % 300 === 0) {
            quality = Math.min(ceiling, quality + 0.1);
            resize();
          }
        }
      } else {
        streak = 0;
        average = 16.7;
      }
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (alive && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    wake.current = (withColors = false) => {
      if (withColors) ground = resolveColor(root, settings.current.groundColor);
      shown = -1;
      play();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = root.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      pointer.target = inside ? 1 : 0;
      if (inside) {
        pointer.x = (event.clientX - rect.left) / Math.max(1, rect.width);
        pointer.y = (event.clientY - rect.top) / Math.max(1, rect.height);
      }
    };
    const onLeave = () => {
      pointer.target = 0;
    };

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => {
      if (!alive) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      } catch {
        setFailed(true);
        return;
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      texW = image.naturalWidth;
      texH = image.naturalHeight;
      loaded = true;
      setReady(true);
      wake.current();
    };
    image.onerror = () => setFailed(true);
    image.src = imageSrc;

    const onLost = (event: Event) => {
      event.preventDefault();
      alive = false;
      cancelAnimationFrame(frame);
      setFailed(true);
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
        wake.current(true);
      });
    });
    for (let node = root.parentElement; node; node = node.parentElement) {
      mo.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    }
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    ground = resolveColor(root, settings.current.groundColor);
    build();
    resize();
    play();

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      wake.current = () => {};
      image.onload = null;
      image.onerror = null;
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.deleteTexture(texture);
      gl.deleteBuffer(grainBuffer);
      gl.deleteBuffer(quadBuffer);
      cleanupGl();
    };
  }, [imageSrc, reduce]);

  useEffect(() => {
    wake.current(true);
  }, [groundColor]);

  useEffect(() => {
    wake.current(false);
  }, [progress, autoplay, speed, wind, grain, density, interactive, focusX, focusY, paused]);

  const position = `${clamp01(focusX) * 100}% ${clamp01(focusY) * 100}%`;
  const showCanvas = ready && !failed && !reduce;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: groundColor }}>
      {/* The plain photo is the reduced-motion frame and the fallback; the canvas covers it once the grains are ready */}
      <img
        src={imageSrc}
        alt={imageAlt}
        decoding="async"
        className={cn("absolute inset-0 size-full object-cover", !reduce && !failed && "opacity-0")}
        style={{ objectPosition: position }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 size-full transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
          showCanvas ? "opacity-100" : "opacity-0",
        )}
      />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
