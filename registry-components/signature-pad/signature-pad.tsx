"use client";

import * as React from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Surface treatment of the pad. */
type Tone = "muted" | "outline" | "ghost";

/** Height and control density. */
type Size = "sm" | "default" | "lg";

/** One sampled point. `x` and `y` are fractions of the pad's width, so strokes survive any resize. */
export interface SignaturePoint {
  x: number;
  y: number;
  /** Milliseconds since the stroke began. */
  t: number;
  /** Pen pressure, 0 to 1. Left out for mouse and touch, which report no real pressure. */
  p?: number;
}

export type SignatureStroke = SignaturePoint[];

/** A drawn signature: its strokes, oldest first. */
export type SignatureData = SignatureStroke[];

export interface SignaturePadHandle {
  clear: () => void;
  undo: () => void;
  isEmpty: () => boolean;
  /** PNG (or `type`) of the pad at its current size, transparent behind the ink. */
  toDataURL: (type?: string) => string;
  toSvg: () => string;
}

interface SignaturePadProps {
  value?: SignatureData;
  defaultValue?: SignatureData;
  /** Fires when a stroke ends, and on undo and clear. */
  onChange?: (value: SignatureData) => void;
  /** Ink color, any CSS color. Defaults to the foreground token and follows theme switches. */
  color?: string;
  /** Thinnest line in px, reached on fast strokes. */
  minWidth?: number;
  /** Thickest line in px, reached on slow strokes or full pen pressure. */
  maxWidth?: number;
  /** Faint text on the empty pad. */
  placeholder?: string;
  /** The dashed line and the × the signer writes on. */
  showBaseline?: boolean;
  /** Accessible name of the pad. */
  label?: string;
  disabled?: boolean;
  size?: Size;
  tone?: Tone;
  className?: string;
  ref?: React.Ref<SignaturePadHandle>;
}

export const signaturePadDemo: SignaturePadProps = {
  placeholder: "Sign here",
  label: "Signature of Nina Simone",
  minWidth: 0.8,
  maxWidth: 3.2,
  className: "max-w-xl",
};

const EMPTY: SignatureData = [];

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted",
  outline: "border border-border bg-background",
  ghost: "border border-dashed border-border/70",
};

const sizeStyles: Record<Size, { pad: string; bar: string }> = {
  sm: { pad: "h-32", bar: "gap-1 px-2 pb-2" },
  default: { pad: "h-44", bar: "gap-1.5 px-3 pb-3" },
  lg: { pad: "h-56", bar: "gap-2 px-4 pb-4" },
};

/** True when nothing was drawn. */
export function isEmpty(data: SignatureData | undefined) {
  return !data || data.length === 0;
}

/**
 * Stroke width at each point: slow strokes run thick and fast ones thin, like ink,
 * unless a pen reports real pressure. The same maths runs live and on every redraw.
 */
function stepWidth(
  prev: SignaturePoint | undefined,
  point: SignaturePoint,
  velocity: number,
  scale: number,
  minWidth: number,
  maxWidth: number,
) {
  if (point.p !== undefined) return { width: minWidth + (maxWidth - minWidth) * point.p, velocity };
  let next = velocity;
  if (prev) {
    const distance = Math.hypot(point.x - prev.x, point.y - prev.y) * scale;
    next = 0.7 * (distance / Math.max(1, point.t - prev.t)) + 0.3 * velocity;
  }
  return { width: Math.max(minWidth, maxWidth / (next * 1.6 + 1)), velocity: next };
}

function widthsFor(stroke: SignatureStroke, scale: number, minWidth: number, maxWidth: number) {
  const widths: number[] = [];
  let velocity = 0;
  for (let i = 0; i < stroke.length; i++) {
    const point = stroke[i];
    if (!point) continue;
    const step = stepWidth(stroke[i - 1], point, velocity, scale, minWidth, maxWidth);
    velocity = step.velocity;
    widths.push(step.width);
  }
  return widths;
}

/** Walks a stroke as quadratic curves through the midpoints, the smoothing both renderers share. */
function eachSegment(
  stroke: SignatureStroke,
  widths: number[],
  scale: number,
  draw: (from: [number, number], control: [number, number], to: [number, number], width: number) => void,
) {
  const at = (i: number): [number, number] => [(stroke[i]?.x ?? 0) * scale, (stroke[i]?.y ?? 0) * scale];
  const mid = (i: number): [number, number] => {
    const a = at(i - 1);
    const b = at(i);
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  };
  for (let i = 1; i < stroke.length; i++) {
    const from = i === 1 ? at(0) : mid(i - 1);
    const to = i === stroke.length - 1 ? at(i) : mid(i);
    draw(from, at(i - 1), to, ((widths[i - 1] ?? 1) + (widths[i] ?? 1)) / 2);
  }
}

function paintStroke(ctx: CanvasRenderingContext2D, stroke: SignatureStroke, scale: number, minWidth: number, maxWidth: number) {
  const widths = widthsFor(stroke, scale, minWidth, maxWidth);
  const first = stroke[0];
  if (!first) return;
  if (stroke.length === 1) {
    ctx.beginPath();
    ctx.arc(first.x * scale, first.y * scale, (widths[0] ?? maxWidth) * 0.6, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  eachSegment(stroke, widths, scale, (from, control, to, width) => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.moveTo(from[0], from[1]);
    ctx.quadraticCurveTo(control[0], control[1], to[0], to[1]);
    ctx.stroke();
  });
}

const escapeXml = (text: string) => text.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
const round = (n: number) => Math.round(n * 100) / 100;

/** The signature as a standalone SVG string: one path per curve. */
export function toSvg(data: SignatureData, { width = 600, height = 200, color = "#111", minWidth = 0.8, maxWidth = 3.2 } = {}) {
  const open = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  const parts: string[] = [];
  for (const stroke of data) {
    const first = stroke[0];
    if (!first) continue;
    const widths = widthsFor(stroke, width, minWidth, maxWidth);
    if (stroke.length === 1) {
      parts.push(`<circle cx="${round(first.x * width)}" cy="${round(first.y * width)}" r="${round((widths[0] ?? maxWidth) * 0.6)}" fill="${escapeXml(color)}" stroke="none"/>`);
      continue;
    }
    eachSegment(stroke, widths, width, (from, control, to, w) => {
      parts.push(
        `<path d="M${round(from[0])} ${round(from[1])}Q${round(control[0])} ${round(control[1])} ${round(to[0])} ${round(to[1])}" stroke-width="${round(w)}"/>`,
      );
    });
  }
  return `${open}<g fill="none" stroke="${escapeXml(color)}" stroke-linecap="round" stroke-linejoin="round">${parts.join("")}</g></svg>`;
}

/** The signature rasterized off screen, for a form upload or an `<img>`. Client only. */
export function toDataURL(
  data: SignatureData,
  { width = 600, height = 200, color = "#111", minWidth = 0.8, maxWidth = 3.2, type = "image/png", pixelRatio = 2 } = {},
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.scale(pixelRatio, pixelRatio);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const stroke of data) paintStroke(ctx, stroke, width, minWidth, maxWidth);
  return canvas.toDataURL(type);
}

export function SignaturePad({
  value,
  defaultValue,
  onChange,
  color,
  minWidth = 0.8,
  maxWidth = 3.2,
  placeholder = "Sign here",
  showBaseline = true,
  label = "Signature",
  disabled = false,
  size = "default",
  tone = "muted",
  className,
  ref,
}: SignaturePadProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const statusId = React.useId();
  const [inner, setInner] = React.useState<SignatureData>(defaultValue ?? EMPTY);
  const data = value ?? inner;
  const [drawing, setDrawing] = React.useState(false);
  const live = React.useRef<{ stroke: SignatureStroke; widths: number[]; velocity: number; start: number; id: number } | null>(null);
  const geometry = React.useRef({ width: 0, height: 0, ink: "#111" });

  const commit = React.useCallback(
    (next: SignatureData) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    },
    [value, onChange],
  );

  const context = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return null;
    ctx.fillStyle = geometry.current.ink;
    ctx.strokeStyle = geometry.current.ink;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    return ctx;
  };

  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { width, height } = geometry.current;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = geometry.current.ink;
    ctx.strokeStyle = geometry.current.ink;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const stroke of data) paintStroke(ctx, stroke, width, minWidth, maxWidth);
    if (live.current) paintStroke(ctx, live.current.stroke, width, minWidth, maxWidth);
  }, [data, minWidth, maxWidth]);

  const redrawRef = React.useRef(redraw);
  redrawRef.current = redraw;

  // DPR-correct backing store; strokes are stored in width fractions, so a resize only needs a repaint
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resolveInk = () => {
      if (color) {
        canvas.style.color = color;
        geometry.current.ink = getComputedStyle(canvas).color;
        canvas.style.color = "";
      } else {
        geometry.current.ink = getComputedStyle(canvas).color;
      }
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      geometry.current.width = rect.width;
      geometry.current.height = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      redrawRef.current();
    };
    resolveInk();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      resolveInk();
      redrawRef.current();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [color]);

  React.useEffect(() => {
    redraw();
  }, [redraw]);

  const pointFrom = (event: PointerEvent | React.PointerEvent, start: number): SignaturePoint => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    const width = rect?.width || 1;
    const point: SignaturePoint = {
      x: (event.clientX - (rect?.left ?? 0)) / width,
      y: (event.clientY - (rect?.top ?? 0)) / width,
      t: Math.round(event.timeStamp - start),
    };
    if (event.pointerType === "pen" && event.pressure > 0) point.p = Math.min(1, event.pressure);
    return point;
  };

  // Paints only the newest curve while drawing, so long strokes stay cheap
  const extend = (points: SignaturePoint[]) => {
    const current = live.current;
    const ctx = context();
    if (!current || !ctx) return;
    const { width } = geometry.current;
    for (const point of points) {
      const last = current.stroke.at(-1);
      if (last && Math.hypot(point.x - last.x, point.y - last.y) * width < 0.75) continue;
      const step = stepWidth(last, point, current.velocity, width, minWidth, maxWidth);
      current.velocity = step.velocity;
      current.stroke.push(point);
      current.widths.push(step.width);
      // Segment s is final once point s exists; the same curve eachSegment draws on a repaint
      const s = current.stroke.length - 2;
      if (s < 1) continue;
      const a = current.stroke[s - 2];
      const b = current.stroke[s - 1];
      const c = current.stroke[s];
      if (!b || !c) continue;
      const from: [number, number] = s === 1 || !a ? [b.x * width, b.y * width] : [((a.x + b.x) / 2) * width, ((a.y + b.y) / 2) * width];
      ctx.beginPath();
      ctx.lineWidth = ((current.widths[s - 1] ?? 1) + (current.widths[s] ?? 1)) / 2;
      ctx.moveTo(from[0], from[1]);
      ctx.quadraticCurveTo(b.x * width, b.y * width, ((b.x + c.x) / 2) * width, ((b.y + c.y) / 2) * width);
      ctx.stroke();
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || live.current) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
    const start = event.timeStamp;
    const first = pointFrom(event, start);
    live.current = { stroke: [first], widths: [stepWidth(undefined, first, 0, geometry.current.width, minWidth, maxWidth).width], velocity: 0, start, id: event.pointerId };
    setDrawing(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const current = live.current;
    if (!current || current.id !== event.pointerId) return;
    const native = event.nativeEvent;
    const samples = typeof native.getCoalescedEvents === "function" ? native.getCoalescedEvents() : [];
    extend((samples.length > 0 ? samples : [native]).map((sample) => pointFrom(sample, current.start)));
  };

  const finish = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const current = live.current;
    if (!current || current.id !== event.pointerId) return;
    live.current = null;
    setDrawing(false);
    commit([...data, current.stroke]);
  };

  const undo = React.useCallback(() => {
    if (data.length > 0) commit(data.slice(0, -1));
  }, [data, commit]);

  const clear = React.useCallback(() => {
    commit(EMPTY);
  }, [commit]);

  React.useImperativeHandle(
    ref,
    () => ({
      clear,
      undo,
      isEmpty: () => data.length === 0,
      toDataURL: (type = "image/png") => {
        const { width, height, ink } = geometry.current;
        return toDataURL(data, { width, height, color: ink, minWidth, maxWidth, type });
      },
      toSvg: () => {
        const { width, height, ink } = geometry.current;
        return toSvg(data, { width, height, color: ink, minWidth, maxWidth });
      },
    }),
    [clear, undo, data, minWidth, maxWidth],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && !event.shiftKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      undo();
    }
  };

  const strokeCount = data.length;
  const empty = strokeCount === 0 && !drawing;
  const status = strokeCount === 0 ? "Signature pad is empty" : `Signature drawn, ${strokeCount} stroke${strokeCount === 1 ? "" : "s"}`;

  const button =
    "inline-flex h-9 cursor-pointer select-none items-center gap-1.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

  return (
    <div
      data-slot="signature-pad"
      data-empty={empty}
      data-disabled={disabled || undefined}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-xl text-foreground",
        toneStyles[tone],
        disabled && "opacity-60",
        className,
      )}
    >
      <div className={cn("relative w-full", sizeStyles[size].pad)}>
        {showBaseline && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 bottom-[26%] flex select-none items-end gap-2">
            <span className="text-lg leading-none text-muted-foreground/70">×</span>
            <span className="mb-0.5 h-px flex-1 border-b border-dashed border-muted-foreground/35" />
          </div>
        )}

        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 flex select-none items-center justify-center text-sm text-muted-foreground/70 transition-opacity duration-300",
            empty ? "opacity-100" : "opacity-0",
          )}
        >
          {placeholder}
        </span>
        <canvas
          ref={canvasRef}
          role="img"
          tabIndex={disabled ? -1 : 0}
          aria-label={label}
          aria-describedby={statusId}
          aria-disabled={disabled || undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finish}
          onPointerCancel={finish}
          onKeyDown={onKeyDown}
          className={cn(
            "absolute inset-0 size-full touch-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            disabled ? "cursor-not-allowed" : "cursor-crosshair",
          )}
          style={{ color: color || undefined }}
        />
      </div>

      <div className={cn("flex items-center", sizeStyles[size].bar)}>
        <span id={statusId} className="min-w-0 flex-1 truncate text-sm text-muted-foreground select-none" aria-live="polite">
          {status}
        </span>
        <button type="button" className={button} onClick={undo} disabled={disabled || strokeCount === 0} aria-keyshortcuts="Control+Z Meta+Z">
          <RotateCcw className="size-4" aria-hidden="true" />
          <span className="max-sm:sr-only">Undo</span>
        </button>
        <button type="button" className={button} onClick={clear} disabled={disabled || strokeCount === 0}>
          <Trash2 className="size-4" aria-hidden="true" />
          <span className="max-sm:sr-only">Clear</span>
        </button>
      </div>
    </div>
  );
}
