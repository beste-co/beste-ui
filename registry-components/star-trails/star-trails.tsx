"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

type Silhouette = "forest" | "ridges" | "none";

export interface StarTrailsProps {
  /** Night sky at the zenith. */
  skyColor?: string;
  /** Airglow that lifts the sky toward the horizon. */
  glowColor?: string;
  /** Faint warm band right on the horizon, like a distant town. */
  horizonColor?: string;
  /** The land in the foreground. */
  landColor?: string;
  /** Star density, 0 to 1. */
  stars?: number;
  /** Length of the trails once the exposure has built up, 0 (short) to 1 (long). */
  exposure?: number;
  /** Where the sky turns around, 0 to 1 on each axis (y runs down, below 0 is above the frame). */
  poleX?: number;
  poleY?: number;
  /** Height of the far ridges above the bottom edge, 0 to 1. */
  horizon?: number;
  /** What stands in the foreground. */
  silhouette?: Silhouette;
  /** Drives the exposure from outside, 0 to 1. A number, or anything with a get() method such as a MotionValue. */
  progress?: number | { get(): number };
  /** Sensor noise, 0 to 1. It also keeps the dark gradients from banding. */
  grain?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** The land and the pole shift slightly with the cursor. */
  interactive?: boolean;
  /** Freeze the sky where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const starTrailsDemo: StarTrailsProps = {
  skyColor: "#03050b",
  glowColor: "#10292f",
  horizonColor: "#b0643a",
  landColor: "#010203",
  stars: 0.6,
  exposure: 0.5,
  poleX: 0.64,
  poleY: -0.14,
  horizon: 0.24,
  silhouette: "forest",
  grain: 0.5,
  speed: 1,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uPole;
uniform float uRot;
uniform float uArc;
uniform float uBand;
uniform float uDpr;
uniform float uStars;
uniform float uRef;
uniform vec3 uSky;
uniform vec3 uGlow;
uniform vec3 uHorizonColor;
uniform vec3 uLand;
uniform float uHorizon;
uniform float uSil;
uniform vec2 uPar;
uniform float uGrain;
uniform float uIntro;

const float TAU=6.2831853;
const float SECTORS=20.;
const float SECTOR=TAU/SECTORS;

float hash11(float p){p=fract(p*.1031);p*=p+33.33;p*=p+p;return fract(p);}
float hash12(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(hash11(i),hash11(i+1.),f);}
float n2(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(mix(hash12(i),hash12(i+vec2(1.,0.)),f.x),mix(hash12(i+vec2(0.,1.)),hash12(i+1.),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<4;i++){v+=a*n2(p);p=p*2.03+vec2(5.3,11.7);a*=.5;}
  return v;
}
// Ridged 1D noise: sharp peaks, soft valleys
float mountain(float x){
  float m=0.,a=.55,f=1.;
  for(int i=0;i<5;i++){m+=a*(1.-abs(n1(x*f)*2.-1.));f*=2.03;a*=.47;x+=7.31;}
  return m;
}

// Star colour temperature, blue-white through white to orange
vec3 tint(float t){
  vec3 c=mix(vec3(.68,.8,1.),vec3(1.,.97,.93),smoothstep(.05,.3,t));
  c=mix(c,vec3(1.,.86,.66),smoothstep(.62,.8,t));
  return mix(c,vec3(1.,.64,.4),smoothstep(.88,.97,t));
}

// Every star sits on its own circle around the pole; its trail is the arc it has swept
vec3 trails(vec2 pix){
  vec2 d=pix-uPole;
  float r=length(d);
  float th=atan(d.y,d.x);
  float presence=uStars*.6*clamp(r/uRef,.05,1.);
  vec3 acc=vec3(0.);
  for(int l=0;l<4;l++){
    float fl=float(l);
    float w=uBand*(.85+.29*fl);
    float band0=floor(r/w);
    float side=fract(r/w)<.5?-1.:1.;
    float phi=th-uRot+fl*1.713;
    float j0=floor(phi/SECTOR);
    for(int b=0;b<2;b++){
      float band=band0+float(b)*side;
      for(int k=0;k<6;k++){
        float j=j0+float(k);
        if(j*SECTOR>phi+uArc+.02) break;
        vec2 key=vec2(mod(j,SECTORS)+fl*37.,band+fl*.5);
        float h0=hash12(key);
        if(h0>presence) continue;
        float rs=(band+.3+.4*hash12(key+41.9))*w;
        float perp=r-rs;
        float bright=pow(hash12(key+73.1),7.);
        float sig=(.5+.75*bright)*uDpr;
        if(abs(perp)>sig*8.) continue;
        float h1=hash12(key+17.3);
        float aj=(j+.08+.84*h1)*SECTOR;
        float behind=aj-phi;
        float along=behind<0.?-behind*rs:max(0.,behind-uArc)*rs;
        float d2=perp*perp+along*along;
        float s2=2.*sig*sig;
        float glow=exp(-d2/s2)+exp(-d2/(s2*9.))*.14*bright;
        float pos=clamp(behind/max(uArc,1e-4),0.,1.);
        float x=behind*rs/uDpr;
        float flicker=1.+.07*sin(x*.23+h1*40.)+.05*sin(x*.071+h0*90.);
        float head=behind*rs;
        float lead=exp(-(perp*perp+head*head)/(s2*2.2))*.3;
        acc+=tint(hash12(key+91.7))*(.035+1.05*bright)*(glow*mix(1.,.55,pos)*flicker+lead);
      }
    }
  }
  return acc;
}

float trees(float X,float y,float base,float aspect,float px){
  float cw=.016;
  float c=floor(X/cw);
  float cov=0.;
  for(int k=-3;k<=3;k++){
    float id=c+float(k);
    float h1=hash11(id*1.37+.5);
    float h2=hash11(id*2.91+7.1);
    float h3=hash11(id*.73+3.3);
    if(h3<.12) continue;
    float cx=(id+.5+(h1-.5)*.8)*cw;
    float edge=abs(cx/aspect-.5)*2.;
    float th=(.026+.07*h2*h2)*(1.+.9*edge*edge*edge);
    float t=(base+.004*h3-y)/th;
    if(t<0.||t>1.08) continue;
    float tier=fract(t*(7.+4.*h3)+h1);
    float hw=th*.19*pow(max(0.,1.-t),1.05)*(.6+.4*(1.-tier))+th*.01;
    hw*=.84+.32*n1(y*260.+id*13.);
    cov=max(cov,smoothstep(px,-px,abs(X-cx)-hw)*smoothstep(1.06,.97,t));
  }
  return cov;
}

void main(){
  float aspect=uRes.x/max(uRes.y,1.);
  vec2 pix=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
  vec2 uv=pix/uRes;
  float X=uv.x*aspect;
  float px=.8/uRes.y;
  float hl=1.-uHorizon;

  // Land, back to front, each layer shifting a little more with the cursor
  float far=0.,mid=0.,near=0.;
  if(uSil>.5){
    float yF=hl+.02-.1*mountain(X*1.2+3.+uPar.x*.006)+uPar.y*.003;
    float yM=hl+.045-.065*mountain(X*2.1+17.+uPar.x*.014)+uPar.y*.006;
    far=smoothstep(yF-px,yF+px,uv.y);
    mid=smoothstep(yM-px,yM+px,uv.y);
    float Xn=X+uPar.x*.03;
    if(uSil>1.5){
      float yG=hl+.088+.012*n1(Xn*5.)+uPar.y*.01;
      near=max(smoothstep(yG-px,yG+px,uv.y),uv.y>yG-.3?trees(Xn,uv.y,yG,aspect,px):0.);
    }else{
      float yN=hl+.07-.045*mountain(Xn*3.3+5.)+uPar.y*.01;
      near=smoothstep(yN-px,yN+px,uv.y);
    }
  }

  float s=clamp(uv.y/max(hl,.05),0.,1.);
  vec3 col=mix(uSky,uGlow,pow(s,2.4)*.85);
  col+=uHorizonColor*exp(-pow((hl-uv.y)/.07,2.))*.26;
  col*=.88+.24*fbm(vec2(X,uv.y)*2.2);
  if(max(far,max(mid,near))<.999){
    float ext=mix(.3,1.,smoothstep(0.,.35,hl-uv.y));
    col+=trails(pix)*ext;
  }

  vec3 farCol=mix(uLand,uGlow,.3)+uHorizonColor*.035;
  farCol*=mix(1.,.72,smoothstep(hl-.08,hl+.1,uv.y));
  col=mix(col,farCol,far);
  col=mix(col,mix(uLand,uGlow,.12),mid);
  col=mix(col,uLand,near);

  vec2 c=uv-.5;
  col*=1.-.34*pow(length(c*vec2(1.,1.1))*1.3,2.4);

  // Static sensor noise with a touch of colour; it dithers the dark gradients too
  float g=hash12(gl_FragCoord.xy)+hash12(gl_FragCoord.yx+31.7)-1.;
  vec3 chroma=vec3(hash12(gl_FragCoord.xy+7.),hash12(gl_FragCoord.xy+13.),hash12(gl_FragCoord.xy+19.))-.5;
  col+=(g*.03+chroma*.012)*uGrain;
  // The night grows out of the flat sky color the wrapper shows before the first frame
  col=mix(uSky,col,uIntro);

  gl_FragColor=vec4(clamp(col,0.,1.),1.);
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
const readProgress = (value: StarTrailsProps["progress"]) =>
  value === undefined ? undefined : clamp01(typeof value === "number" ? value : value.get());
const INTRO_MS = 2400;
const silhouetteIndex: Record<Silhouette, number> = { none: 0, ridges: 1, forest: 2 };

export function StarTrails({
  skyColor = "#03050b",
  glowColor = "#10292f",
  horizonColor = "#b0643a",
  landColor = "#010203",
  stars = 0.6,
  exposure = 0.5,
  poleX = 0.64,
  poleY = -0.14,
  horizon = 0.24,
  silhouette = "forest",
  progress,
  grain = 0.5,
  speed = 1,
  interactive = true,
  paused = false,
  className,
  children,
}: StarTrailsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ skyColor, glowColor, horizonColor, landColor, stars, exposure, poleX, poleY, horizon, silhouette, progress, grain, speed, interactive, paused });
  settings.current = { skyColor, glowColor, horizonColor, landColor, stars, exposure, poleX, poleY, horizon, silhouette, progress, grain, speed, interactive, paused };
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
    const uPole = u("uPole");
    const uRot = u("uRot");
    const uArc = u("uArc");
    const uBand = u("uBand");
    const uDpr = u("uDpr");
    const uStars = u("uStars");
    const uRef = u("uRef");
    const uSky = u("uSky");
    const uGlow = u("uGlow");
    const uHorizonColor = u("uHorizonColor");
    const uLand = u("uLand");
    const uHorizon = u("uHorizon");
    const uSil = u("uSil");
    const uPar = u("uPar");
    const uGrain = u("uGrain");
    const uIntro = u("uIntro");

    const target = { x: 0.5, y: 0.5, on: 0 };
    const current = { x: 0.5, y: 0.5, on: 0 };
    // rotation is the sky's turn since the shutter opened; grown is how much of it the trails show
    let rotation = 0;
    let grown = 0;
    let rate = 0;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let lastMove = -10000;
    let tick = 0;
    let settled = 0;
    let introStart = 0;
    let intro = reduce ? 1 : 0;

    const arcFor = (value: number) => ((8 + clamp01(value) * 67) * Math.PI) / 180;

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uSky, ...resolveColor(root, s.skyColor));
      gl.uniform3f(uGlow, ...resolveColor(root, s.glowColor));
      gl.uniform3f(uHorizonColor, ...resolveColor(root, s.horizonColor));
      gl.uniform3f(uLand, ...resolveColor(root, s.landColor));
    };

    const draw = () => {
      const s = settings.current;
      const still = reduce || s.paused;
      const k = still ? 1 : 0.06;
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      current.on += (target.on - current.on) * (still ? 1 : 0.05);
      const on = s.interactive ? current.on : 0;
      const parX = (current.x - 0.5) * on;
      const parY = (current.y - 0.5) * on;
      const width = canvas.width;
      const height = canvas.height;
      const pole = [(s.poleX + parX * 0.012) * width, (s.poleY + parY * 0.012) * height] as const;
      const reach = Math.max(
        Math.hypot(pole[0], pole[1]),
        Math.hypot(width - pole[0], pole[1]),
        Math.hypot(pole[0], height - pole[1]),
        Math.hypot(width - pole[0], height - pole[1]),
      );
      const outside = readProgress(s.progress);
      const arc = arcFor(s.exposure);
      const shown = reduce ? arc : outside !== undefined ? arc * outside : grown;
      const turned = reduce ? arc : outside !== undefined ? arc * outside : rotation;
      gl.uniform2f(uRes, width, height);
      gl.uniform2f(uPole, pole[0], pole[1]);
      gl.uniform1f(uRot, turned);
      gl.uniform1f(uArc, shown);
      gl.uniform1f(uBand, 8 * dpr);
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uStars, clamp01(s.stars));
      gl.uniform1f(uRef, Math.max(1, reach));
      gl.uniform1f(uHorizon, Math.min(0.9, Math.max(0.05, s.horizon)));
      gl.uniform1f(uSil, silhouetteIndex[s.silhouette] ?? 2);
      gl.uniform2f(uPar, parX, parY);
      gl.uniform1f(uGrain, clamp01(s.grain));
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;
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
      const s = settings.current;
      if (intro < 1) {
        introStart ||= now;
        const k = clamp01((now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      if (s.paused) {
        draw();
        frame = intro < 1 ? requestAnimationFrame(loop) : 0;
        return;
      }
      const dt = (delta / 1000) * Math.max(0, s.speed);
      const arc = arcFor(s.exposure);
      // The exposure builds for about eleven seconds, then the sky keeps turning slowly
      const build = arc / 11;
      const building = grown < arc - 0.001;
      if (building) {
        rate = build;
        grown = Math.min(arc, grown + build * dt);
      } else {
        rate += (build * 0.2 - rate) * Math.min(1, dt * 0.8);
        grown += (arc - grown) * Math.min(1, dt * 2);
      }
      rotation = (rotation + rate * dt) % (Math.PI * 2);
      const active = intro < 1 || building || s.progress !== undefined || now - lastMove < 1500 || Math.abs(target.on - current.on) > 0.02;
      if (active || tick % 2 === 0) draw();
      frame = requestAnimationFrame(loop);
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

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      target.on = inside ? 1 : 0;
      if (!inside) return;
      target.x = (event.clientX - rect.left) / Math.max(1, rect.width);
      target.y = (event.clientY - rect.top) / Math.max(1, rect.height);
      lastMove = performance.now();
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
    const mo = new MutationObserver(() => requestAnimationFrame(() => redraw.current(true)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    resize();
    setReady(true);
    play();

    return () => {
      cancelAnimationFrame(frame);
      redraw.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
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
  }, [skyColor, glowColor, horizonColor, landColor]);

  useEffect(() => {
    redraw.current(false);
  }, [stars, exposure, poleX, poleY, horizon, silhouette, progress, grain, speed, interactive, paused]);

  // The same night as a CSS gradient, shown only when WebGL fails
  const line = Math.round((1 - horizon) * 100);
  const fallback = `linear-gradient(to bottom, ${skyColor} 0%, ${glowColor} ${line - 4}%, ${landColor} ${line + 6}%, ${landColor} 100%)`;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ background: failed ? fallback : skyColor }}>
      {!failed && (
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
