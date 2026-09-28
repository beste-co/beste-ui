"use client";

import { cn } from "@/lib/utils";
import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

export interface GlassLensProps {
  /** The words set under the glass. The type comes from `className` (size, weight, family, tracking). */
  text: string;
  /** Element the accessible copy of the text renders as. */
  as?: Tag;
  /** Color of the type. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color of the page behind the type. */
  paperColor?: string;
  /** Color the glass is faintly tinted with. */
  tintColor?: string;
  /** Strength of that tint, 0 to 1. */
  tint?: number;
  /** Number of glass drops, 1 to 4. */
  blobs?: number;
  /** Size of the drops, 0 to 1. */
  size?: number;
  /** How readily drops melt into each other, 0 (crisp) to 1 (syrupy). */
  smoothness?: number;
  /** How much the glass bends the type toward its edges, 0 to 1. */
  refraction?: number;
  /** How much the glass enlarges the type beneath it, 0 to 1. */
  magnify?: number;
  /** Color split at the glass edges, 0 to 1. */
  dispersion?: number;
  /** Thin bright rim and dark edge line, 0 to 1. */
  rim?: number;
  /** Specular highlight on the glass, 0 to 1. */
  highlight?: number;
  /** Drift speed, 1 is the default pace. */
  speed?: number;
  /** One drop follows the cursor. */
  interactive?: boolean;
  /** Freeze the glass where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const glassLensDemo: GlassLensProps = {
  text: "See through everything.",
  as: "h2",
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  tintColor: "var(--primary)",
  tint: 0.08,
  blobs: 3,
  size: 0.5,
  smoothness: 0.5,
  refraction: 0.5,
  magnify: 0.5,
  dispersion: 0.4,
  rim: 0.6,
  highlight: 0.6,
  speed: 1,
  interactive: true,
  className: "min-h-[32rem] text-8xl font-semibold leading-[0.9] tracking-[-0.05em]",
};

const MAX_BLOBS = 4;

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform sampler2D uTex;
uniform vec3 uBlobs[${MAX_BLOBS}];
uniform float uCount;
uniform float uRadius;
uniform float uSmooth;
uniform float uRefract;
uniform float uMagnify;
uniform float uDisperse;
uniform float uRim;
uniform float uHighlight;
uniform float uTint;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uTintColor;

float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float glass(vec2 p){
  float d=1e3;
  for(int i=0;i<${MAX_BLOBS};i++){
    if(float(i)>=uCount)break;
    vec3 b=uBlobs[i];
    float di=length(p-b.xy)-b.z;
    d=i==0?di:smin(d,di,uSmooth);
  }
  return d;
}
vec2 lensCenter(vec2 p){
  vec2 c=vec2(0.);
  float total=0.;
  for(int i=0;i<${MAX_BLOBS};i++){
    if(float(i)>=uCount)break;
    vec3 b=uBlobs[i];
    vec2 q=p-b.xy;
    float w=1./max(dot(q,q),.0004);
    c+=b.xy*w;
    total+=w;
  }
  return c/max(total,1e-5);
}
float ink(vec2 uv){return texture2D(uTex,uv).a;}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  float e=1.5/uRes.y;
  float d=glass(p);
  vec2 g=vec2(glass(p+vec2(e,0.))-glass(p-vec2(e,0.)),glass(p+vec2(0.,e))-glass(p-vec2(0.,e)))/(2.*e);
  float inside=1.-smoothstep(-e,e,d);
  float t=clamp(-d/(uRadius*.9),0.,1.);
  float h=sqrt(max(0.,1.-(1.-t)*(1.-t)));
  float slope=(1.-h)*inside;
  vec3 n=normalize(vec3(g*slope*1.6,max(h,.05)));
  vec2 c=lensCenter(p);
  vec2 ps=c+(p-c)*(1.-uMagnify*.45*h)-n.xy*uRefract*.08;
  ps=mix(p,ps,inside);
  vec2 uv=(ps*uRes.y+.5*uRes)/uRes;
  vec2 split=n.xy*uDisperse*.014*slope;
  float ar=ink(uv+split);
  float ag=ink(uv);
  float ab=ink(uv-split);
  vec3 col=vec3(mix(uPaper.r,uInk.r,ar),mix(uPaper.g,uInk.g,ag),mix(uPaper.b,uInk.b,ab));
  float ds=glass(p-vec2(.012,-.02));
  float shade=(1.-inside)*(1.-smoothstep(0.,.06,ds))*.1;
  col=mix(col,uInk,shade*.5);
  col=mix(col,uTintColor,uTint*inside*(.4+.6*h));
  col=mix(col,uInk,inside*(1.-smoothstep(0.,.035,-d))*.1);
  float edge=exp(-abs(d)/(e*1.2));
  col=mix(col,uInk,edge*.25*uRim);
  float lit=max(dot(normalize(g+vec2(1e-5)),vec2(-.6,.8)),0.);
  col=mix(col,vec3(1.),inside*pow(1.-h,6.)*lit*uRim*.7);
  vec3 half_=normalize(normalize(vec3(-.5,.6,.8))+vec3(0.,0.,1.));
  col+=pow(max(dot(n,half_),0.),80.)*uHighlight*inside*.9;
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

// Seeded drift paths so every drop wanders its own slow loop
const PATHS = [
  { ax: 0.34, ay: 0.22, fx: 0.11, fy: 0.17, px: 0.4, py: 1.3, scale: 1.15 },
  { ax: 0.3, ay: 0.26, fx: 0.09, fy: 0.13, px: 2.6, py: 0.2, scale: 0.9 },
  { ax: 0.38, ay: 0.2, fx: 0.07, fy: 0.15, px: 4.1, py: 3.4, scale: 0.75 },
  { ax: 0.26, ay: 0.3, fx: 0.13, fy: 0.08, px: 5.3, py: 2.1, scale: 0.6 },
];

export function GlassLens({
  text,
  as = "p",
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  tintColor = "var(--primary)",
  tint = 0.08,
  blobs = 3,
  size = 0.5,
  smoothness = 0.5,
  refraction = 0.5,
  magnify = 0.5,
  dispersion = 0.4,
  rim = 0.6,
  highlight = 0.6,
  speed = 1,
  interactive = true,
  paused = false,
  className,
  children,
}: GlassLensProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ text, inkColor, paperColor, tintColor, tint, blobs, size, smoothness, refraction, magnify, dispersion, rim, highlight, speed, interactive, paused });
  settings.current = { text, inkColor, paperColor, tintColor, tint, blobs, size, smoothness, refraction, magnify, dispersion, rim, highlight, speed, interactive, paused };
  const redraw = useRef<(what?: "colors" | "text") => void>(() => {});
  const Tag = as as ElementType;

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
    const sheet = document.createElement("canvas");
    const ctx = sheet.getContext("2d");
    if (!canvas || !root || !gl || !ctx) return setFailed(true);
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
    const uBlobs = u("uBlobs");
    const uCount = u("uCount");
    const uRadius = u("uRadius");
    const uSmooth = u("uSmooth");
    const uRefract = u("uRefract");
    const uMagnify = u("uMagnify");
    const uDisperse = u("uDisperse");
    const uRim = u("uRim");
    const uHighlight = u("uHighlight");
    const uTint = u("uTint");
    const uInk = u("uInk");
    const uPaper = u("uPaper");
    const uTintColor = u("uTintColor");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const blobData = new Float32Array(MAX_BLOBS * 3);
    const follow = { x: 0, y: 0, vx: 0, vy: 0 };
    const pointer = { x: 0, y: 0, inside: false };
    let time = 0;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let settled = 0;

    // Sets the text on a hidden canvas in the element's own type, then hands it to the shader
    const paint = () => {
      const w = canvas.width;
      const h = canvas.height;
      sheet.width = w;
      sheet.height = h;
      ctx.clearRect(0, 0, w, h);
      const style = getComputedStyle(root);
      const cssSize = Number.parseFloat(style.fontSize) || 16;
      const scale = w / Math.max(1, canvas.clientWidth);
      const line = style.lineHeight === "normal" ? 1.05 : (Number.parseFloat(style.lineHeight) || cssSize * 1.05) / cssSize;
      const spacing = style.letterSpacing === "normal" ? 0 : (Number.parseFloat(style.letterSpacing) || 0) / cssSize;
      const words = settings.current.text.split(/\s+/).filter(Boolean);
      const spaced = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
      let fontSize = cssSize * scale;
      let lines: string[] = [];
      for (let attempt = 0; attempt < 8; attempt++) {
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
        if ("letterSpacing" in spaced) spaced.letterSpacing = `${spacing * fontSize}px`;
        lines = [];
        let current = "";
        for (const word of words) {
          const next = current ? `${current} ${word}` : word;
          if (current && ctx.measureText(next).width > w * 0.9) {
            lines.push(current);
            current = word;
          } else current = next;
        }
        if (current) lines.push(current);
        const widest = lines.reduce((max, entry) => Math.max(max, ctx.measureText(entry).width), 0);
        if (lines.length * fontSize * line <= h * 0.86 && widest <= w * 0.94) break;
        fontSize *= 0.88;
      }
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const lead = fontSize * line;
      const top = h / 2 - ((lines.length - 1) * lead) / 2;
      lines.forEach((entry, index) => ctx.fillText(entry, w / 2, top + index * lead));
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sheet);
    };

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uInk, ...resolveColor(root, s.inkColor));
      gl.uniform3f(uPaper, ...resolveColor(root, s.paperColor));
      gl.uniform3f(uTintColor, ...resolveColor(root, s.tintColor));
    };

    const place = (dt: number) => {
      const s = settings.current;
      const aspect = canvas.width / Math.max(1, canvas.height);
      const count = Math.max(1, Math.min(MAX_BLOBS, Math.round(s.blobs)));
      const base = 0.12 + clamp01(s.size) * 0.16;
      for (let i = 0; i < MAX_BLOBS; i++) {
        const path = PATHS[i];
        if (!path) continue;
        let x = Math.sin(time * path.fx + path.px) * path.ax * aspect;
        let y = Math.sin(time * path.fy + path.py) * path.ay;
        if (i === 0) {
          const followCursor = s.interactive && pointer.inside;
          const tx = followCursor ? pointer.x : x;
          const ty = followCursor ? pointer.y : y;
          const pull = followCursor ? 90 : 20;
          follow.vx = (follow.vx + (tx - follow.x) * pull * dt) * Math.exp(-dt * 9);
          follow.vy = (follow.vy + (ty - follow.y) * pull * dt) * Math.exp(-dt * 9);
          follow.x += follow.vx * dt;
          follow.y += follow.vy * dt;
          x = follow.x;
          y = follow.y;
        }
        blobData[i * 3] = x;
        blobData[i * 3 + 1] = y;
        blobData[i * 3 + 2] = base * path.scale * (1 + 0.04 * Math.sin(time * 0.6 + i * 1.7));
      }
      gl.uniform3fv(uBlobs, blobData);
      gl.uniform1f(uCount, count);
      gl.uniform1f(uRadius, base);
    };

    const draw = (dt = 0) => {
      const s = settings.current;
      place(dt);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uSmooth, 0.02 + clamp01(s.smoothness) * 0.18);
      gl.uniform1f(uRefract, clamp01(s.refraction));
      gl.uniform1f(uMagnify, clamp01(s.magnify));
      gl.uniform1f(uDisperse, clamp01(s.dispersion));
      gl.uniform1f(uRim, clamp01(s.rim));
      gl.uniform1f(uHighlight, clamp01(s.highlight));
      gl.uniform1f(uTint, clamp01(s.tint));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      paint();
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
      const dt = (delta / 1000) * settings.current.speed;
      time += dt;
      draw(Math.min(0.05, delta / 1000));
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    redraw.current = (what) => {
      if (what === "colors") recolor();
      if (what === "text") paint();
      play();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!pointer.inside) return;
      pointer.x = (event.clientX - rect.left - rect.width / 2) / rect.height;
      pointer.y = (rect.height / 2 - (event.clientY - rect.top)) / rect.height;
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
    io.observe(root);
    const mo = new MutationObserver(() => requestAnimationFrame(() => redraw.current("colors")));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    let disposed = false;
    document.fonts?.ready.then(() => {
      if (disposed) return;
      paint();
      draw();
    });
    follow.x = PATHS[0] ? Math.sin(PATHS[0].px) * PATHS[0].ax : 0;
    follow.y = PATHS[0] ? Math.sin(PATHS[0].py) * PATHS[0].ay : 0;
    recolor();
    play();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      redraw.current = () => {};
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
  }, [reduce]);

  useEffect(() => {
    redraw.current("text");
  }, [text]);

  useEffect(() => {
    redraw.current("colors");
  }, [inkColor, paperColor, tintColor]);

  useEffect(() => {
    redraw.current();
  }, [tint, blobs, size, smoothness, refraction, magnify, dispersion, rim, highlight, speed, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      <Tag className="sr-only">{text}</Tag>
      {failed ? (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center px-6 text-center" style={{ color: inkColor }}>
          {text}
        </div>
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
