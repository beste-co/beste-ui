"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";

export interface ReactionDiffusionProps {
  /** Color of the grown pattern. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color of the empty ground. */
  paperColor?: string;
  /** Color of the growing fronts and the faint wash around them. */
  accentColor?: string;
  /** Gray-Scott feed rate: lower thins the pattern into worms, higher fills it into spots. */
  feed?: number;
  /** Gray-Scott kill rate: lower spreads coral, higher breaks it into dots. */
  kill?: number;
  /** Grid detail, 0 (soft, cheap) to 1 (fine). */
  resolution?: number;
  /** Growth speed, 1 is the default pace. */
  speed?: number;
  /** How often new colonies seed themselves, 0 (never) to 1 (often). */
  seeding?: number;
  /** A slow drifting eraser that keeps the pattern changing, 0 to 1. */
  erase?: number;
  /** Strength of the accent on the growing fronts, 0 to 1. */
  edges?: number;
  /** Light and shade on the pattern, 0 to 1. */
  relief?: number;
  /** Growth steers around this element, so text laid over it stays readable. */
  avoidRef?: RefObject<HTMLElement | null>;
  /** The cursor and taps seed new colonies. */
  interactive?: boolean;
  /** Freeze the growth where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const reactionDiffusionDemo: ReactionDiffusionProps = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  accentColor: "var(--primary)",
  feed: 0.0545,
  kill: 0.062,
  resolution: 0.5,
  speed: 1,
  seeding: 0.5,
  erase: 0.5,
  edges: 0.8,
  relief: 0.5,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const simFragment = `
precision highp float;
uniform sampler2D uState;
uniform vec2 uGrid;
uniform vec3 uSeed;
uniform vec3 uTrail;
uniform vec4 uCalm;
uniform vec3 uEraser;
uniform float uReset;
uniform float uFeed;
uniform float uKill;

vec2 pack(float v){
  v=clamp(v,0.,.9999);
  float s=v*255.;
  return vec2(floor(s)/255.,fract(s));
}
vec2 get(vec2 o){
  vec4 e=texture2D(uState,(gl_FragCoord.xy+o)/uGrid);
  return vec2(e.r+e.g/255.,e.b+e.a/255.);
}
void main(){
  if(uReset>.5){gl_FragColor=vec4(pack(1.),pack(0.));return;}
  vec2 c=get(vec2(0.));
  vec2 lap=-c
    +.2*(get(vec2(1.,0.))+get(vec2(-1.,0.))+get(vec2(0.,1.))+get(vec2(0.,-1.)))
    +.05*(get(vec2(1.,1.))+get(vec2(-1.,1.))+get(vec2(1.,-1.))+get(vec2(-1.,-1.)));
  vec2 uv=gl_FragCoord.xy/uGrid;
  vec2 m=smoothstep(uCalm.xy-.08,uCalm.xy,uv)*(1.-smoothstep(uCalm.zw,uCalm.zw+.08,uv));
  vec2 ed=(uv-uEraser.xy)*vec2(uGrid.x/uGrid.y,1.);
  float k=uKill+.012*m.x*m.y+.009*(1.-smoothstep(uEraser.z*.5,uEraser.z,length(ed)));
  float u=c.x;
  float v=c.y;
  float r=u*v*v;
  u+=lap.x-r+uFeed*(1.-u);
  v+=.5*lap.y+r-(uFeed+k)*v;
  vec2 sd=gl_FragCoord.xy-uSeed.xy;
  if(dot(sd,sd)<uSeed.z*uSeed.z){u=.45;v=.45;}
  // The cursor seeds softly: a gaussian nudge toward growth, never a hard stamp
  vec2 td=gl_FragCoord.xy-uTrail.xy;
  float tf=exp(-dot(td,td)/7.)*uTrail.z;
  u=mix(u,.5,tf);
  v=mix(v,.3,tf);
  gl_FragColor=vec4(pack(u),pack(v));
}`;

const displayFragment = `
precision highp float;
uniform sampler2D uState;
uniform vec2 uRes;
uniform vec2 uTexel;
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uAccent;
uniform float uEdges;
uniform float uRelief;
uniform float uIntro;

float V(vec2 uv){vec4 e=texture2D(uState,uv);return e.b+e.a/255.;}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float v=V(uv);
  float gx=V(uv+vec2(uTexel.x,0.))-V(uv-vec2(uTexel.x,0.));
  float gy=V(uv+vec2(0.,uTexel.y))-V(uv-vec2(0.,uTexel.y));
  vec3 n=normalize(vec3(-gx*14.*uRelief,-gy*14.*uRelief,1.));
  float light=dot(n,normalize(vec3(-.5,.6,.65)));
  float t=smoothstep(.15,.25,v);
  float edge=4.*t*(1.-t);
  float wash=smoothstep(.02,.15,v)*(1.-t);
  vec3 body=mix(uInk,uPaper,clamp((light-.55)*.7,0.,.32));
  vec3 col=mix(uPaper,uAccent,wash*.175*uEdges);
  col=mix(col,body,t);
  col=mix(col,uAccent,edge*uEdges);
  col+=(hash(gl_FragCoord.xy)-.5)/160.;
  // The pattern fades up out of the flat paper color
  gl_FragColor=vec4(mix(uPaper,col,uIntro),1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function link(gl: WebGLRenderingContext, fragmentSource: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vertex);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "p");
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
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
  if (!ctx) return [0, 0, 0];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [(data[0] ?? 0) / 255, (data[1] ?? 0) / 255, (data[2] ?? 0) / 255];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const BASE_STEPS = 12;
const INTRO_MS = 2400;

export function ReactionDiffusion({
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  accentColor = "var(--primary)",
  feed = 0.0545,
  kill = 0.062,
  resolution = 0.5,
  speed = 1,
  seeding = 0.5,
  erase = 0.5,
  edges = 0.8,
  relief = 0.5,
  avoidRef,
  interactive = true,
  paused = false,
  className,
  children,
}: ReactionDiffusionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [ready, setReady] = useState(false);
  const settings = useRef({ inkColor, paperColor, accentColor, feed, kill, speed, seeding, erase, edges, relief, avoidRef, interactive, paused });
  settings.current = { inkColor, paperColor, accentColor, feed, kill, speed, seeding, erase, edges, relief, avoidRef, interactive, paused };
  const refresh = useRef<(recolor?: boolean) => void>(() => {});

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
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false, depth: false, stencil: false });
    if (!canvas || !root || !gl) return setFailed(true);
    const sim = link(gl, simFragment);
    const display = link(gl, displayFragment);
    if (!sim || !display) return setFailed(true);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const s = (name: string) => gl.getUniformLocation(sim, name);
    const d = (name: string) => gl.getUniformLocation(display, name);
    const sGrid = s("uGrid");
    const sSeed = s("uSeed");
    const sTrail = s("uTrail");
    const sCalm = s("uCalm");
    const sEraser = s("uEraser");
    const sReset = s("uReset");
    const sFeed = s("uFeed");
    const sKill = s("uKill");
    const dRes = d("uRes");
    const dTexel = d("uTexel");
    const dPaper = d("uPaper");
    const dInk = d("uInk");
    const dAccent = d("uAccent");
    const dEdges = d("uEdges");
    const dRelief = d("uRelief");
    const dIntro = d("uIntro");
    gl.useProgram(sim);
    gl.uniform1i(s("uState"), 0);
    gl.useProgram(display);
    gl.uniform1i(d("uState"), 0);
    gl.activeTexture(gl.TEXTURE0);

    const textures: (WebGLTexture | null)[] = [null, null];
    const buffers: (WebGLFramebuffer | null)[] = [null, null];
    const calm = { x0: -1, y0: -1, x1: -1, y1: -1 };
    const pointer = { x: 0, y: 0, lastX: -1, lastY: -1, pending: false, tx: 0, ty: 0, sx: 0, sy: 0, movedAt: -1e9, inside: false };
    let gridW = 0;
    let gridH = 0;
    let src = 0;
    let seedsLeft = 0;
    let nextAuto = 0;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let clock = 0;
    let introStart = 0;
    let intro = reduce ? 1 : 0;

    const freeGrid = () => {
      for (let i = 0; i < 2; i++) {
        gl.deleteTexture(textures[i] ?? null);
        gl.deleteFramebuffer(buffers[i] ?? null);
        textures[i] = null;
        buffers[i] = null;
      }
    };

    const buildGrid = () => {
      freeGrid();
      for (let i = 0; i < 2; i++) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gridW, gridH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        textures[i] = texture;
        buffers[i] = fbo;
      }
      const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      if (!complete) return false;
      gl.useProgram(sim);
      gl.uniform2f(sGrid, gridW, gridH);
      gl.uniform1f(sReset, 1);
      gl.uniform3f(sSeed, 0, 0, 0);
      gl.viewport(0, 0, gridW, gridH);
      gl.bindTexture(gl.TEXTURE_2D, null);
      for (let i = 0; i < 2; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffers[i] ?? null);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.uniform1f(sReset, 0);
      src = 0;
      seedsLeft = 7;
      return true;
    };

    const inCalm = (x: number, y: number) => x > calm.x0 - 0.04 && x < calm.x1 + 0.04 && y > calm.y0 - 0.04 && y < calm.y1 + 0.04;

    const pickSeed = (radius: number) => {
      for (let i = 0; i < 8; i++) {
        const x = 0.05 + Math.random() * 0.9;
        const y = 0.05 + Math.random() * 0.9;
        if (!inCalm(x, y)) {
          gl.uniform3f(sSeed, x * gridW, y * gridH, radius);
          return;
        }
      }
      gl.uniform3f(sSeed, 0, 0, 0);
    };

    const simulate = (steps: number, time: number) => {
      const st = settings.current;
      const every = 6 - clamp01(st.seeding) * 5.4;
      gl.useProgram(sim);
      gl.viewport(0, 0, gridW, gridH);
      gl.uniform1f(sFeed, st.feed);
      gl.uniform1f(sKill, st.kill);
      gl.uniform4f(sCalm, calm.x0, calm.y0, calm.x1, calm.y1);
      gl.uniform3f(
        sEraser,
        0.6 + Math.sin(time * 0.07) * 0.28,
        0.5 + Math.sin(time * 0.053 + 1.2) * 0.32,
        reduce ? 0.001 : 0.001 + clamp01(st.erase) * 0.26,
      );
      for (let i = 0; i < steps; i++) {
        if (i === 0 && pointer.pending) {
          gl.uniform3f(sSeed, pointer.x * gridW, pointer.y * gridH, 3.5);
          pointer.pending = false;
        } else if (i === 0 && (seedsLeft > 0 || (st.seeding > 0 && time > nextAuto))) {
          pickSeed(seedsLeft > 0 ? 5 : 4);
          if (seedsLeft > 0) seedsLeft--;
          else nextAuto = time + every;
        } else if (i === 1) {
          gl.uniform3f(sSeed, 0, 0, 0);
        }
        if (i === 0) {
          // Follow a smoothed pointer and add a little growth each frame while it moves
          pointer.sx += (pointer.tx - pointer.sx) * 0.35;
          pointer.sy += (pointer.ty - pointer.sy) * 0.35;
          const trailing = pointer.inside && performance.now() - pointer.movedAt < 220;
          gl.uniform3f(sTrail, pointer.sx * gridW, pointer.sy * gridH, trailing ? 0.28 : 0);
        } else if (i === 1) {
          gl.uniform3f(sTrail, 0, 0, 0);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffers[1 - src] ?? null);
        gl.bindTexture(gl.TEXTURE_2D, textures[src] ?? null);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        src = 1 - src;
      }
      gl.uniform3f(sSeed, 0, 0, 0);
      gl.uniform3f(sTrail, 0, 0, 0);
    };

    const render = () => {
      if (!gridW) return;
      const st = settings.current;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(display);
      gl.uniform2f(dRes, canvas.width, canvas.height);
      gl.uniform2f(dTexel, 1 / gridW, 1 / gridH);
      gl.uniform1f(dEdges, clamp01(st.edges));
      gl.uniform1f(dRelief, clamp01(st.relief) * intro);
      gl.uniform1f(dIntro, intro);
      gl.bindTexture(gl.TEXTURE_2D, textures[src] ?? null);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      setReady(true);
    };

    const recolor = () => {
      const st = settings.current;
      gl.useProgram(display);
      gl.uniform3f(dPaper, ...resolveColor(root, st.paperColor));
      gl.uniform3f(dInk, ...resolveColor(root, st.inkColor));
      gl.uniform3f(dAccent, ...resolveColor(root, st.accentColor));
    };

    const measureCalm = () => {
      const zone = settings.current.avoidRef?.current;
      const box = canvas.getBoundingClientRect();
      if (!zone || box.width === 0 || box.height === 0) {
        calm.x0 = calm.y0 = calm.x1 = calm.y1 = -1;
        return;
      }
      const rect = zone.getBoundingClientRect();
      calm.x0 = (rect.left - box.left) / box.width;
      calm.x1 = (rect.right - box.left) / box.width;
      calm.y0 = (box.bottom - rect.bottom) / box.height;
      calm.y1 = (box.bottom - rect.top) / box.height;
    };

    const settle = () => {
      for (let i = 0; i < 90; i++) simulate(BASE_STEPS, i * 0.4);
      render();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      measureCalm();
      const detail = 160 + clamp01(resolution) * 320;
      const w = Math.round(canvas.clientWidth < 768 ? detail * 0.6 : detail);
      const h = Math.min(512, Math.max(96, Math.round((w * canvas.clientHeight) / Math.max(1, canvas.clientWidth))));
      if (w !== gridW || h !== gridH) {
        gridW = w;
        gridH = h;
        if (!buildGrid()) return setFailed(true);
        if (reduce) return settle();
      }
      render();
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      average += (delta - average) * 0.05;
      lastFrame = now;
      clock += delta / 1000;
      if (++tick % 90 === 0) {
        // Fewer simulation steps per frame on a device that can't keep up
        if (average > 22 && quality > 0.4) quality = Math.max(0.4, quality - 0.15);
        else if (average < 17.5 && quality < 1) quality = Math.min(1, quality + 0.05);
      }
      if (intro < 1) {
        introStart ||= now;
        const k = clamp01((now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      const paused = settings.current.paused;
      const steps = Math.max(1, Math.min(36, Math.round(BASE_STEPS * Math.max(0, settings.current.speed) * quality)));
      if (!paused) simulate(steps, clock);
      render();
      frame = paused && intro >= 1 ? 0 : requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden && gridW) frame = requestAnimationFrame(loop);
    };

    refresh.current = (withColors = false) => {
      if (withColors) recolor();
      measureCalm();
      render();
      play();
    };

    const seedAt = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
      const x = (clientX - rect.left) / rect.width;
      const y = (rect.bottom - clientY) / rect.height;
      if (Math.hypot((x - pointer.lastX) * rect.width, (y - pointer.lastY) * rect.height) < 14) return;
      pointer.x = pointer.lastX = x;
      pointer.y = pointer.lastY = y;
      pointer.pending = true;
    };
    const onMove = (event: PointerEvent) => {
      const st = settings.current;
      if (!st.interactive || st.paused || event.pointerType === "touch" || reduce) return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) {
        pointer.inside = false;
        return;
      }
      const x = (event.clientX - rect.left) / rect.width;
      const y = (rect.bottom - event.clientY) / rect.height;
      if (!pointer.inside) {
        pointer.sx = x;
        pointer.sy = y;
      }
      pointer.tx = x;
      pointer.ty = y;
      pointer.inside = true;
      pointer.movedAt = performance.now();
    };
    const onDown = (event: PointerEvent) => {
      const st = settings.current;
      if (st.interactive && !st.paused && !reduce) seedAt(event.clientX, event.clientY);
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(() => {
      resize();
      play();
    });
    ro.observe(root);
    const avoid = settings.current.avoidRef?.current;
    if (avoid) ro.observe(avoid);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    const mo = new MutationObserver(() =>
      requestAnimationFrame(() => {
        recolor();
        render();
      }),
    );
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      freeGrid();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(sim);
      gl.deleteProgram(display);
    };
  }, [reduce, resolution]);

  useEffect(() => {
    refresh.current(true);
  }, [inkColor, paperColor, accentColor]);

  useEffect(() => {
    refresh.current(false);
  }, [feed, kill, speed, seeding, erase, edges, relief, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15 [mask-image:radial-gradient(60%_70%_at_75%_40%,black,transparent)]"
          style={{ background: `repeating-radial-gradient(circle at 75% 40%, ${inkColor} 0 2px, transparent 3px 9px)` }}
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
