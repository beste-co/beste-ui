"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface KaleidoscopeProps {
  /** Photo folded into the pattern. Loaded with CORS so WebGL can read it. */
  src: string;
  /** Description of the photo for screen readers. */
  alt?: string;
  /** Number of mirrored segments, 6 to 12. */
  segments?: number;
  /** Speed of the slow turn and drift, 1 is the default pace. */
  speed?: number;
  /** How close the tube looks into the photo, 0 (wide) to 1 (tight). */
  zoom?: number;
  /** How far the view wanders over the photo, 0 (still) to 1 (roaming). */
  drift?: number;
  /** A thin glass rim around the circle. */
  rim?: boolean;
  /** Darkening toward the edge of the tube, 0 to 1. */
  vignette?: number;
  /** The cursor turns and zooms the tube. */
  interactive?: boolean;
  /** Hold the pattern where it is. */
  paused?: boolean;
  /** Circle (looking into a tube) or a full rectangle of pattern. */
  round?: boolean;
  className?: string;
  children?: ReactNode;
}

export const kaleidoscopeDemo: KaleidoscopeProps = {
  src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=2400&q=80",
  alt: "Orange poppies against a clear blue sky",
  segments: 8,
  speed: 1,
  zoom: 0.5,
  drift: 0.5,
  rim: true,
  vignette: 0.5,
  interactive: true,
  round: true,
  className: "aspect-square w-full max-w-[560px]",
};

const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uTexRes;
uniform sampler2D uTex;
uniform float uSegments;
uniform float uAngle;
uniform vec2 uCenter;
uniform float uScale;
uniform float uRound;
uniform float uRim;
uniform float uVignette;

vec3 fold(vec2 p,float r){
  float seg=6.2831853/uSegments;
  float a=mod(atan(p.y,p.x)+uAngle,seg);
  a=abs(a-seg*.5);
  vec2 q=vec2(cos(a),sin(a))*r;
  vec2 uv=uCenter+vec2(q.x*uTexRes.y/uTexRes.x,q.y)*uScale;
  return texture2D(uTex,clamp(uv,.001,.999)).rgb;
}
void main(){
  float unit=.5*(uRound>.5?min(uRes.x,uRes.y):max(uRes.x,uRes.y));
  vec2 p=(gl_FragCoord.xy-.5*uRes)/unit;
  float r=length(p);
  // Only the rim splits colors, like light bending at the edge of the glass
  float split=smoothstep(.72,1.,r)*.014*uRim*uRound;
  vec3 col=vec3(fold(p,r*(1.+split)).r,fold(p,r).g,fold(p,r*(1.-split)).b);
  col*=1.-uVignette*.6*smoothstep(.3,1.05,r);
  float alpha=1.;
  if(uRound>.5){
    float aa=1.5/unit;
    alpha=1.-smoothstep(1.-aa,1.,r);
    float band=smoothstep(.95,.972,r)*(1.-smoothstep(.985,1.,r));
    col*=1.-smoothstep(.9,.975,r)*.28*uRim;
    col=mix(col,vec3(1.),band*.28*uRim);
    col+=pow(max(0.,dot(p/max(r,.001),vec2(-.6,.8))),10.)*band*.55*uRim;
  }
  gl_FragColor=vec4(col*alpha,alpha);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function Kaleidoscope({
  src,
  alt,
  segments = 8,
  speed = 1,
  zoom = 0.5,
  drift = 0.5,
  rim = true,
  vignette = 0.5,
  interactive = true,
  paused = false,
  round = true,
  className,
  children,
}: KaleidoscopeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ segments, speed, zoom, drift, rim, vignette, interactive, paused, round });
  settings.current = { segments, speed, zoom, drift, rim, vignette, interactive, paused, round };
  const redraw = useRef<() => void>(() => {});

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
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
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
    const uSegments = u("uSegments");
    const uAngle = u("uAngle");
    const uCenter = u("uCenter");
    const uScale = u("uScale");
    const uRound = u("uRound");
    const uRim = u("uRim");
    const uVignette = u("uVignette");

    const texture = gl.createTexture();
    const pointer = { x: 0.5, y: 0.5, inside: false };
    // Spring-smoothed turn and zoom; the cursor sets the targets, the loop eases toward them
    const turn = { value: 0, velocity: 0, target: 0 };
    const lens = { value: 1, velocity: 0, target: 1 };
    let spin = 0.35;
    let texAspect = 1.5;
    let time = 0;
    let loaded = false;
    let frame = 0;
    let visible = true;
    let quality = 1;
    let ceiling = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let settled = 0;

    const spring = (state: { value: number; velocity: number; target: number }, dt: number) => {
      state.velocity += ((state.target - state.value) * 40 - state.velocity * 11) * dt;
      state.value += state.velocity * dt;
    };

    const draw = () => {
      if (!loaded) return;
      const s = settings.current;
      const wander = clamp01(s.drift) * 0.2;
      const scale = Math.min(0.48, (0.42 - clamp01(s.zoom) * 0.3) * lens.value);
      // Keep the whole sampling window inside the photo whatever the zoom and drift
      const my = Math.min(0.5, scale * 1.02);
      const mx = Math.min(0.5, (scale * 1.02) / texAspect);
      const cx = Math.min(1 - mx, Math.max(mx, 0.5 + Math.sin(time * 0.061) * wander + Math.sin(time * 0.023 + 1.7) * wander * 0.5));
      const cy = Math.min(1 - my, Math.max(my, 0.5 + Math.cos(time * 0.047 + 0.4) * wander * 0.9));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uSegments, Math.round(Math.min(12, Math.max(6, s.segments))));
      gl.uniform1f(uAngle, spin + turn.value);
      gl.uniform2f(uCenter, cx, cy);
      gl.uniform1f(uScale, scale);
      gl.uniform1f(uRound, s.round ? 1 : 0);
      gl.uniform1f(uRim, s.rim ? 1 : 0);
      gl.uniform1f(uVignette, clamp01(s.vignette));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
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
      const dt = delta / 1000;
      time += dt * s.speed;
      spin += dt * s.speed * 0.07;
      const hover = s.interactive && pointer.inside;
      turn.target = hover ? (pointer.x - 0.5) * Math.PI * 0.8 : turn.target * 0.995;
      lens.target = hover ? 0.7 + (1 - pointer.y) * 0.7 : 1;
      spring(turn, dt);
      spring(lens, dt);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (loaded && !reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    redraw.current = () => {
      play();
      draw();
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
      texAspect = image.naturalWidth / Math.max(1, image.naturalHeight);
      loaded = true;
      draw();
      setReady(true);
      play();
    };
    image.onerror = () => setFailed(true);
    image.src = src;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      const y = (event.clientY - rect.top) / Math.max(1, rect.height);
      pointer.inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      if (pointer.inside) {
        pointer.x = x;
        pointer.y = y;
      }
      if (reduce || settings.current.paused) {
        turn.value = turn.target = pointer.inside ? (pointer.x - 0.5) * Math.PI * 0.8 : turn.value;
        draw();
      }
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
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      redraw.current = () => {};
      image.onload = null;
      image.onerror = null;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src, reduce]);

  useEffect(() => {
    redraw.current();
  }, [segments, speed, zoom, drift, rim, vignette, interactive, paused, round]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", round && "rounded-full", className)}>
      {alt && <span className="sr-only">{alt}</span>}
      {failed ? (
        <img src={src} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 size-full transition-opacity duration-[1400ms]", ready ? "opacity-100" : "opacity-0")}
        />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
