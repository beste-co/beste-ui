"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface RelightWindow {
  /**
   * Corners of the lit area as [x, y] pairs, 0 to 1 across and down the photo, in order around the shape.
   * Four corners follow the photo's perspective, so a slanted ceiling or a pool edge is traced exactly.
   */
  points: [number, number][];
  /**
   * What the light is. "window": glass glows with a warm interior while dark frames stay dark.
   * "surface": a ceiling or wall is washed with light, keeping its own texture.
   * "water": only water glows, lit from within; the deck around it stays dark.
   */
  kind?: "window" | "surface" | "water";
  /** Point in the day this light switches on, 0 to 1. Lights without it come on in array order through the dusk. */
  at?: number;
  /** Color of this light. Defaults to glowColor. */
  color?: string;
}

/** Anything with a get() that returns 0 to 1, such as a framer-motion MotionValue. It is read every frame without re-rendering. */
export interface ProgressSource {
  get(): number;
}

export interface PhotoRelightProps {
  /** The photograph to relight. Its host must allow cross-origin loading (Unsplash does). */
  imageSrc?: string;
  imageAlt?: string;
  /** Areas of the photo that light up after dusk: windows, soffits, a pool. Normalized to the photo, not the frame. */
  lights?: RelightWindow[];
  /** Point in the day, 0 (dawn) to 1 (night). A number, or a live source such as a scroll MotionValue. Leave it out to let autoplay run the day. */
  progress?: number | ProgressSource;
  /** Run the day back and forth on its own when no progress is given. */
  autoplay?: boolean;
  /** Pace of autoplay, 1 is one full day in about 13 seconds each way. */
  speed?: number;
  /** Warmth of golden hour, 0 to 1. */
  warmth?: number;
  /** How dark the night gets, 0 to 1. */
  nightDepth?: number;
  /** Default color of the lights. */
  glowColor?: string;
  /** Halo around each light once it is dark, 0 to 1. */
  bloom?: number;
  /** Film grain, 0 to 1. */
  grain?: number;
  /** How far down the photo the sky can reach, 0 to 1. */
  horizon?: number;
  /** Focal point of the crop, 0 to 1 on each axis. */
  focusX?: number;
  focusY?: number;
  /** Freeze the day where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

// Traced on the demo photo: the living room glazing, a slim window, two upstairs rooms, both timber ceilings and the pool
export const photoRelightLights: RelightWindow[] = [
  { kind: "window", points: [[0.228, 0.468], [0.598, 0.468], [0.598, 0.645], [0.228, 0.645]] },
  { kind: "surface", points: [[0.165, 0.413], [0.622, 0.413], [0.6, 0.468], [0.225, 0.468]], color: "#ffc58a" },
  { kind: "window", points: [[0.25, 0.253], [0.443, 0.253], [0.443, 0.36], [0.25, 0.36]] },
  { kind: "surface", points: [[0.16, 0.125], [0.646, 0.125], [0.646, 0.24], [0.215, 0.24]], color: "#ffc58a" },
  { kind: "window", points: [[0.5, 0.253], [0.61, 0.253], [0.61, 0.36], [0.5, 0.36]] },
  { kind: "window", points: [[0.614, 0.445], [0.626, 0.445], [0.626, 0.648], [0.614, 0.648]] },
  { kind: "water", points: [[0, 0.69], [0.59, 0.69], [0.97, 0.94], [0, 0.94]], color: "#5fd4f0" },
];

export const photoRelightDemo: PhotoRelightProps = {
  imageSrc: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2000&q=80",
  imageAlt: "A white modernist house with timber soffits behind a long pool",
  lights: photoRelightLights,
  autoplay: true,
  speed: 1,
  warmth: 0.7,
  nightDepth: 0.6,
  glowColor: "#ffd9a8",
  bloom: 0.6,
  grain: 0.4,
  horizon: 0.5,
  focusX: 0.45,
  focusY: 0.5,
  className: "aspect-[3/2] w-full max-w-5xl",
};

const MAX_LIGHTS = 16;

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uCrop;
uniform vec2 uOffset;
uniform vec2 uImgPx;
uniform sampler2D uTex;
uniform float uExposure;
uniform vec3 uTint;
uniform float uSat;
uniform float uLift;
uniform float uRake;
uniform vec3 uSkyTop;
uniform vec3 uSkyLow;
uniform float uSkyAmt;
uniform float uHorizon;
uniform float uNight;
uniform float uVig;
uniform float uBloom;
uniform float uBloomR;
uniform float uGrain;
uniform float uCount;
uniform vec4 uQuadA[${MAX_LIGHTS}];
uniform vec4 uQuadB[${MAX_LIGHTS}];
uniform vec4 uLight[${MAX_LIGHTS}];
uniform float uKind[${MAX_LIGHTS}];

float hash(vec2 p){
  p=fract(p*vec2(443.897,441.423));
  p+=dot(p,p.yx+19.19);
  return fract((p.x+p.y)*p.x);
}

void main(){
  vec2 uv=vec2(gl_FragCoord.x/uRes.x,1.-gl_FragCoord.y/uRes.y);
  vec2 iu=uOffset+uv*uCrop;
  vec3 img=texture2D(uTex,iu).rgb;
  float lum=dot(img,vec3(.2126,.7152,.0722));

  // Sky: blue or near-white pixels above the horizon line
  float blue=img.b-(img.r+img.g)*.5;
  float top=1.-smoothstep(uHorizon-.12,uHorizon+.08,iu.y);
  float sky=top*smoothstep(.08,.28,blue+max(0.,lum-.9)*.8);

  vec3 col=mix(vec3(lum),img,uSat)*uTint*uExposure;

  // Low raking sun from the left, strongest on the surfaces it already lights
  float rake=smoothstep(0.,1.,.5+dot(uv-.5,vec2(-.85,.3)));
  col+=uRake*rake*vec3(1.,.6,.26)*smoothstep(.25,.95,lum)*.32;
  col+=uLift*(1.-smoothstep(0.,.5,lum))*uTint*.07;

  float ys=clamp(iu.y/max(uHorizon,.05),0.,1.);
  vec3 skyCol=mix(uSkyTop,uSkyLow,pow(ys,1.5))*(.8+.45*(lum-.6));
  col=mix(col,skyCol,sky*uSkyAmt);

  // Lights: each is a four-cornered shape traced on the photo, and only the right pixels in it glow:
  // glass but not its frames, the whole of a ceiling, water but not the deck
  vec3 glow=vec3(0.);
  vec2 P=iu*uImgPx;
  float waterish=smoothstep(.02,.14,img.b-img.r)*smoothstep(.05,.2,img.g-img.r*.8);
  for(int i=0;i<${MAX_LIGHTS};i++){
    if(float(i)>=uCount)break;
    vec4 L=uLight[i];
    if(L.w<.002)continue;
    vec2 a=uQuadA[i].xy*uImgPx;
    vec2 b=uQuadA[i].zw*uImgPx;
    vec2 c=uQuadB[i].xy*uImgPx;
    vec2 e=uQuadB[i].zw*uImgPx;
    // Signed distance to a convex quad whose corners run counter-clockwise: positive outside
    vec2 ab=b-a;vec2 bc=c-b;vec2 ce=e-c;vec2 ea=a-e;
    float d0=(ab.x*(P.y-a.y)-ab.y*(P.x-a.x))/max(length(ab),1e-4);
    float d1=(bc.x*(P.y-b.y)-bc.y*(P.x-b.x))/max(length(bc),1e-4);
    float d2=(ce.x*(P.y-c.y)-ce.y*(P.x-c.x))/max(length(ce),1e-4);
    float d3=(ea.x*(P.y-e.y)-ea.y*(P.x-e.x))/max(length(ea),1e-4);
    float d=-min(min(d0,d1),min(d2,d3));
    float m=1.-smoothstep(-1.5,1.5,d);
    if(m<=0.&&d>uBloomR*5.)continue;
    float kind=uKind[i];
    vec3 lit;
    float take;
    if(kind<.5){
      // Glass glows with a warm room behind it; black frames and mullions stay dark
      float glass=smoothstep(.08,.2,lum);
      lit=L.rgb*(.3+.95*lum);
      take=m*glass;
    }else if(kind<1.5){
      // A ceiling or wall washed with light, keeping its own grain
      lit=img*L.rgb*1.35+L.rgb*.05;
      take=m;
    }else{
      // Pool lights: only the water glows, from within, with its ripples
      lit=mix(img*L.rgb*1.6,L.rgb*(.35+.9*lum),.45);
      take=m*waterish;
    }
    col=mix(col,lit,take*L.w);
    if(kind<1.5)glow+=L.rgb*L.w*exp(-max(d,0.)/uBloomR)*(1.-m);
  }
  col+=glow*uBloom*.3*uNight;

  vec2 c=uv-.5;
  col*=1.-uVig*pow(length(c*vec2(1.,1.12))*1.3,2.4);

  // Static triangular grain, a touch stronger in the dark
  float n=hash(gl_FragCoord.xy)+hash(gl_FragCoord.yx+31.7)-1.;
  float l2=dot(col,vec3(.299,.587,.114));
  col+=n*.055*uGrain*(.45+(1.-l2)*.55);

  gl_FragColor=vec4(clamp(col,0.,1.),1.);
}`;

type Vec3 = [number, number, number];
interface Key {
  at: number;
  exposure: number;
  tint: Vec3;
  sat: number;
  lift: number;
  rake: number;
  skyTop: Vec3;
  skyLow: Vec3;
  skyAmt: number;
  night: number;
  vig: number;
}

// Dawn, midday, golden hour, sunset, blue hour, night
const keys: Key[] = [
  { at: 0, exposure: 0.72, tint: [0.86, 0.9, 1.08], sat: 0.78, lift: 0.6, rake: 0, skyTop: [0.36, 0.46, 0.66], skyLow: [0.98, 0.78, 0.7], skyAmt: 0.8, night: 0.1, vig: 0.25 },
  { at: 0.22, exposure: 1.02, tint: [1, 1, 1], sat: 1.02, lift: 0.15, rake: 0, skyTop: [0.3, 0.44, 0.72], skyLow: [1, 0.74, 0.46], skyAmt: 0, night: 0, vig: 0.15 },
  { at: 0.45, exposure: 0.98, tint: [1.2, 0.92, 0.64], sat: 1.08, lift: 0.45, rake: 0.9, skyTop: [0.3, 0.44, 0.72], skyLow: [1, 0.74, 0.46], skyAmt: 0.75, night: 0.05, vig: 0.25 },
  { at: 0.6, exposure: 0.58, tint: [0.8, 0.72, 0.9], sat: 0.8, lift: 0.35, rake: 0.25, skyTop: [0.14, 0.16, 0.38], skyLow: [0.96, 0.56, 0.46], skyAmt: 0.9, night: 0.45, vig: 0.35 },
  { at: 0.78, exposure: 0.34, tint: [0.52, 0.6, 0.95], sat: 0.6, lift: 0.25, rake: 0, skyTop: [0.05, 0.08, 0.22], skyLow: [0.36, 0.3, 0.48], skyAmt: 0.95, night: 0.8, vig: 0.42 },
  { at: 1, exposure: 0.2, tint: [0.4, 0.48, 0.85], sat: 0.5, lift: 0.2, rake: 0, skyTop: [0.012, 0.02, 0.06], skyLow: [0.06, 0.07, 0.15], skyAmt: 1, night: 1, vig: 0.5 },
];

const DAWN: Key = keys[0] ?? { at: 0, exposure: 1, tint: [1, 1, 1], sat: 1, lift: 0, rake: 0, skyTop: [0, 0, 0], skyLow: [0, 0, 0], skyAmt: 0, night: 0, vig: 0 };
const GOLDEN = 0.45;
const LIGHTS_FROM = 0.55;
const LIGHTS_TO = 0.84;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Resolves any CSS color (tokens and oklch included) to 0-1 RGB
function resolveColor(el: HTMLElement, color: string): Vec3 {
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  el.style.color = "";
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [1, 0.85, 0.66];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [(data[0] ?? 0) / 255, (data[1] ?? 0) / 255, (data[2] ?? 0) / 255];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const readProgress = (value: number | ProgressSource | undefined) =>
  value === undefined ? undefined : clamp01(typeof value === "number" ? value : value.get());

export function PhotoRelight({
  imageSrc = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2000&q=80",
  imageAlt = "",
  lights = photoRelightLights,
  progress,
  autoplay = true,
  speed = 1,
  warmth = 0.7,
  nightDepth = 0.6,
  glowColor = "#ffd9a8",
  bloom = 0.6,
  grain = 0.4,
  horizon = 0.5,
  focusX = 0.45,
  focusY = 0.5,
  paused = false,
  className,
  children,
}: PhotoRelightProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ lights, progress, autoplay, speed, warmth, nightDepth, glowColor, bloom, grain, horizon, focusX, focusY, paused });
  settings.current = { lights, progress, autoplay, speed, warmth, nightDepth, glowColor, bloom, grain, horizon, focusX, focusY, paused };
  const wake = useRef<(recolor?: boolean) => void>(() => {});

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
    if (!canvas || !root) return;
    const context = canvas.getContext("webgl", { antialias: false, alpha: false });
    const vs = context && compile(context, context.VERTEX_SHADER, vertex);
    const fs = context && compile(context, context.FRAGMENT_SHADER, fragment);
    const program = context?.createProgram() ?? null;
    if (context && vs && fs && program) {
      context.attachShader(program, vs);
      context.attachShader(program, fs);
      context.linkProgram(program);
    }
    const gl = context && vs && fs && program && context.getProgramParameter(program, context.LINK_STATUS) ? context : null;
    if (!gl) setFailed(true);

    const buffer = gl?.createBuffer() ?? null;
    const texture = gl?.createTexture() ?? null;
    const loc: Record<string, WebGLUniformLocation | null> = {};
    if (gl && program) {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const attr = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);
      for (const name of ["uRes", "uCrop", "uOffset", "uImgPx", "uTex", "uExposure", "uTint", "uSat", "uLift", "uRake", "uSkyTop", "uSkyLow", "uSkyAmt", "uHorizon", "uNight", "uVig", "uBloom", "uBloomR", "uGrain", "uCount", "uQuadA", "uQuadB", "uLight", "uKind"]) {
        loc[name] = gl.getUniformLocation(program, name);
      }
    }

    const quadA = new Float32Array(MAX_LIGHTS * 4);
    const quadB = new Float32Array(MAX_LIGHTS * 4);
    const kinds = new Float32Array(MAX_LIGHTS);
    const lightData = new Float32Array(MAX_LIGHTS * 4);
    const colors = new Float32Array(MAX_LIGHTS * 3);
    const level = new Float32Array(MAX_LIGHTS);
    const grade: Key = { ...DAWN, tint: [1, 1, 1], skyTop: [0, 0, 0], skyLow: [0, 0, 0] };
    let texW = 1;
    let texH = 1;
    let loaded = false;
    let glOk = !!gl;
    let shown = -1;
    let current = -1;
    let clock = 0;
    let frame = 0;
    let last = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let streak = 0;

    const recolor = () => {
      const s = settings.current;
      const fallback = resolveColor(root, s.glowColor);
      for (let i = 0; i < MAX_LIGHTS; i++) {
        const color = s.lights[i]?.color;
        const rgb = color ? resolveColor(root, color) : fallback;
        colors[i * 3] = rgb[0];
        colors[i * 3 + 1] = rgb[1];
        colors[i * 3 + 2] = rgb[2];
      }
    };

    const gradeAt = (p: number) => {
      let index = 0;
      while (index < keys.length - 2 && p > (keys[index + 1]?.at ?? 1)) index++;
      const a = keys[index] ?? DAWN;
      const b = keys[index + 1] ?? DAWN;
      const t = clamp01((p - a.at) / Math.max(0.001, b.at - a.at));
      const k = t * t * (3 - 2 * t);
      const mix = (x: number, y: number) => x + (y - x) * k;
      const s = settings.current;
      grade.exposure = mix(a.exposure, b.exposure);
      grade.sat = mix(a.sat, b.sat);
      grade.lift = mix(a.lift, b.lift);
      grade.rake = mix(a.rake, b.rake) * (0.4 + clamp01(s.warmth) * 0.86);
      grade.skyAmt = mix(a.skyAmt, b.skyAmt);
      grade.night = mix(a.night, b.night);
      grade.vig = mix(a.vig, b.vig);
      // Warmth scales golden hour's push away from neutral; night depth lowers the last exposure
      const warm = clamp01(s.warmth) / 0.7;
      const golden = Math.max(0, 1 - Math.abs(p - GOLDEN) / 0.2);
      for (let c = 0; c < 3; c++) {
        const base = mix(a.tint[c] ?? 1, b.tint[c] ?? 1);
        grade.tint[c] = base + (base - 1) * (warm - 1) * golden;
        grade.skyTop[c] = mix(a.skyTop[c] ?? 0, b.skyTop[c] ?? 0);
        grade.skyLow[c] = mix(a.skyLow[c] ?? 0, b.skyLow[c] ?? 0);
      }
      const depth = clamp01(s.nightDepth);
      const dark = clamp01((p - 0.6) / 0.4);
      grade.exposure *= 1 - dark * (depth - 0.5) * 0.9;
    };

    const draw = (p: number) => {
      const s = settings.current;
      gradeAt(p);
      if (!glOk || !loaded || !gl) {
        const shade = shadeRef.current;
        if (shade) {
          shade.style.opacity = glOk ? "0" : clamp01(1 - grade.exposure).toFixed(3);
        }
        return;
      }
      const count = Math.min(MAX_LIGHTS, s.lights.length);
      for (let i = 0; i < count; i++) {
        const light = s.lights[i];
        // Four corners, turned counter-clockwise so the shader's inside test holds for any drawing order
        const pts = (light?.points ?? []).slice(0, 4);
        while (pts.length < 4) pts.push(pts[pts.length - 1] ?? [0, 0]);
        let area = 0;
        for (let k = 0; k < 4; k++) {
          const [x1, y1] = pts[k] ?? [0, 0];
          const [x2, y2] = pts[(k + 1) % 4] ?? [0, 0];
          area += x1 * y2 - x2 * y1;
        }
        if (area < 0) pts.reverse();
        quadA[i * 4] = pts[0]?.[0] ?? 0;
        quadA[i * 4 + 1] = pts[0]?.[1] ?? 0;
        quadA[i * 4 + 2] = pts[1]?.[0] ?? 0;
        quadA[i * 4 + 3] = pts[1]?.[1] ?? 0;
        quadB[i * 4] = pts[2]?.[0] ?? 0;
        quadB[i * 4 + 1] = pts[2]?.[1] ?? 0;
        quadB[i * 4 + 2] = pts[3]?.[0] ?? 0;
        quadB[i * 4 + 3] = pts[3]?.[1] ?? 0;
        kinds[i] = light?.kind === "surface" ? 1 : light?.kind === "water" ? 2 : 0;
        lightData[i * 4] = colors[i * 3] ?? 1;
        lightData[i * 4 + 1] = colors[i * 3 + 1] ?? 1;
        lightData[i * 4 + 2] = colors[i * 3 + 2] ?? 1;
        lightData[i * 4 + 3] = level[i] ?? 0;
      }
      // Cover crop around the focal point
      const ra = canvas.width / Math.max(1, canvas.height);
      const ta = texW / Math.max(1, texH);
      const cropX = ra > ta ? 1 : ra / ta;
      const cropY = ra > ta ? ta / ra : 1;
      gl.uniform2f(loc.uRes ?? null, canvas.width, canvas.height);
      gl.uniform2f(loc.uCrop ?? null, cropX, cropY);
      gl.uniform2f(loc.uOffset ?? null, clamp01(s.focusX) * (1 - cropX), clamp01(s.focusY) * (1 - cropY));
      gl.uniform2f(loc.uImgPx ?? null, canvas.width / cropX, canvas.height / cropY);
      gl.uniform1f(loc.uExposure ?? null, grade.exposure);
      gl.uniform3f(loc.uTint ?? null, grade.tint[0], grade.tint[1], grade.tint[2]);
      gl.uniform1f(loc.uSat ?? null, grade.sat);
      gl.uniform1f(loc.uLift ?? null, grade.lift);
      gl.uniform1f(loc.uRake ?? null, grade.rake);
      gl.uniform3f(loc.uSkyTop ?? null, grade.skyTop[0], grade.skyTop[1], grade.skyTop[2]);
      gl.uniform3f(loc.uSkyLow ?? null, grade.skyLow[0], grade.skyLow[1], grade.skyLow[2]);
      gl.uniform1f(loc.uSkyAmt ?? null, grade.skyAmt);
      gl.uniform1f(loc.uHorizon ?? null, clamp01(s.horizon));
      gl.uniform1f(loc.uNight ?? null, grade.night);
      gl.uniform1f(loc.uVig ?? null, grade.vig);
      gl.uniform1f(loc.uBloom ?? null, clamp01(s.bloom));
      gl.uniform1f(loc.uBloomR ?? null, Math.max(6, (canvas.height / cropY) * 0.03 * (0.4 + clamp01(s.bloom))));
      gl.uniform1f(loc.uGrain ?? null, clamp01(s.grain));
      gl.uniform1f(loc.uCount ?? null, count);
      gl.uniform4fv(loc.uQuadA ?? null, quadA);
      gl.uniform4fv(loc.uQuadB ?? null, quadB);
      gl.uniform4fv(loc.uLight ?? null, lightData);
      gl.uniform1fv(loc.uKind ?? null, kinds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Where the day should be right now
    const goal = () => {
      const s = settings.current;
      const given = readProgress(s.progress);
      if (reduce) return given !== undefined && typeof s.progress === "number" ? given : GOLDEN;
      if (given !== undefined) return given;
      if (!s.autoplay) return GOLDEN;
      const period = 26 / Math.max(0.05, s.speed);
      return 0.5 - 0.5 * Math.cos((clock / period) * Math.PI * 2);
    };

    // Each light switches on (or off) over a fraction of a second once the day passes its moment
    const stepLights = (p: number, dt: number) => {
      const s = settings.current;
      const count = Math.min(MAX_LIGHTS, s.lights.length);
      const k = reduce || dt <= 0 ? 1 : 1 - Math.exp(-dt / 0.22);
      let moving = false;
      for (let i = 0; i < count; i++) {
        const at = s.lights[i]?.at ?? LIGHTS_FROM + ((LIGHTS_TO - LIGHTS_FROM) * i) / Math.max(1, count - 1);
        const target = p >= at ? 1 : 0;
        const value = level[i] ?? 0;
        const next = Math.abs(target - value) < 0.002 ? target : value + (target - value) * k;
        level[i] = next;
        if (next !== target) moving = true;
      }
      return moving;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl?.viewport(0, 0, canvas.width, canvas.height);
      if (current >= 0) draw(current);
    };

    const loop = (now: number) => {
      const delta = last ? Math.min(100, now - last) : 16.7;
      last = now;
      const s = settings.current;
      const live = !reduce && s.progress !== undefined && typeof s.progress !== "number";
      const running = !reduce && !s.paused;
      if (running && s.progress === undefined && s.autoplay) clock += delta / 1000;
      const target = goal();
      if (current < 0 || !running) current = target;
      else current += (target - current) * (1 - Math.exp(-delta / 160));
      if (Math.abs(target - current) < 0.0004) current = target;
      const lightsMoving = stepLights(current, running ? delta / 1000 : 0);
      const changed = Math.abs(current - shown) > 0.00005 || lightsMoving;
      if (changed) {
        draw(current);
        shown = current;
        // Adaptive resolution while frames are drawn back to back
        streak++;
        average += (delta - average) * 0.05;
        if (streak % 60 === 0) {
          if (average > 22 && quality > 0.5) {
            ceiling = Math.max(0.5, quality - 0.05);
            quality = Math.max(0.5, quality - 0.15);
            resize();
          } else if (average < 17.5 && quality < ceiling && streak % 300 === 0) {
            quality = Math.min(ceiling, quality + 0.1);
            resize();
          }
        }
      } else {
        streak = 0;
        average = 16.7;
      }
      // A settled number needs no more frames; a live source or autoplay keeps the loop alive
      const settled = !changed && !live && !(running && s.progress === undefined && s.autoplay);
      frame = settled ? 0 : requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    wake.current = (withColors = false) => {
      if (withColors) recolor();
      shown = -1;
      play();
    };

    const image = new Image();
    if (gl) {
      image.crossOrigin = "anonymous";
      image.decoding = "async";
      image.onload = () => {
        if (!gl) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        } catch {
          glOk = false;
          setFailed(true);
          wake.current();
          return;
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(loc.uTex ?? null, 0);
        texW = image.naturalWidth;
        texH = image.naturalHeight;
        loaded = true;
        setReady(true);
        wake.current();
      };
      image.onerror = () => {
        glOk = false;
        setFailed(true);
        wake.current();
      };
      image.src = imageSrc;
    }

    const onLost = (event: Event) => {
      event.preventDefault();
      glOk = false;
      setFailed(true);
      wake.current();
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    const mo = new MutationObserver(() => requestAnimationFrame(() => wake.current(true)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    resize();
    play();

    return () => {
      cancelAnimationFrame(frame);
      wake.current = () => {};
      image.onload = null;
      image.onerror = null;
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      if (context) {
        context.deleteTexture(texture);
        context.deleteBuffer(buffer);
        context.deleteProgram(program);
        context.deleteShader(vs);
        context.deleteShader(fs);
      }
    };
  }, [imageSrc, reduce]);

  const lightsKey = lights.map((light) => light.color ?? "").join("|");
  useEffect(() => {
    wake.current(true);
  }, [glowColor, lightsKey]);

  useEffect(() => {
    wake.current(false);
  }, [progress, autoplay, speed, warmth, nightDepth, bloom, grain, horizon, focusX, focusY, paused, lights]);

  const position = `${clamp01(focusX) * 100}% ${clamp01(focusY) * 100}%`;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden bg-[#0b0d14]", className)}>
      {/* The plain photo shows while the texture loads, and stays as the fallback with a shade for the hour */}
      <img
        src={imageSrc}
        alt={imageAlt}
        decoding="async"
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: position }}
      />
      <div ref={shadeRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#0a1024] opacity-0" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 size-full transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          ready && !failed ? "opacity-100" : "opacity-0",
        )}
      />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
