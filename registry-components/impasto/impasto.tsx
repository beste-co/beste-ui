"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface ImpastoProps {
  /** Photo the painting is made from. Loaded with CORS so the canvas can read its colors. */
  src: string;
  /** Description of the photo for screen readers. */
  alt?: string;
  /** Size of the brushstrokes, 0 (fine) to 1 (broad). */
  strokeSize?: number;
  /** Brushstrokes laid down for one painting. */
  strokes?: number;
  /** Seconds one painting takes to lay down. */
  paintTime?: number;
  /** Height of the paint ridges under the raking light, 0 to 1. */
  thickness?: number;
  /** How closely strokes follow the photo's contours, 0 (loose swirl) to 1 (along every edge). */
  flow?: number;
  /** Wet shine on the paint, 0 to 1. */
  sheen?: number;
  /** Linen weave showing through thin paint, 0 to 1. */
  canvasTexture?: number;
  /** Seconds a finished painting rests before it is painted over again; 0 keeps it. */
  repaint?: number;
  /** Color of the primed canvas. Any CSS color. */
  primerColor?: string;
  /** The raking light follows the cursor. */
  lightFollow?: boolean;
  /** Dragging with a mouse lays fresh strokes. */
  interactive?: boolean;
  /** Freeze the painting where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const impastoDemo: ImpastoProps = {
  src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1600&q=80",
  alt: "Sunrise over a misty valley with lone pines on a grassy slope",
  strokeSize: 0.5,
  strokes: 2000,
  paintTime: 12,
  thickness: 0.6,
  flow: 0.6,
  sheen: 0.5,
  canvasTexture: 0.6,
  repaint: 14,
  primerColor: "#efe8da",
  lightFollow: true,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform sampler2D uColor;
uniform sampler2D uHeight;
uniform vec2 uRes;
uniform vec2 uTexRes;
uniform vec3 uLight;
uniform float uSheen;
uniform float uRelief;
uniform float uWeave;
uniform float uThread;
uniform vec3 uPrimer;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 cover(vec2 uv){
  float ra=uRes.x/uRes.y,ta=uTexRes.x/uTexRes.y;
  vec2 s=ra>ta?vec2(1.,ta/ra):vec2(ra/ta,1.);
  return (uv-.5)*s+.5;
}
// Plain-weave linen: alternating warp and weft ridges with a little irregularity per thread
float weave(vec2 p){
  vec2 w=p/uThread;
  vec2 cell=floor(w);
  vec2 f=fract(w)-.5;
  float over=mod(cell.x+cell.y,2.);
  float warp=1.-abs(f.x)*2.;
  float weft=1.-abs(f.y)*2.;
  float t=mix(weft,warp,over);
  return t*(.85+.3*hash(cell));
}
void main(){
  vec2 uv=cover(gl_FragCoord.xy/uRes);
  vec2 tx=1./uTexRes;
  vec4 paint=texture2D(uColor,uv);
  float cov=paint.a;
  float h=texture2D(uHeight,uv).r;
  float hx=texture2D(uHeight,uv+vec2(tx.x,0.)).r-texture2D(uHeight,uv-vec2(tx.x,0.)).r;
  float hy=texture2D(uHeight,uv+vec2(0.,tx.y)).r-texture2D(uHeight,uv-vec2(0.,tx.y)).r;
  vec2 q=gl_FragCoord.xy;
  float wv=weave(q);
  float wx=weave(q+vec2(1.,0.))-weave(q-vec2(1.,0.));
  float wy=weave(q+vec2(0.,1.))-weave(q-vec2(0.,1.));
  // Linen shows through where the paint is thin
  float linen=uWeave*(1.-cov*.8);
  vec3 n=normalize(vec3(-(hx*uRelief*7.+wx*linen*.35),-(hy*uRelief*7.+wy*linen*.35),1.));
  vec3 l=normalize(uLight);
  float diff=clamp(dot(n,l),0.,1.);
  vec3 primer=uPrimer*(.95+.05*wv*uWeave);
  vec3 base=mix(primer,paint.rgb,cov);
  vec3 col=base*(.58+.55*diff);
  vec3 hv=normalize(l+vec3(0.,0.,1.));
  float spec=pow(max(dot(n,hv),0.),42.)*uSheen*cov*(.4+h*.8);
  col+=spec*vec3(1.,.97,.92)*.6;
  col+=(hash(q)-.5)*.012;
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
  if (!ctx) return [0.94, 0.91, 0.85];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [(data[0] ?? 0) / 255, (data[1] ?? 0) / 255, (data[2] ?? 0) / 255];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function hash2(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  const top = a + (b - a) * ux;
  return top + (c + (d - c) * ux - top) * uy;
}

const MAX_STEPS = 64;

export function Impasto({
  src,
  alt,
  strokeSize = 0.5,
  strokes = 2000,
  paintTime = 12,
  thickness = 0.6,
  flow = 0.6,
  sheen = 0.5,
  canvasTexture = 0.6,
  repaint = 14,
  primerColor = "#efe8da",
  lightFollow = true,
  interactive = true,
  paused = false,
  className,
  children,
}: ImpastoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ strokeSize, strokes, paintTime, thickness, flow, sheen, canvasTexture, repaint, primerColor, lightFollow, interactive, paused });
  settings.current = { strokeSize, strokes, paintTime, thickness, flow, sheen, canvasTexture, repaint, primerColor, lightFollow, interactive, paused };
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
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false });
    const colorCanvas = document.createElement("canvas");
    const heightCanvas = document.createElement("canvas");
    const cctx = colorCanvas.getContext("2d");
    const hctx = heightCanvas.getContext("2d");
    if (!canvas || !root || !gl || !cctx || !hctx) return setFailed(true);
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
    const uLight = u("uLight");
    const uSheen = u("uSheen");
    const uRelief = u("uRelief");
    const uWeave = u("uWeave");
    const uThread = u("uThread");
    const uPrimer = u("uPrimer");
    gl.uniform1i(u("uColor"), 0);
    gl.uniform1i(u("uHeight"), 1);

    const makeTexture = (unit: number) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    };
    const colorTexture = makeTexture(0);
    const heightTexture = makeTexture(1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Paint lives on two 2D canvases: color with coverage in alpha, and paint height in gray
    let paintW = 0;
    let paintH = 0;
    let sampleW = 1;
    let sampleH = 1;
    let sample = new Uint8ClampedArray(4);
    let lum = new Float32Array(1);
    const px = new Float32Array(MAX_STEPS + 1);
    const py = new Float32Array(MAX_STEPS + 1);
    const image = new Image();
    let loaded = false;

    let cycle = 0;
    let index = 0;
    let carry = 0;
    let hold = 0;
    let phase: "paint" | "fill" | "hold" = "paint";
    // Coarse map of where paint already is, so strokes spread evenly and no primer is left bare
    let gridW = 1;
    let gridH = 1;
    let gridCell = 1;
    let cover = new Float32Array(1);
    let fillOrder = new Uint32Array(0);
    let fillAt = 0;
    let seed = 1;
    let dirty = false;
    let uploadTick = 0;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let settled = 0;
    let dpr = 1;
    const light = { x: -0.62, y: 0.5, tx: -0.62, ty: 0.5 };
    const drag = { active: false, x: 0, y: 0 };
    let hovering = false;
    let clock = 0;

    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const sampleAt = (x: number, y: number) => {
      const sx = Math.min(sampleW - 1, Math.max(0, Math.floor((x / paintW) * sampleW)));
      const sy = Math.min(sampleH - 1, Math.max(0, Math.floor((y / paintH) * sampleH)));
      return sy * sampleW + sx;
    };

    const lumAt = (sx: number, sy: number) => lum[Math.min(sampleH - 1, Math.max(0, sy)) * sampleW + Math.min(sampleW - 1, Math.max(0, sx))] ?? 0;

    const gradientAt = (x: number, y: number, out: { x: number; y: number }) => {
      const sx = Math.floor((x / paintW) * sampleW);
      const sy = Math.floor((y / paintH) * sampleH);
      out.x = lumAt(sx + 1, sy) - lumAt(sx - 1, sy);
      out.y = lumAt(sx, sy + 1) - lumAt(sx, sy - 1);
    };

    const grad = { x: 0, y: 0 };
    const direction = { x: 1, y: 0 };

    // Strokes follow the photo's contours, blending into a slow swirl where the photo is flat
    const fieldAt = (x: number, y: number) => {
      gradientAt(x, y, grad);
      const mag = Math.hypot(grad.x, grad.y);
      const along = Math.atan2(grad.y, grad.x) + Math.PI / 2;
      const f = 3 / Math.max(paintW, paintH);
      const swirl = noise(x * f + cycle * 7.3, y * f + cycle * 3.1) * Math.PI * 2.2;
      const k = clamp01(settings.current.flow) * smooth(0.015, 0.1, mag);
      const vx = Math.cos(along) * k + Math.cos(swirl) * (1 - k);
      const vy = Math.sin(along) * k + Math.sin(swirl) * (1 - k);
      const len = Math.hypot(vx, vy) || 1;
      direction.x = vx / len;
      direction.y = vy / len;
    };

    const paintStroke = (x0: number, y0: number, width: number, length: number, hintX?: number, hintY?: number) => {
      const index0 = sampleAt(x0, y0) * 4;
      const vary = 1 + (random() - 0.5) * 0.1;
      const r = (sample[index0] ?? 128) * vary;
      const g = (sample[index0 + 1] ?? 128) * vary;
      const b = (sample[index0 + 2] ?? 128) * vary;
      const steps = Math.max(4, Math.min(MAX_STEPS, Math.ceil(length / (width * 0.35))));
      const stepLen = length / steps;
      let dx: number;
      let dy: number;
      if (hintX !== undefined && hintY !== undefined) {
        dx = hintX;
        dy = hintY;
      } else {
        fieldAt(x0, y0);
        dx = direction.x;
        dy = direction.y;
      }
      let x = x0;
      let y = y0;
      px[0] = x;
      py[0] = y;
      for (let i = 1; i <= steps; i++) {
        fieldAt(x, y);
        let fx = direction.x;
        let fy = direction.y;
        if (fx * dx + fy * dy < 0) {
          fx = -fx;
          fy = -fy;
        }
        dx = dx * 0.72 + fx * 0.28;
        dy = dy * 0.72 + fy * 0.28;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        x += dx * stepLen;
        y += dy * stepLen;
        px[i] = x;
        py[i] = y;
      }

      const reach = Math.max(0, Math.round((width * 0.5) / gridCell));
      for (let i = 0; i <= steps; i += 2) {
        const gx = Math.floor((px[i] ?? 0) / gridCell);
        const gy = Math.floor((py[i] ?? 0) / gridCell);
        for (let oy = -reach; oy <= reach; oy++) {
          for (let ox = -reach; ox <= reach; ox++) {
            const cx = gx + ox;
            const cy = gy + oy;
            if (cx < 0 || cy < 0 || cx >= gridW || cy >= gridH) continue;
            cover[cy * gridW + cx] = (cover[cy * gridW + cx] ?? 0) + 1;
          }
        }
      }

      const bristles = Math.max(5, Math.min(18, Math.round(width / 2.4)));
      const lineWidth = (width / bristles) * 1.6;
      cctx.lineCap = "round";
      cctx.lineJoin = "round";
      hctx.lineCap = "round";
      hctx.lineJoin = "round";
      cctx.lineWidth = lineWidth;
      hctx.lineWidth = lineWidth;
      for (let k = 0; k < bristles; k++) {
        const o = (k + 0.5) / bristles - 0.5;
        const end = Math.max(2, Math.floor(steps * (0.74 + random() * 0.26)));
        const shade = 1 + (random() - 0.5) * 0.16;
        // Paint piles up at the stroke's edges, and the bristles leave grooves between them
        const ridge = smooth(0.28, 0.5, Math.abs(o)) * 0.2;
        const groove = (k % 2 === 0 ? 0.06 : -0.05) + (random() - 0.5) * 0.05;
        const heightValue = Math.round(clamp01(0.48 + ridge + groove) * 255);
        cctx.strokeStyle = `rgb(${Math.min(255, r * shade) | 0},${Math.min(255, g * shade) | 0},${Math.min(255, b * shade) | 0})`;
        hctx.strokeStyle = `rgb(${heightValue},${heightValue},${heightValue})`;
        cctx.globalAlpha = 0.93;
        hctx.globalAlpha = 0.95;
        cctx.beginPath();
        hctx.beginPath();
        for (let i = 0; i <= end; i++) {
          const t = i / steps;
          const envelope = t < 0.12 ? 0.62 + (t / 0.12) * 0.38 : t > 0.82 ? 1 - ((t - 0.82) / 0.18) * 0.45 : 1;
          const a = Math.min(i, steps - 1);
          let nx = -((py[a + 1] ?? 0) - (py[a] ?? 0));
          let ny = (px[a + 1] ?? 0) - (px[a] ?? 0);
          const nl = Math.hypot(nx, ny) || 1;
          nx /= nl;
          ny /= nl;
          const off = o * width * envelope;
          const qx = (px[i] ?? 0) + nx * off;
          const qy = (py[i] ?? 0) + ny * off;
          if (i === 0) {
            cctx.moveTo(qx, qy);
            hctx.moveTo(qx, qy);
          } else {
            cctx.lineTo(qx, qy);
            hctx.lineTo(qx, qy);
          }
        }
        cctx.stroke();
        hctx.stroke();
      }
      // A loaded brush leaves a thicker deposit where it first touches the canvas
      cctx.globalAlpha = 0.5;
      cctx.fillStyle = `rgb(${Math.min(255, r) | 0},${Math.min(255, g) | 0},${Math.min(255, b) | 0})`;
      cctx.beginPath();
      cctx.ellipse(x0, y0, width * 0.42, width * 0.3, Math.atan2(dy, dx), 0, Math.PI * 2);
      cctx.fill();
      hctx.globalAlpha = 0.45;
      hctx.fillStyle = "rgb(210,210,210)";
      hctx.beginPath();
      hctx.ellipse(x0, y0, width * 0.36, width * 0.24, Math.atan2(dy, dx), 0, Math.PI * 2);
      hctx.fill();
      dirty = true;
    };

    const coverAt = (x: number, y: number) => {
      const gx = Math.min(gridW - 1, Math.max(0, Math.floor(x / gridCell)));
      const gy = Math.min(gridH - 1, Math.max(0, Math.floor(y / gridCell)));
      return cover[gy * gridW + gx] ?? 0;
    };

    // Coarse to fine: broad strokes block in the picture, medium ones model it, then small ones describe edges and detail
    const strokeAt = (k: number, total: number) => {
      const s = settings.current;
      const t = k / total;
      const pass = t < 0.3 ? 0 : t < 0.58 ? 1 : t < 0.82 ? 2 : 3;
      const base = Math.max(paintW, paintH) * (0.006 + clamp01(s.strokeSize) * 0.018);
      const scale = [2.4, 1.35, 0.72, 0.42][pass] ?? 1;
      const stretch = [4.4, 4.2, 3.6, 2.6][pass] ?? 4;
      const width = base * scale * (0.8 + random() * 0.4);
      const length = width * stretch * (0.7 + random() * 0.6);
      let x = random() * paintW;
      let y = random() * paintH;
      let best = -Infinity;
      const tries = pass < 2 ? 5 : pass === 2 ? 6 : 9;
      for (let i = 0; i < tries; i++) {
        const cx = random() * paintW;
        const cy = random() * paintH;
        let score: number;
        if (pass < 2) {
          // Least painted spot wins, so the picture fills in evenly
          score = -coverAt(cx, cy) + random() * 0.5;
        } else {
          // Detail goes where the photo changes most, and spreads instead of piling up in one place
          gradientAt(cx, cy, grad);
          score = Math.hypot(grad.x, grad.y) / (1 + coverAt(cx, cy) * (pass === 3 ? 0.08 : 0.04));
        }
        if (score > best) {
          best = score;
          x = cx;
          y = cy;
        }
      }
      paintStroke(x, y, width, length);
    };

    // Any cell still bare after the planned strokes gets its own stroke before the painting rests
    const fillStep = () => {
      const base = Math.max(paintW, paintH) * (0.006 + clamp01(settings.current.strokeSize) * 0.018);
      while (fillAt < fillOrder.length) {
        const cell = fillOrder[fillAt++] ?? 0;
        if ((cover[cell] ?? 0) > 0) continue;
        const x = ((cell % gridW) + 0.5) * gridCell;
        const y = (Math.floor(cell / gridW) + 0.5) * gridCell;
        const width = base * 1.1 * (0.85 + random() * 0.3);
        paintStroke(x, y, width, width * 3.4 * (0.8 + random() * 0.4));
        return true;
      }
      return false;
    };

    const beginFill = () => {
      phase = "fill";
      fillAt = 0;
      fillOrder = new Uint32Array(gridW * gridH);
      for (let i = 0; i < fillOrder.length; i++) fillOrder[i] = i;
      for (let i = fillOrder.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        const tmp = fillOrder[i] ?? 0;
        fillOrder[i] = fillOrder[j] ?? 0;
        fillOrder[j] = tmp;
      }
    };

    const startCycle = () => {
      cover.fill(0);
      cycle += 1;
      seed = (cycle * 9973 + 17) % 2147483647 || 1;
      index = 0;
      carry = 0;
      phase = "paint";
    };

    const prime = () => {
      cctx.clearRect(0, 0, paintW, paintH);
      hctx.globalAlpha = 1;
      hctx.fillStyle = "#000";
      hctx.fillRect(0, 0, paintW, paintH);
      dirty = true;
    };

    const upload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, colorTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, colorCanvas);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, heightTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, heightCanvas);
      dirty = false;
    };

    const draw = () => {
      if (!loaded) return;
      const s = settings.current;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uTexRes, paintW, paintH);
      gl.uniform3f(uLight, light.x, light.y, 0.45);
      gl.uniform1f(uSheen, clamp01(s.sheen));
      gl.uniform1f(uRelief, 0.2 + clamp01(s.thickness) * 1.4);
      gl.uniform1f(uWeave, clamp01(s.canvasTexture));
      gl.uniform1f(uThread, 3.2 * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const recolor = () => {
      gl.uniform3f(uPrimer, ...resolveColor(root, settings.current.primerColor));
    };

    // The paint canvases match the surface's aspect; a big change of shape starts a new painting
    const buildPaint = () => {
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      const scale = Math.min(1.25, 1400 / Math.max(w, h));
      paintW = Math.max(64, Math.round(w * scale));
      paintH = Math.max(64, Math.round(h * scale));
      colorCanvas.width = paintW;
      colorCanvas.height = paintH;
      heightCanvas.width = paintW;
      heightCanvas.height = paintH;
      sampleW = Math.max(32, Math.round(paintW / 2));
      sampleH = Math.max(32, Math.round(paintH / 2));
      gridCell = Math.max(paintW, paintH) / 72;
      gridW = Math.max(1, Math.ceil(paintW / gridCell));
      gridH = Math.max(1, Math.ceil(paintH / gridCell));
      cover = new Float32Array(gridW * gridH);
      const probe = document.createElement("canvas");
      probe.width = sampleW;
      probe.height = sampleH;
      const pctx = probe.getContext("2d", { willReadFrequently: true });
      if (!pctx) return;
      const ia = image.naturalWidth / Math.max(1, image.naturalHeight);
      const ca = sampleW / sampleH;
      let sw = image.naturalWidth;
      let sh = image.naturalHeight;
      if (ia > ca) sw = sh * ca;
      else sh = sw / ca;
      pctx.drawImage(image, (image.naturalWidth - sw) / 2, (image.naturalHeight - sh) / 2, sw, sh, 0, 0, sampleW, sampleH);
      sample = pctx.getImageData(0, 0, sampleW, sampleH).data;
      lum = new Float32Array(sampleW * sampleH);
      for (let i = 0; i < sampleW * sampleH; i++) {
        lum[i] = ((sample[i * 4] ?? 0) * 0.299 + (sample[i * 4 + 1] ?? 0) * 0.587 + (sample[i * 4 + 2] ?? 0) * 0.114) / 255;
      }
      prime();
      cycle = 0;
      startCycle();
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (loaded && paintW > 0) {
        const was = paintW / paintH;
        const now = canvas.clientWidth / Math.max(1, canvas.clientHeight);
        if (Math.abs(now - was) / was > 0.2) {
          buildPaint();
          if (reduce) finishInstantly();
        }
      }
      draw();
    };

    // Reduced motion: paint the whole picture in time-sliced chunks and show only the finished canvas
    let settleFrame = 0;
    const finishInstantly = () => {
      const total = Math.max(200, Math.round(settings.current.strokes));
      const step = () => {
        const budget = performance.now() + 12;
        while (index < total && performance.now() < budget) strokeAt(index++, total);
        if (index < total) {
          settleFrame = requestAnimationFrame(step);
          return;
        }
        if (phase !== "fill") beginFill();
        while (performance.now() < budget) if (!fillStep()) break;
        if (fillAt < fillOrder.length) {
          settleFrame = requestAnimationFrame(step);
          return;
        }
        phase = "hold";
        upload();
        draw();
      };
      cancelAnimationFrame(settleFrame);
      settleFrame = requestAnimationFrame(step);
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
      const dt = delta / 1000;
      clock += dt;
      const s = settings.current;
      const total = Math.max(200, Math.round(s.strokes));

      if (phase === "paint") {
        carry += (total / Math.max(2, s.paintTime)) * dt;
        const budget = performance.now() + 5;
        while (carry >= 1 && index < total && performance.now() < budget) {
          strokeAt(index++, total);
          carry -= 1;
        }
        if (index >= total) {
          beginFill();
          carry = 0;
        }
      } else if (phase === "fill") {
        // Closing sweep at the same pace, so the last touches read as part of the painting
        carry += (total / Math.max(2, s.paintTime)) * dt;
        const budget = performance.now() + 5;
        let more = true;
        while (carry >= 1 && more && performance.now() < budget) {
          more = fillStep();
          carry -= 1;
        }
        if (!more || fillAt >= fillOrder.length) {
          phase = "hold";
          hold = 0;
          carry = 0;
        }
      } else if (s.repaint > 0) {
        hold += dt;
        if (hold >= s.repaint) startCycle();
      }

      // The raking light drifts on its own and follows the cursor when asked to
      if (!(s.lightFollow && hovering)) {
        light.tx = -0.62 + Math.sin(clock * 0.21) * 0.28;
        light.ty = 0.5 + Math.sin(clock * 0.17 + 1) * 0.2;
      }
      const lx = light.x;
      const ly = light.y;
      light.x += (light.tx - light.x) * 0.06;
      light.y += (light.ty - light.y) * 0.06;
      const moving = Math.abs(light.x - lx) + Math.abs(light.y - ly) > 0.0004;

      let uploaded = false;
      if (dirty) {
        uploadTick++;
        if (uploadTick % 2 === 0 || phase === "hold") {
          upload();
          uploaded = true;
        }
      }
      // A resting painting under a slowly drifting light redraws at half rate; the cursor gets full rate
      if (uploaded || (moving && (hovering || tick % 2 === 0))) draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (loaded && !reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    refresh.current = (withColors = false) => {
      if (withColors) recolor();
      play();
      draw();
    };

    image.crossOrigin = "anonymous";
    image.onload = () => {
      loaded = true;
      recolor();
      buildPaint();
      upload();
      draw();
      if (reduce) finishInstantly();
      setReady(true);
      play();
    };
    image.onerror = () => setFailed(true);
    image.src = src;

    const toPaint = (clientX: number, clientY: number, rect: DOMRect) => {
      // Screen point to paint-canvas point, through the same cover fit the shader uses
      const ra = rect.width / Math.max(1, rect.height);
      const ta = paintW / Math.max(1, paintH);
      let ux = (clientX - rect.left) / rect.width;
      let uy = (clientY - rect.top) / rect.height;
      if (ra > ta) uy = (uy - 0.5) * (ta / ra) + 0.5;
      else ux = (ux - 0.5) * (ra / ta) + 0.5;
      return { x: ux * paintW, y: uy * paintH };
    };

    const onMove = (event: PointerEvent) => {
      const s = settings.current;
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      hovering = inside;
      if (inside && s.lightFollow) {
        light.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 1.8;
        light.ty = (0.5 - (event.clientY - rect.top) / rect.height) * 1.8;
      }
      if (drag.active && inside && s.interactive && !s.paused && loaded) {
        const p = toPaint(event.clientX, event.clientY, rect);
        const mx = p.x - drag.x;
        const my = p.y - drag.y;
        const dist = Math.hypot(mx, my);
        const base = Math.max(paintW, paintH) * (0.006 + clamp01(s.strokeSize) * 0.018) * 1.1;
        if (dist > base * 1.2) {
          paintStroke(drag.x, drag.y, base, Math.min(dist * 1.4, base * 6), mx / dist, my / dist);
          drag.x = p.x;
          drag.y = p.y;
          if (reduce) {
            upload();
            draw();
          }
        }
      }
    };
    const onDown = (event: PointerEvent) => {
      const s = settings.current;
      if (event.pointerType === "touch" || !s.interactive || s.paused || !loaded) return;
      const rect = canvas.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      const p = toPaint(event.clientX, event.clientY, rect);
      drag.active = true;
      drag.x = p.x;
      drag.y = p.y;
    };
    const onUp = () => {
      drag.active = false;
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
    const mo = new MutationObserver(() => requestAnimationFrame(() => refresh.current(true)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settleFrame);
      refresh.current = () => {};
      image.onload = null;
      image.onerror = null;
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(colorTexture);
      gl.deleteTexture(heightTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src, reduce]);

  useEffect(() => {
    refresh.current(true);
  }, [primerColor]);

  useEffect(() => {
    refresh.current(false);
  }, [strokeSize, strokes, paintTime, thickness, flow, sheen, canvasTexture, repaint, lightFollow, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: primerColor }}>
      {alt && <span className="sr-only">{alt}</span>}
      {failed ? (
        <img src={src} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 size-full transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}
        />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
