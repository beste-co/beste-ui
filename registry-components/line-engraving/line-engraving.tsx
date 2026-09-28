"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface LineEngravingProps {
  /** Photo the engraving is cut from. Loaded with CORS so WebGL can read it. Portraits on a plain ground engrave best. */
  imageSrc: string;
  /** Description of the photo for screen readers. */
  imageAlt?: string;
  /** Color of the printed lines. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color of the paper. */
  paperColor?: string;
  /** How close the lines sit, 0 (open) to 1 (very fine). */
  density?: number;
  /** Direction the lines run, in degrees. */
  angle?: number;
  /** How far the lines bend to follow the form, 0 (straight) to 1. */
  contour?: number;
  /** Second set of crossing lines in the deepest shadows, 0 (none) to 1. */
  crossHatch?: number;
  /** Strength and size of the loupe that follows the cursor with finer lines, 0 (off) to 1. */
  loupe?: number;
  /** Pace of the draw-in and the slow drift of the lines, 1 is the default. */
  speed?: number;
  /** Paper grain, 0 to 1. */
  grain?: number;
  /** Pressed plate mark around the engraving, like an intaglio print. */
  plateMark?: boolean;
  /** Follow the cursor with the loupe. */
  interactive?: boolean;
  /** Freeze on the current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const lineEngravingDemo: LineEngravingProps = {
  imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=1500&fit=crop&q=80",
  imageAlt: "Portrait of a bearded man in a dark shirt",
  inkColor: "#18222f",
  paperColor: "#f3eee3",
  density: 0.55,
  angle: 28,
  contour: 0.5,
  crossHatch: 0.6,
  loupe: 0.6,
  speed: 1,
  grain: 0.4,
  plateMark: true,
  interactive: true,
  className: "aspect-[4/5] w-full max-w-md",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragmentBody = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uTexRes;
uniform sampler2D uTex;
uniform vec3 uPaper;
uniform vec3 uInk;
uniform float uSpacing;
uniform vec2 uDir;
uniform vec2 uAlong;
uniform vec2 uAlong2;
uniform float uContour;
uniform float uCross;
uniform float uGrain;
uniform float uDpr;
uniform float uTime;
uniform float uDraw;
uniform float uPlate;
uniform vec4 uLoupe;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}

vec2 cover(vec2 uv){
  float ra=uRes.x/uRes.y,ta=uTexRes.x/uTexRes.y;
  vec2 s=ra>ta?vec2(1.,ta/ra):vec2(ra/ta,1.);
  return (uv-.5)*s+.5;
}
float lum(vec2 uv){return dot(texture2D(uTex,clamp(uv,0.,1.)).rgb,vec3(.299,.587,.114));}

// Coverage of one engraved line inside its period; keeps the average tone right when the line is thinner than a pixel
float line(float phase,float w,float aa){
  float d=abs(fract(phase)-.5);
  float wide=max(w,aa);
  return clamp((wide-d)/(2.*aa)+.5,0.,1.)*(w/wide);
}

void main(){
  vec2 frag=gl_FragCoord.xy;
  vec2 uv=frag/uRes;
  float asp=uRes.x/uRes.y;
  vec2 tuv=cover(uv);
  vec2 px=cover(uv+1./uRes)-tuv;

  // Loupe: a soft gaussian around the cursor, no edge
  vec2 dl=frag-uLoupe.xy;
  float m=exp(-dot(dl,dl)/(uLoupe.z*uLoupe.z))*uLoupe.w;

  // Tone from a small blur, sharper under the loupe
  vec2 a=px*uSpacing*.6;
  float center=lum(tuv);
  float tone=(center*2.+lum(tuv+vec2(a.x,0.))+lum(tuv-vec2(a.x,0.))+lum(tuv+vec2(0.,a.y))+lum(tuv-vec2(0.,a.y)))/6.;
  tone=mix(tone,center,m*.7);

  // Contour field: a wide, soft luminance the lines bend around
  vec2 b=px*uSpacing*3.;
  vec2 c=px*uSpacing*6.5;
  float field=
    lum(tuv+vec2(b.x,0.))+lum(tuv-vec2(b.x,0.))+lum(tuv+vec2(0.,b.y))+lum(tuv-vec2(0.,b.y))+
    lum(tuv+c*vec2(.71,.71))+lum(tuv+c*vec2(-.71,.71))+lum(tuv+c*vec2(.71,-.71))+lum(tuv-c*vec2(.71,.71))+
    lum(tuv+vec2(c.x*1.3,0.))+lum(tuv-vec2(c.x*1.3,0.))+lum(tuv+vec2(0.,c.y*1.3))+lum(tuv-vec2(0.,c.y*1.3));
  field/=12.;

  float dk=smoothstep(.07,.93,1.-tone);
  dk=pow(dk,1.12);

  vec2 n=vec2(-uDir.y,uDir.x);
  float along=dot(frag,uDir);
  float an=(along-uAlong.x)/(uAlong.y-uAlong.x);
  float breath=.1*sin(uTime*.35+field*6.2832+along/(uSpacing*38.));

  // Main set: parallel lines bent by the field, swelling with the shadow
  float across=dot(frag,n);
  float phase=across/uSpacing+field*uContour+m*(across-dot(uLoupe.xy,n))/uSpacing+breath;
  float row=floor(phase);
  float drawn=clamp((uDraw*1.62-an-hash(vec2(row,3.1))*.34-.08)/.06,0.,1.);
  float w=mix(.05,.47,dk)*(.9+.2*noise(vec2(along/(uSpacing*7.),row*1.3)))*drawn;

  // Cross set: only where the shadow is deepest, drawn a beat later
  vec2 d2=vec2(uDir.x*.54-uDir.y*.84,uDir.x*.84+uDir.y*.54);
  vec2 n2=vec2(-d2.y,d2.x);
  float across2=dot(frag,n2);
  float phase2=across2/(uSpacing*1.08)+field*uContour*.6+m*(across2-dot(uLoupe.xy,n2))/uSpacing-breath*.6;
  float an2=(dot(frag,d2)-uAlong2.x)/(uAlong2.y-uAlong2.x);
  float drawn2=clamp(((uDraw-.2)*1.9-an2-hash(vec2(floor(phase2),8.7))*.3)/.06,0.,1.);
  float w2=smoothstep(.56,.94,dk)*.34*uCross*drawn2;

#ifdef DERIV
  float aa=max(fwidth(phase)*.75,.002);
  float aa2=max(fwidth(phase2)*.75,.002);
#else
  float aa=.75*(1.+m)/uSpacing;
  float aa2=aa*1.08;
#endif

  float c1=line(phase,w,aa);
  float c2=line(phase2,w2,aa2);
  float cov=1.-(1.-c1)*(1.-c2);

  // Plate: faint wiped tone inside, pressed bevel at the edge, lines only inside
  vec2 e=min(frag,uRes-frag);
  float edge=min(e.x,e.y)-uPlate;
  float inside=uPlate>0.?smoothstep(-.8*uDpr,.8*uDpr,edge):1.;
  cov*=inside;

  // Paper: fibers and grain
  vec2 q=vec2(uv.x*asp,uv.y);
  float fiber=fbm(q*vec2(8.,22.))*.6+fbm(q*40.)*.4;
  float g=(hash(frag)-hash(frag+71.3))*uGrain;
  vec3 paper=uPaper*(1.-.035*fiber)+g*.03;
  if(uPlate>0.){
    paper=mix(paper,mix(paper,uInk,.03),inside);
    float rim=exp(-pow(edge/(1.6*uDpr),2.));
    float side=e.x<e.y?(frag.x<uRes.x*.5?-1.:1.):(frag.y>uRes.y*.5?-1.:1.);
    paper*=1.-.07*rim*side;
  }

  // Ink: a little uneven along the cut, like a real pull
  float inkAmt=.86+.14*noise(frag*.3/uDpr);
  vec3 col=mix(paper,uInk,clamp(cov*inkAmt,0.,1.));
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
const DRAW_SECONDS = 3.4;

export function LineEngraving({
  imageSrc,
  imageAlt,
  inkColor = "#18222f",
  paperColor = "#f3eee3",
  density = 0.55,
  angle = 28,
  contour = 0.5,
  crossHatch = 0.6,
  loupe = 0.6,
  speed = 1,
  grain = 0.4,
  plateMark = true,
  interactive = true,
  paused = false,
  className,
  children,
}: LineEngravingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const settings = useRef({ inkColor, paperColor, density, angle, contour, crossHatch, loupe, speed, grain, plateMark, interactive, paused });
  settings.current = { inkColor, paperColor, density, angle, contour, crossHatch, loupe, speed, grain, plateMark, interactive, paused };
  const refresh = useRef<(recolor?: boolean) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false });
    if (!canvas || !root || !gl) return setFailed(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const deriv = gl.getExtension("OES_standard_derivatives");
    const fragment = (deriv ? "#extension GL_OES_standard_derivatives : enable\n#define DERIV\n" : "") + fragmentBody;
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
    const uSpacing = u("uSpacing");
    const uDir = u("uDir");
    const uAlong = u("uAlong");
    const uAlong2 = u("uAlong2");
    const uContour = u("uContour");
    const uCross = u("uCross");
    const uGrain = u("uGrain");
    const uDpr = u("uDpr");
    const uTime = u("uTime");
    const uDraw = u("uDraw");
    const uPlate = u("uPlate");
    const uLoupe = u("uLoupe");

    const texture = gl.createTexture();
    let loaded = false;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let settled = 0;
    let time = 0;
    let drawRaw = reduce ? 1 : 0;
    // Pointer in CSS px relative to the canvas; the loupe eases toward it
    let pointerX = 0;
    let pointerY = 0;
    let inside = false;
    let loupeX = 0;
    let loupeY = 0;
    let loupeAmount = 0;
    let skip = false;

    const recolor = () => {
      const s = settings.current;
      const paper = resolveColor(root, s.paperColor);
      const ink = resolveColor(root, s.inkColor);
      gl.uniform3f(uPaper, paper[0], paper[1], paper[2]);
      gl.uniform3f(uInk, ink[0], ink[1], ink[2]);
    };

    const draw = () => {
      if (!loaded) return;
      const s = settings.current;
      const w = canvas.width;
      const h = canvas.height;
      const rad = (s.angle * Math.PI) / 180;
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);
      // The cross set runs about 57 degrees from the main one, matching the shader
      const ex = dx * 0.54 - dy * 0.84;
      const ey = dx * 0.84 + dy * 0.54;
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uDir, dx, dy);
      gl.uniform2f(uAlong, Math.min(0, w * dx, h * dy, w * dx + h * dy), Math.max(0, w * dx, h * dy, w * dx + h * dy) + 1);
      gl.uniform2f(uAlong2, Math.min(0, w * ex, h * ey, w * ex + h * ey), Math.max(0, w * ex, h * ey, w * ex + h * ey) + 1);
      gl.uniform1f(uSpacing, (9 - clamp01(s.density) * 5.4) * dpr);
      gl.uniform1f(uContour, clamp01(s.contour) * 10);
      gl.uniform1f(uCross, clamp01(s.crossHatch));
      gl.uniform1f(uGrain, clamp01(s.grain));
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uDraw, easeInOut(clamp01(drawRaw)));
      gl.uniform1f(uPlate, s.plateMark ? Math.max(10, Math.min(w, h) * 0.035) : 0);
      const scale = canvas.clientWidth ? w / canvas.clientWidth : dpr;
      gl.uniform4f(uLoupe, loupeX * scale, h - loupeY * scale, (80 + clamp01(s.loupe) * 110) * scale, loupeAmount);
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
      frame = requestAnimationFrame(loop);
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      lastFrame = now;
      const s = settings.current;
      const dt = delta / 1000;
      const pace = Math.max(0, s.speed);
      const loupeGoal = inside && s.interactive ? clamp01(s.loupe) : 0;
      const busy = drawRaw < 1 || Math.abs(loupeGoal - loupeAmount) > 0.002 || (loupeAmount > 0.002 && (Math.abs(pointerX - loupeX) > 0.3 || Math.abs(pointerY - loupeY) > 0.3));

      time += dt * pace;
      drawRaw = Math.min(1, drawRaw + (dt * pace) / DRAW_SECONDS);
      const follow = 1 - Math.exp(-dt * 10);
      loupeX += (pointerX - loupeX) * follow;
      loupeY += (pointerY - loupeY) * follow;
      loupeAmount += (loupeGoal - loupeAmount) * (1 - Math.exp(-dt * 5));

      // The drift is slow, so a still engraving renders at 30fps
      skip = busy ? false : !skip;
      if (skip) return;

      average += (delta - average) * 0.05;
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
      draw();
    };

    const play = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      if (!loaded) return;
      if (reduce || settings.current.paused) {
        draw();
        return;
      }
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    refresh.current = (withColors = false) => {
      if (withColors) recolor();
      play();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const within = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (within && !inside && loupeAmount < 0.01) {
        loupeX = x;
        loupeY = y;
      }
      inside = within;
      pointerX = x;
      pointerY = y;
    };
    const onLeave = () => {
      inside = false;
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
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    // Themes can be scoped to any wrapper, not just <html>, so every ancestor is watched for token changes
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        refresh.current(true);
      });
    });
    for (let node = root.parentElement; node; node = node.parentElement) {
      mo.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    }
    canvas.addEventListener("webglcontextlost", onLost);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      refresh.current = () => {};
      image.onload = null;
      image.onerror = null;
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [imageSrc]);

  useEffect(() => {
    refresh.current(true);
  }, [inkColor, paperColor]);

  useEffect(() => {
    refresh.current(false);
  }, [density, angle, contour, crossHatch, loupe, speed, grain, plateMark, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      {imageAlt && <span className="sr-only">{imageAlt}</span>}
      {failed ? (
        <img
          src={imageSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-80 mix-blend-multiply grayscale contrast-125"
        />
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
