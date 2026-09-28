"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface InkFluidProps {
  /** Color of the ground the ink moves over. Dark grounds make the pigments glow; light ones mix them like ink on paper. */
  groundColor?: string;
  /** Pigment colors as they read on white paper. Clicks and drops cycle through them. */
  pigments?: string[];
  /** First pigment; overrides pigments[0] (a single color, so it can be set from a color picker). */
  pigment1?: string;
  /** Second pigment; overrides pigments[1]. */
  pigment2?: string;
  /** Third pigment; overrides pigments[2]. */
  pigment3?: string;
  /** Cells on the short side of the velocity grid. Higher is finer and costlier. */
  simResolution?: number;
  /** Cells on the short side of the dye grid. Higher keeps the ink edges sharper. */
  dyeResolution?: number;
  /** Pressure solver passes per frame. More keeps the flow tighter. */
  pressureIterations?: number;
  /** How much the flow curls into eddies, 0 to 1. */
  vorticity?: number;
  /** How quickly the ink fades back into the ground, 0 to 1. */
  fade?: number;
  /** Size of each splash of ink, 0 to 1. */
  splatSize?: number;
  /** How hard the cursor and the drops push the water, 0 to 1. */
  force?: number;
  /** Seconds between drops that land on their own when nobody is drawing. 0 turns them off. */
  autoInterval?: number;
  /** The cursor drags ink and a click switches pigment. */
  interactive?: boolean;
  /** Freeze the water where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const inkFluidDemo: InkFluidProps = {
  groundColor: "var(--foreground)",
  pigments: ["#1a264c", "#d32f1a", "#27272a"],
  simResolution: 128,
  dyeResolution: 512,
  pressureIterations: 18,
  vorticity: 0.5,
  fade: 0.3,
  splatSize: 0.5,
  force: 0.5,
  autoInterval: 2.2,
  interactive: true,
  className: "min-h-[32rem]",
};

const DEFAULT_PIGMENTS = ["#1a264c", "#d32f1a", "#27272a"];

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

// The display pass mixes ink as paper * exp(-dye * 1.25), so a visible color maps back to its absorption
function absorption(rgb: [number, number, number]): [number, number, number] {
  return [
    -Math.log(Math.max(rgb[0], 0.02)) / 1.25,
    -Math.log(Math.max(rgb[1], 0.02)) / 1.25,
    -Math.log(Math.max(rgb[2], 0.02)) / 1.25,
  ];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const INTRO_MS = 2400;

const baseVertex = `
precision highp float;
attribute vec2 aPosition;
uniform vec2 texelSize;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
void main(){
  vUv=aPosition*.5+.5;
  vL=vUv-vec2(texelSize.x,0.);
  vR=vUv+vec2(texelSize.x,0.);
  vT=vUv+vec2(0.,texelSize.y);
  vB=vUv-vec2(0.,texelSize.y);
  gl_Position=vec4(aPosition,0.,1.);
}`;

const splatShader = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main(){
  vec2 p=vUv-point;
  p.x*=aspectRatio;
  vec3 s=exp(-dot(p,p)/radius)*color;
  gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+s,1.);
}`;

const advectionShader = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 velTexel;
uniform float dt;
uniform float dissipation;
void main(){
  vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*velTexel;
  gl_FragColor=texture2D(uSource,coord)/(1.+dissipation*dt);
}`;

const divergenceShader = `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
void main(){
  float L=texture2D(uVelocity,vL).x;
  float R=texture2D(uVelocity,vR).x;
  float T=texture2D(uVelocity,vT).y;
  float B=texture2D(uVelocity,vB).y;
  vec2 C=texture2D(uVelocity,vUv).xy;
  if(vL.x<0.)L=-C.x;
  if(vR.x>1.)R=-C.x;
  if(vT.y>1.)T=-C.y;
  if(vB.y<0.)B=-C.y;
  gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);
}`;

const curlShader = `
precision highp float;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
void main(){
  float L=texture2D(uVelocity,vL).y;
  float R=texture2D(uVelocity,vR).y;
  float T=texture2D(uVelocity,vT).x;
  float B=texture2D(uVelocity,vB).x;
  gl_FragColor=vec4(.5*(R-L-T+B),0.,0.,1.);
}`;

const vorticityShader = `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main(){
  float L=texture2D(uCurl,vL).x;
  float R=texture2D(uCurl,vR).x;
  float T=texture2D(uCurl,vT).x;
  float B=texture2D(uCurl,vB).x;
  float C=texture2D(uCurl,vUv).x;
  vec2 force=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));
  force/=length(force)+.0001;
  force*=curl*C;
  force.y*=-1.;
  vec2 vel=texture2D(uVelocity,vUv).xy+force*dt;
  gl_FragColor=vec4(clamp(vel,-1000.,1000.),0.,1.);
}`;

const pressureShader = `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main(){
  float L=texture2D(uPressure,vL).x;
  float R=texture2D(uPressure,vR).x;
  float T=texture2D(uPressure,vT).x;
  float B=texture2D(uPressure,vB).x;
  float div=texture2D(uDivergence,vUv).x;
  gl_FragColor=vec4((L+R+B+T-div)*.25,0.,0.,1.);
}`;

const gradientShader = `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main(){
  float L=texture2D(uPressure,vL).x;
  float R=texture2D(uPressure,vR).x;
  float T=texture2D(uPressure,vT).x;
  float B=texture2D(uPressure,vB).x;
  vec2 vel=texture2D(uVelocity,vUv).xy-vec2(R-L,T-B);
  gl_FragColor=vec4(vel,0.,1.);
}`;

const clearShader = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`;

const displayShader = `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uTexture;
uniform vec3 paper;
uniform float uDark;
uniform float uIntro;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec3 d=max(texture2D(uTexture,vUv).rgb,0.);
  float edge=length(texture2D(uTexture,vR).rgb-texture2D(uTexture,vL).rgb)+length(texture2D(uTexture,vT).rgb-texture2D(uTexture,vB).rgb);
  vec3 ink=paper*exp(-d*1.25-edge*.35);
  float cover=1.-exp(-(d.r+d.g+d.b)*.7);
  vec3 glow=1.-(1.-exp(-d/(max(max(d.r,d.g),d.b)+.001)*1.2))*.75;
  vec3 light=mix(paper,glow,cover*.9)+edge*.06*glow;
  vec3 col=mix(ink,light,uDark);
  col+=(hash(gl_FragCoord.xy)-.5)*.03;
  // The ink rises out of the bare ground on arrival
  col=mix(paper,col,uIntro);
  gl_FragColor=vec4(col,1.);
}`;

interface Program {
  program: WebGLProgram;
  u: (name: string) => WebGLUniformLocation | null;
}

interface Target {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
}

interface DoubleTarget {
  read: Target;
  write: Target;
  swap: () => void;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export function InkFluid({
  groundColor = "var(--foreground)",
  pigments: pigmentList = DEFAULT_PIGMENTS,
  pigment1,
  pigment2,
  pigment3,
  simResolution = 128,
  dyeResolution = 512,
  pressureIterations = 18,
  vorticity = 0.5,
  fade = 0.3,
  splatSize = 0.5,
  force = 0.5,
  autoInterval = 2.2,
  interactive = true,
  paused = false,
  className,
  children,
}: InkFluidProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const pigments = [pigment1, pigment2, pigment3]
    .map((color, index) => color ?? pigmentList[index])
    .concat(pigmentList.slice(3))
    .filter((color): color is string => Boolean(color));
  const settings = useRef({ groundColor, pigments, simResolution, dyeResolution, pressureIterations, vorticity, fade, splatSize, force, autoInterval, interactive, paused });
  settings.current = { groundColor, pigments, simResolution, dyeResolution, pressureIterations, vorticity, fade, splatSize, force, autoInterval, interactive, paused };
  const refresh = useRef<(kind: "colors" | "grid" | "play") => void>(() => {});
  const pigmentKey = pigments.join("|");

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
    if (!canvas || !root) return setFailed(true);
    const options: WebGLContextAttributes = { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false };
    const gl2 = canvas.getContext("webgl2", options) as WebGL2RenderingContext | null;
    const gl = (gl2 as unknown as WebGLRenderingContext | null) ?? (canvas.getContext("webgl", options) as WebGLRenderingContext | null);
    if (!gl) return setFailed(true);

    // Half-float render targets with linear filtering, or bail to the fallback
    let internalFormat: number = gl.RGBA;
    let texType = 0;
    if (gl2) {
      if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return setFailed(true);
      internalFormat = 0x881a;
      texType = 0x140b;
    } else {
      const half = gl.getExtension("OES_texture_half_float");
      if (!half || !gl.getExtension("OES_texture_half_float_linear")) return setFailed(true);
      gl.getExtension("EXT_color_buffer_half_float");
      texType = half.HALF_FLOAT_OES;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, baseVertex);
    if (!vs) return setFailed(true);
    const shaders: WebGLShader[] = [vs];
    const programs: WebGLProgram[] = [];
    const build = (source: string): Program | null => {
      const fs = compile(gl, gl.FRAGMENT_SHADER, source);
      const program = gl.createProgram();
      if (!fs || !program) return null;
      shaders.push(fs);
      programs.push(program);
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.bindAttribLocation(program, 0, "aPosition");
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
      const uniforms = new Map<string, WebGLUniformLocation | null>();
      const total = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < total; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) uniforms.set(info.name, gl.getUniformLocation(program, info.name));
      }
      return { program, u: (name: string) => uniforms.get(name) ?? null };
    };

    const cleanupPrograms = () => {
      programs.forEach((program) => gl.deleteProgram(program));
      shaders.forEach((shader) => gl.deleteShader(shader));
    };

    const splatP = build(splatShader);
    const advectP = build(advectionShader);
    const divergenceP = build(divergenceShader);
    const curlP = build(curlShader);
    const vorticityP = build(vorticityShader);
    const pressureP = build(pressureShader);
    const gradientP = build(gradientShader);
    const clearP = build(clearShader);
    const displayP = build(displayShader);
    if (!splatP || !advectP || !divergenceP || !curlP || !vorticityP || !pressureP || !gradientP || !clearP || !displayP) {
      cleanupPrograms();
      return setFailed(true);
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);

    const targets: Target[] = [];
    const createTarget = (width: number, height: number): Target | null => {
      const texture = gl.createTexture();
      const fbo = gl.createFramebuffer();
      if (!texture || !fbo) return null;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, gl.RGBA, texType, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const target = { texture, fbo, width, height };
      targets.push(target);
      return ok ? target : null;
    };
    const createDouble = (width: number, height: number): DoubleTarget | null => {
      const a = createTarget(width, height);
      const b = createTarget(width, height);
      if (!a || !b) return null;
      const pair: DoubleTarget = {
        read: a,
        write: b,
        swap: () => {
          const temp = pair.read;
          pair.read = pair.write;
          pair.write = temp;
        },
      };
      return pair;
    };
    const releaseTargets = () => {
      targets.forEach((target) => {
        gl.deleteTexture(target.texture);
        gl.deleteFramebuffer(target.fbo);
      });
      targets.length = 0;
    };

    let velocity: DoubleTarget | null = null;
    let dye: DoubleTarget | null = null;
    let pressure: DoubleTarget | null = null;
    let divergence: Target | null = null;
    let curlTarget: Target | null = null;
    let simW = 0;
    let simH = 0;
    let dyeW = 0;

    const resolution = (size: number): [number, number] => {
      const aspect = canvas.width / Math.max(1, canvas.height);
      const min = Math.round(size);
      const max = Math.round(size * Math.max(aspect, 1 / aspect));
      return aspect > 1 ? [max, min] : [min, max];
    };

    const allocate = (): "same" | "new" | "failed" => {
      const s = settings.current;
      const [sw, sh] = resolution(Math.min(512, Math.max(32, s.simResolution)));
      const [dw, dh] = resolution(Math.min(1024, Math.max(64, s.dyeResolution)));
      if (sw === simW && sh === simH && dw === dyeW && velocity) return "same";
      releaseTargets();
      simW = sw;
      simH = sh;
      dyeW = dw;
      velocity = createDouble(sw, sh);
      dye = createDouble(dw, dh);
      pressure = createDouble(sw, sh);
      divergence = createTarget(sw, sh);
      curlTarget = createTarget(sw, sh);
      return velocity && dye && pressure && divergence && curlTarget ? "new" : "failed";
    };

    const blit = (target: Target | null) => {
      if (target) {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      } else {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const bindTexture = (unit: number, texture: WebGLTexture) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return unit;
    };
    const use = (p: Program, texelW: number, texelH: number) => {
      gl.useProgram(p.program);
      gl.uniform2f(p.u("texelSize"), 1 / texelW, 1 / texelH);
    };

    let inks: [number, number, number][] = [];
    let ground: [number, number, number] = [0.1, 0.1, 0.1];
    let dark = 1;
    let introStart = 0;
    let intro = reduce ? 1 : 0;
    const readColors = () => {
      const s = settings.current;
      ground = resolveColor(root, s.groundColor);
      dark = 0.2126 * ground[0] + 0.7152 * ground[1] + 0.0722 * ground[2] < 0.5 ? 1 : 0;
      const list = s.pigments.length > 0 ? s.pigments : DEFAULT_PIGMENTS;
      inks = list.map((color) => absorption(resolveColor(root, color)));
    };
    readColors();

    const splat = (x: number, y: number, dx: number, dy: number, pigment: number, amount: number, radius: number) => {
      if (!velocity || !dye) return;
      const s = settings.current;
      const aspect = canvas.width / Math.max(1, canvas.height);
      const push = 0.2 + clamp01(s.force) * 1.6;
      const size = radius * (0.35 + clamp01(s.splatSize) * 1.3);
      use(splatP, simW, simH);
      gl.uniform1i(splatP.u("uTarget"), bindTexture(0, velocity.read.texture));
      gl.uniform1f(splatP.u("aspectRatio"), aspect);
      gl.uniform2f(splatP.u("point"), x, y);
      gl.uniform3f(splatP.u("color"), dx * push, dy * push, 0);
      gl.uniform1f(splatP.u("radius"), size * (aspect > 1 ? aspect : 1));
      blit(velocity.write);
      velocity.swap();
      const color = inks[pigment % Math.max(1, inks.length)] ?? [1.5, 1.5, 1.45];
      gl.uniform1i(splatP.u("uTarget"), bindTexture(0, dye.read.texture));
      gl.uniform3f(splatP.u("color"), color[0] * amount, color[1] * amount, color[2] * amount);
      blit(dye.write);
      dye.swap();
    };

    const step = (dt: number) => {
      if (!velocity || !dye || !pressure || !divergence || !curlTarget) return;
      const s = settings.current;
      use(curlP, simW, simH);
      gl.uniform1i(curlP.u("uVelocity"), bindTexture(0, velocity.read.texture));
      blit(curlTarget);

      use(vorticityP, simW, simH);
      gl.uniform1i(vorticityP.u("uVelocity"), bindTexture(0, velocity.read.texture));
      gl.uniform1i(vorticityP.u("uCurl"), bindTexture(1, curlTarget.texture));
      gl.uniform1f(vorticityP.u("curl"), clamp01(s.vorticity) * 44);
      gl.uniform1f(vorticityP.u("dt"), dt);
      blit(velocity.write);
      velocity.swap();

      use(divergenceP, simW, simH);
      gl.uniform1i(divergenceP.u("uVelocity"), bindTexture(0, velocity.read.texture));
      blit(divergence);

      use(clearP, simW, simH);
      gl.uniform1i(clearP.u("uTexture"), bindTexture(0, pressure.read.texture));
      gl.uniform1f(clearP.u("value"), 0.8);
      blit(pressure.write);
      pressure.swap();

      use(pressureP, simW, simH);
      gl.uniform1i(pressureP.u("uDivergence"), bindTexture(1, divergence.texture));
      const passes = Math.min(60, Math.max(1, Math.round(s.pressureIterations)));
      for (let i = 0; i < passes; i++) {
        gl.uniform1i(pressureP.u("uPressure"), bindTexture(0, pressure.read.texture));
        blit(pressure.write);
        pressure.swap();
      }

      use(gradientP, simW, simH);
      gl.uniform1i(gradientP.u("uPressure"), bindTexture(0, pressure.read.texture));
      gl.uniform1i(gradientP.u("uVelocity"), bindTexture(1, velocity.read.texture));
      blit(velocity.write);
      velocity.swap();

      use(advectP, simW, simH);
      gl.uniform2f(advectP.u("velTexel"), 1 / simW, 1 / simH);
      gl.uniform1f(advectP.u("dt"), dt);
      gl.uniform1i(advectP.u("uVelocity"), bindTexture(0, velocity.read.texture));
      gl.uniform1i(advectP.u("uSource"), bindTexture(1, velocity.read.texture));
      gl.uniform1f(advectP.u("dissipation"), 0.35);
      blit(velocity.write);
      velocity.swap();

      gl.uniform2f(advectP.u("texelSize"), 1 / dye.read.width, 1 / dye.read.height);
      gl.uniform1i(advectP.u("uVelocity"), bindTexture(0, velocity.read.texture));
      gl.uniform1i(advectP.u("uSource"), bindTexture(1, dye.read.texture));
      gl.uniform1f(advectP.u("dissipation"), clamp01(s.fade) * 0.53);
      blit(dye.write);
      dye.swap();
    };

    const render = () => {
      if (!dye) return;
      use(displayP, dye.read.width, dye.read.height);
      gl.uniform1i(displayP.u("uTexture"), bindTexture(0, dye.read.texture));
      gl.uniform3f(displayP.u("paper"), ground[0], ground[1], ground[2]);
      gl.uniform1f(displayP.u("uDark"), dark);
      gl.uniform1f(displayP.u("uIntro"), intro);
      blit(null);
    };

    const pointer = { x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false, lastMove: 0 };
    let pigment = 0;
    let frame = 0;
    let visible = true;
    let last = performance.now();
    let nextAuto = performance.now() + 2200;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let tick = 0;
    let settled = 0;

    const autoSplat = () => {
      const x = 0.15 + Math.random() * 0.8;
      const y = 0.1 + Math.random() * 0.8;
      const angle = Math.random() * Math.PI * 2;
      const push = 380 + Math.random() * 520;
      pigment = (pigment + 1) % Math.max(1, inks.length);
      splat(x, y, Math.cos(angle) * push, Math.sin(angle) * push, pigment, 0.9, 0.0022);
    };

    const seed = () => {
      splat(0.72, 0.58, -520, 260, 0, 1.1, 0.003);
      splat(0.84, 0.36, -300, -420, 1, 0.9, 0.0022);
      splat(0.58, 0.3, 420, 160, 2, 0.7, 0.0018);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      const state = allocate();
      if (state === "failed") {
        releaseTargets();
        cleanupPrograms();
        return setFailed(true);
      }
      if (state === "new") {
        seed();
        if (reduce) for (let i = 0; i < 90; i++) step(1 / 60);
      }
      render();
      setReady(true);
    };

    const frameStep = (now: number) => {
      const delta = Math.min(100, now - last);
      last = now;
      average += (delta - average) * 0.05;
      tick++;
      // Fluid motion is quick, so frames stay at full rate and only the display resolution adapts
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
      const dt = Math.min(delta / 1000, 1 / 60);
      if (pointer.moved) {
        pointer.moved = false;
        splat(pointer.x, pointer.y, pointer.dx * 5200, pointer.dy * 5200, pigment, 0.32, 0.0014);
        pointer.dx = 0;
        pointer.dy = 0;
      }
      if (s.autoInterval > 0 && now > nextAuto && now - pointer.lastMove > 2500) {
        autoSplat();
        nextAuto = now + s.autoInterval * 1000 * (0.64 + Math.random() * 0.72);
      }
      step(dt);
      render();
    };

    const loop = (now: number) => {
      if (intro < 1) {
        introStart ||= now;
        const k = clamp01((now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      const paused = settings.current.paused;
      if (paused) render();
      else frameStep(now);
      frame = !paused || intro < 1 ? requestAnimationFrame(loop) : 0;
    };
    const play = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      if (!reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    refresh.current = (kind) => {
      if (kind === "colors") {
        readColors();
        render();
      } else if (kind === "grid") {
        resize();
      }
      play();
    };

    const inside = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      const y = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      return { x, y, hit: x >= 0 && x <= 1 && y >= 0 && y <= 1 };
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !settings.current.interactive) return;
      const { x, y, hit } = inside(event);
      if (!hit) return;
      pointer.dx += x - pointer.x;
      pointer.dy += y - pointer.y;
      pointer.x = x;
      pointer.y = y;
      pointer.moved = !reduce && !settings.current.paused && performance.now() - pointer.lastMove < 200;
      pointer.lastMove = performance.now();
      if (!pointer.moved) {
        pointer.dx = 0;
        pointer.dy = 0;
      }
    };
    const onDown = (event: PointerEvent) => {
      if (!settings.current.interactive || !inside(event).hit) return;
      pigment = (pigment + 1) % Math.max(1, inks.length);
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
    const mo = new MutationObserver(() => requestAnimationFrame(() => refresh.current("colors")));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    play();

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
      releaseTargets();
      cleanupPrograms();
      gl.deleteBuffer(quad);
    };
  }, [reduce]);

  useEffect(() => {
    refresh.current("colors");
  }, [groundColor, pigmentKey]);

  useEffect(() => {
    refresh.current("grid");
  }, [simResolution, dyeResolution]);

  useEffect(() => {
    refresh.current("play");
  }, [pressureIterations, vorticity, fade, splatSize, force, autoInterval, interactive, paused]);

  const first = pigments[0] ?? "#1a264c";
  const second = pigments[1] ?? first;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: groundColor }}>
      {failed ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(40% 50% at 75% 40%, color-mix(in oklab, ${first} 55%, transparent), transparent 70%), radial-gradient(30% 35% at 62% 70%, color-mix(in oklab, ${second} 35%, transparent), transparent 70%)`,
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
