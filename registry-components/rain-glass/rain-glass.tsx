"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface RainGlassProps {
  /** Photo seen through the glass. Loaded with CORS so WebGL can read it. */
  src: string;
  /** Description of the photo for screen readers. */
  alt?: string;
  /** How far out of focus the view behind the glass is, 0 to 1. */
  blur?: number;
  /** Density of the mist on the glass, 0 to 1. */
  fog?: number;
  /** How many small droplets cling to the glass, 0 to 1. */
  density?: number;
  /** How often larger drops gather and run down, 0 to 1. */
  rate?: number;
  /** Size of every drop, 0 to 1. */
  dropSize?: number;
  /** How strongly each drop bends the view behind it, 0 to 1. */
  refraction?: number;
  /** Color the mist takes on. Any CSS color. */
  tintColor?: string;
  /** The cursor wipes the mist like a finger on the glass. */
  wipe?: boolean;
  /** How quickly the glass mists over again, 0 to 1. */
  recovery?: number;
  /** Respond to the cursor. */
  interactive?: boolean;
  /** Freeze the rain where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const rainGlassDemo: RainGlassProps = {
  src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=2000&q=80",
  alt: "A city street at dusk with car lights and lit towers",
  blur: 0.6,
  fog: 0.6,
  density: 0.5,
  rate: 0.5,
  dropSize: 0.5,
  refraction: 0.5,
  tintColor: "#a9b8c9",
  wipe: true,
  recovery: 0.4,
  interactive: true,
  className: "min-h-[32rem]",
};

const MAX_DROPS = 64;
const INTRO_MS = 2400;

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uTexRes;
uniform sampler2D uTex;
uniform sampler2D uDrops;
uniform sampler2D uFog;
uniform float uBlur;
uniform float uFogAmount;
uniform float uRefract;
uniform vec3 uTint;
uniform float uIntro;

vec2 fit(vec2 uv){
  float ra=uRes.x/uRes.y,ta=uTexRes.x/uTexRes.y;
  vec2 s=ra>ta?vec2(1.,ta/ra):vec2(ra/ta,1.);
  return clamp((uv-.5)*s+.5,.001,.999);
}
vec3 photo(vec2 uv,float bias){return texture2D(uTex,fit(uv),bias).rgb;}
vec3 soft(vec2 uv,float bias){
  float o=.004*bias;
  vec3 c=photo(uv,bias)*.4;
  c+=photo(uv+vec2(o,o*.7),bias)*.15;
  c+=photo(uv-vec2(o,o*.7),bias)*.15;
  c+=photo(uv+vec2(-o*.7,o),bias)*.15;
  c+=photo(uv-vec2(-o*.7,o),bias)*.15;
  return c;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec4 d=texture2D(uDrops,uv);
  float wet=d.a*uIntro;
  vec2 n=(d.rg-.5)*2.;
  n.y=-n.y;
  float mist=texture2D(uFog,uv).r*uFogAmount;
  float bias=mix(uBlur*3.5,uBlur*5.5,mist)+(1.-uIntro)*3.;
  vec3 view=soft(uv,bias)*.9;
  vec3 glass=mix(view,view*.5+uTint*.3,mist*.85);
  vec3 lens=photo(uv-n*uRefract*.12*uIntro,.4)*1.08;
  lens*=1.-smoothstep(.35,1.,length(n))*.5;
  float spec=pow(max(dot(normalize(vec3(n*1.4,1.)),normalize(vec3(-.35,.55,.75))),0.),28.)*.7;
  vec3 col=mix(glass,lens+spec,wet);
  vec2 q=uv-.5;
  col*=1.-dot(q,q)*.55;
  // The view comes into focus out of the flat dark ground as the drops gather
  gl_FragColor=vec4(mix(vec3(12.,13.,18.)/255.,col,uIntro),1.);
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
  if (!ctx) return [0.6, 0.7, 0.8];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [(data[0] ?? 0) / 255, (data[1] ?? 0) / 255, (data[2] ?? 0) / 255];
}

// A drop sprite whose red and green channels hold its surface normal and whose alpha is its coverage
function dropSprite() {
  const size = 64;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  const image = ctx.createImageData(size, size);
  const half = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x + 0.5) / half - 1;
      const v = (y + 0.5) / half - 1;
      const r = Math.sqrt(u * u + v * v);
      const i = (y * size + x) * 4;
      image.data[i] = Math.round((0.5 + 0.5 * u) * 255);
      image.data[i + 1] = Math.round((0.5 + 0.5 * v) * 255);
      image.data[i + 2] = Math.round(Math.max(0, 1 - r * r) * 255);
      image.data[i + 3] = Math.round(Math.min(1, Math.max(0, (1 - r) * 6)) * 255);
    }
  }
  ctx.putImageData(image, 0, 0);
  return sprite;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function RainGlass({
  src,
  alt,
  blur = 0.6,
  fog = 0.6,
  density = 0.5,
  rate = 0.5,
  dropSize = 0.5,
  refraction = 0.5,
  tintColor = "#a9b8c9",
  wipe = true,
  recovery = 0.4,
  interactive = true,
  paused = false,
  className,
  children,
}: RainGlassProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ blur, fog, density, rate, dropSize, refraction, tintColor, wipe, recovery, interactive, paused });
  settings.current = { blur, fog, density, rate, dropSize, refraction, tintColor, wipe, recovery, interactive, paused };
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
    const drops = document.createElement("canvas");
    const still = document.createElement("canvas");
    const mist = document.createElement("canvas");
    const dctx = drops.getContext("2d");
    const sctx = still.getContext("2d");
    const fctx = mist.getContext("2d");
    if (!canvas || !root || !gl || !dctx || !sctx || !fctx) return setFailed(true);
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
    const uBlur = u("uBlur");
    const uFogAmount = u("uFogAmount");
    const uRefract = u("uRefract");
    const uTint = u("uTint");
    const uIntro = u("uIntro");
    gl.uniform1i(u("uTex"), 0);
    gl.uniform1i(u("uDrops"), 1);
    gl.uniform1i(u("uFog"), 2);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const photoTex = gl.createTexture();
    const dropsTex = gl.createTexture();
    const fogTex = gl.createTexture();
    for (const [unit, texture] of [
      [1, dropsTex],
      [2, fogTex],
    ] as const) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    const sprite = dropSprite();
    const xs = new Float32Array(MAX_DROPS);
    const ys = new Float32Array(MAX_DROPS);
    const rs = new Float32Array(MAX_DROPS);
    const vy = new Float32Array(MAX_DROPS);
    const stick = new Float32Array(MAX_DROPS);
    const phase = new Float32Array(MAX_DROPS);
    const alive = new Uint8Array(MAX_DROPS);

    let cssW = 1;
    let cssH = 1;
    let k = 1;
    let fk = 1;
    let spawn = 0;
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
    const last = { x: -1, y: -1 };

    const drawDrop = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, stretch = 1) => {
      ctx.drawImage(sprite, x - r, y - r * stretch, r * 2, r * 2 * stretch);
    };

    const erase = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha = 1) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const smallRadius = () => (1.2 + Math.random() * 2.8) * (0.6 + clamp01(settings.current.dropSize) * 0.8);

    const scatter = () => {
      const s = settings.current;
      sctx.clearRect(0, 0, still.width, still.height);
      const count = Math.round(((cssW * cssH) / 1400) * (0.3 + clamp01(s.density) * 1.4));
      for (let i = 0; i < count; i++) drawDrop(sctx, Math.random() * still.width, Math.random() * still.height, smallRadius() * k);
      fctx.globalCompositeOperation = "source-over";
      fctx.fillStyle = "#fff";
      fctx.fillRect(0, 0, mist.width, mist.height);
      alive.fill(0);
    };

    const addDrop = (stuckFor: number) => {
      const i = alive.indexOf(0);
      if (i < 0) return;
      alive[i] = 1;
      xs[i] = Math.random() * cssW;
      ys[i] = Math.random() * cssH * 0.8;
      rs[i] = (5 + Math.random() * 8) * (0.6 + clamp01(settings.current.dropSize) * 0.8);
      vy[i] = 0;
      stick[i] = stuckFor;
      phase[i] = Math.random() * Math.PI * 2;
    };

    const step = (dt: number) => {
      const s = settings.current;
      spawn += dt * clamp01(s.rate) * 2.5;
      while (spawn > 1) {
        addDrop(0.4 + Math.random() * 3);
        spawn -= 1;
      }
      const condense = dt * clamp01(s.density) * 30;
      for (let n = 0; n < condense; n++) {
        if (Math.random() > condense - n) break;
        drawDrop(sctx, Math.random() * still.width, Math.random() * still.height, smallRadius() * k);
      }
      for (let i = 0; i < MAX_DROPS; i++) {
        if (!alive[i]) continue;
        const r = rs[i] ?? 6;
        const held = (stick[i] ?? 0) - dt;
        stick[i] = held;
        if (held > 0) continue;
        // Stop-start slide: gravity pulls, the glass grabs the drop now and then
        let speed = (vy[i] ?? 0) + 140 * dt;
        if (Math.random() < dt * 0.8) {
          stick[i] = 0.1 + Math.random() * 0.6;
          speed *= 0.2;
        }
        vy[i] = speed;
        const y = (ys[i] ?? 0) + speed * dt * (r / 10);
        const x = (xs[i] ?? 0) + Math.sin((phase[i] ?? 0) + y * 0.05) * 0.3;
        ys[i] = y;
        xs[i] = x;
        erase(sctx, x * k, y * k, r * k * 0.9);
        erase(fctx, x * fk, y * fk, r * fk * 0.8, 0.6);
        if (Math.random() < dt * 6) drawDrop(sctx, x * k, (y - r * 1.2) * k, r * 0.35 * k);
        if (y - r > cssH) alive[i] = 0;
      }
      fctx.fillStyle = `rgba(255,255,255,${Math.min(1, clamp01(s.recovery) * dt * 0.25)})`;
      fctx.fillRect(0, 0, mist.width, mist.height);
    };

    const compose = () => {
      dctx.clearRect(0, 0, drops.width, drops.height);
      dctx.drawImage(still, 0, 0);
      for (let i = 0; i < MAX_DROPS; i++) {
        if (!alive[i]) continue;
        const stretch = 1 + Math.min((vy[i] ?? 0) / 300, 0.4);
        drawDrop(dctx, (xs[i] ?? 0) * k, (ys[i] ?? 0) * k, (rs[i] ?? 6) * k, stretch);
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, dropsTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drops);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, fogTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mist);
    };

    const recolor = () => {
      gl.uniform3f(uTint, ...resolveColor(root, settings.current.tintColor));
    };

    const draw = () => {
      if (!loaded) return;
      const s = settings.current;
      compose();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uBlur, clamp01(s.blur));
      gl.uniform1f(uFogAmount, clamp01(s.fog));
      gl.uniform1f(uRefract, clamp01(s.refraction));
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      cssW = Math.max(1, canvas.clientWidth);
      cssH = Math.max(1, canvas.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      k = Math.min(1, 720 / Math.max(cssW, cssH));
      fk = Math.min(1, 256 / Math.max(cssW, cssH));
      const w = Math.max(1, Math.round(cssW * k));
      const h = Math.max(1, Math.round(cssH * k));
      if (drops.width !== w || drops.height !== h) {
        drops.width = still.width = w;
        drops.height = still.height = h;
        mist.width = Math.max(1, Math.round(cssW * fk));
        mist.height = Math.max(1, Math.round(cssH * fk));
        scatter();
        if (reduce) for (let i = 0; i < 16; i++) addDrop(1e9);
      }
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
        const t = clamp01((now - introStart) / INTRO_MS);
        intro = t * t * t * (t * (t * 6 - 15) + 10);
      }
      const s = settings.current;
      if (!s.paused) step(Math.min(0.05, delta / 1000));
      draw();
      frame = s.paused && intro >= 1 ? 0 : requestAnimationFrame(loop);
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
      // A power-of-two copy so the photo can be mipmapped and sampled out of focus
      const pot = document.createElement("canvas");
      pot.width = pot.height = 1024;
      pot.getContext("2d")?.drawImage(image, 0, 0, 1024, 1024);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, photoTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pot);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
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
      if (!s.interactive || !s.wipe || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        last.x = -1;
        return;
      }
      if (last.x >= 0) {
        // A finger through the mist also sweeps away the droplets it touches
        for (const [ctx, scale, width] of [
          [fctx, fk, 38],
          [sctx, k, 26],
        ] as const) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineCap = "round";
          ctx.lineWidth = width * scale;
          ctx.beginPath();
          ctx.moveTo(last.x * scale, last.y * scale);
          ctx.lineTo(x * scale, y * scale);
          ctx.stroke();
          ctx.globalCompositeOperation = "source-over";
        }
        if (reduce || s.paused) draw();
      }
      last.x = x;
      last.y = y;
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
    resize();

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
      gl.deleteTexture(photoTex);
      gl.deleteTexture(dropsTex);
      gl.deleteTexture(fogTex);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src, reduce]);

  useEffect(() => {
    redraw.current(true);
  }, [tintColor]);

  useEffect(() => {
    redraw.current(false);
  }, [blur, fog, density, rate, dropSize, refraction, wipe, recovery, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden bg-[#0c0d12]", className)}>
      {alt && <span className="sr-only">{alt}</span>}
      {failed ? (
        <>
          <img src={src} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-110 object-cover blur-xl" />
          <div aria-hidden="true" className="absolute inset-0 bg-[#0c0d12]/40" />
        </>
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
