"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

type Arrangement = "left" | "center" | "stagger";

export interface LetterpressProps {
  /** The composition, one entry per line; words are pressed one at a time in reading order. */
  lines: string[];
  /** Color of the cotton sheet. Any CSS color, tokens included. */
  paperColor?: string;
  /** Ink colors; each new sheet takes the next one. */
  inkColors?: string[];
  /** How each sheet is set; cycles through the list, one per sheet. */
  arrangements?: Arrangement[];
  /** Seconds between two presses. */
  interval?: number;
  /** Seconds the finished sheet rests before it is swapped. */
  hold?: number;
  /** How deep the type bites into the paper, 0 to 1. */
  depth?: number;
  /** How fully the ink covers the bottom of each impression, 0 to 1. */
  coverage?: number;
  /** Uneven ink: light spots where it didn't take and squeeze at the edges, 0 to 1. */
  irregularity?: number;
  /** Paper fiber and grain, 0 to 1. */
  grain?: number;
  /** Margins of the type area as shares of the sheet, 0 to 0.45. */
  area?: { top?: number; right?: number; bottom?: number; left?: number };
  /** The raking light follows the cursor, so the impressions glint. */
  interactive?: boolean;
  /** Freeze the press where it is. */
  paused?: boolean;
  /** Font family, weight and size (the size is an upper bound) come from these classes. */
  className?: string;
  children?: ReactNode;
}

export const letterpressDemo: LetterpressProps = {
  lines: ["Pressed", "by hand,", "one word", "at a time."],
  paperColor: "#f1ece1",
  inkColors: ["#1f2a44", "#a8352a", "#2d2a26"],
  arrangements: ["left", "center", "stagger"],
  interval: 0.6,
  hold: 4,
  depth: 0.6,
  coverage: 0.9,
  irregularity: 0.5,
  grain: 0.5,
  interactive: true,
  className: "min-h-[32rem] font-serif text-8xl font-bold",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform sampler2D uMask;
uniform vec2 uRes;
uniform float uPress;
uniform float uDepth;
uniform float uBlur;
uniform vec2 uLight;
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uTable;
uniform float uCoverage;
uniform float uIrregular;
uniform float uGrain;
uniform float uSlide;
uniform float uSeed;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float bite(vec2 uv){vec4 m=texture2D(uMask,uv);return m.r+m.g*uPress;}
float soft(vec2 uv){
  vec2 o=vec2(uBlur)/uRes;
  return (bite(uv)*2.+bite(uv+o)+bite(uv-o)+bite(uv+vec2(o.x,-o.y))+bite(uv+vec2(-o.x,o.y)))/6.;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 s=vec2(uv.x-uSlide,uv.y);
  if(s.x<0.||s.x>1.){gl_FragColor=vec4(uTable,1.);return;}
  vec2 e=vec2(1.5)/uRes;
  float h=soft(s);
  vec2 g=vec2(soft(s+vec2(e.x,0.))-soft(s-vec2(e.x,0.)),soft(s+vec2(0.,e.y))-soft(s-vec2(0.,e.y)));
  vec3 n=normalize(vec3(g*uDepth*7.,1.));
  vec3 l=normalize(vec3(uLight,.9));
  float shade=(dot(n,l)-l.z)*1.6;
  vec2 px=s*uRes;
  float fiber=noise(px/3.)*.5+noise(px/11.+uSeed)*.5;
  vec3 paper=uPaper*(1.-uGrain*.05+fiber*uGrain*.06)*(1.-h*.05*uDepth);
  vec3 col=paper*(1.+shade*.55);
  vec4 m=texture2D(uMask,s);
  float ink=clamp(m.r+m.g*smoothstep(.55,1.,uPress),0.,1.);
  float dens=uCoverage*(.8+.2*noise(px/14.+uSeed*3.));
  dens*=1.-smoothstep(.64,.82,noise(px/5.+uSeed*7.))*uIrregular*.7;
  float edge=clamp(ink*(1.-h*1.15)*2.,0.,1.);
  dens=clamp(dens+edge*.25*uIrregular,0.,1.);
  col=mix(col,uInk*(1.+shade*.25),ink*dens);
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
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

interface Word {
  text: string;
  x: number;
  y: number;
}

export function Letterpress({
  lines,
  paperColor = "#f1ece1",
  inkColors = ["#1f2a44", "#a8352a", "#2d2a26"],
  arrangements = ["left", "center", "stagger"],
  interval = 0.6,
  hold = 4,
  depth = 0.6,
  coverage = 0.9,
  irregularity = 0.5,
  grain = 0.5,
  area,
  interactive = true,
  paused = false,
  className,
  children,
}: LetterpressProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ paperColor, inkColors, arrangements, interval, hold, depth, coverage, irregularity, grain, area, interactive, paused });
  settings.current = { paperColor, inkColors, arrangements, interval, hold, depth, coverage, irregularity, grain, area, interactive, paused };
  const refresh = useRef<(recolor?: boolean) => void>(() => {});
  const text = lines.join("\n");
  const inkKey = inkColors.join(",");

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
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");
    if (!canvas || !root || !gl || !mctx) return setFailed(true);
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
    const uPress = u("uPress");
    const uDepth = u("uDepth");
    const uBlur = u("uBlur");
    const uLight = u("uLight");
    const uPaper = u("uPaper");
    const uInk = u("uInk");
    const uTable = u("uTable");
    const uCoverage = u("uCoverage");
    const uIrregular = u("uIrregular");
    const uGrain = u("uGrain");
    const uSlide = u("uSlide");
    const uSeed = u("uSeed");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const rows = text.split("\n").filter(Boolean);
    let words: Word[] = [];
    let font = "";
    let fontPx = 16;
    let pressed = 0;
    let sheet = 0;
    let phase: "press" | "hold" | "out" | "in" = "press";
    let phaseTime = -0.6;
    let press = 0;
    let slide = 0;
    let frame = 0;
    let visible = true;
    let disposed = false;
    let lastFrame = 0;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let tick = 0;
    let settled = 0;
    const light = { x: -0.6, y: 0.7 };
    const target = { x: -0.6, y: 0.7 };

    const layout = () => {
      const w = canvas.width;
      const h = canvas.height;
      const s = settings.current;
      const a = s.area ?? {};
      const top = h * Math.min(0.45, a.top ?? 0.12);
      const bottom = h * Math.min(0.45, a.bottom ?? 0.12);
      const left = w * Math.min(0.45, a.left ?? 0.08);
      const right = w * Math.min(0.45, a.right ?? 0.08);
      const style = getComputedStyle(root);
      const dpr = canvas.width / Math.max(1, canvas.clientWidth);
      const family = `${style.fontStyle} ${style.fontWeight}`;
      fontPx = (Number.parseFloat(style.fontSize) || 96) * dpr;
      mctx.font = `${family} ${fontPx}px ${style.fontFamily}`;
      let widest = 1;
      for (const row of rows) widest = Math.max(widest, mctx.measureText(row).width);
      const lineHeight = 1.02;
      const fit = Math.min(1, (w - left - right) / widest, (h - top - bottom) / (rows.length * fontPx * lineHeight));
      fontPx *= fit;
      font = `${family} ${fontPx}px ${style.fontFamily}`;
      mctx.font = font;
      widest *= fit;
      const arrangement = s.arrangements[sheet % Math.max(1, s.arrangements.length)] ?? "left";
      const block = rows.length * fontPx * lineHeight;
      const startY = top + (h - top - bottom - block) / 2 + fontPx * lineHeight * 0.5;
      const space = mctx.measureText(" ").width;
      words = [];
      rows.forEach((row, index) => {
        const width = mctx.measureText(row).width;
        let x = left;
        if (arrangement === "center") x = left + (w - left - right - width) / 2;
        else if (arrangement === "stagger") x = left + Math.min(w - left - right - width, index * (w - left - right - widest) / Math.max(1, rows.length - 1));
        const y = startY + index * fontPx * lineHeight;
        for (const part of row.split(" ").filter(Boolean)) {
          words.push({ text: part, x, y });
          x += mctx.measureText(part).width + space;
        }
      });
    };

    const paint = () => {
      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.globalCompositeOperation = "source-over";
      mctx.fillStyle = "#000";
      mctx.fillRect(0, 0, mask.width, mask.height);
      mctx.globalCompositeOperation = "lighter";
      mctx.font = font;
      mctx.textBaseline = "middle";
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (!word || i > pressed) continue;
        mctx.fillStyle = i < pressed ? "#f00" : "#0f0";
        mctx.fillText(word.text, word.x, word.y);
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
    };

    const recolor = () => {
      const s = settings.current;
      const paper = resolveColor(root, s.paperColor);
      const inks = s.inkColors.length > 0 ? s.inkColors : ["#1f2a44"];
      const ink = resolveColor(root, inks[sheet % inks.length] ?? "#1f2a44");
      gl.uniform3f(uPaper, ...paper);
      gl.uniform3f(uInk, ...ink);
      gl.uniform3f(uTable, paper[0] * 0.86, paper[1] * 0.85, paper[2] * 0.83);
    };

    const draw = () => {
      const s = settings.current;
      light.x += (target.x - light.x) * 0.06;
      light.y += (target.y - light.y) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uPress, press);
      gl.uniform1f(uDepth, 0.2 + clamp01(s.depth) * 1.4);
      gl.uniform1f(uBlur, Math.max(1.5, fontPx * 0.03));
      gl.uniform2f(uLight, light.x, light.y);
      gl.uniform1f(uCoverage, 0.55 + clamp01(s.coverage) * 0.45);
      gl.uniform1f(uIrregular, clamp01(s.irregularity));
      gl.uniform1f(uGrain, clamp01(s.grain));
      gl.uniform1f(uSlide, slide);
      gl.uniform1f(uSeed, sheet * 3.7);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const nextSheet = () => {
      sheet++;
      pressed = 0;
      press = 0;
      layout();
      recolor();
      paint();
    };

    // Press: the newest word bites in with a slight overshoot, then joins the settled sheet
    const advance = (dt: number) => {
      const s = settings.current;
      const gap = Math.max(0.3, s.interval);
      // The bite takes a little over half the gap, so quick settings stay crisp
      const bite = Math.min(0.42, gap * 0.6);
      phaseTime += dt;
      if (phase === "press") {
        const t = clamp01(phaseTime / bite);
        press = t < 0.5 ? easeInOut(t * 2) * 1.15 : 1.15 - easeInOut((t - 0.5) * 2) * 0.15;
        if (phaseTime >= gap) {
          pressed++;
          phaseTime = 0;
          press = 0;
          if (pressed >= words.length) {
            pressed = words.length;
            phase = "hold";
          }
          paint();
        }
      } else if (phase === "hold" && phaseTime >= Math.max(0.5, s.hold)) {
        phase = "out";
        phaseTime = 0;
      } else if (phase === "out") {
        slide = -easeInOut(clamp01(phaseTime / 0.7)) * 1.05;
        if (phaseTime >= 0.7) {
          nextSheet();
          phase = "in";
          phaseTime = 0;
        }
      } else if (phase === "in") {
        slide = (1 - easeInOut(clamp01(phaseTime / 0.7))) * 1.05;
        if (phaseTime >= 0.7) {
          slide = 0;
          phase = "press";
          phaseTime = -0.15;
        }
      }
    };

    const finish = () => {
      pressed = words.length;
      press = 0;
      phase = "hold";
      slide = 0;
      paint();
      draw();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      mask.width = canvas.width;
      mask.height = canvas.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
      layout();
      if (reduce) finish();
      else {
        paint();
        draw();
      }
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
      advance(delta / 1000);
      // A resting sheet with a settled light only needs every other frame
      const moving = phase !== "hold" || Math.abs(target.x - light.x) + Math.abs(target.y - light.y) > 0.002;
      if (moving || tick % 2 === 0) draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    refresh.current = (withColors = false) => {
      if (withColors) recolor();
      play();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (inside) {
        target.x = -0.6 + ((event.clientX - rect.left) / rect.width - 0.5) * 0.8;
        target.y = 0.7 - ((event.clientY - rect.top) / rect.height - 0.5) * 0.6;
      } else {
        target.x = -0.6;
        target.y = 0.7;
      }
      if (reduce || settings.current.paused) draw();
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(root);
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
        refresh.current(true);
      });
    });
    for (let node = root.parentElement; node; node = node.parentElement) {
      mo.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    document.fonts?.ready.then(() => {
      if (disposed) return;
      layout();
      paint();
      draw();
    });
    recolor();
    play();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [text, reduce]);

  useEffect(() => {
    refresh.current(true);
  }, [paperColor, inkKey]);

  useEffect(() => {
    refresh.current(false);
  }, [interval, hold, depth, coverage, irregularity, grain, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      {failed ? (
        <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-center gap-[0.02em] px-[8%] leading-[1.02]" style={{ color: inkColors[0] }}>
          {lines.map((line, index) => (
            <span key={index} className="opacity-85 [text-shadow:1px_1px_0_rgba(255,255,255,0.6),-1px_-1px_1px_rgba(0,0,0,0.25)]">
              {line}
            </span>
          ))}
        </div>
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
