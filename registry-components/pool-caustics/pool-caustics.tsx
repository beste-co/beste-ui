"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface PoolCausticsProps {
  /** Color of the pale floor tiles. Any CSS color. */
  tileColor?: string;
  /** Color of the grout lines between tiles. */
  groutColor?: string;
  /** Color of the lane mark tiles. */
  laneColor?: string;
  /** Color of the water laid over the floor. */
  waterColor?: string;
  /** Color of the caustic light. */
  lightColor?: string;
  /** How strongly the water tints the floor, 0 to 1. */
  tint?: number;
  /** Tiles across the height of the surface. */
  tileSize?: number;
  /** Draw the lane mark on the floor. */
  lane?: boolean;
  /** Brightness of the caustic light, 0 to 1. */
  caustics?: number;
  /** Size of the caustic network, 0 (large cells) to 1 (fine mesh). */
  causticScale?: number;
  /** How much the water bends the tile grid, 0 to 1. */
  refraction?: number;
  /** Rainbow split on the caustic edges, 0 to 1. */
  colorSplit?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** Strength of every ripple ring, 0 to 1. */
  ripples?: number;
  /** How often ripples start on their own, 0 (never) to 1 (often). */
  rain?: number;
  /** Ripples follow the cursor and taps. */
  interactive?: boolean;
  /** Freeze the water on its current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const poolCausticsDemo: PoolCausticsProps = {
  tileColor: "#d6f2f5",
  groutColor: "#abd6de",
  laneColor: "#1a4a78",
  waterColor: "#8cd6e0",
  lightColor: "#fffaeb",
  tint: 0.24,
  tileSize: 16,
  lane: true,
  caustics: 0.7,
  causticScale: 0.5,
  refraction: 0.5,
  colorSplit: 0.5,
  speed: 1,
  ripples: 0.6,
  rain: 0.5,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uRip[6];
uniform vec3 uTile;
uniform vec3 uGrout;
uniform vec3 uLane;
uniform vec3 uWater;
uniform vec3 uLight;
uniform float uTint;
uniform float uTiles;
uniform float uLaneOn;
uniform float uCaustic;
uniform float uCScale;
uniform float uRefract;
uniform float uSplit;
uniform float uRipple;
uniform vec3 uBase;
uniform float uIntro;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float caustic(vec2 p,float t){
  vec2 i=p;
  float c=1.;
  for(int n=0;n<5;n++){
    float s=t*(1.-3.5/float(n+1));
    i=p+vec2(cos(s-i.x)+sin(s+i.y),sin(s-i.y)+cos(s+i.x));
    c+=1./length(vec2(p.x/(sin(i.x+s)/.005),p.y/(cos(i.y+s)/.005)));
  }
  c/=5.;
  c=1.17-pow(c,1.4);
  return pow(abs(c),8.);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 w=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  float t=uTime;
  vec2 slope=vec2(sin(w.y*7.+t*.9)+sin((w.x+w.y)*5.3-t*.7),cos(w.x*6.1-t*.8)+sin((w.x-w.y)*4.7+t*.6))*.004;
  float ring=0.;
  for(int k=0;k<6;k++){
    vec3 r=uRip[k];
    float age=t-r.z;
    if(age>0.&&age<5.){
      vec2 dv=w-r.xy;
      float d=length(dv)+.0001;
      float front=d-age*.28;
      float amp=exp(-age*.9)*exp(-front*front*90.)*uRipple;
      float wave=sin(front*70.)*amp;
      slope+=dv/d*wave*.018;
      ring+=wave;
    }
  }
  vec2 f=w+slope*uRefract*uIntro;
  float px=uTiles/uRes.y;
  vec2 tile=f*uTiles+.5;
  vec2 id=floor(tile);
  vec2 g=abs(fract(tile)-.5);
  float grout=smoothstep(.44-px,.44+px,max(g.x,g.y));
  float n=hash(id);
  float laneX=floor(uRes.x/uRes.y*uTiles*.275);
  float body=step(abs(id.x-laneX-.5),1.)*step(id.y,4.5);
  float bar=step(abs(id.x-laneX-.5),3.)*step(3.5,id.y)*step(id.y,5.5);
  float lane=max(body,bar)*uLaneOn;
  vec3 base=mix(uTile*(.965+.07*n),uLane*(.94+.12*n),lane);
  base=mix(base,mix(uGrout,uLane*.92+.02,lane),grout);
  vec3 col=mix(base,mix(uWater,uWater+vec3(.07,.04,.04),uv.y),uTint);
  vec2 cp=f*uCScale-250.;
  float ct=t*.45+23.;
  vec3 cau=vec3(caustic(cp+vec2(uSplit,0.),ct),caustic(cp,ct),caustic(cp-vec2(uSplit,0.),ct));
  float dapple=.5+.5*smoothstep(-.7,.9,sin(w.x*2.3+t*.11)*sin(w.y*3.1-t*.07)+.3);
  col+=cau*uLight*uCaustic*dapple*uIntro;
  col+=ring*.05;
  col+=uLight*.07*smoothstep(-.2,.6,w.y-w.x*.3);
  col*=1.-.2*dot(uv-.5,uv-.5);
  // The intro grows the pool out of the flat tile color
  gl_FragColor=vec4(mix(uBase,col,uIntro),1.);
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

export function PoolCaustics({
  tileColor = "#d6f2f5",
  groutColor = "#abd6de",
  laneColor = "#1a4a78",
  waterColor = "#8cd6e0",
  lightColor = "#fffaeb",
  tint = 0.24,
  tileSize = 16,
  lane = true,
  caustics = 0.7,
  causticScale = 0.5,
  refraction = 0.5,
  colorSplit = 0.5,
  speed = 1,
  ripples = 0.6,
  rain = 0.5,
  interactive = true,
  paused = false,
  className,
  children,
}: PoolCausticsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [ready, setReady] = useState(false);
  const settings = useRef({ tileColor, groutColor, laneColor, waterColor, lightColor, tint, tileSize, lane, caustics, causticScale, refraction, colorSplit, speed, ripples, rain, interactive, paused });
  settings.current = { tileColor, groutColor, laneColor, waterColor, lightColor, tint, tileSize, lane, caustics, causticScale, refraction, colorSplit, speed, ripples, rain, interactive, paused };
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
    const uRip = u("uRip");
    const uTile = u("uTile");
    const uGrout = u("uGrout");
    const uLane = u("uLane");
    const uWater = u("uWater");
    const uLight = u("uLight");
    const uTint = u("uTint");
    const uTiles = u("uTiles");
    const uLaneOn = u("uLaneOn");
    const uCaustic = u("uCaustic");
    const uCScale = u("uCScale");
    const uRefract = u("uRefract");
    const uSplit = u("uSplit");
    const uRipple = u("uRipple");
    const uBase = u("uBase");
    const uIntro = u("uIntro");

    // Ring buffer of ripples: x, y (pool space), start time
    const drops = new Float32Array(18).fill(-100);
    let head = 0;
    const last = { x: 0, y: 0, time: -10 };
    let time = 12;
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

    const addRipple = (x: number, y: number, at: number) => {
      drops[head * 3] = x;
      drops[head * 3 + 1] = y;
      drops[head * 3 + 2] = at;
      head = (head + 1) % 6;
      last.x = x;
      last.y = y;
      last.time = at;
    };

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uTile, ...resolveColor(root, s.tileColor));
      gl.uniform3f(uGrout, ...resolveColor(root, s.groutColor));
      gl.uniform3f(uLane, ...resolveColor(root, s.laneColor));
      gl.uniform3f(uWater, ...resolveColor(root, s.waterColor));
      gl.uniform3f(uLight, ...resolveColor(root, s.lightColor));
      gl.uniform3f(uBase, ...resolveColor(root, s.tileColor));
    };

    const draw = () => {
      const s = settings.current;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform3fv(uRip, drops);
      gl.uniform1f(uTint, clamp01(s.tint));
      gl.uniform1f(uTiles, Math.max(4, s.tileSize));
      gl.uniform1f(uLaneOn, s.lane ? 1 : 0);
      gl.uniform1f(uCaustic, clamp01(s.caustics));
      gl.uniform1f(uCScale, 4.5 + clamp01(s.causticScale) * 9);
      gl.uniform1f(uRefract, clamp01(s.refraction) * 4);
      gl.uniform1f(uSplit, clamp01(s.colorSplit) * 0.08);
      gl.uniform1f(uRipple, clamp01(s.ripples) / 0.6);
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1) * 0.75 * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
      setReady(true);
    };

    // Water moves quickly, so it stays at full frame rate and only the resolution adapts
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
      const s = settings.current;
      if (intro < 1) {
        introStart ||= now;
        const k = clamp01((now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      if (!s.paused) time += (delta / 1000) * s.speed;
      const shower = clamp01(s.rain);
      if (!s.paused && shower > 0 && time - last.time > Math.max(0.5, 6 - shower * 6.8)) {
        const aspect = canvas.width / Math.max(1, canvas.height);
        addRipple((Math.random() - 0.3) * aspect * 0.6, (Math.random() - 0.4) * 0.6, time);
      }
      draw();
      frame = s.paused && intro >= 1 ? 0 : requestAnimationFrame(loop);
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

    const toPool = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) return null;
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * (rect.width / rect.height);
      const y = 0.5 - (event.clientY - rect.top) / rect.height;
      return [x, y] as const;
    };
    const onMove = (event: PointerEvent) => {
      const s = settings.current;
      if (reduce || s.paused || !s.interactive) return;
      const point = toPool(event);
      if (!point) return;
      const [x, y] = point;
      if (time - last.time > 0.14 && Math.hypot(x - last.x, y - last.y) > 0.07) addRipple(x, y, time);
    };
    const onDown = (event: PointerEvent) => {
      const s = settings.current;
      if (reduce || s.paused || !s.interactive) return;
      const point = toPool(event);
      if (point) addRipple(point[0], point[1], time);
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    const onVisibility = () => play();

    if (reduce) {
      addRipple(0.34, -0.12, 11.1);
      addRipple(-0.18, 0.16, 10.2);
    }

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
    window.addEventListener("pointerdown", onDown, { passive: true });
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
      window.removeEventListener("pointerdown", onDown);
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
  }, [tileColor, groutColor, laneColor, waterColor, lightColor]);

  useEffect(() => {
    redraw.current(false);
  }, [tint, tileSize, lane, caustics, causticScale, refraction, colorSplit, speed, ripples, rain, interactive, paused]);

  const cell = `${Math.round(100 / Math.max(4, tileSize))}svh`;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: tileColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(70% 60% at 75% 20%, ${lightColor}, transparent 70%), linear-gradient(${groutColor} 2px, transparent 2px), linear-gradient(90deg, ${groutColor} 2px, transparent 2px)`,
            backgroundSize: `100% 100%, ${cell} ${cell}, ${cell} ${cell}`,
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
