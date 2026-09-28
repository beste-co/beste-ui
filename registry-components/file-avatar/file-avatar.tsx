"use client";

import { Camera, Check, Trash2, X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the avatar and its buttons. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Avatar and crop area size. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

export interface FileAvatarResult {
  /** The cropped square image. */
  blob: Blob;
  /** The same image as a data URL, ready for an `<img>`. */
  dataUrl: string;
  /** The file the crop was made from. */
  file: File;
}

export interface FileAvatarProps {
  /** Image shown in the avatar, controlled. `null` shows the initials. */
  value?: string | null;
  /** Image shown at first, uncontrolled. */
  defaultValue?: string | null;
  /** A saved crop, or `null` when the avatar is removed. */
  onChange?: (result: FileAvatarResult | null) => void;
  /** Whose avatar it is: initials when there is no image, and part of every accessible name. */
  name?: string;
  /** Round avatar or a rounded square. */
  shape?: "circle" | "rounded";
  /** Width and height of the saved image, in pixels. */
  outputSize?: number;
  /** Format of the saved image. */
  outputType?: "image/png" | "image/jpeg" | "image/webp";
  /** Quality for jpeg and webp, 0 to 1. */
  quality?: number;
  /** Accepted files, like the native input's `accept`. */
  accept?: string;
  /** Largest file in bytes. */
  maxSize?: number;
  /** Upload progress, 0 to 1, drawn as a ring around the avatar. `null` hides it. */
  progress?: number | null;
  /** Offer a remove button when there is an image. */
  removable?: boolean;
  /** Line under the buttons, e.g. the accepted formats. */
  hint?: string;
  disabled?: boolean;
  tone?: Tone;
  size?: Size;
  className?: string;
}

export const fileAvatarDemo: FileAvatarProps = {
  name: "Björk",
  defaultValue: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=400&h=400&auto=format&fit=crop",
  accept: "image/png,image/jpeg,image/webp",
  maxSize: 5 * 1024 * 1024,
  hint: "PNG, JPG or WebP, up to 5 MB",
  onChange: (result) => console.log(result ? `Saved ${result.blob.size} bytes` : "Removed"),
  className: "w-fit",
};

// Soft ease-out for everything that follows the pointer or repeats; a spring overshoot would wobble here
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MAX_ZOOM = 4;

const toneStyles: Record<Tone, { avatar: string; button: string }> = {
  muted: { avatar: "bg-muted", button: "bg-muted hover:bg-muted/70" },
  outline: { avatar: "border border-border bg-background", button: "border border-border bg-background hover:bg-muted" },
  ghost: { avatar: "bg-muted/60", button: "hover:bg-muted" },
};

const sizeStyles: Record<Size, { avatar: number; crop: number; initials: string; button: string; icon: string }> = {
  sm: { avatar: 64, crop: 192, initials: "text-lg", button: "h-8 px-3 text-sm", icon: "size-4" },
  default: { avatar: 96, crop: 240, initials: "text-2xl", button: "h-9 px-3.5 text-sm", icon: "size-4" },
  lg: { avatar: 128, crop: 288, initials: "text-3xl", button: "h-10 px-4 text-base", icon: "size-5" },
};

/** First letters of the first and last word: "Nina Simone" is "NS", "Björk" is "B". */
export function initialsOf(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

/** Same rule as the native input's `accept`: extensions, `type/*` and exact types. */
function accepts(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => (rule.startsWith(".") ? name.endsWith(rule) : rule.endsWith("/*") ? type.startsWith(rule.slice(0, -1)) : type === rule));
}

const megabytes = (bytes: number) => `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;

interface Crop {
  zoom: number;
  x: number;
  y: number;
}

export function FileAvatar({
  value: valueProp,
  defaultValue = null,
  onChange,
  name = "",
  shape = "circle",
  outputSize = 256,
  outputType = "image/png",
  quality = 0.92,
  accept = "image/*",
  maxSize,
  progress = null,
  removable = true,
  hint,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
}: FileAvatarProps) {
  const [inner, setInner] = React.useState<string | null>(defaultValue);
  const image = valueProp === undefined ? inner : valueProp;
  const [source, setSource] = React.useState<{ file: File; url: string; width: number; height: number } | null>(null);
  const [error, setError] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const viewRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const zoomRef = React.useRef<HTMLInputElement>(null);
  const changeRef = React.useRef<HTMLButtonElement>(null);
  const crop = React.useRef<Crop>({ zoom: 1, x: 0, y: 0 });
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const hintId = React.useId();
  const errorId = React.useId();

  const s = sizeStyles[size];
  const t = toneStyles[tone];
  const radius = shape === "circle" ? "rounded-full" : "rounded-[22%]";
  const initials = initialsOf(name);
  const who = name ? `${name}'s avatar` : "Avatar";

  // The crop state lives in a ref and is written straight to the image, so dragging costs no renders
  const apply = React.useCallback(() => {
    const img = imgRef.current;
    if (!img || !source) return;
    const view = s.crop;
    const base = view / Math.min(source.width, source.height);
    const c = crop.current;
    const w = source.width * base * c.zoom;
    const h = source.height * base * c.zoom;
    c.x = Math.min((w - view) / 2, Math.max(-(w - view) / 2, c.x));
    c.y = Math.min((h - view) / 2, Math.max(-(h - view) / 2, c.y));
    img.style.width = `${w}px`;
    img.style.height = `${h}px`;
    img.style.transform = `translate(${view / 2 + c.x - w / 2}px, ${view / 2 + c.y - h / 2}px)`;
    if (zoomRef.current) zoomRef.current.value = String(c.zoom);
  }, [source, s.crop]);

  // Zooms around a point given relative to the crop area's center, so what is under it stays put
  const zoomTo = React.useCallback(
    (zoom: number, px = 0, py = 0) => {
      const c = crop.current;
      const next = Math.min(MAX_ZOOM, Math.max(1, zoom));
      const ratio = next / c.zoom;
      c.x = px + (c.x - px) * ratio;
      c.y = py + (c.y - py) * ratio;
      c.zoom = next;
      apply();
    },
    [apply],
  );

  React.useLayoutEffect(() => {
    if (!source) return;
    crop.current = { zoom: 1, x: 0, y: 0 };
    apply();
    viewRef.current?.focus({ preventScroll: true });
  }, [source, apply]);

  const close = React.useCallback(() => {
    setSource((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    requestAnimationFrame(() => changeRef.current?.focus({ preventScroll: true }));
  }, []);

  // Frees the picked file's object URL if the component goes away mid-crop
  const sourceRef = React.useRef(source);
  sourceRef.current = source;
  React.useEffect(() => () => {
    if (sourceRef.current) URL.revokeObjectURL(sourceRef.current.url);
  }, []);

  const open = (file: File | undefined) => {
    if (!file || disabled) return;
    if (!accepts(file, accept) || !file.type.startsWith("image/")) {
      setError(`${file.name} is not an image this avatar takes.`);
      return;
    }
    if (maxSize !== undefined && file.size > maxSize) {
      setError(`${file.name} is larger than ${megabytes(maxSize)}.`);
      return;
    }
    setError("");
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => setSource({ file, url, width: probe.naturalWidth, height: probe.naturalHeight });
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setError(`${file.name} could not be read as an image.`);
    };
    probe.src = url;
  };

  // Paste works while focus is anywhere inside the component
  React.useEffect(() => {
    if (disabled) return;
    const onPaste = (event: ClipboardEvent) => {
      if (!rootRef.current?.contains(document.activeElement)) return;
      const file = Array.from(event.clipboardData?.files ?? []).find((item) => item.type.startsWith("image/"));
      if (!file) return;
      event.preventDefault();
      open(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  });

  // Wheel zoom needs a non-passive listener to keep the page from scrolling
  React.useEffect(() => {
    const view = viewRef.current;
    if (!view || !source) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = view.getBoundingClientRect();
      zoomTo(crop.current.zoom * Math.exp(-event.deltaY * 0.0015), event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2);
    };
    view.addEventListener("wheel", onWheel, { passive: false });
    return () => view.removeEventListener("wheel", onWheel);
  }, [source, zoomTo]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const map = pointers.current;
    const prev = map.get(event.pointerId);
    if (!prev) return;
    const next = { x: event.clientX, y: event.clientY };
    if (map.size === 1) {
      crop.current.x += next.x - prev.x;
      crop.current.y += next.y - prev.y;
      map.set(event.pointerId, next);
      apply();
      return;
    }
    // Two fingers: the change in their distance zooms around their midpoint
    const [a, b] = [...map.values()];
    const other = a === prev ? b : a;
    if (!other) return;
    const before = Math.hypot(prev.x - other.x, prev.y - other.y) || 1;
    const after = Math.hypot(next.x - other.x, next.y - other.y) || 1;
    map.set(event.pointerId, next);
    const rect = event.currentTarget.getBoundingClientRect();
    zoomTo(crop.current.zoom * (after / before), (next.x + other.x) / 2 - rect.left - rect.width / 2, (next.y + other.y) / 2 - rect.top - rect.height / 2);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
  };

  const save = async () => {
    const img = imgRef.current;
    if (!img || !source || saving) return;
    setSaving(true);
    const view = s.crop;
    const scale = (view / Math.min(source.width, source.height)) * crop.current.zoom;
    const w = source.width * scale;
    const h = source.height * scale;
    const left = view / 2 + crop.current.x - w / 2;
    const top = view / 2 + crop.current.y - h / 2;
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setSaving(false);
      return;
    }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, -left / scale, -top / scale, view / scale, view / scale, 0, 0, outputSize, outputSize);
    const dataUrl = canvas.toDataURL(outputType, quality);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, quality));
    setSaving(false);
    if (!blob) return setError("The crop could not be saved.");
    if (valueProp === undefined) setInner(dataUrl);
    onChange?.({ blob, dataUrl, file: source.file });
    close();
  };

  const remove = () => {
    if (valueProp === undefined) setInner(null);
    onChange?.(null);
    setError("");
  };

  const onCropKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 32 : 8;
    const c = crop.current;
    const moves: Record<string, () => void> = {
      ArrowLeft: () => (c.x += step),
      ArrowRight: () => (c.x -= step),
      ArrowUp: () => (c.y += step),
      ArrowDown: () => (c.y -= step),
      "+": () => zoomTo(c.zoom * 1.1),
      "=": () => zoomTo(c.zoom * 1.1),
      "-": () => zoomTo(c.zoom / 1.1),
      Enter: () => void save(),
      Escape: close,
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    move();
    apply();
  };

  const shown = progress !== null && progress !== undefined;
  const ringValue = Math.min(1, Math.max(0, progress ?? 0));
  const button = cn(
    "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    s.button,
  );

  return (
    <div
      ref={rootRef}
      data-slot="file-avatar"
      data-state={source ? "crop" : "idle"}
      data-disabled={disabled || undefined}
      className={cn("inline-flex flex-col gap-3 text-foreground", disabled && "opacity-60", className)}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
        onChange={(event) => {
          open(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {source ? (
        <div className="flex flex-col items-center gap-3 motion-safe:transition-[opacity,scale] motion-safe:duration-300 motion-safe:starting:scale-95 starting:opacity-0" style={{ transitionTimingFunction: EASE }}>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: the crop surface; arrows, plus and minus cover the keyboard */}
          <div
            ref={viewRef}
            role="group"
            tabIndex={0}
            aria-label={`Crop ${who}. Drag or use the arrow keys to move, plus and minus to zoom, Enter to save, Escape to cancel.`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onCropKey}
            className="relative cursor-grab touch-none overflow-hidden rounded-2xl bg-muted outline-none select-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ width: s.crop, height: s.crop }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={source.url} alt="" draggable={false} className="pointer-events-none absolute top-0 left-0 max-w-none" />
            {/* The mask darkens everything outside the avatar's shape */}
            <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 shadow-[0_0_0_999px_rgb(0_0_0/0.5)] ring-2 ring-white/80", radius)} />
          </div>
          <label className="flex w-full items-center gap-3">
            <span className="shrink-0 select-none text-sm text-muted-foreground">Zoom</span>
            <input
              ref={zoomRef}
              type="range"
              min={1}
              max={MAX_ZOOM}
              step={0.01}
              defaultValue={1}
              onInput={(event) => zoomTo(Number(event.currentTarget.value))}
              className="h-1.5 w-full min-w-0 cursor-pointer accent-foreground"
            />
          </label>
          <div className="flex w-full items-center justify-end gap-2">
            <button type="button" onClick={close} className={cn(button, t.button)}>
              <X aria-hidden="true" className={s.icon} />
              Cancel
            </button>
            <button type="button" onClick={() => void save()} disabled={saving} className={cn(button, "bg-foreground text-background hover:bg-foreground/85")}>
              <Check aria-hidden="true" className={s.icon} />
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={disabled}
            aria-label={image ? `Change ${who}` : `Upload ${who}`}
            aria-describedby={[hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined}
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              if (disabled) return;
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              open(event.dataTransfer.files[0]);
            }}
            data-dragging={dragging || undefined}
            className={cn(
              "group/avatar relative grid shrink-0 cursor-pointer place-items-center outline-none transition-[scale] duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed data-[dragging=true]:scale-105",
              radius,
            )}
            style={{ width: s.avatar, height: s.avatar, transitionTimingFunction: EASE }}
          >
            <span className={cn("absolute inset-0 grid place-items-center overflow-hidden", radius, t.avatar)}>
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={image}
                  src={image}
                  alt=""
                  className="size-full object-cover motion-safe:transition-opacity motion-safe:duration-500 motion-safe:starting:opacity-0"
                />
              ) : (
                <span className={cn("select-none font-semibold text-muted-foreground", s.initials)}>{initials || <Camera aria-hidden="true" className="size-1/3" />}</span>
              )}
              <span className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 transition-opacity duration-200 group-hover/avatar:opacity-100 group-focus-visible/avatar:opacity-100 group-data-[dragging=true]/avatar:opacity-100">
                <Camera aria-hidden="true" className="size-1/4" />
              </span>
            </span>
            {shown && (
              <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute -inset-1.5 size-[calc(100%+0.75rem)] -rotate-90 overflow-visible">
                {shape === "circle" ? (
                  <circle cx={50} cy={50} r={48.5} fill="none" strokeWidth={3} pathLength={100} className="stroke-muted" />
                ) : (
                  <rect x={1.5} y={1.5} width={97} height={97} rx={23} fill="none" strokeWidth={3} pathLength={100} className="stroke-muted" />
                )}
                {shape === "circle" ? (
                  <circle
                    cx={50}
                    cy={50}
                    r={48.5}
                    fill="none"
                    strokeWidth={3}
                    strokeLinecap="round"
                    pathLength={100}
                    className="stroke-foreground motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500"
                    style={{ strokeDasharray: 100, strokeDashoffset: 100 - ringValue * 100, transitionTimingFunction: EASE }}
                  />
                ) : (
                  <rect
                    x={1.5}
                    y={1.5}
                    width={97}
                    height={97}
                    rx={23}
                    fill="none"
                    strokeWidth={3}
                    strokeLinecap="round"
                    pathLength={100}
                    className="stroke-foreground motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500"
                    style={{ strokeDasharray: 100, strokeDashoffset: 100 - ringValue * 100, transitionTimingFunction: EASE }}
                  />
                )}
              </svg>
            )}
          </button>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button ref={changeRef} type="button" disabled={disabled} onClick={() => inputRef.current?.click()} className={cn(button, t.button)}>
                <Camera aria-hidden="true" className={s.icon} />
                {image ? "Change photo" : "Upload photo"}
              </button>
              {removable && image && (
                <button type="button" disabled={disabled} onClick={remove} aria-label={`Remove ${who}`} className={cn(button, "text-muted-foreground hover:bg-muted hover:text-destructive")}>
                  <Trash2 aria-hidden="true" className={s.icon} />
                  Remove
                </button>
              )}
            </div>
            {hint && (
              <p id={hintId} className="select-none text-sm text-muted-foreground">
                {hint}
              </p>
            )}
            {shown && (
              <p className="select-none text-sm tabular-nums text-muted-foreground" aria-live="polite">
                {ringValue >= 1 ? "Uploaded" : `Uploading ${Math.round(ringValue * 100)}%`}
              </p>
            )}
          </div>
        </div>
      )}

      <p id={errorId} aria-live="polite" className={cn("text-sm text-destructive", !error && "sr-only")}>
        {error}
      </p>
    </div>
  );
}
