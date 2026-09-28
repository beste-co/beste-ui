"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface LiquidSlide {
  src: string;
  alt: string;
}

export interface LiquidSlidesProps {
  /** Photos in order. Loaded with CORS so WebGL can read them. */
  slides: LiquidSlide[];
  /** Seconds each slide stays before the next wipe. */
  interval?: number;
  /** Seconds the liquid wipe takes. */
  transition?: number;
  /** How far the wet edge drags the photos, 0 to 1. */
  distortion?: number;
  /** Size of the ripples in the wipe's edge, 0 (broad) to 1 (fine). */
  noiseScale?: number;
  /** Color split along the wet edge, 0 to 1. */
  colorSplit?: number;
  /** Slow push-in on the resting photo, 0 to 1. */
  zoom?: number;
  /** Advance on a timer. */
  autoplay?: boolean;
  /** Hold the timer while the pointer is over the slides. */
  pauseOnHover?: boolean;
  /** Timeline of thin bars along the bottom. */
  progress?: boolean;
  /** Previous and next arrows beside the timeline. */
  arrows?: boolean;
  /** Accessible names for the carousel and its arrows. */
  labels?: { carousel: string; previous: string; next: string };
  /** The photo ripples softly under the cursor. */
  interactive?: boolean;
  /** Freeze on the current slide. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const liquidSlidesDemo: LiquidSlidesProps = {
  slides: [
    { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=80", alt: "A model in wide striped trousers leaning on a teal wall" },
    { src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1400&q=80", alt: "A woman in a dark check coat walking down a city street" },
    { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80", alt: "A model in a bright yellow fleece set on a concrete court" },
    { src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400&q=80", alt: "A model in a red jersey and black jacket against a teal sky" },
  ],
  interval: 6,
  transition: 1.5,
  distortion: 0.5,
  noiseScale: 0.5,
  colorSplit: 0.5,
  zoom: 0.5,
  autoplay: true,
  pauseOnHover: true,
  progress: true,
  arrows: true,
  labels: { carousel: "Lookbook", previous: "Previous look", next: "Next look" },
  interactive: true,
  className: "aspect-[4/5] w-full max-w-sm md:max-w-md",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform vec2 uFromRes;
uniform vec2 uToRes;
uniform float uProgress;
uniform float uDir;
uniform float uZoom;
uniform float uTime;
uniform vec2 uPointer;
uniform float uHover;
uniform float uDistort;
uniform float uNoise;
uniform float uSplit;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.07+vec2(3.1,1.7);a*=.5;}
  return v;
}
vec2 cover(vec2 uv,vec2 tex){
  float ra=uRes.x/uRes.y,ta=tex.x/tex.y;
  vec2 s=ra>ta?vec2(1.,ta/ra):vec2(ra/ta,1.);
  return (uv-.5)*s+.5;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 asp=vec2(uRes.x/uRes.y,1.);
  vec2 d=(uv-uPointer)*asp;
  float r=length(d)+.0001;
  uv+=(d/r)/asp*sin(r*42.-uTime*4.)*.004*exp(-r*6.)*uHover;
  vec2 fz=(uv-.5)*(1.-uZoom)+.5;
  if(uProgress<=0.){
    gl_FragColor=vec4(texture2D(uFrom,cover(fz,uFromRes)).rgb,1.);
    return;
  }
  float n=fbm(uv*vec2(2.4,3.4)*uNoise+vec2(0.,uTime*.12));
  float axis=uDir>0.?uv.x*.8+(1.-uv.y)*.2:(1.-uv.x)*.8+uv.y*.2;
  float s=axis*.7+n*.3;
  float p=uProgress*1.3-.15;
  float m=smoothstep(p-.07,p+.07,s);
  float edge=1.-abs(m*2.-1.);
  vec2 dir=vec2(uDir,-.25);
  vec2 fromUv=fz-dir*edge*(.05+.08*n)*uDistort;
  vec2 toUv=(uv-.5)*(1.-.08*(1.-uProgress))+.5+dir*(edge*.06*n*uDistort+(1.-uProgress)*.02);
  vec2 ca=dir*edge*.012*uSplit;
  vec3 to=vec3(texture2D(uTo,cover(toUv+ca,uToRes)).r,texture2D(uTo,cover(toUv,uToRes)).g,texture2D(uTo,cover(toUv-ca,uToRes)).b);
  vec3 from=texture2D(uFrom,cover(fromUv,uFromRes)).rgb;
  vec3 col=mix(to,from,m);
  col*=1.-.18*edge*edge;
  col+=pow(edge,12.)*.28;
  gl_FragColor=vec4(col,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function LiquidSlides({
  slides,
  interval = 6,
  transition = 1.5,
  distortion = 0.5,
  noiseScale = 0.5,
  colorSplit = 0.5,
  zoom = 0.5,
  autoplay = true,
  pauseOnHover = true,
  progress = true,
  arrows = true,
  labels,
  interactive = true,
  paused = false,
  className,
  children,
}: LiquidSlidesProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const goRef = useRef<(target: number, direction: number) => void>(() => {});
  const playRef = useRef<() => void>(() => {});
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ interval, transition, distortion, noiseScale, colorSplit, zoom, autoplay, pauseOnHover, interactive, paused });
  settings.current = { interval, transition, distortion, noiseScale, colorSplit, zoom, autoplay, pauseOnHover, interactive, paused };
  const total = slides.length;
  const srcKey = slides.map((slide) => slide.src).join("|");

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const srcs = srcKey ? srcKey.split("|") : [];
    const count = srcs.length;
    if (!root || count === 0) return;

    // One engine drives the timer and the timeline; WebGL is optional and only paints the wipe
    const canvas = failed ? null : canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false }) ?? null;
    let program: WebGLProgram | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    let buffer: WebGLBuffer | null = null;
    const textures: (WebGLTexture | null)[] = [];
    const sizes = new Float32Array(count * 2);
    const images: HTMLImageElement[] = [];
    let u: (name: string) => WebGLUniformLocation | null = () => null;

    if (gl && canvas) {
      vs = compile(gl, gl.VERTEX_SHADER, vertex);
      fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
      program = gl.createProgram();
      if (!vs || !fs || !program) {
        setFailed(true);
        return;
      }
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        setFailed(true);
        return;
      }
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const linked = program;
      u = (name: string) => gl.getUniformLocation(linked, name);
      gl.uniform1i(u("uFrom"), 0);
      gl.uniform1i(u("uTo"), 1);
      for (let i = 0; i < count; i++) textures.push(gl.createTexture());
    }
    const uRes = u("uRes");
    const uFromRes = u("uFromRes");
    const uToRes = u("uToRes");
    const uProgress = u("uProgress");
    const uDir = u("uDir");
    const uZoom = u("uZoom");
    const uTime = u("uTime");
    const uPointer = u("uPointer");
    const uHover = u("uHover");
    const uDistort = u("uDistort");
    const uNoise = u("uNoise");
    const uSplit = u("uSplit");

    const shown = new Float32Array(count);
    let loaded = !gl;
    let loadedCount = 0;
    let cur = Math.min(count - 1, Math.max(0, indexRef.current));
    let next = cur;
    let dir = 1;
    let wipe = 0;
    let wiping = false;
    let elapsed = 0;
    let push = 0;
    let clock = 0;
    let last = 0;
    let frame = 0;
    let visible = true;
    let hovering = false;
    let quality = 1;
    let average = 16.7;
    let tick = 0;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0 };

    // Timeline: bars before the active slide are full, the active one fills with time, the rest are empty
    const targetFor = (i: number) => {
      const base = wiping ? next : cur;
      if (i < base) return 1;
      if (i > base) return 0;
      if (wiping || reduce) return reduce ? 1 : 0;
      return clamp01(elapsed / Math.max(0.5, settings.current.interval));
    };

    const paintBars = (dt: number, snap = false) => {
      const list = bars.current;
      const ease = snap ? 1 : 1 - Math.exp(-12 * dt);
      for (let i = 0; i < count; i++) {
        const goal = targetFor(i);
        const value = (shown[i] ?? 0) + (goal - (shown[i] ?? 0)) * ease;
        shown[i] = value;
        const bar = list[i];
        if (bar) bar.style.transform = `scaleX(${value.toFixed(4)})`;
      }
    };

    const bindPair = () => {
      if (!gl) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[cur] ?? null);
      gl.uniform2f(uFromRes, sizes[cur * 2] ?? 1, sizes[cur * 2 + 1] ?? 1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[next] ?? null);
      gl.uniform2f(uToRes, sizes[next * 2] ?? 1, sizes[next * 2 + 1] ?? 1);
    };

    const draw = () => {
      if (!gl || !canvas || !loaded) return;
      const s = settings.current;
      const t = wipe < 0.5 ? 4 * wipe * wipe * wipe : 1 - (-2 * wipe + 2) ** 3 / 2;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uProgress, wiping ? Math.max(0.0001, t) : 0);
      gl.uniform1f(uDir, dir);
      gl.uniform1f(uZoom, push * clamp01(s.zoom) * 2);
      gl.uniform1f(uTime, clock);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uHover, s.interactive ? pointer.hover : 0);
      gl.uniform1f(uDistort, clamp01(s.distortion) * 2);
      gl.uniform1f(uNoise, 0.4 + clamp01(s.noiseScale) * 1.2);
      gl.uniform1f(uSplit, clamp01(s.colorSplit) * 2);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const finish = () => {
      cur = next;
      wiping = false;
      wipe = 0;
      elapsed = 0;
      push = 0;
      bindPair();
    };

    const go = (target: number, direction: number) => {
      if (!loaded || wiping || target === cur || count < 2) return;
      next = target;
      dir = direction;
      wipe = 0;
      setIndex(target);
      if (!gl || reduce) {
        finish();
        paintBars(0, reduce);
        draw();
        return;
      }
      wiping = true;
      bindPair();
    };
    goRef.current = go;
    playRef.current = () => play();

    const resize = () => {
      if (!gl || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      average += (dt * 1000 - average) * 0.05;
      last = now;
      tick++;
      if (gl && tick % 90 === 0 && average > 22 && quality > 0.6) {
        quality = Math.max(0.6, quality - 0.15);
        resize();
      }
      const s = settings.current;
      clock += dt;
      push = Math.min(1, push + dt * 0.012);
      const k = 1 - Math.exp(-6 * dt);
      pointer.x += (pointer.tx - pointer.x) * k;
      pointer.y += (pointer.ty - pointer.y) * k;
      pointer.hover += ((hovering ? 1 : 0) - pointer.hover) * (1 - Math.exp(-3 * dt));
      if (wiping) {
        wipe += dt / Math.max(0.3, s.transition);
        if (wipe >= 1) finish();
      } else if (s.autoplay && !(s.pauseOnHover && hovering)) {
        elapsed += dt;
        if (elapsed >= Math.max(0.5, s.interval)) {
          elapsed = Math.max(0.5, s.interval);
          go((cur + 1) % count, 1);
        }
      }
      paintBars(dt);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (loaded && !reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    if (gl) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      srcs.forEach((src, i) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
          gl.bindTexture(gl.TEXTURE_2D, textures[i] ?? null);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          sizes[i * 2] = image.naturalWidth;
          sizes[i * 2 + 1] = image.naturalHeight;
          loadedCount++;
          if (loadedCount === count) {
            loaded = true;
            bindPair();
            resize();
            setReady(true);
            play();
          }
        };
        image.onerror = () => setFailed(true);
        image.src = src;
        images.push(image);
      });
    } else {
      setReady(true);
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = root.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (rect.bottom - event.clientY) / rect.height;
      hovering = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      if (hovering) {
        pointer.tx = x;
        pointer.ty = y;
      }
    };
    const onLeave = () => {
      hovering = false;
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    if (canvas) ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    canvas?.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    paintBars(0, true);
    play();

    return () => {
      cancelAnimationFrame(frame);
      goRef.current = () => {};
      playRef.current = () => {};
      for (const image of images) {
        image.onload = null;
        image.onerror = null;
      }
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      canvas?.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      if (gl) {
        for (const texture of textures) gl.deleteTexture(texture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [srcKey, failed, reduce]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Pausing or resuming only restarts the loop; the engine itself is never rebuilt for it
  useEffect(() => {
    playRef.current();
  }, [paused, autoplay]);

  const go = useCallback(
    (target: number, direction: number) => {
      if (total < 2) return;
      goRef.current((target + total) % total, direction);
    },
    [total],
  );

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") go(index + 1, 1);
    if (event.key === "ArrowLeft") go(index - 1, -1);
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels?.carousel}
      tabIndex={0}
      onKeyDown={onKey}
      onClick={() => go(index + 1, 1)}
      className={cn(
        "relative isolate w-full cursor-pointer overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className,
      )}
    >
      {slides.map((slide, slideIndex) => (
        <img
          key={slideIndex}
          src={slide.src}
          alt={slideIndex === index ? slide.alt : ""}
          aria-hidden={slideIndex !== index}
          crossOrigin="anonymous"
          className={cn("absolute inset-0 size-full object-cover transition-opacity duration-1000", slideIndex === index ? "opacity-100" : "opacity-0")}
        />
      ))}
      {!failed && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 size-full transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}
        />
      )}
      {(progress || arrows) && total > 1 && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-6 p-5 text-white md:p-6">
            <div aria-hidden="true" className={cn("flex flex-1 gap-1.5", !progress && "invisible")}>
              {slides.map((_, slideIndex) => (
                <span key={slideIndex} className="relative h-px flex-1 overflow-hidden bg-white/30">
                  <span
                    ref={(node) => {
                      bars.current[slideIndex] = node;
                    }}
                    style={{ transform: "scaleX(0)" }}
                    className="absolute inset-0 origin-left bg-white"
                  />
                </span>
              ))}
            </div>
            {arrows && (
              <div className="pointer-events-auto flex shrink-0 gap-1">
                <button
                  type="button"
                  aria-label={labels?.previous}
                  onClick={(event) => {
                    event.stopPropagation();
                    go(index - 1, -1);
                  }}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-white hover:text-black"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={labels?.next}
                  onClick={(event) => {
                    event.stopPropagation();
                    go(index + 1, 1);
                  }}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-white hover:text-black"
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
