"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface OceanHorizonProps {
  /** Sky color high overhead. */
  skyTop?: string;
  /** Sky color at the horizon line; the far water and the haze take it on too. */
  skyHorizon?: string;
  /** Color of the sun, its glow and the glitter path on the water. */
  sunColor?: string;
  /** Deep color of the water body under the reflections. */
  waterColor?: string;
  /** Height of the sun, 0 (just set) to 1 (high afternoon). */
  sunHeight?: number;
  /** Horizontal position of the sun, 0 (left) to 1 (right). */
  sunX?: number;
  /** Size of the swell, 0 (glassy) to 1 (a lively sea). */
  waves?: number;
  /** Sharpness of the crests, 0 (rolling) to 1 (peaked). */
  choppiness?: number;
  /** Strength of the sun's glitter path, 0 to 1. */
  glitter?: number;
  /** Aerial haze that softens the distance, 0 to 1. */
  haze?: number;
  /** Thin high clouds, 0 (clear) to 1. */
  clouds?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** The camera turns gently toward the cursor. */
  interactive?: boolean;
  /** Freeze the sea where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const oceanHorizonDemo: OceanHorizonProps = {
  skyTop: "#1b2544",
  skyHorizon: "#e39a74",
  sunColor: "#ffd29a",
  waterColor: "#0a2130",
  sunHeight: 0.16,
  sunX: 0.62,
  waves: 0.5,
  choppiness: 0.5,
  glitter: 0.7,
  haze: 0.45,
  clouds: 0.5,
  speed: 1,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uCam;
uniform float uRoll;
uniform float uFocal;
uniform vec3 uSun;
uniform vec3 uTop;
uniform vec3 uHor;
uniform vec3 uSunC;
uniform vec3 uWater;
uniform float uAmp;
uniform float uChop;
uniform float uDrag;
uniform float uIter;
uniform float uWsum;
uniform float uGlitter;
uniform float uHaze;
uniform float uClouds;
uniform float uIntro;

float hash(vec2 p){
  p=fract(p*vec2(443.897,441.423));
  p+=dot(p,p.yx+19.19);
  return fract((p.x+p.y)*p.x);
}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(17.1,9.3);a*=.5;}
  return v;
}

// Sky without the sun disc: gradient, a warm band on the horizon and the sun's glow
vec3 atmosphere(vec3 rd){
  float e=max(rd.y,0.);
  float mu=max(dot(rd,uSun),0.);
  vec3 col=mix(uHor,uTop,pow(smoothstep(0.,.55,e),.55));
  float side=max(dot(normalize(rd.xz+1e-4),normalize(uSun.xz+1e-4)),0.);
  col+=uSunC*(pow(mu,6.)*.3+pow(mu,48.)*.9)*exp(-e*3.);
  col+=uSunC*exp(-e*14.)*.16*(.35+.65*side*side);
  col=mix(col,uHor*1.04,exp(-e*(26.-uHaze*14.))*uHaze*.45);
  return col;
}

vec3 sky(vec3 rd){
  vec3 col=atmosphere(rd);
  float mu=dot(rd,uSun);
  if(rd.y>0.){
    vec2 q=rd.xz/(rd.y+.045);
    q=vec2(q.x*.16,q.y*.7)+vec2(uTime*.006,uTime*.002);
    float n=fbm(q*.55+vec2(3.1,1.7));
    float c=smoothstep(.48,.86,n)*smoothstep(0.,.2,rd.y)*uClouds;
    vec3 lit=mix(uTop*1.3+uHor*.25,uSunC*1.25+uHor*.35,pow(max(mu,0.),2.)*.75+.15);
    col=mix(col,lit,c*.75);
  }
  col+=uSunC*16.*smoothstep(.99984,.99993,mu)*smoothstep(-.02,.03,uSun.y+.004);
  return col;
}

// Summed directional waves with sharpened crests; returns height (0 to 1) and its gradient
vec3 waves(vec2 p,float foot){
  float freq=.06,amp=1.,sum=0.,ph=0.;
  vec2 g=vec2(0.);
  for(int i=0;i<24;i++){
    if(float(i)>=uIter)break;
    float fade=1.-smoothstep(.35,1.4,freq*foot);
    if(fade<=0.)break;
    float fi=float(i);
    float ang=3.14159+sin(fi*12.9898+.7)*(.45+fi*.06);
    vec2 d=vec2(sin(ang),cos(ang));
    float x=dot(d,p)*freq-uTime*sqrt(9.8*freq)*.55+ph;
    float w=exp(uChop*(sin(x)-1.));
    float dw=w*uChop*cos(x);
    p-=d*dw*amp*uDrag/.06;
    sum+=w*amp*fade;
    g+=d*freq*dw*amp*fade;
    freq*=1.18;
    amp*=.8;
    ph+=1.7;
  }
  return vec3(sum,g)/uWsum;
}

vec3 sea(vec3 ro,vec3 rd,float pix){
  float t=ro.y/max(-rd.y,1e-4);
  vec3 p=ro+rd*t;
  float foot=t*pix/max(sqrt(-rd.y),.08);
  vec3 w=waves(p.xz,foot);
  vec3 n=normalize(vec3(-w.y*uAmp,1.,-w.z*uAmp));

  float cosi=max(dot(n,-rd),0.);
  float F=.02+.98*pow(1.-cosi,5.);
  vec3 r=reflect(rd,n);
  r.y=abs(r.y);
  vec3 refl=atmosphere(r);

  // Water body: ambient sky light, a little direct sun, and light through the crests toward the sun
  vec3 amb=uTop*.6+uHor*.4;
  vec3 body=uWater*(amb*1.1+uSunC*max(uSun.y,0.)*1.4+uSunC*max(dot(n,uSun),0.)*.25);
  float toward=max(dot(normalize(rd.xz),normalize(uSun.xz+1e-4)),0.);
  float crest=w.x*w.x;
  body+=uWater*vec3(.7,1.5,1.2)*uSunC*crest*(.25+toward*toward*.9)*exp(-t*.004);
  vec3 col=mix(body,refl,F);

  // Glitter path: the specular lobe widens with distance the way a real sea roughens toward the horizon
  vec3 h=normalize(uSun-rd);
  float shin=mix(1600.,60.,sqrt(clamp(t/800.,0.,1.)));
  float spec=min(pow(max(dot(n,h),0.),shin)*(shin+8.)/30.,50.);
  col+=uSunC*spec*(.25+.75*F)*uGlitter*smoothstep(-.03,.02,uSun.y);

  float fog=1.-exp(-t*(.0006+uHaze*.0035));
  return mix(col,atmosphere(normalize(vec3(rd.x,0.,rd.z))),fog);
}

void main(){
  vec2 uv=(gl_FragCoord.xy*2.-uRes)/uRes.y;
  float yaw=uCam.x,pitch=uCam.y;
  vec3 fwd=vec3(sin(yaw)*cos(pitch),-sin(pitch),cos(yaw)*cos(pitch));
  vec3 right=normalize(cross(vec3(0.,1.,0.),fwd));
  vec3 up=cross(fwd,right);
  vec3 rr=right*cos(uRoll)+up*sin(uRoll);
  vec3 uu=up*cos(uRoll)-right*sin(uRoll);
  vec3 rd=normalize(fwd*uFocal+rr*uv.x+uu*uv.y);
  vec3 ro=vec3(0.,uCam.z,0.);
  float pix=2./(uRes.y*uFocal);

  vec3 col=rd.y<-.0002?sea(ro,rd,pix):sky(rd);

  // Soft shoulder: picked colors stay as picked, only the sun and its glints roll off
  col=mix(col,.8+.2*(1.-exp(-(col-.8)/.2)),step(.8,col));
  vec2 c=gl_FragCoord.xy/uRes-.5;
  col*=1.-.22*pow(length(c*vec2(1.,1.15))*1.4,2.4);
  col=pow(max(col,0.),vec3(1./2.2));
  float g=hash(gl_FragCoord.xy)+hash(gl_FragCoord.yx+31.7)-1.;
  col+=g*.018;
  // On load the scene rises out of the wrapper's plain sky gradient
  vec3 base=mix(uTop,uHor,1.-gl_FragCoord.y/uRes.y);
  gl_FragColor=vec4(mix(base,clamp(col,0.,1.),uIntro),1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Resolves any CSS color (tokens and oklch included) to linear 0-1 RGB
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
  const lin = (v: number) => (v / 255) ** 2.2;
  return [lin(data[0] ?? 0), lin(data[1] ?? 0), lin(data[2] ?? 0)];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const INTRO_MS = 2400;
const FOV = (44 * Math.PI) / 180;
const FOCAL = 1 / Math.tan(FOV / 2);
const PITCH = Math.atan(0.12 / FOCAL);

export function OceanHorizon({
  skyTop = "#1b2544",
  skyHorizon = "#e39a74",
  sunColor = "#ffd29a",
  waterColor = "#0a2130",
  sunHeight = 0.16,
  sunX = 0.62,
  waves = 0.5,
  choppiness = 0.5,
  glitter = 0.7,
  haze = 0.45,
  clouds = 0.5,
  speed = 1,
  interactive = true,
  paused = false,
  className,
  children,
}: OceanHorizonProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ skyTop, skyHorizon, sunColor, waterColor, sunHeight, sunX, waves, choppiness, glitter, haze, clouds, speed, interactive, paused });
  settings.current = { skyTop, skyHorizon, sunColor, waterColor, sunHeight, sunX, waves, choppiness, glitter, haze, clouds, speed, interactive, paused };
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
    const uCam = u("uCam");
    const uRoll = u("uRoll");
    const uFocal = u("uFocal");
    const uSun = u("uSun");
    const uTop = u("uTop");
    const uHor = u("uHor");
    const uSunC = u("uSunC");
    const uWater = u("uWater");
    const uAmp = u("uAmp");
    const uChop = u("uChop");
    const uDrag = u("uDrag");
    const uIter = u("uIter");
    const uWsum = u("uWsum");
    const uGlitter = u("uGlitter");
    const uHaze = u("uHaze");
    const uClouds = u("uClouds");
    const uIntro = u("uIntro");

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let time = 40;
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

    const recolor = () => {
      const s = settings.current;
      gl.uniform3f(uTop, ...resolveColor(root, s.skyTop));
      gl.uniform3f(uHor, ...resolveColor(root, s.skyHorizon));
      gl.uniform3f(uSunC, ...resolveColor(root, s.sunColor));
      gl.uniform3f(uWater, ...resolveColor(root, s.waterColor));
    };

    const draw = () => {
      const s = settings.current;
      const still = reduce || s.paused;
      const k = still ? 1 : 0.035;
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      const elevation = -0.02 + clamp01(s.sunHeight) * 0.5;
      const azimuth = (clamp01(s.sunX) - 0.5) * 0.9;
      const bob = still ? 0 : 1;
      const iter = quality >= 0.9 ? 22 : quality >= 0.7 ? 18 : 14;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform3f(
        uCam,
        (s.interactive ? current.x : 0) * 0.05,
        PITCH + (s.interactive ? current.y : 0) * 0.015 + Math.sin(time * 0.43) * 0.004 * bob,
        5 + Math.sin(time * 0.5) * 0.12 * bob,
      );
      gl.uniform1f(uRoll, Math.sin(time * 0.37) * 0.004 * bob);
      gl.uniform1f(uFocal, FOCAL);
      gl.uniform3f(uSun, Math.sin(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(azimuth) * Math.cos(elevation));
      gl.uniform1f(uAmp, (0.25 + clamp01(s.waves) * 1.6) * (0.2 + 0.8 * intro));
      gl.uniform1f(uChop, 0.8 + clamp01(s.choppiness) * 2.4);
      gl.uniform1f(uDrag, 0.12 + clamp01(s.choppiness) * 0.2);
      gl.uniform1f(uIter, iter);
      gl.uniform1f(uWsum, (1 - 0.8 ** iter) / 0.2);
      gl.uniform1f(uGlitter, clamp01(s.glitter) * intro);
      gl.uniform1f(uIntro, intro);
      gl.uniform1f(uHaze, clamp01(s.haze));
      gl.uniform1f(uClouds, clamp01(s.clouds));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
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
      if (intro < 1) {
        introStart ||= now;
        const k = Math.min(1, (now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      if (settings.current.paused) {
        draw();
        frame = intro < 1 ? requestAnimationFrame(loop) : 0;
        return;
      }
      time += (delta / 1000) * settings.current.speed;
      draw();
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
      target.x = inside ? ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1 : 0;
      target.y = inside ? ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1 : 0;
      if (reduce || settings.current.paused) draw();
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
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    resize();
    setReady(true);
    play();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
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
  }, [skyTop, skyHorizon, sunColor, waterColor]);

  useEffect(() => {
    redraw.current(false);
  }, [sunHeight, sunX, waves, choppiness, glitter, haze, clouds, speed, interactive, paused]);

  // The same scene as a CSS gradient, shown only without WebGL
  const horizon = 44;
  const sunTop = Math.max(8, horizon - clamp01(sunHeight) * 40);
  const fallback = `radial-gradient(18% 14% at ${Math.round(clamp01(sunX) * 100)}% ${sunTop}%, ${sunColor}, transparent 70%), linear-gradient(to bottom, ${skyTop} 0%, ${skyHorizon} ${horizon}%, ${waterColor} ${horizon + 0.2}%, ${waterColor} 100%)`;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ background: `linear-gradient(to bottom, ${skyTop}, ${skyHorizon})` }}>
      {failed ? (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: fallback }} />
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
