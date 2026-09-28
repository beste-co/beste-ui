"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface MarbleSlabProps {
  /** The stone's ground, the bright body between the veins. */
  groundColor?: string;
  /** The main veins and the cloudy shadows around them. */
  veinColor?: string;
  /** A metallic warmth that gathers along the edges of the veins. */
  accentColor?: string;
  /** Size of the pattern; higher values show more of the slab. */
  scale?: number;
  /** How many major veins cross the slab, 0 to 1. */
  veins?: number;
  /** How much the veins bend and wander, 0 to 1. */
  warp?: number;
  /** Mirror the slab around a center joint, the way two cut slabs are opened like a book. */
  bookMatch?: boolean;
  /** Strength of the polished reflection, 0 to 1. */
  gloss?: number;
  /** Speed of the studio light drifting across the polish, 1 is the default pace. */
  speed?: number;
  /** The reflection follows the cursor. */
  interactive?: boolean;
  /** Freeze the light where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const marbleSlabDemo: MarbleSlabProps = {
  groundColor: "#f3eee6",
  veinColor: "#5f5a57",
  accentColor: "#b8925f",
  scale: 1,
  veins: 0.5,
  warp: 0.6,
  bookMatch: true,
  gloss: 0.6,
  speed: 1,
  interactive: true,
  className: "min-h-[32rem]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Pass one: the stone itself, rendered once per size or setting into a texture.
// rgb holds the color, alpha a fine micro relief used by the polish.
const stoneFragment = `
precision highp float;
uniform vec2 uRes;
uniform float uScale;
uniform float uVeins;
uniform float uWarp;
uniform float uBook;
uniform vec3 uGround;
uniform vec3 uVein;
uniform vec3 uAccent;

float hash(vec2 p){
  p=fract(p*vec2(443.897,441.423));
  p+=dot(p,p.yx+19.19);
  return fract((p.x+p.y)*p.x);
}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
const mat2 R=mat2(.8,.6,-.6,.8);
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<5;i++){v+=a*noise(p);p=R*p*2.03+vec2(5.3,11.7);a*=.5;}
  return v;
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float aspect=uRes.x/max(uRes.y,1.);
  vec2 p=vec2((uv.x-.5)*aspect,uv.y-.5);
  if(uBook>.5)p.x=abs(p.x);
  float zoom=1.6*uScale;
  p=p*zoom+vec2(2.3,1.1);
  float pxu=uRes.y/zoom;
  float aa=1.1/pxu;

  // Domain warp gives the veins their slow, folded wander
  vec2 q=vec2(fbm(p*.9),fbm(p*.9+vec2(5.2,1.3)));
  vec2 r=vec2(fbm(p*1.3+q*2.2+vec2(1.7,9.2)),fbm(p*1.3+q*2.2+vec2(8.3,2.8)));
  float f=dot(p,vec2(.83,.55))*.75+uWarp*1.7*(r.x-.5)+.4*(q.y-.5);

  // Cloudy body with a faint grey drift
  float cloud=fbm(p*1.2+r*1.5);
  vec3 col=mix(uGround,mix(uGround,uVein,.16),smoothstep(.42,.85,cloud));
  col=mix(col,uGround*1.02,smoothstep(.5,.2,cloud)*.5);

  // Major veins: level lines of the warped field, fading in and out along their length
  float N=mix(.9,3.2,uVeins);
  float dist=abs(fract(f*N+.5)-.5)/N;
  float w=mix(.0015,.028,pow(noise(p*.8+3.3),2.4));
  float vis=smoothstep(.34,.72,fbm(p*.45+vec2(7.1,2.3)));
  float core=1.-smoothstep(w,w+aa,dist);
  float halo=exp(-dist/(w*3.+.018));
  vec3 veinTone=mix(uVein,uVein*.72,noise(p*9.+r*3.));
  col=mix(col,mix(col,uVein,.5),halo*vis*.22);
  col=mix(col,uAccent,clamp((halo-core)*vis*.5*smoothstep(.35,.75,noise(p*2.1+5.)),0.,1.));
  col=mix(col,veinTone,core*vis*.88);

  // Hairline veins that branch off at a finer rhythm
  float f2=f*2.3+uWarp*1.4*(r.y-.5)+.6*q.x;
  float N2=N*2.2;
  float d2=abs(fract(f2*N2+.5)-.5)/N2;
  float hw=.0009;
  float hair=1.-smoothstep(hw,hw+aa,d2);
  float vis2=smoothstep(.5,.82,fbm(p*.8+vec2(11.,4.)));
  col=mix(col,mix(col,uVein,.55),hair*vis2*.8);

  // A fine crackle of ridges, only in a few passages
  float rn=1.-abs(fbm(p*2.6+r*2.)*2.-1.);
  float crack=smoothstep(.965,.992,rn)*smoothstep(.55,.8,fbm(p*.6+vec2(3.,17.)));
  col=mix(col,mix(col,uVein,.4),crack*.7);

  // The joint between the two book-matched slabs
  if(uBook>.5){
    float d=abs(uv.x-.5)*uRes.x;
    col*=1.-.1*(1.-smoothstep(.4,1.4,d));
    col+=.025*exp(-pow((d-1.8)/.8,2.));
  }

  float relief=noise(gl_FragCoord.xy*.45)*.45+fbm(p*7.)*.55;
  gl_FragColor=vec4(clamp(col,0.,1.),relief);
}`;

// Pass two, every frame: the polish, a large softbox reflection gliding over the stone
const lightFragment = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec3 uLight;
uniform float uGloss;
uniform vec3 uGround;
uniform float uIntro;

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 px=1./uRes;
  vec4 s=texture2D(uTex,uv);
  float hx=texture2D(uTex,uv+vec2(px.x,0.)).a-texture2D(uTex,uv-vec2(px.x,0.)).a;
  float hy=texture2D(uTex,uv+vec2(0.,px.y)).a-texture2D(uTex,uv-vec2(0.,px.y)).a;
  vec2 n=vec2(hx,hy);

  float aspect=uRes.x/max(uRes.y,1.);
  vec2 p=(uv-.5)*vec2(aspect,1.);
  vec2 lp=(uLight.xy-.5)*vec2(aspect,1.);

  // Broad key light falloff across the slab
  vec2 k=p-lp;
  vec3 col=s.rgb*mix(.9,1.03,exp(-dot(k,k)*.9));

  // Softbox reflection, slightly tipped, shimmering through the micro relief
  vec2 d=k+n*.35;
  float a=-.32;
  d=mat2(cos(a),-sin(a),sin(a),cos(a))*d;
  vec2 b=abs(d)-vec2(.36,.15);
  float sd=length(max(b,0.))+min(max(b.x,b.y),0.)-.07;
  float box=1.-smoothstep(-.06,.26,sd);
  float core=1.-smoothstep(-.14,.01,sd);
  float spec=(box*.13+core*.09)*(.8+.4*s.a);
  float lum=dot(col,vec3(.299,.587,.114));
  col=mix(col,vec3(lum),spec*.6*uGloss);
  col+=spec*uGloss*uLight.z;

  // Room reflection: the top of the polish catches a little more sky
  col+=uGloss*.035*smoothstep(-.2,.6,uv.y);
  vec2 c=uv-.5;
  col*=1.-.14*pow(length(c*vec2(1.,1.15))*1.4,2.4);
  // On load the stone surfaces out of its flat ground, the micro relief setting a soft uneven front
  float reveal=clamp(uIntro*1.35-s.a*.35,0.,1.);
  col=mix(uGround,clamp(col,0.,1.),reveal*reveal*(3.-2.*reveal));
  gl_FragColor=vec4(col,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function link(gl: WebGLRenderingContext, fragment: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vertex);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  return { program, vs, fs };
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

export function MarbleSlab({
  groundColor = "#f3eee6",
  veinColor = "#5f5a57",
  accentColor = "#b8925f",
  scale = 1,
  veins = 0.5,
  warp = 0.6,
  bookMatch = true,
  gloss = 0.6,
  speed = 1,
  interactive = true,
  paused = false,
  className,
  children,
}: MarbleSlabProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ groundColor, veinColor, accentColor, scale, veins, warp, bookMatch, gloss, speed, interactive, paused });
  settings.current = { groundColor, veinColor, accentColor, scale, veins, warp, bookMatch, gloss, speed, interactive, paused };
  const redraw = useRef<(stone?: boolean) => void>(() => {});

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
    const stone = link(gl, stoneFragment);
    const light = link(gl, lightFragment);
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!stone || !light || !buffer || !texture || !fbo) return setFailed(true);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const bindQuad = (program: WebGLProgram) => {
      const loc = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };
    const su = (name: string) => gl.getUniformLocation(stone.program, name);
    const lu = (name: string) => gl.getUniformLocation(light.program, name);
    const sRes = su("uRes");
    const sScale = su("uScale");
    const sVeins = su("uVeins");
    const sWarp = su("uWarp");
    const sBook = su("uBook");
    const sGround = su("uGround");
    const sVein = su("uVein");
    const sAccent = su("uAccent");
    const lTex = lu("uTex");
    const lRes = lu("uRes");
    const lLight = lu("uLight");
    const lGloss = lu("uGloss");
    const lGround = lu("uGround");
    const lIntro = lu("uIntro");

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const target = { x: 0.5, y: 0.5, on: 0 };
    const current = { x: 0.62, y: 0.62, on: 0 };
    let time = 0;
    let frame = 0;
    let visible = true;
    let lastFrame = 0;
    let lastMove = -10000;
    let tick = 0;
    let introStart = 0;
    let intro = reduce ? 1 : 0;
    let ground: [number, number, number] = [0, 0, 0];

    const renderStone = () => {
      const s = settings.current;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(stone.program);
      bindQuad(stone.program);
      gl.uniform2f(sRes, canvas.width, canvas.height);
      gl.uniform1f(sScale, Math.max(0.2, s.scale));
      gl.uniform1f(sVeins, clamp01(s.veins));
      gl.uniform1f(sWarp, clamp01(s.warp));
      gl.uniform1f(sBook, s.bookMatch ? 1 : 0);
      ground = resolveColor(root, s.groundColor);
      gl.uniform3f(sGround, ...ground);
      gl.uniform3f(sVein, ...resolveColor(root, s.veinColor));
      gl.uniform3f(sAccent, ...resolveColor(root, s.accentColor));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    const draw = () => {
      const s = settings.current;
      const still = reduce || s.paused;
      // The softbox wanders on a slow figure of eight when nobody is steering it
      const idleX = 0.6 + Math.sin(time * 0.21) * 0.24;
      const idleY = 0.6 + Math.sin(time * 0.13 + 1.1) * 0.16;
      const on = s.interactive ? current.on : 0;
      const k = still ? 1 : 0.05;
      current.x += (idleX + (target.x - idleX) * on - current.x) * k;
      current.y += (idleY + (target.y - idleY) * on - current.y) * k;
      current.on += (target.on - current.on) * (still ? 1 : 0.04);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(light.program);
      bindQuad(light.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(lTex, 0);
      gl.uniform2f(lRes, canvas.width, canvas.height);
      gl.uniform3f(lLight, current.x, current.y, 1);
      gl.uniform1f(lGloss, clamp01(s.gloss) * intro);
      gl.uniform3f(lGround, ...ground);
      gl.uniform1f(lIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      if (!complete) return setFailed(true);
      renderStone();
      draw();
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      lastFrame = now;
      tick++;
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
      // The stone never moves and the light drifts slowly, so idle frames alternate
      const active = now - lastMove < 1500 || Math.abs(target.on - current.on) > 0.02;
      if (active || intro < 1 || tick % 2 === 0) draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    redraw.current = (withStone = false) => {
      if (withStone) renderStone();
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
      target.y = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      lastMove = performance.now();
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
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      for (const pass of [stone, light]) {
        gl.deleteProgram(pass.program);
        gl.deleteShader(pass.vs);
        gl.deleteShader(pass.fs);
      }
    };
  }, [reduce]);

  useEffect(() => {
    redraw.current(true);
  }, [groundColor, veinColor, accentColor, scale, veins, warp, bookMatch]);

  useEffect(() => {
    redraw.current(false);
  }, [gloss, speed, interactive, paused]);

  // A soft stone gradient, shown only without WebGL
  const fallback = `linear-gradient(118deg, transparent 38%, color-mix(in srgb, ${veinColor} 14%, transparent) 46%, transparent 55%), radial-gradient(70% 60% at 62% 38%, color-mix(in srgb, white 30%, ${groundColor}), ${groundColor} 70%)`;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: groundColor }}>
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
