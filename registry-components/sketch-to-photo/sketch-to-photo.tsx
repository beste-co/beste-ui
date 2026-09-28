"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface SketchToPhotoProps {
  /** Photo the drawing is made from. Loaded with CORS so WebGL can read it. Strong lines draw best. */
  imageSrc: string;
  /** Description of the photo for screen readers. */
  imageAlt?: string;
  /** Color of the paper. Any CSS color, tokens included. */
  paperColor?: string;
  /** Color of the pen lines and hatching. */
  inkColor?: string;
  /** Thickness of the pen lines, 0 (hairline) to 1. */
  lineWeight?: number;
  /** How many edges of the photo become lines, 0 (only the main contours) to 1 (every detail). */
  lineDetail?: number;
  /** Where the piece is, 0 to 1: blank paper, lines drawn by 0.4, watercolor washed in by 0.75, full photo at 1. Used when autoplay is off. */
  progress?: number;
  /** Loop the whole sequence on its own. Defaults to on when no progress is given. */
  autoplay?: boolean;
  /** Pace of the autoplay loop and of the easing toward a new progress, 1 is the default. */
  speed?: number;
  /** Paper grain, 0 to 1. */
  grain?: number;
  /** Freeze on the current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const sketchToPhotoDemo: SketchToPhotoProps = {
  imageSrc: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=80",
  imageAlt: "A modern house with wide glass walls and a pool",
  paperColor: "#f1ece2",
  inkColor: "#2b2723",
  lineWeight: 0.4,
  lineDetail: 0.5,
  autoplay: true,
  speed: 1,
  grain: 0.5,
  className: "aspect-[4/3] w-full max-w-3xl",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uTexRes;
uniform sampler2D uTex;
uniform vec3 uPaper;
uniform vec3 uInk;
uniform float uProgress;
uniform float uStep;
uniform float uThreshold;
uniform float uHatch;
uniform float uGrain;
uniform float uDpr;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}

vec2 cover(vec2 uv){
  float ra=uRes.x/uRes.y,ta=uTexRes.x/uTexRes.y;
  vec2 s=ra>ta?vec2(1.,ta/ra):vec2(ra/ta,1.);
  return (uv-.5)*s+.5;
}
vec3 tex(vec2 uv){return texture2D(uTex,clamp(uv,0.,1.)).rgb;}
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}

// Pen line along a direction: fine, slightly wobbly, broken into strokes like a real hatch
float hatch(vec2 frag,vec2 dir,float spacing,float seed){
  vec2 n=vec2(-dir.y,dir.x);
  float along=dot(frag,dir);
  float across=dot(frag,n)+(noise(frag*.012+seed)-.5)*spacing*.9;
  float d=abs(fract(across/spacing)-.5)*spacing;
  float line=1.-smoothstep(.35*uDpr,.95*uDpr,d);
  float row=floor(across/spacing);
  float stroke=smoothstep(.25,.45,noise(vec2(along/(spacing*9.),row*1.7+seed)));
  return line*stroke;
}

float reveal(float front,float prog,float soft){return clamp((prog-front)/soft,0.,1.);}

void main(){
  vec2 frag=gl_FragCoord.xy;
  vec2 uv=frag/uRes;
  float asp=uRes.x/uRes.y;
  vec2 q=vec2(uv.x*asp,uv.y);
  vec2 tuv=cover(uv);
  vec2 texel=(cover(uv+1./uRes)-tuv);
  vec2 o=texel*uStep;

  // Fine Sobel on luminance: the contours the pen follows
  float tl=lum(tex(tuv+vec2(-o.x,o.y))),t=lum(tex(tuv+vec2(0.,o.y))),tr=lum(tex(tuv+o));
  float l=lum(tex(tuv-vec2(o.x,0.))),r=lum(tex(tuv+vec2(o.x,0.)));
  float bl=lum(tex(tuv-o)),b=lum(tex(tuv-vec2(0.,o.y))),br=lum(tex(tuv+vec2(o.x,-o.y)));
  float gx=(tr+2.*r+br)-(tl+2.*l+bl);
  float gy=(tl+2.*t+tr)-(bl+2.*b+br);
  float fine=smoothstep(uThreshold,uThreshold*2.4,length(vec2(gx,gy)));

  // Soft photo from two rings of taps: the watercolor body and the broad structure lines
  vec3 sharp=tex(tuv);
  vec2 w1=texel*4.*uDpr,w2=texel*9.*uDpr;
  vec3 e1=tex(tuv+vec2(w1.x,0.)),e2=tex(tuv-vec2(w1.x,0.)),e3=tex(tuv+vec2(0.,w1.y)),e4=tex(tuv-vec2(0.,w1.y));
  vec3 soft=(sharp*2.+e1+e2+e3+e4+tex(tuv+w2)+tex(tuv-w2)+tex(tuv+vec2(w2.x,-w2.y))+tex(tuv+vec2(-w2.x,w2.y)))/10.;
  float coarse=smoothstep(uThreshold*1.6,uThreshold*4.,length(vec2(lum(e1)-lum(e2),lum(e3)-lum(e4))));
  float tone=lum(soft);

  // Paper: fibers, a faint tooth and static grain
  float fiber=fbm(q*vec2(9.,26.)*1.3)*.6+fbm(q*44.)*.4;
  float g=(hash(frag)-hash(frag+71.3))*uGrain;
  vec3 paper=uPaper*(1.-.045*fiber)+g*.035;

  // Pen: contours sweep in first, hatching follows a beat behind
  float p=uProgress;
  float front=dot(uv,vec2(.82,.3))/1.12+(fbm(q*3.2)-.5)*.2;
  float drawn=reveal(front,clamp(p/.36,0.,1.)*1.34-.18,.05);
  float shaded=reveal(front,clamp((p-.1)/.34,0.,1.)*1.34-.18,.08);
  float outline=fine*(.5+.42*coarse)*drawn;
  float spacing=(4.2+uHatch*2.4)*uDpr;
  float h1=hatch(frag,normalize(vec2(1.,.62)),spacing,3.1)*smoothstep(.56,.3,tone);
  float h2=hatch(frag,normalize(vec2(-.5,1.)),spacing*1.1,9.7)*smoothstep(.34,.14,tone);
  float shade=max(h1,h2)*.42*shaded;
  float graphite=.78+.22*noise(frag*.45/uDpr);
  float ink=clamp(max(outline,shade)*graphite,0.,1.);

  // Watercolor wash blooms from the middle along a feathered, noisy front
  float wp=smoothstep(.38,.75,p);
  float field=length((uv-vec2(.56,.48))*vec2(asp,1.))/length(vec2(asp,1.))*1.35+fbm(q*2.6+4.)*.42+fbm(q*13.)*.06;
  float wet=smoothstep(-.035,.035,wp*1.35-field+(wp>0.?.02:-.1));
  float tide=wet*(1.-wet)*4.;
  float bloom=fbm(q*6.+11.);
  vec3 pigment=mix(uPaper,soft*mix(vec3(1.),uPaper,.25),.82);
  pigment*=.93+.12*bloom;
  vec3 col=mix(paper,pigment*(1.-.03*fiber),wet);
  col=mix(col,col*col*1.08,tide*.45);

  // The drawing lets go and the photograph sharpens into place
  float fp=smoothstep(.72,1.,p);
  vec3 photo=mix(soft,sharp,fp);
  col=mix(col,photo,fp*fp*(3.-2.*fp));
  col=mix(col,uInk,ink*(1.-fp)*.9);

  vec2 v=uv-.5;
  col*=1.-dot(v,v)*.12*(1.-fp);
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
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

// Autoplay: draw and wash for 9s, hold the photo, rewind, rest on blank paper
const DRAW = 9;
const HOLD = 2.6;
const REWIND = 2.4;
const REST = 0.8;
const CYCLE = DRAW + HOLD + REWIND + REST;

function loopProgress(time: number) {
  const t = time % CYCLE;
  if (t < DRAW) return easeInOut(t / DRAW);
  if (t < DRAW + HOLD) return 1;
  if (t < DRAW + HOLD + REWIND) return 1 - easeInOut((t - DRAW - HOLD) / REWIND);
  return 0;
}

export function SketchToPhoto({
  imageSrc,
  imageAlt,
  paperColor = "#f1ece2",
  inkColor = "#2b2723",
  lineWeight = 0.4,
  lineDetail = 0.5,
  progress,
  autoplay = progress === undefined,
  speed = 1,
  grain = 0.5,
  paused = false,
  className,
  children,
}: SketchToPhotoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ paperColor, inkColor, lineWeight, lineDetail, progress, autoplay, speed, grain, paused });
  settings.current = { paperColor, inkColor, lineWeight, lineDetail, progress, autoplay, speed, grain, paused };
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
    const uTexRes = u("uTexRes");
    const uPaper = u("uPaper");
    const uInk = u("uInk");
    const uProgress = u("uProgress");
    const uStep = u("uStep");
    const uThreshold = u("uThreshold");
    const uHatch = u("uHatch");
    const uGrain = u("uGrain");
    const uDpr = u("uDpr");

    const texture = gl.createTexture();
    let loaded = false;
    let shown = 0;
    let clock = 0;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let settled = 0;

    const recolor = () => {
      const s = settings.current;
      const paper = resolveColor(root, s.paperColor);
      const ink = resolveColor(root, s.inkColor);
      gl.uniform3f(uPaper, paper[0], paper[1], paper[2]);
      gl.uniform3f(uInk, ink[0], ink[1], ink[2]);
    };

    const target = () => {
      const s = settings.current;
      if (reduce) return s.autoplay || s.progress === undefined ? 1 : clamp01(s.progress);
      if (s.autoplay) return loopProgress(clock);
      return clamp01(s.progress ?? 1);
    };

    const draw = () => {
      if (!loaded) return;
      const s = settings.current;
      const weight = clamp01(s.lineWeight);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uProgress, shown);
      gl.uniform1f(uStep, (0.7 + weight * 1.6) * dpr);
      gl.uniform1f(uThreshold, 0.34 - clamp01(s.lineDetail) * 0.26);
      gl.uniform1f(uHatch, weight);
      gl.uniform1f(uGrain, clamp01(s.grain));
      gl.uniform1f(uDpr, dpr);
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
      const dt = (delta / 1000) * Math.max(0, s.speed);
      clock += dt;
      const goal = target();
      shown += (goal - shown) * (s.autoplay ? 1 : 1 - Math.exp(-dt * 5));
      draw();
      // A driven piece stops drawing once it has caught up with its progress
      if (!s.autoplay && Math.abs(goal - shown) < 0.0005) {
        shown = goal;
        draw();
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      const s = settings.current;
      if (!loaded) return;
      if (reduce || s.paused) {
        if (reduce) shown = target();
        draw();
        return;
      }
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    redraw.current = (withColors = false) => {
      if (withColors) recolor();
      play();
    };

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform2f(uTexRes, image.naturalWidth, image.naturalHeight);
      loaded = true;
      const s = settings.current;
      shown = reduce ? target() : s.autoplay ? 0 : clamp01(s.progress ?? 1);
      recolor();
      resize();
      setReady(true);
      play();
    };
    image.onerror = () => setFailed(true);
    image.src = imageSrc;

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
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      redraw.current = () => {};
      image.onload = null;
      image.onerror = null;
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [imageSrc, reduce]);

  useEffect(() => {
    redraw.current(true);
  }, [paperColor, inkColor]);

  useEffect(() => {
    redraw.current(false);
  }, [lineWeight, lineDetail, progress, autoplay, speed, grain, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      {imageAlt && <span className="sr-only">{imageAlt}</span>}
      {failed ? (
        <img src={imageSrc} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
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
