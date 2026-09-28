"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface SilkDrapeProps {
  /** Color of the silk. Any CSS color, tokens included. */
  color?: string;
  /** Color behind the fabric, seen only where the silk lifts away. */
  backgroundColor?: string;
  /** Strength of the sheen along the weave, 0 to 1. */
  sheen?: number;
  /** Direction the light comes from, in degrees (0 = right, 90 = top). */
  lightAngle?: number;
  /** How firmly the fabric holds its shape, 0 (liquid) to 1 (crisp). */
  stiffness?: number;
  /** Strength of the breeze moving the fabric, 0 to 1. */
  wind?: number;
  /** Pins along the top edge the silk hangs from, 2 to 9. */
  pins?: number;
  /** Mesh detail, 0 to 1. Higher is smoother folds and more work. */
  detail?: number;
  /** Sweeping the cursor across stirs the air, so the silk ripples and swings with the movement. */
  interactive?: boolean;
  /** Freeze the fabric where it hangs. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const silkDrapeDemo: SilkDrapeProps = {
  color: "#1f5c4c",
  backgroundColor: "#07120f",
  sheen: 0.7,
  lightAngle: 125,
  stiffness: 0.5,
  wind: 0.45,
  pins: 5,
  detail: 0.6,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `
attribute vec3 aPos;
attribute vec3 aNor;
attribute vec3 aTan;
attribute float aAo;
uniform float uAspect;
varying vec3 vN;
varying vec3 vT;
varying float vAo;
void main(){
  float w=4./(4.-aPos.z);
  gl_Position=vec4(aPos.x/uAspect*w,aPos.y*w,-aPos.z*.1,1.);
  vN=aNor;
  vT=aTan;
  vAo=aAo;
}`;

const fragment = `
precision highp float;
uniform vec3 uColor;
uniform vec3 uLight;
uniform float uSheen;
uniform vec3 uBg;
uniform float uIntro;
varying vec3 vN;
varying vec3 vT;
varying float vAo;
void main(){
  vec3 N=normalize(vN);
  if(N.z<0.)N=-N;
  vec3 T=normalize(vT-N*dot(vT,N));
  vec3 V=vec3(0.,0.,1.);
  vec3 L=normalize(uLight);
  vec3 H=normalize(L+V);
  float wrap=clamp(dot(N,L)*.55+.45,0.,1.);
  float a=dot(T,H);
  float primary=pow(sqrt(max(0.,1.-a*a)),90.);
  vec3 H2=normalize(H+N*.3);
  float b=dot(T,H2);
  float secondary=pow(sqrt(max(0.,1.-b*b)),16.);
  float rim=pow(1.-max(dot(N,V),0.),3.);
  float occ=mix(.45,1.,vAo);
  vec3 base=uColor*(.28+.85*wrap)*occ;
  vec3 sheen=vec3(1.,.97,.92)*primary*.85+mix(uColor,vec3(1.),.35)*secondary*.45+mix(uColor,vec3(1.),.55)*rim*.3;
  // The silk grows out of the flat background color the wrapper shows before the first frame
  gl_FragColor=vec4(mix(uBg,base+sheen*uSheen*uIntro*mix(.35,1.,vAo),uIntro),1.);
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
const STEP = 1 / 60;
const INTRO_MS = 2400;

export function SilkDrape({
  color = "#1f5c4c",
  backgroundColor = "#07120f",
  sheen = 0.7,
  lightAngle = 125,
  stiffness = 0.5,
  wind = 0.45,
  pins = 5,
  detail = 0.6,
  interactive = true,
  paused = false,
  className,
  children,
}: SilkDrapeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ color, backgroundColor, sheen, lightAngle, stiffness, wind, interactive, paused });
  settings.current = { color, backgroundColor, sheen, lightAngle, stiffness, wind, interactive, paused };
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
    const gl = canvas?.getContext("webgl", { antialias: true, alpha: false });
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
    gl.enable(gl.DEPTH_TEST);

    const aPos = gl.getAttribLocation(program, "aPos");
    const aNor = gl.getAttribLocation(program, "aNor");
    const aTan = gl.getAttribLocation(program, "aTan");
    const aAo = gl.getAttribLocation(program, "aAo");
    const uAspect = gl.getUniformLocation(program, "uAspect");
    const uColor = gl.getUniformLocation(program, "uColor");
    const uLight = gl.getUniformLocation(program, "uLight");
    const uSheen = gl.getUniformLocation(program, "uSheen");
    const uBg = gl.getUniformLocation(program, "uBg");
    const uIntro = gl.getUniformLocation(program, "uIntro");
    const posBuf = gl.createBuffer();
    const norBuf = gl.createBuffer();
    const tanBuf = gl.createBuffer();
    const aoBuf = gl.createBuffer();
    const idxBuf = gl.createBuffer();

    // Cloth state, rebuilt when the canvas changes shape
    let cols = 0;
    let rows = 0;
    let count = 0;
    let pos = new Float32Array(0);
    let prev = new Float32Array(0);
    let rest = new Float32Array(0);
    let nor = new Float32Array(0);
    let tan = new Float32Array(0);
    let ao = new Float32Array(0);
    let pinned = new Uint8Array(0);
    let links = new Uint16Array(0);
    let lengths = new Float32Array(0);
    let stiffLinks = 0;
    let indexCount = 0;
    let aspect = 1;
    let background: [number, number, number] = [0, 0, 0];

    // Air stirred by the cursor: where it passes, how fast it moved, and how much of that is left
    const air = { x: 0, y: 0, vx: 0, vy: 0, power: 0, lastX: 0, lastY: 0, lastAt: 0, has: false };
    let time = 0;
    let accumulator = 0;
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

    const build = () => {
      aspect = canvas.width / Math.max(1, canvas.height);
      // Far wider than the frame, so however the silk gathers, its side edges stay out of view
      cols = Math.round((32 + clamp01(detail) * 28) * 1.3);
      const width = 2 * aspect * 1.45;
      let spacing = width / (cols - 1);
      // On tall, narrow canvases keep the row count in budget by widening the weave instead
      if (2.8 / spacing > 89) {
        spacing = 2.8 / 89;
        cols = Math.max(12, Math.ceil(width / spacing) + 1);
      }
      rows = Math.ceil(2.8 / spacing) + 1;
      count = cols * rows;
      pos = new Float32Array(count * 3);
      prev = new Float32Array(count * 3);
      rest = new Float32Array(count * 3);
      nor = new Float32Array(count * 3);
      tan = new Float32Array(count * 3);
      ao = new Float32Array(count).fill(1);
      pinned = new Uint8Array(count);
      const pinCount = Math.max(2, Math.min(9, Math.round(pins)));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = -width / 2 + c * spacing;
          const y = 1.22 - r * spacing;
          // A soft start: the fabric already hangs in gentle folds
          const z = Math.sin(c * 0.45) * 0.03 * Math.min(1, r / 6);
          pos[i * 3] = rest[i * 3] = prev[i * 3] = x;
          pos[i * 3 + 1] = rest[i * 3 + 1] = prev[i * 3 + 1] = y;
          pos[i * 3 + 2] = rest[i * 3 + 2] = prev[i * 3 + 2] = z;
        }
      }
      for (let p = 0; p < pinCount; p++) {
        const c = Math.round((p / (pinCount - 1)) * (cols - 1));
        pinned[c] = 1;
      }
      // Structural and shear links hold the weave; bend links two apart give the fabric body
      const list: number[] = [];
      const push = (a: number, b: number) => list.push(a, b);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (c < cols - 1) push(i, i + 1);
          if (r < rows - 1) push(i, i + cols);
          if (c < cols - 1 && r < rows - 1) {
            push(i, i + cols + 1);
            push(i + 1, i + cols);
          }
        }
      }
      stiffLinks = list.length / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (c < cols - 2) push(i, i + 2);
          if (r < rows - 2) push(i, i + cols * 2);
        }
      }
      links = new Uint16Array(list);
      lengths = new Float32Array(links.length / 2);
      for (let k = 0; k < lengths.length; k++) {
        const a = (links[k * 2] ?? 0) * 3;
        const b = (links[k * 2 + 1] ?? 0) * 3;
        lengths[k] = Math.hypot((rest[a] ?? 0) - (rest[b] ?? 0), (rest[a + 1] ?? 0) - (rest[b + 1] ?? 0), (rest[a + 2] ?? 0) - (rest[b + 2] ?? 0));
      }
      const indices = new Uint16Array((cols - 1) * (rows - 1) * 6);
      let n = 0;
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const i = r * cols + c;
          indices[n++] = i;
          indices[n++] = i + cols;
          indices[n++] = i + 1;
          indices[n++] = i + 1;
          indices[n++] = i + cols;
          indices[n++] = i + cols + 1;
        }
      }
      indexCount = n;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
      for (const [buf, data] of [
        [posBuf, pos],
        [norBuf, nor],
        [tanBuf, tan],
        [aoBuf, ao],
      ] as const) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      }
      // Let the fabric fall into its folds before the first frame
      for (let s = 0; s < 150; s++) simulate();
      shade();
    };

    const simulate = () => {
      const s = settings.current;
      time += STEP;
      const breeze = clamp01(s.wind);
      const gravity = -2.4 * STEP * STEP;
      const damp = 0.982;
      // A sweep of the cursor carries the silk along with it, then the stirred air dies away
      const ax = air.x;
      const ay = air.y;
      const aPower = air.power;
      air.power *= 0.93;
      const avx = air.vx * aPower * 0.00055;
      const avy = air.vy * aPower * 0.0003;
      const avz = Math.hypot(air.vx, air.vy) * aPower * 0.0008;
      for (let i = 0; i < count; i++) {
        if (pinned[i]) continue;
        const k = i * 3;
        const x = pos[k] ?? 0;
        const y = pos[k + 1] ?? 0;
        const z = pos[k + 2] ?? 0;
        // A breeze as slow, overlapping swells, strongest low on the fabric
        const drop = Math.min(1, (1.22 - y) / 2);
        const gust = (Math.sin(x * 1.3 + time * 0.9) * Math.cos(y * 1.1 - time * 0.55) + Math.sin(x * 0.5 - time * 0.35) * 0.6) * breeze * drop;
        const vx = (x - (prev[k] ?? 0)) * damp;
        const vy = (y - (prev[k + 1] ?? 0)) * damp;
        const vz = (z - (prev[k + 2] ?? 0)) * damp;
        prev[k] = x;
        prev[k + 1] = y;
        prev[k + 2] = z;
        let px = x + vx + gust * 0.00012;
        let py = y + vy + gravity;
        let pz = z + vz + gust * 0.0004;
        if (aPower > 0.004) {
          const ox = x - ax;
          const oy = y - ay;
          const fall = Math.exp(-(ox * ox + oy * oy) / 0.2);
          px += avx * fall;
          py += avy * fall;
          pz += avz * fall;
        }
        pos[k] = px;
        pos[k + 1] = py;
        pos[k + 2] = pz;
      }
      const iterations = 3 + Math.round(clamp01(s.stiffness) * 5);
      const bend = 0.12 + clamp01(s.stiffness) * 0.5;
      for (let it = 0; it < iterations; it++) {
        const total = lengths.length;
        for (let l = 0; l < total; l++) {
          const a = links[l * 2] ?? 0;
          const b = links[l * 2 + 1] ?? 0;
          const ka = a * 3;
          const kb = b * 3;
          const dx = (pos[kb] ?? 0) - (pos[ka] ?? 0);
          const dy = (pos[kb + 1] ?? 0) - (pos[ka + 1] ?? 0);
          const dz = (pos[kb + 2] ?? 0) - (pos[ka + 2] ?? 0);
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
          const strength = l < stiffLinks ? 1 : bend;
          const diff = (((dist - (lengths[l] ?? 0)) / dist) * 0.5 * strength);
          const pa = pinned[a] ? 0 : pinned[b] ? 2 : 1;
          const pb = pinned[b] ? 0 : pinned[a] ? 2 : 1;
          pos[ka] = (pos[ka] ?? 0) + dx * diff * pa;
          pos[ka + 1] = (pos[ka + 1] ?? 0) + dy * diff * pa;
          pos[ka + 2] = (pos[ka + 2] ?? 0) + dz * diff * pa;
          pos[kb] = (pos[kb] ?? 0) - dx * diff * pb;
          pos[kb + 1] = (pos[kb + 1] ?? 0) - dy * diff * pb;
          pos[kb + 2] = (pos[kb + 2] ?? 0) - dz * diff * pb;
        }
      }
    };

    // Normals, the vertical weave direction, and occlusion from how deep each point sits in a fold
    const shade = () => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const l = (r * cols + Math.max(0, c - 1)) * 3;
          const rr = (r * cols + Math.min(cols - 1, c + 1)) * 3;
          const u = (Math.max(0, r - 1) * cols + c) * 3;
          const d = (Math.min(rows - 1, r + 1) * cols + c) * 3;
          const ux = (pos[rr] ?? 0) - (pos[l] ?? 0);
          const uy = (pos[rr + 1] ?? 0) - (pos[l + 1] ?? 0);
          const uz = (pos[rr + 2] ?? 0) - (pos[l + 2] ?? 0);
          const vx = (pos[d] ?? 0) - (pos[u] ?? 0);
          const vy = (pos[d + 1] ?? 0) - (pos[u + 1] ?? 0);
          const vz = (pos[d + 2] ?? 0) - (pos[u + 2] ?? 0);
          let nx = vy * uz - vz * uy;
          let ny = vz * ux - vx * uz;
          let nz = vx * uy - vy * ux;
          const nl = Math.hypot(nx, ny, nz) || 1;
          nx /= nl;
          ny /= nl;
          nz /= nl;
          const k = i * 3;
          nor[k] = nx;
          nor[k + 1] = ny;
          nor[k + 2] = nz;
          tan[k] = vx;
          tan[k + 1] = vy;
          tan[k + 2] = vz;
          const around = ((pos[l + 2] ?? 0) + (pos[rr + 2] ?? 0) + (pos[u + 2] ?? 0) + (pos[d + 2] ?? 0)) / 4;
          ao[i] = clamp01(1 - (around - (pos[k + 2] ?? 0)) * 9);
        }
      }
    };

    const draw = () => {
      const s = settings.current;
      const angle = (s.lightAngle * Math.PI) / 180;
      gl.clearColor(background[0], background[1], background[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(uAspect, aspect);
      gl.uniform3f(uLight, Math.cos(angle), Math.sin(angle), 0.9);
      gl.uniform1f(uSheen, clamp01(s.sheen) * 1.6);
      gl.uniform3f(uBg, background[0], background[1], background[2]);
      gl.uniform1f(uIntro, intro);
      for (const [buf, data, loc, size] of [
        [posBuf, pos, aPos, 3],
        [norBuf, nor, aNor, 3],
        [tanBuf, tan, aTan, 3],
        [aoBuf, ao, aAo, 1],
      ] as const) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
      gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    };

    const recolor = () => {
      const s = settings.current;
      const [r, g, b] = resolveColor(root, s.color);
      gl.useProgram(program);
      gl.uniform3f(uColor, r, g, b);
      background = resolveColor(root, s.backgroundColor);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      const shapeChanged = Math.abs(width / height - aspect) > 0.02 || count === 0;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      if (shapeChanged) build();
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
        const p = clamp01((now - introStart) / INTRO_MS);
        intro = p * p * p * (p * (p * 6 - 15) + 10);
      }
      if (settings.current.paused) {
        draw();
        frame = intro < 1 ? requestAnimationFrame(loop) : 0;
        return;
      }
      accumulator = Math.min(accumulator + delta / 1000, STEP * 3);
      while (accumulator >= STEP) {
        simulate();
        accumulator -= STEP;
      }
      shade();
      draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden) frame = requestAnimationFrame(loop);
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
      if (!inside) {
        air.has = false;
        return;
      }
      const now = performance.now();
      const x = (((event.clientX - rect.left) / rect.width) * 2 - 1) * aspect;
      const y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
      if (air.has) {
        const dt = Math.max(0.008, (now - air.lastAt) / 1000);
        // Smoothed cursor speed in scene units per second, capped so a flick never tears the fabric
        const vx = Math.max(-6, Math.min(6, (x - air.lastX) / dt));
        const vy = Math.max(-6, Math.min(6, (y - air.lastY) / dt));
        air.vx += (vx - air.vx) * 0.4;
        air.vy += (vy - air.vy) * 0.4;
        air.power = Math.min(1, air.power + Math.hypot(vx, vy) * 0.05);
      }
      air.x = x;
      air.y = y;
      air.lastX = x;
      air.lastY = y;
      air.lastAt = now;
      air.has = true;
    };
    const onLeave = () => {
      air.has = false;
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
    document.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    resize();
    play();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const buf of [posBuf, norBuf, tanBuf, aoBuf, idxBuf]) gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [reduce, pins, detail]);

  useEffect(() => {
    refresh.current(true);
  }, [color, backgroundColor]);

  useEffect(() => {
    refresh.current(false);
  }, [sheen, lightAngle, stiffness, wind, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(90deg, color-mix(in oklab, ${color} 70%, black) 0px, ${color} 60px, color-mix(in oklab, ${color} 55%, white) 90px, ${color} 120px, color-mix(in oklab, ${color} 70%, black) 180px)`,
          }}
        />
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
