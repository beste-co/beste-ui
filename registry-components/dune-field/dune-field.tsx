"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface DuneFieldProps {
  /** Color of the sand in full sun. Any CSS color. */
  sandColor?: string;
  /** Sky overhead; it also tints the shadows. */
  skyColor?: string;
  /** Haze at the horizon, where the distance fades. */
  hazeColor?: string;
  /** Color of the low sun and its glow. */
  sunColor?: string;
  /** How high the sun stands, 0 (on the horizon) to 1 (well up). Low suns throw long shadows. */
  sunHeight?: number;
  /** Where the sun stands relative to the view, in degrees (-90 left, 0 ahead, 90 right). */
  sunAngle?: number;
  /** Size of the dunes, 0.6 (small) to 1.6 (vast). */
  scale?: number;
  /** Fine wind ripples on the sand, 0 to 1. */
  ripples?: number;
  /** Speed of the camera's glide, 1 is the default pace. */
  speed?: number;
  /** Film grain, 0 to 1. */
  grain?: number;
  /** The view turns gently with the cursor. */
  interactive?: boolean;
  /** Hold the camera where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const duneFieldDemo: DuneFieldProps = {
  sandColor: "#d9a066",
  skyColor: "#6d8fbf",
  hazeColor: "#f2c9a0",
  sunColor: "#ffd2a1",
  sunHeight: 0.25,
  sunAngle: -32,
  scale: 1,
  ripples: 0.6,
  speed: 1,
  grain: 0.4,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLook;
uniform vec3 uSand;
uniform vec3 uSky;
uniform vec3 uHaze;
uniform vec3 uSunCol;
uniform vec2 uSunPos;
uniform float uScale;
uniform float uRipples;
uniform float uGrain;
uniform float uIntro;
uniform vec3 uBase;

vec3 sun;
float pixAng;

// Inputs are wrapped first, so the hash keeps its precision however far the camera has travelled
float hash(vec2 p){
  p=mod(p,289.);
  vec3 q=fract(vec3(p.xyx)*.1031);
  q+=dot(q,q.yzx+33.33);
  return fract((q.x+q.y)*q.z);
}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
float screenHash(vec2 p){return fract(sin(dot(mod(p,1024.),vec2(12.9898,78.233)))*43758.5453);}

// A dune in cross-section: a long windward slope up to the crest, then a steep lee face.
// k rounds the crest; far away it grows, so distant crests never break into speckle
float profile(float u,float k){
  float s=fract(u);
  float up=pow(s/.72,1.7);
  float down=pow(max(1.-s,0.)/.28,1.25);
  float h=clamp(.5+.5*(down-up)/k,0.,1.);
  return mix(down,up,h)-k*h*(1.-h);
}
// lod is the size of one pixel on the ground; detail finer than that is left out
float swell(vec2 p,float lod){
  return noise(p*.035)*2.2+noise(p*.09)*.6*(1.-smoothstep(2.,6.,lod));
}
float dunes(vec2 p,float lod){
  vec2 w=vec2(noise(p*.05),noise(p*.05+17.3))-.5;
  vec2 q=p+w*5.;
  float k=.07+.5*smoothstep(.15,2.5,lod);
  float a=profile(dot(q,vec2(.94,.34))*.15,k)*(1.1+.9*noise(p*.045));
  float fine=1.-smoothstep(.4,1.6,lod);
  float b=fine>0.?profile(dot(q*1.7+vec2(11.,3.),vec2(.8,.6))*.15,k)*.3*fine:0.;
  return a+b;
}
float height(vec2 p,float lod){
  p/=uScale;
  return (dunes(p,lod/uScale)+swell(p,lod/uScale))*uScale;
}

vec3 sky(vec3 rd){
  float h=max(rd.y,0.);
  vec3 c=mix(uHaze,uSky,clamp(pow(h,.5)*1.15,0.,1.));
  float s=max(dot(rd,sun),0.);
  c+=uSunCol*(pow(s,5.)*.22+pow(s,60.)*.5+smoothstep(.9994,.9998,s)*3.);
  return c;
}

float shadow(vec3 p,float lod){
  float res=1.;
  float t=.1*uScale;
  for(int i=0;i<22;i++){
    vec3 q=p+sun*t;
    float d=q.y-height(q.xz,max(lod,t*.03));
    res=min(res,6.*d/t);
    t+=max(.08*uScale+t*.03,d*.5);
    if(res<.005||t>18.*uScale)break;
  }
  res=clamp(res,0.,1.);
  return res*res*(3.-2.*res);
}

void main(){
  vec2 frag=gl_FragCoord.xy;
  vec2 uv=(frag-.5*uRes)/uRes.y;
  pixAng=1./(1.6*uRes.y);

  // The camera glides low over the dunes, turning slowly
  vec3 ro=vec3(uTime*.9,0.,uTime*2.2)*uScale;
  ro.y=swell(ro.xz/uScale,0.)*uScale+3.4*uScale;
  float yaw=.38+sin(uTime*.05)*.08+uLook.x*.16;
  float pitch=-.1+uLook.y*.05;
  vec3 fw=normalize(vec3(sin(yaw)*cos(pitch),sin(pitch),cos(yaw)*cos(pitch)));
  vec3 rt=normalize(cross(vec3(0.,1.,0.),fw));
  vec3 up=cross(fw,rt);
  vec3 rd=normalize(fw*1.6+rt*uv.x+up*uv.y);

  float az=.38+uSunPos.y;
  sun=normalize(vec3(sin(az)*cos(uSunPos.x),sin(uSunPos.x),cos(az)*cos(uSunPos.x)));

  // Steps grow with distance, where the terrain is drawn smoother anyway, and a bisection
  // pins the crossing, so every ray reaches the haze and crest lines come out clean
  float tMax=118.*uScale;
  float hTop=5.4*uScale;
  float t=.3*uScale;
  float lt=t;
  float hit=-1.;
  for(int i=0;i<150;i++){
    vec3 pos=ro+rd*t;
    float lod=t*pixAng*2.;
    float d=pos.y-height(pos.xz,lod);
    if(d<0.){
      float a=lt;
      float b=t;
      for(int k=0;k<6;k++){
        float m=.5*(a+b);
        vec3 q=ro+rd*m;
        if(q.y-height(q.xz,lod)<0.)b=m;else a=m;
      }
      hit=.5*(a+b);
      break;
    }
    lt=t;
    t+=max(.02*uScale+t*.011,d*.4);
    if(t>tMax||(rd.y>0.&&pos.y>hTop))break;
  }

  vec3 col;
  if(hit<0.){
    col=sky(rd);
  }else{
    vec3 pos=ro+rd*hit;
    float far=hit/uScale;
    float fog=1.-exp(-far*.02);
    fog=max(fog,smoothstep(72.,112.,far));

    // Size of one pixel on the sand here. Far away the sand is seen almost edge-on, so a pixel
    // stretches over a long strip of ground; the surface is smoothed over that strip
    float fp0=hit*pixAng;
    float lod0=fp0*2.;
    float h0=height(pos.xz,lod0);
    float e0=max(.015*uScale,fp0*1.5);
    vec3 n0=normalize(vec3(h0-height(pos.xz+vec2(e0,0.),lod0),e0,h0-height(pos.xz+vec2(0.,e0),lod0)));
    float fp=fp0/max(abs(dot(rd,n0)),.08);
    float e=max(e0,fp*.75);
    vec3 n=e>e0*1.05?normalize(vec3(h0-height(pos.xz+vec2(e,0.),fp),e,h0-height(pos.xz+vec2(0.,e),fp))):n0;

    // Wind ripples: wobbly, broken into segments of every length, crossed by a weaker second set,
    // over a fine wrinkle in the sand; they keep to gentler slopes and fade once finer than a pixel
    vec2 rp=pos.xz/uScale;
    float gentle=smoothstep(.6,.88,n.y);
    if(fp<.25*uScale&&gentle>0.&&uRipples>0.){
      float ang=-1.22+(noise(rp*.045+3.1)-.5)*.9;
      vec2 rdir=vec2(cos(ang),sin(ang));
      float freq=7.5+noise(rp*.11+9.7)*3.5;
      float ph=dot(rp,rdir)*freq+noise(rp*.7)*3.6+noise(rp*2.1+5.3)*1.5+noise(rp*4.7+2.9)*.7;
      float seg=smoothstep(.22,.7,noise(rp*2.4+13.1))*(.45+.55*noise(rp*.9+4.4));
      float ripple=(cos(ph)+.45*cos(2.*ph+.6))*seg;
      float ang2=ang+.55+(noise(rp*.08+6.6)-.5)*.6;
      vec2 rdir2=vec2(cos(ang2),sin(ang2));
      float ph2=dot(rp,rdir2)*freq*1.35+noise(rp*1.3+7.7)*4.+noise(rp*3.9+1.1)*.9;
      float ripple2=cos(ph2)*.42*smoothstep(.3,.75,noise(rp*1.9+21.3));
      float patches=smoothstep(.2,.62,noise(rp*.16+1.7));
      float wl=6.2832/freq*uScale;
      float near=1.-smoothstep(wl*.06,wl*.25,fp);
      float amt=.11*uRipples*gentle*near;
      vec3 bend=vec3(rdir.x,0.,rdir.y)*ripple*patches+vec3(rdir2.x,0.,rdir2.y)*ripple2*(.4+.6*patches);
      // Fine wrinkles: the slope of a small noise, finer than the ripples
      vec2 wq=rp*9.;
      float w0=noise(wq);
      vec2 wg=vec2(noise(wq+vec2(.15,0.))-w0,noise(wq+vec2(0.,.15))-w0)/.15;
      float fine=1.-smoothstep(wl*.02,wl*.08,fp);
      n=normalize(n+bend*amt+vec3(wg.x,0.,wg.y)*.05*uRipples*fine);
    }

    float dif=max(dot(n,sun),0.);
    // Faces turned from the sun and sand lost in the haze need no shadow ray
    float sh=1.;
    if(dif>.003&&fog<.92)sh=shadow(pos+n*.02*uScale,fp);
    float amb=.55+.45*n.y;
    vec3 away=normalize(vec3(-sun.x,.25,-sun.z));
    float bounce=max(dot(n,away),0.);
    // Sand color varies a little, but not finer than a pixel
    float tone=mix(.5,noise(rp*.7),1.-smoothstep(.15,.6,fp/uScale));
    vec3 alb=uSand*(.9+.2*tone);
    col=alb*(uSunCol*dif*sh*2.1+uSky*amb*.42+uSand*bounce*.12);
    // Quartz grains catch the sun here and there, only close by
    float glint=1.-smoothstep(.002,.006,fp/uScale);
    if(glint>0.){
      float grain=step(.994,hash(floor(rp*150.)));
      col+=uSunCol*grain*pow(max(dot(reflect(rd,n),sun),0.),16.)*sh*.8*glint;
    }
    // Distance fades into the haze, warmed by the sun, and closes the horizon fully
    col=mix(col,sky(normalize(vec3(rd.x,.03,rd.z))),fog);
  }

  // The light comes up out of the dusk once, on arrival
  col*=mix(.2,1.,uIntro);
  col=1.-exp(-col*1.5);
  col=pow(col,vec3(1./2.2));
  vec2 c=frag/uRes-.5;
  col*=1.-.22*pow(length(c*vec2(1.,1.2))*1.35,2.4);
  col+=(screenHash(frag)-.5)*.03*uGrain;
  // The scene grows out of the wrapper's flat color, grain included
  col=mix(uBase,col,uIntro);
  gl_FragColor=vec4(clamp(col,0.,1.),1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Resolves any CSS color (tokens and oklch included) to linear 0-1 RGB for lighting
function resolveColor(el: HTMLElement, color: string): [number, number, number] {
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  el.style.color = "";
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0.5, 0.5, 0.5];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  const lin = (v: number) => (v / 255) ** 2.2;
  return [lin(data[0] ?? 0), lin(data[1] ?? 0), lin(data[2] ?? 0)];
}

// The wrapper's own background as display 0-1 sRGB, for the intro to grow out of
function resolveBase(el: HTMLElement): [number, number, number] {
  const [r, g, b] = resolveColor(el, getComputedStyle(el).backgroundColor);
  return [r ** (1 / 2.2), g ** (1 / 2.2), b ** (1 / 2.2)];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const INTRO_MS = 2400;

export function DuneField({
  sandColor = "#d9a066",
  skyColor = "#6d8fbf",
  hazeColor = "#f2c9a0",
  sunColor = "#ffd2a1",
  sunHeight = 0.25,
  sunAngle = -32,
  scale = 1,
  ripples = 0.6,
  speed = 1,
  grain = 0.4,
  interactive = true,
  paused = false,
  className,
  children,
}: DuneFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ sandColor, skyColor, hazeColor, sunColor, sunHeight, sunAngle, scale, ripples, speed, grain, interactive, paused });
  settings.current = { sandColor, skyColor, hazeColor, sunColor, sunHeight, sunAngle, scale, ripples, speed, grain, interactive, paused };
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
    const uLook = u("uLook");
    const uSand = u("uSand");
    const uSky = u("uSky");
    const uHaze = u("uHaze");
    const uSunCol = u("uSunCol");
    const uSunPos = u("uSunPos");
    const uScale = u("uScale");
    const uRipples = u("uRipples");
    const uGrain = u("uGrain");
    const uIntro = u("uIntro");
    const uBase = u("uBase");

    const target = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };
    // A fixed start point on the glide, so every visit opens on the same view
    let time = 14;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    // Render scale in device pixels per CSS pixel: starts at one, climbs toward the screen's own density
    // while frames stay fast, and steps down when they do not
    const densest = Math.min(window.devicePixelRatio || 1, 1.5);
    let quality = 1;
    let ceiling = densest;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let settled = 0;
    let introStart = 0;
    let intro = reduce ? 1 : 0;

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uSand, ...resolveColor(root, s.sandColor));
      gl.uniform3f(uSky, ...resolveColor(root, s.skyColor));
      gl.uniform3f(uHaze, ...resolveColor(root, s.hazeColor));
      gl.uniform3f(uSunCol, ...resolveColor(root, s.sunColor));
      gl.uniform3f(uBase, ...resolveBase(root));
    };

    const draw = () => {
      const s = settings.current;
      const still = reduce || s.paused;
      look.x += (target.x - look.x) * (still ? 1 : 0.05);
      look.y += (target.y - look.y) * (still ? 1 : 0.05);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uLook, s.interactive ? look.x : 0, s.interactive ? look.y : 0);
      gl.uniform2f(uSunPos, 0.035 + clamp01(s.sunHeight) * 0.58, (Math.max(-90, Math.min(90, s.sunAngle)) * Math.PI) / 180);
      gl.uniform1f(uScale, Math.max(0.6, Math.min(1.6, s.scale)));
      gl.uniform1f(uRipples, clamp01(s.ripples));
      gl.uniform1f(uGrain, clamp01(s.grain));
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      dpr = quality;
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
        if (average > 24 && quality > 0.6) {
          ceiling = Math.max(0.6, quality - 0.05);
          quality = Math.max(0.6, quality - 0.1);
          settled = 0;
          resize();
        } else if (average < 17.5 && quality < ceiling) {
          settled += 60;
          if (settled >= 240) {
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
      if (!settings.current.paused) time += (delta / 1000) * 0.25 * Math.max(0, settings.current.speed);
      // The glide is slow, so the scene redraws at half rate
      if (tick % 2 === 0 || (intro >= 1 && settings.current.paused)) draw();
      frame = !settings.current.paused || intro < 1 ? requestAnimationFrame(loop) : 0;
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
      target.x = inside ? ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1 : 0;
      target.y = inside ? 1 - ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 : 0;
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
  }, [sandColor, skyColor, hazeColor, sunColor]);

  useEffect(() => {
    redraw.current(false);
  }, [sunHeight, sunAngle, scale, ripples, speed, grain, interactive, paused]);

  // The frame holds the dusk haze until the scene grows in; without WebGL a painted sky and sand stand in
  const fallback = `linear-gradient(to bottom, ${skyColor} 0%, ${hazeColor} 46%, ${sandColor} 58%, color-mix(in srgb, ${sandColor} 55%, #2a1a10) 100%)`;

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={{ background: failed ? fallback : `color-mix(in srgb, ${hazeColor} 22%, #120c08)` }}
    >
      {!failed && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 size-full transition-opacity duration-300",
            ready ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
