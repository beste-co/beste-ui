"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

export interface CrtChannel {
  /** Main line drawn on the screen */
  title: string;
  /** Smaller line under or above it */
  caption?: string;
  /** Card style: a title card, color bars or an amber slate. Cycles by position when omitted. */
  look?: "title" | "bars" | "slate";
}

export interface CrtScreenProps {
  /** Cards the set tunes through, painted onto the tube */
  channels: CrtChannel[];
  /** How far the glass bulges, 0 (flat) to 1. */
  curvature?: number;
  /** Depth of the scanlines, 0 to 1. */
  scanlines?: number;
  /** Strength of the red, green and blue aperture grille, 0 to 1. */
  mask?: number;
  /** Bloom around bright shapes, 0 to 1. */
  glow?: number;
  /** Static on the picture, 0 to 1. */
  noise?: number;
  /** Strength of the slow hum bar rolling down the screen, 0 to 1. */
  roll?: number;
  /** Seconds between channel changes on its own. 0 keeps one channel until clicked. */
  glitchInterval?: number;
  /** Clicking the screen switches to the next channel. */
  clickToTune?: boolean;
  /** Accessible name of the screen when it is clickable */
  tuneLabel?: string;
  /** Wrap the tube in a rounded television housing. */
  bezel?: boolean;
  /** Freeze the picture. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const crtScreenDemo: CrtScreenProps = {
  channels: [
    { title: "The late show never signed off.", caption: "Rabbit Ear Archive" },
    { title: "Midnight double feature", caption: "Two noir pictures, back to back" },
    { title: "Cartoons before dawn", caption: "Saturday mornings, as taped in 1986" },
  ],
  curvature: 0.5,
  scanlines: 0.6,
  mask: 0.5,
  glow: 0.5,
  noise: 0.5,
  roll: 0.5,
  glitchInterval: 6.5,
  clickToTune: true,
  tuneLabel: "Change the channel",
  bezel: true,
  className: "max-w-3xl",
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uTexRes;
uniform sampler2D uTex;
uniform float uTime;
uniform float uGlitch;
uniform float uSeed;
uniform float uCurve;
uniform float uScan;
uniform float uMask;
uniform float uGlow;
uniform float uNoise;
uniform float uRoll;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 curve(vec2 uv){
  uv=uv*2.-1.;
  vec2 o=abs(uv.yx)/vec2(5.2,4.2);
  uv=uv+uv*o*o*uCurve;
  return uv*.5+.5;
}
vec2 cover(vec2 uv){
  float ra=uRes.x/uRes.y,ta=uTexRes.x/uTexRes.y;
  vec2 s=ra>ta?vec2(1.,ta/ra):vec2(ra/ta,1.);
  return (uv-.5)*s+.5;
}
vec3 tap(vec2 uv){
  vec2 inside=step(vec2(0.),uv)*step(uv,vec2(1.));
  return texture2D(uTex,cover(clamp(uv,0.,1.))).rgb*inside.x*inside.y;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 q=curve(uv);
  float g=uGlitch;
  float t=uTime;
  float line=floor(q.y*150.);
  float burst=step(.6,hash(vec2(line*.37,floor(t*14.)+uSeed)));
  float tear=(hash(vec2(line,floor(t*24.)+uSeed))-.5)*(.003+.11*g*burst);
  tear+=.0011*sin(q.y*38.+t*2.6);
  float roll=g*g*(.25+.2*sin(uSeed));
  vec2 s=vec2(q.x+tear,fract(q.y+roll));
  float ab=.0022+.014*g+.003*length(uv-.5);
  vec3 col;
  col.r=tap(s+vec2(ab,0.)).r;
  col.g=tap(s).g;
  col.b=tap(s-vec2(ab,0.)).b;
  vec3 glow=(tap(s+vec2(.005,0.))+tap(s-vec2(.005,0.))+tap(s+vec2(0.,.006))+tap(s-vec2(0.,.006)))*.25;
  col+=glow*uGlow;
  float lines=floor(uRes.y/3.);
  float scan=1.-uScan+uScan*pow(.5+.5*sin(q.y*lines*6.2831),1.5);
  col*=scan;
  float mx=mod(gl_FragCoord.x,3.);
  float low=1.-uMask*.6;
  vec3 mask=vec3(mx<1.?1.:low,(mx>=1.&&mx<2.)?1.:low,mx>=2.?1.:low);
  col*=mask*(1.+uMask*.4);
  col*=1.-uRoll+uRoll*sin(q.y*2.4-t*1.1);
  float n=hash(gl_FragCoord.xy+fract(t*7.)*113.);
  col+=(n-.5)*(uNoise+.4*g);
  col=mix(col,vec3(n*.85),g*g*.55);
  float vig=16.*q.x*q.y*(1.-q.x)*(1.-q.y);
  col*=pow(clamp(vig,0.,1.),.3);
  col*=.975+.025*sin(t*11.);
  vec2 edge=step(vec2(0.),q)*step(q,vec2(1.));
  col*=edge.x*edge.y;
  gl_FragColor=vec4(col,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

const TEX_W = 1024;
const TEX_H = 768;

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function fitText(ctx: CanvasRenderingContext2D, text: string, font: (size: number) => string, start: number, maxWidth: number, maxLines: number) {
  let size = start;
  ctx.font = font(size);
  let lines = wrapLines(ctx, text, maxWidth);
  while (lines.length > maxLines && size > 36) {
    size -= 6;
    ctx.font = font(size);
    lines = wrapLines(ctx, text, maxWidth);
  }
  return { size, lines };
}

const barColors = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"];
const stripColors = ["#0000c0", "#131313", "#c000c0", "#131313", "#00c0c0", "#131313", "#c0c0c0"];

function paintChannel(ctx: CanvasRenderingContext2D, channel: CrtChannel, index: number, sans: string) {
  const look = channel.look ?? (index === 0 ? "title" : index % 2 === 1 ? "bars" : "slate");
  const serif = "ui-serif, Georgia, 'Times New Roman', serif";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  if (look === "title") {
    const bg = ctx.createLinearGradient(0, 0, 0, TEX_H);
    bg.addColorStop(0, "#0c1c40");
    bg.addColorStop(1, "#03060f");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    const { size, lines } = fitText(ctx, channel.title, (s) => `800 ${s}px ${sans}`, 118, TEX_W - 144, 4);
    const lineHeight = size * 0.98;
    const top = TEX_H / 2 - (lines.length * lineHeight) / 2 + size * 0.78;
    if (channel.caption) {
      ctx.fillStyle = "#86ff9f";
      ctx.font = `500 34px ${sans}`;
      ctx.fillText(channel.caption, 72, top - size - 24, TEX_W - 144);
    }
    ctx.fillStyle = "#f6f1e6";
    ctx.font = `800 ${size}px ${sans}`;
    lines.forEach((text, i) => ctx.fillText(text, 72, top + i * lineHeight));
    return;
  }

  if (look === "bars") {
    const w = TEX_W / barColors.length;
    barColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(i * w), 0, Math.ceil(w), 500);
    });
    stripColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(i * w), 500, Math.ceil(w), 56);
    });
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 556, TEX_W, TEX_H - 556);
    ctx.fillStyle = "#f6f1e6";
    const { lines } = fitText(ctx, channel.title, (s) => `800 ${s}px ${sans}`, 64, TEX_W - 144, 1);
    ctx.fillText(lines[0] ?? "", 72, 648, TEX_W - 144);
    if (channel.caption) {
      ctx.fillStyle = "#9a958c";
      ctx.font = `500 30px ${sans}`;
      ctx.fillText(channel.caption, 72, 702, TEX_W - 144);
    }
    return;
  }

  const glow = ctx.createRadialGradient(TEX_W / 2, TEX_H / 2, 40, TEX_W / 2, TEX_H / 2, TEX_W * 0.7);
  glow.addColorStop(0, "#3a2408");
  glow.addColorStop(1, "#0d0803");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.fillStyle = "#ffb54a";
  ctx.textAlign = "center";
  const { size, lines } = fitText(ctx, channel.title, (s) => `italic 400 ${s}px ${serif}`, 104, TEX_W - 200, 3);
  const lineHeight = size * 1.02;
  const top = TEX_H / 2 - (lines.length * lineHeight) / 2 + size * 0.7;
  lines.forEach((text, i) => ctx.fillText(text, TEX_W / 2, top + i * lineHeight));
  if (channel.caption) {
    ctx.fillStyle = "#c98a3a";
    ctx.font = `500 30px ${sans}`;
    ctx.fillText(channel.caption, TEX_W / 2, top + lines.length * lineHeight + 30, TEX_W - 200);
  }
  ctx.textAlign = "left";
}

interface CrtState {
  paint: () => void;
  tune: () => void;
  play: () => void;
}

export function CrtScreen({
  channels,
  curvature = 0.5,
  scanlines = 0.6,
  mask = 0.5,
  glow = 0.5,
  noise = 0.5,
  roll = 0.5,
  glitchInterval = 6.5,
  clickToTune = true,
  tuneLabel = "Change the channel",
  bezel = true,
  paused = false,
  className,
  children,
}: CrtScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  // A string key keeps the channel list stable across re-renders so the GL setup does not restart
  const key = JSON.stringify(channels);
  const screens = useMemo<CrtChannel[]>(() => JSON.parse(key), [key]);
  const settings = useRef({ curvature, scanlines, mask, glow, noise, roll, glitchInterval, paused });
  settings.current = { curvature, scanlines, mask, glow, noise, roll, glitchInterval, paused };
  const state = useRef<CrtState | null>(null);

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
    const paper = document.createElement("canvas");
    paper.width = TEX_W;
    paper.height = TEX_H;
    const ctx = paper.getContext("2d");
    if (!canvas || !root || !gl || !ctx || screens.length === 0) return setFailed(true);
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
    const uGlitch = u("uGlitch");
    const uSeed = u("uSeed");
    const uCurve = u("uCurve");
    const uScan = u("uScan");
    const uMask = u("uMask");
    const uGlow = u("uGlow");
    const uNoise = u("uNoise");
    const uRoll = u("uRoll");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform2f(uTexRes, TEX_W, TEX_H);

    let channel = 0;
    let frame = 0;
    let visible = true;
    let disposed = false;
    let glitchStart = -10;
    let switched = true;
    let seed = 0;
    let time = 12;
    let lastFrame = 0;
    let nextGlitch = 5;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let tick = 0;
    let settled = 0;
    const sans = getComputedStyle(root).fontFamily || "system-ui, sans-serif";

    const paint = () => {
      const screen = screens[channel];
      if (screen) paintChannel(ctx, screen, channel, sans);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, paper);
    };

    const draw = () => {
      const s = settings.current;
      let glitch = 0;
      const since = time - glitchStart;
      if (since >= 0 && since < 0.6) {
        glitch = since < 0.09 ? since / 0.09 : 1 - (since - 0.09) / 0.51;
        if (!switched && since >= 0.09) {
          switched = true;
          channel = (channel + 1) % screens.length;
          paint();
        }
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uGlitch, Math.max(0, glitch));
      gl.uniform1f(uSeed, seed);
      gl.uniform1f(uCurve, clamp01(s.curvature) * 2);
      gl.uniform1f(uScan, clamp01(s.scanlines) * 0.67);
      gl.uniform1f(uMask, clamp01(s.mask));
      gl.uniform1f(uGlow, clamp01(s.glow) * 0.8);
      gl.uniform1f(uNoise, clamp01(s.noise) * 0.14);
      gl.uniform1f(uRoll, clamp01(s.roll) * 0.14);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tune = () => {
      glitchStart = time;
      switched = false;
      seed = Math.random() * 100;
      const every = settings.current.glitchInterval;
      nextGlitch = every > 0 ? time + every * (0.77 + Math.random() * 0.46) : Number.POSITIVE_INFINITY;
    };

    const resize = () => {
      // Scanlines and the aperture grille need real pixels, so this stays near device scale
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
        if (average > 22 && quality > 0.7) {
          ceiling = Math.max(0.7, quality - 0.05);
          quality = Math.max(0.7, quality - 0.15);
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
      time += delta / 1000;
      if (time >= nextGlitch && screens.length > 1) tune();
      draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      const every = settings.current.glitchInterval;
      if (every <= 0) nextGlitch = Number.POSITIVE_INFINITY;
      else if (!Number.isFinite(nextGlitch)) nextGlitch = time + every;
      if (!reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
      else draw();
    };

    state.current = {
      paint,
      play,
      tune: () => {
        if (screens.length < 2) return;
        if (reduce || settings.current.paused) {
          channel = (channel + 1) % screens.length;
          paint();
          draw();
          return;
        }
        tune();
      },
    };

    const onLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    const onVisibility = () => play();

    paint();
    document.fonts?.ready.then(() => {
      if (disposed) return;
      paint();
      draw();
    });

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(canvas);
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    play();

    return () => {
      disposed = true;
      state.current = null;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    };
  }, [screens, reduce]);

  useEffect(() => {
    state.current?.play();
  }, [curvature, scanlines, mask, glow, noise, roll, glitchInterval, paused]);

  const first = screens[0];
  const glassClass = cn(
    "relative block aspect-[4/3] w-full overflow-hidden bg-black shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]",
    bezel ? "rounded-[1.75rem]" : "rounded-md",
  );
  const picture = (
    <>
      {failed ? (
        <span aria-hidden="true" className="absolute inset-0 flex flex-col justify-center bg-[radial-gradient(circle_at_50%_45%,#11224a,#03060f_75%)] p-8 text-left md:p-12">
          {first?.caption && <span className="mb-4 text-base text-[#86ff9f]">{first.caption}</span>}
          {first && <span className="text-4xl font-extrabold leading-none tracking-tight text-[#f6f1e6] md:text-6xl">{first.title}</span>}
          <span className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)]" />
        </span>
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      )}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_10%,rgba(255,255,255,0.07),transparent_45%)]",
          bezel ? "rounded-[1.75rem]" : "rounded-md",
        )}
      />
    </>
  );
  const tube = clickToTune ? (
    <button type="button" aria-label={tuneLabel} onClick={() => state.current?.tune()} className={cn(glassClass, "cursor-pointer")}>
      {picture}
    </button>
  ) : (
    <div aria-hidden="true" className={glassClass}>
      {picture}
    </div>
  );

  return (
    <div ref={rootRef} className={cn("relative isolate w-full", className)}>
      {bezel ? (
        <div className="rounded-[2.25rem] bg-gradient-to-b from-[#2b2825] to-[#141210] p-3 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] md:p-5">
          {tube}
        </div>
      ) : (
        tube
      )}
      {children && <div className="relative">{children}</div>}
    </div>
  );
}
