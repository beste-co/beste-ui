"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

type Focus = "right" | "center" | "full";

export interface CyanotypeProps {
  /** Deep color the exposed chemistry turns. Any CSS color. */
  blueColor?: string;
  /** Color of the watercolor paper around and under the specimens. */
  paperColor?: string;
  /** Color of the fresh, unexposed coating. */
  chemistryColor?: string;
  /** How many specimens lie on each print, 1 to 9. */
  specimens?: number;
  /** Seed for the specimen arrangement; the same seed always lays out the same print. */
  seed?: number;
  /** Where the specimens gather, leaving the rest of the print open for text. */
  focus?: Focus;
  /** Seconds until the print is almost fully developed. */
  exposureTime?: number;
  /** Seconds between washes; each wash rinses the print and a new arrangement develops. 0 turns washing off. */
  washInterval?: number;
  /** Ragged, brushed edges where the coating stops and bare paper begins. */
  brushEdge?: boolean;
  /** Paper grain and fiber, 0 to 1. */
  grain?: number;
  /** How much the cursor's shade holds back the exposure, 0 to 1. */
  shade?: number;
  /** The cursor casts shade like a hand over the print. */
  interactive?: boolean;
  /** Freeze the print where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const cyanotypeDemo: CyanotypeProps = {
  blueColor: "#1c3f6e",
  paperColor: "#f3eee2",
  chemistryColor: "#dcd6a2",
  specimens: 5,
  seed: 11,
  focus: "right",
  exposureTime: 6,
  washInterval: 12,
  brushEdge: true,
  grain: 0.5,
  shade: 0.6,
  interactive: true,
  className: "min-h-[32rem]",
};

const WASH_SECONDS = 1.8;

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform sampler2D uOld;
uniform sampler2D uNew;
uniform sampler2D uShadeMap;
uniform float uOldStart;
uniform float uOldDelay;
uniform float uNewStart;
uniform float uFront;
uniform float uExposure;
uniform float uShade;
uniform float uGrain;
uniform float uBrush;
uniform vec3 uBlue;
uniform vec3 uPaper;
uniform vec3 uChem;
uniform float uIntro;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float develop(float start){return 1.-exp(-3.*max(uTime-start,0.)/uExposure);}
vec3 printAt(vec2 uv,sampler2D mask,float e,float shade,vec2 p){
  vec2 m=texture2D(mask,vec2(uv.x,1.-uv.y)).rg;
  float through=1.-max(m.r*.94,m.g*.82);
  float lit=e*through*(1.-shade*uShade*.85);
  float mottle=.9+.16*noise(p*3.1)+.06*noise(p*17.);
  vec3 c=mix(uChem,uBlue*mottle,smoothstep(0.,1.,pow(lit,.75)));
  return mix(c,uPaper*.985,e*(1.-through)*.88);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float aspect=uRes.x/uRes.y;
  vec2 p=vec2(uv.x*aspect,uv.y);
  float shade=texture2D(uShadeMap,vec2(uv.x,1.-uv.y)).r;
  float pos=uv.x*.85+(1.-uv.y)*.15;

  float coat=1.;
  if(uBrush>.5){
    vec2 q=vec2(min(uv.x,1.-uv.x)*aspect,min(uv.y,1.-uv.y));
    float edge=min(q.x,q.y);
    float along=q.x<q.y?uv.y*6.:uv.x*aspect*6.;
    float ragged=.045+.018*noise(vec2(along*2.3,1.7))+.008*noise(vec2(along*11.,4.1));
    float bristle=noise(vec2(along*40.,edge*3.));
    coat=smoothstep(ragged,ragged+.01,edge)*mix(1.,.55+.45*bristle,1.-smoothstep(ragged,ragged+.06,edge));
  }

  vec3 col;
  float e=develop(uOldStart+uOldDelay*pos*${WASH_SECONDS.toFixed(1)});
  if(uFront<0.){
    col=printAt(uv,uOld,e,shade,p);
  }else{
    float d=pos-uFront;
    float band=exp(-d*d*900.);
    vec2 wuv=uv+vec2(0.,sin(d*120.-uTime*6.)*.0035*band);
    vec3 before=printAt(wuv,uOld,e,shade,p);
    vec3 after=printAt(wuv,uNew,develop(uNewStart+pos*${WASH_SECONDS.toFixed(1)}),shade,p);
    col=mix(after,before,smoothstep(-.015,.015,d));
    col+=band*.06;
    col=mix(col,col*.9,band*.3*(.5+.5*sin(d*260.)));
  }

  float fiber=noise(p*vec2(52.,7.));
  vec3 paper=uPaper*(.965+.05*fiber+.02*noise(p*140.));
  col=mix(paper,col*(.97+.04*fiber),coat*uIntro);
  col+=(hash(gl_FragCoord.xy)-.5)*.04*uGrain;
  // The intro brushes the coating onto the flat paper color the wrapper paints
  gl_FragColor=vec4(mix(uPaper,col,uIntro),1.);
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

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;
type Specimen = (ctx: CanvasRenderingContext2D, rand: Rand, size: number) => void;

function quad(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number): [number, number, number, number] {
  const u = 1 - t;
  return [
    u * u * x0 + 2 * u * t * cx + t * t * x1,
    u * u * y0 + 2 * u * t * cy + t * t * y1,
    2 * u * (cx - x0) + 2 * t * (x1 - cx),
    2 * u * (cy - y0) + 2 * t * (y1 - cy),
  ];
}

// A tapered stroke along a quadratic curve, filled so stems and blades thin toward the tip
function ribbon(ctx: CanvasRenderingContext2D, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w0: number, w1: number) {
  const steps = 24;
  const left: number[] = [];
  const right: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const [px, py, dx, dy] = quad(x0, y0, cx, cy, x1, y1, t);
    const len = Math.hypot(dx, dy) || 1;
    const half = (w0 + (w1 - w0) * t) / 2;
    left.push(px - (dy / len) * half, py + (dx / len) * half);
    right.push(px + (dy / len) * half, py - (dx / len) * half);
  }
  ctx.beginPath();
  ctx.moveTo(left[0] ?? 0, left[1] ?? 0);
  for (let i = 2; i < left.length; i += 2) ctx.lineTo(left[i] ?? 0, left[i + 1] ?? 0);
  for (let i = right.length - 2; i >= 0; i -= 2) ctx.lineTo(right[i] ?? 0, right[i + 1] ?? 0);
  ctx.closePath();
  ctx.fill();
}

// Leaf outline with its base at the origin and its tip straight up
function leafShape(ctx: CanvasRenderingContext2D, len: number, width: number) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(width, -len * 0.25, width * 0.8, -len * 0.75, 0, -len);
  ctx.bezierCurveTo(-width * 0.8, -len * 0.75, -width, -len * 0.25, 0, 0);
  ctx.fill();
}

function pinna(ctx: CanvasRenderingContext2D, len: number) {
  if (len < 14) {
    leafShape(ctx, len, len * 0.25);
    return;
  }
  ribbon(ctx, 0, 0, 0, -len * 0.5, 0, -len, len * 0.04, len * 0.01);
  const pairs = 6;
  for (let j = 1; j <= pairs; j++) {
    const tt = j / (pairs + 1);
    const size = len * 0.26 * (1 - tt * 0.6);
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(0, -len * tt);
      ctx.rotate(side * (Math.PI / 2 - 0.55));
      leafShape(ctx, size, size * 0.32);
      ctx.restore();
    }
  }
  ctx.save();
  ctx.translate(0, -len * 0.92);
  leafShape(ctx, len * 0.14, len * 0.04);
  ctx.restore();
}

const fern: Specimen = (ctx, rand, size) => {
  const bend = (rand() - 0.5) * size * 0.5;
  const cx = bend;
  const cy = -size * 0.5;
  const ex = bend * 0.6;
  const ey = -size;
  ribbon(ctx, 0, 0, cx, cy, ex, ey, size * 0.014, size * 0.003);
  const count = 16 + Math.floor(rand() * 8);
  for (let i = 1; i <= count; i++) {
    const t = i / (count + 1);
    const [px, py, dx, dy] = quad(0, 0, cx, cy, ex, ey, t);
    const angle = Math.atan2(dy, dx);
    const len = size * (0.2 * (1 - t) ** 0.7 + 0.025);
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle + side * (Math.PI / 2 - 0.5 - t * 0.25) + Math.PI / 2);
      pinna(ctx, len);
      ctx.restore();
    }
  }
};

const grass: Specimen = (ctx, rand, size) => {
  const blades = 5 + Math.floor(rand() * 4);
  for (let b = 0; b < blades; b++) {
    const tx = (rand() - 0.5) * size * 0.7;
    const ty = -size * (0.55 + rand() * 0.45);
    const cx = tx * 0.3 + (rand() - 0.5) * size * 0.25;
    const cy = ty * 0.55;
    const bx = (rand() - 0.5) * size * 0.05;
    ribbon(ctx, bx, 0, cx, cy, tx, ty, size * 0.016, size * 0.0015);
    if (b === blades - 1) {
      for (let k = 0; k < 14; k++) {
        const [px, py, dx, dy] = quad(bx, 0, cx, cy, tx, ty, 0.7 + k * 0.021);
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(Math.atan2(dy, dx) + Math.PI / 2 + (k % 2 ? 0.4 : -0.4));
        leafShape(ctx, size * 0.045, size * 0.012);
        ctx.restore();
      }
    }
  }
};

const seedHead: Specimen = (ctx, rand, size) => {
  const hx = (rand() - 0.5) * size * 0.25;
  const hy = -size * 0.72;
  ribbon(ctx, 0, 0, hx * 0.2 + (rand() - 0.5) * size * 0.1, hy * 0.5, hx, hy, size * 0.01, size * 0.006);
  ctx.lineCap = "round";
  ctx.lineWidth = size * 0.0022;
  ctx.beginPath();
  const tips: number[] = [];
  for (let k = 0; k < 90; k++) {
    const angle = rand() * Math.PI * 2;
    const reach = size * 0.16 * (0.85 + rand() * 0.15);
    const x = hx + Math.cos(angle) * reach;
    const y = hy + Math.sin(angle) * reach;
    ctx.moveTo(hx + Math.cos(angle) * size * 0.015, hy + Math.sin(angle) * size * 0.015);
    ctx.lineTo(x, y);
    tips.push(x, y, angle);
  }
  ctx.stroke();
  ctx.lineWidth = size * 0.0012;
  ctx.beginPath();
  for (let i = 0; i < tips.length; i += 3) {
    const x = tips[i] ?? 0;
    const y = tips[i + 1] ?? 0;
    const angle = tips[i + 2] ?? 0;
    for (let f = -2; f <= 2; f++) {
      const a = angle + f * 0.25;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * size * 0.035, y + Math.sin(a) * size * 0.035);
    }
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(hx, hy, size * 0.018, 0, Math.PI * 2);
  ctx.fill();
};

const leaf: Specimen = (ctx, rand, size) => {
  const len = size * 0.62;
  const wid = size * 0.21;
  ribbon(ctx, 0, 0, (rand() - 0.5) * size * 0.05, -size * 0.14, 0, -size * 0.29, size * 0.012, size * 0.008);
  ctx.save();
  ctx.translate(0, -size * 0.28);
  ctx.globalAlpha = 0.9;
  leafShape(ctx, len, wid);
  // Veins let a little light through, so they print as fine blue lines
  ctx.globalCompositeOperation = "destination-out";
  ctx.globalAlpha = 0.5;
  ribbon(ctx, 0, 0, 0, -len * 0.5, 0, -len * 0.97, size * 0.008, size * 0.0015);
  ctx.lineWidth = size * 0.0035;
  ctx.beginPath();
  for (let k = 1; k <= 7; k++) {
    const t = k / 8;
    const y = -len * t;
    const half = wid * 0.75 * Math.sin(Math.PI * t);
    for (const side of [-1, 1]) {
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(side * half * 0.5, y - len * 0.03, side * half * 0.85, y - len * 0.09);
    }
  }
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.restore();
};

const flower: Specimen = (ctx, rand, size) => {
  const tx = (rand() - 0.5) * size * 0.3;
  const ty = -size * 0.8;
  const cx = (rand() - 0.5) * size * 0.3;
  const cy = -size * 0.4;
  ribbon(ctx, 0, 0, cx, cy, tx, ty, size * 0.011, size * 0.007);
  for (const [t, side] of [
    [0.35, -1],
    [0.55, 1],
  ] as const) {
    const [px, py, dx, dy] = quad(0, 0, cx, cy, tx, ty, t);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(Math.atan2(dy, dx) + Math.PI / 2 + side * 0.9);
    leafShape(ctx, size * 0.18, size * 0.05);
    ctx.restore();
  }
  const petal = size * 0.13;
  ctx.globalAlpha = 0.85;
  for (let k = 0; k < 13; k++) {
    const angle = (k / 13) * Math.PI * 2 + rand() * 0.1;
    ctx.beginPath();
    ctx.ellipse(tx + Math.cos(angle) * petal * 0.55, ty + Math.sin(angle) * petal * 0.55, petal * 0.55, petal * 0.15, angle, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(tx, ty, petal * 0.22, 0, Math.PI * 2);
  ctx.fill();
};

const SPECIMENS: Specimen[] = [fern, grass, seedHead, leaf, flower];

function boxBlur(src: Float32Array, w: number, h: number, r: number) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const norm = 1 / (2 * r + 1);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let acc = 0;
    for (let x = -r; x <= r; x++) acc += src[row + Math.min(w - 1, Math.max(0, x))] ?? 0;
    for (let x = 0; x < w; x++) {
      tmp[row + x] = acc * norm;
      acc += (src[row + Math.min(w - 1, x + r + 1)] ?? 0) - (src[row + Math.max(0, x - r)] ?? 0);
    }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let y = -r; y <= r; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x] ?? 0;
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc * norm;
      acc += (tmp[Math.min(h - 1, y + r + 1) * w + x] ?? 0) - (tmp[Math.max(0, y - r) * w + x] ?? 0);
    }
  }
  return out;
}

// Lays out one print's specimens and packs it as R = sharp silhouette, G = soft penumbra
function rasterize(canvas: HTMLCanvasElement, aspect: number, count: number, seed: number, focus: Focus) {
  const long = 900;
  const w = aspect >= 1 ? long : Math.max(1, Math.round(long * aspect));
  const h = aspect >= 1 ? Math.max(1, Math.round(long / aspect)) : long;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";

  const rand = mulberry32(seed);
  const size = Math.min(w, h);
  const span: [number, number] = focus === "right" ? [0.5, 0.97] : focus === "center" ? [0.25, 0.75] : [0.05, 0.95];
  const offset = Math.floor(rand() * SPECIMENS.length);
  for (let i = 0; i < count; i++) {
    const kind = SPECIMENS[(offset + i) % SPECIMENS.length] ?? fern;
    const x = w * (span[0] + (span[1] - span[0]) * ((i + 0.1 + rand() * 0.8) / count));
    const y = h * (0.62 + rand() * 0.4);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rand() - 0.5) * 1.1);
    kind(ctx, rand, size * (0.5 + rand() * 0.35));
    ctx.restore();
  }

  const pixels = ctx.getImageData(0, 0, w, h).data;
  const sharp = new Float32Array(w * h);
  for (let i = 0; i < sharp.length; i++) sharp[i] = (pixels[i * 4] ?? 0) / 255;
  const radius = Math.max(2, Math.round(size * 0.006));
  const soft = boxBlur(boxBlur(sharp, w, h, radius), w, h, radius);
  const packed = new Uint8Array(w * h * 4);
  for (let i = 0; i < sharp.length; i++) {
    packed[i * 4] = Math.round((sharp[i] ?? 0) * 255);
    packed[i * 4 + 1] = Math.round((soft[i] ?? 0) * 255);
    packed[i * 4 + 3] = 255;
  }
  return { width: w, height: h, data: packed };
}

export function Cyanotype({
  blueColor = "#1c3f6e",
  paperColor = "#f3eee2",
  chemistryColor = "#dcd6a2",
  specimens = 5,
  seed = 11,
  focus = "right",
  exposureTime = 6,
  washInterval = 12,
  brushEdge = true,
  grain = 0.5,
  shade = 0.6,
  interactive = true,
  paused = false,
  className,
  children,
}: CyanotypeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ blueColor, paperColor, chemistryColor, specimens, seed, focus, exposureTime, washInterval, brushEdge, grain, shade, interactive, paused });
  settings.current = { blueColor, paperColor, chemistryColor, specimens, seed, focus, exposureTime, washInterval, brushEdge, grain, shade, interactive, paused };
  const refresh = useRef<(mode: "colors" | "layout" | "settings") => void>(() => {});

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
    const uOldStart = u("uOldStart");
    const uOldDelay = u("uOldDelay");
    const uNewStart = u("uNewStart");
    const uFront = u("uFront");
    const uExposure = u("uExposure");
    const uShade = u("uShade");
    const uGrain = u("uGrain");
    const uBrush = u("uBrush");
    const uBlue = u("uBlue");
    const uPaper = u("uPaper");
    const uChem = u("uChem");
    const uIntro = u("uIntro");
    gl.uniform1i(u("uOld"), 0);
    gl.uniform1i(u("uNew"), 1);
    gl.uniform1i(u("uShadeMap"), 2);

    const makeTexture = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    };
    let current = makeTexture();
    let next = makeTexture();
    const shadeTexture = makeTexture();
    const layoutCanvas = document.createElement("canvas");

    let gridW = 64;
    let gridH = 40;
    let shadeGrid = new Float32Array(gridW * gridH);
    let shadeBytes = new Uint8Array(gridW * gridH);
    let shadeLive = false;

    let time = 0;
    let arrangement = 0;
    let printStart = 0;
    let oldDelay = 0;
    let washStart = 0;
    let front = -1;
    let aspect = 1;
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
    const pointer = { x: 0, y: 0, inside: false };

    const upload = (texture: WebGLTexture | null, index: number) => {
      const s = settings.current;
      const packed = rasterize(layoutCanvas, aspect, Math.max(1, Math.min(9, Math.round(s.specimens))), Math.round(s.seed) + index * 7919, s.focus);
      if (!packed) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, packed.width, packed.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, packed.data);
    };

    const uploadShade = () => {
      for (let i = 0; i < shadeGrid.length; i++) shadeBytes[i] = Math.round((shadeGrid[i] ?? 0) * 255);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, shadeTexture);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gridW, gridH, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, shadeBytes);
    };

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uBlue, ...resolveColor(root, s.blueColor));
      gl.uniform3f(uPaper, ...resolveColor(root, s.paperColor));
      gl.uniform3f(uChem, ...resolveColor(root, s.chemistryColor));
    };

    const draw = () => {
      const s = settings.current;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uOldStart, reduce ? -100000 : printStart);
      gl.uniform1f(uOldDelay, oldDelay);
      gl.uniform1f(uNewStart, washStart);
      gl.uniform1f(uFront, front);
      gl.uniform1f(uExposure, Math.max(0.5, s.exposureTime));
      gl.uniform1f(uShade, clamp01(s.shade));
      gl.uniform1f(uGrain, clamp01(s.grain));
      gl.uniform1f(uBrush, s.brushEdge ? 1 : 0);
      gl.uniform1f(uIntro, intro);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, current);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, next);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, shadeTexture);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const nextAspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
      if (Math.abs(nextAspect - aspect) > 0.01) {
        aspect = nextAspect;
        gridW = 64;
        gridH = Math.max(8, Math.min(128, Math.round(64 / aspect)));
        shadeGrid = new Float32Array(gridW * gridH);
        shadeBytes = new Uint8Array(gridW * gridH);
        uploadShade();
        upload(current, arrangement);
        if (front >= 0) upload(next, arrangement + 1);
      }
      draw();
    };

    const updateShade = (dt: number) => {
      const s = settings.current;
      const decay = Math.exp(-dt * 0.3);
      let live = false;
      for (let i = 0; i < shadeGrid.length; i++) {
        const value = (shadeGrid[i] ?? 0) * decay;
        shadeGrid[i] = value;
        if (value > 0.004) live = true;
      }
      if (s.interactive && pointer.inside) {
        const cx = pointer.x * gridW;
        const cy = pointer.y * gridH;
        const radius = gridW * 0.1;
        const spread = radius * radius * 0.5;
        const x0 = Math.max(0, Math.floor(cx - radius * 2));
        const x1 = Math.min(gridW - 1, Math.ceil(cx + radius * 2));
        const y0 = Math.max(0, Math.floor(cy - radius * 2));
        const y1 = Math.min(gridH - 1, Math.ceil(cy + radius * 2));
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const i = y * gridW + x;
            const d2 = (x - cx) ** 2 + (y - cy) ** 2;
            shadeGrid[i] = Math.min(1, (shadeGrid[i] ?? 0) + dt * 2.2 * Math.exp(-d2 / spread));
          }
        }
        live = true;
      }
      if (live || shadeLive) uploadShade();
      shadeLive = live;
      return live;
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
        const k = clamp01((now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      const s = settings.current;
      const dt = s.paused ? 0 : delta / 1000;
      time += dt;
      if (front < 0 && s.washInterval > 0 && time - printStart >= s.washInterval) {
        arrangement++;
        upload(next, arrangement);
        washStart = time;
        front = 0;
      }
      if (front >= 0) {
        front = (time - washStart) / WASH_SECONDS;
        if (front > 1.25) {
          const done = current;
          current = next;
          next = done;
          printStart = washStart;
          oldDelay = 1;
          front = -1;
        }
      }
      const shading = updateShade(dt);
      // A settled print with no wash and no shade reads the same at half rate
      const developing = time - printStart < Math.max(0.5, s.exposureTime) * 1.3 + WASH_SECONDS;
      if (front >= 0 || shading || developing || intro < 1 || tick % 2 === 0) draw();
      frame = !s.paused || intro < 1 ? requestAnimationFrame(loop) : 0;
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if ((!reduce && !settings.current.paused) || intro < 1) {
        if (visible && !document.hidden) frame = requestAnimationFrame(loop);
      }
    };

    refresh.current = (mode) => {
      if (mode === "colors") recolor();
      if (mode === "layout") {
        upload(current, arrangement);
        if (front >= 0) upload(next, arrangement + 1);
      }
      play();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      const y = (event.clientY - rect.top) / Math.max(1, rect.height);
      pointer.inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      pointer.x = x;
      pointer.y = y;
    };
    const onLeave = () => {
      pointer.inside = false;
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
    document.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    uploadShade();
    resize();
    setReady(true);
    play();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(current);
      gl.deleteTexture(next);
      gl.deleteTexture(shadeTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [reduce]);

  useEffect(() => {
    refresh.current("colors");
  }, [blueColor, paperColor, chemistryColor]);

  useEffect(() => {
    refresh.current("layout");
  }, [specimens, seed, focus]);

  useEffect(() => {
    refresh.current("settings");
  }, [exposureTime, washInterval, brushEdge, grain, shade, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-[4%]"
          style={{ background: `radial-gradient(120% 90% at 70% 60%, ${blueColor}, color-mix(in oklab, ${blueColor} 72%, black))` }}
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
