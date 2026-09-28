"use client";

import {
  Check,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileText,
  FileVideo,
  RotateCw,
  Upload,
  X,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the zone and the rows. */
type Tone = "muted" | "outline" | "ghost";

/** Density preset. */
type Size = "sm" | "default" | "lg";

export type FileDropStatus = "queued" | "uploading" | "done" | "error";

export interface FileDropItem {
  id: string;
  name: string;
  /** Size in bytes. */
  size: number;
  /** MIME type, e.g. "image/png". */
  type: string;
  /** The picked file. Absent for items you pass in yourself, such as files uploaded earlier. */
  file?: File;
  status: FileDropStatus;
  /** Upload progress, 0 to 1. */
  progress?: number;
  error?: string;
}

export type FileDropUpload = (
  item: FileDropItem,
  context: { onProgress: (progress: number) => void; signal: AbortSignal },
) => Promise<void>;

interface FileDropProps {
  /** The list of files. Controlled. */
  files?: FileDropItem[];
  /** The list of files when uncontrolled. */
  defaultFiles?: FileDropItem[];
  onFilesChange?: (files: FileDropItem[]) => void;
  /** Uploads one item; report progress and honor the signal, which aborts when the row is removed. Rejecting marks the row as failed. */
  upload?: FileDropUpload;
  /** Progress by item id, 0 to 1, for uploads you drive yourself. Wins over progress from `upload`. */
  progress?: Record<string, number>;
  /** Accepted types, as for the native input: "image/*,.pdf". */
  accept?: string;
  multiple?: boolean;
  /** Largest file in bytes. */
  maxSize?: number;
  /** Most files in the list. */
  maxFiles?: number;
  /** Take files pasted with Ctrl or Cmd + V anywhere on the page. */
  paste?: boolean;
  disabled?: boolean;
  /** Main line in the zone. */
  title?: string;
  /** Hint under the title. Defaults to the accepted types and the size limit. */
  description?: string;
  size?: Size;
  tone?: Tone;
  className?: string;
}

/** Same spring the inspector family uses. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

/** Uploads running at once; the rest wait their turn. */
const CONCURRENCY = 3;

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

/** Same rule as the native input's `accept`: extensions, `type/*` and exact types. */
export function acceptsFile(file: { name: string; type: string }, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith(".")) return name.endsWith(rule);
      if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
}

const RULE_NAMES: Record<string, string> = { "image/*": "Images", "video/*": "Video", "audio/*": "Audio", "text/*": "Text" };

// Turns an accept rule into words for the hint: ".pdf" reads PDF, "image/*" reads Images
function describeRule(rule: string) {
  const clean = rule.trim().toLowerCase();
  if (!clean) return "";
  if (RULE_NAMES[clean]) return RULE_NAMES[clean];
  if (clean.startsWith(".")) return clean.slice(1).toUpperCase();
  return (clean.split("/").pop() ?? clean).toUpperCase();
}

function iconFor(item: { name: string; type: string }) {
  const { type } = item;
  const ext = item.name.split(".").pop()?.toLowerCase() ?? "";
  if (type.startsWith("image/")) return FileImage;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (["zip", "rar", "7z", "gz", "tar"].includes(ext)) return FileArchive;
  if (["js", "ts", "tsx", "jsx", "json", "css", "html", "py", "rb", "go", "rs"].includes(ext)) return FileCode;
  if (type === "application/pdf" || type.startsWith("text/") || ["doc", "docx", "md", "txt", "rtf"].includes(ext)) return FileText;
  return FileIcon;
}

// Keeps the extension in view: the head truncates, the last few characters never do
function splitName(name: string) {
  const dot = name.lastIndexOf(".");
  const keep = Math.max(dot > 0 ? name.length - dot + 4 : 6, 6);
  if (name.length <= keep + 4) return [name, ""] as const;
  return [name.slice(0, -keep), name.slice(-keep)] as const;
}

let idCounter = 0;
const newId = () => `file-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

const toneStyles: Record<Tone, { zone: string; row: string }> = {
  muted: { zone: "bg-muted text-foreground/15", row: "bg-muted" },
  outline: { zone: "bg-transparent text-border", row: "border border-border" },
  ghost: { zone: "bg-transparent text-transparent hover:text-border", row: "border border-transparent" },
};

const sizeStyles: Record<Size, { zone: string; icon: string; row: string; fileIcon: string }> = {
  sm: { zone: "gap-2 px-4 py-6", icon: "size-9", row: "gap-3 px-3 py-2.5", fileIcon: "size-8" },
  default: { zone: "gap-3 px-6 py-9", icon: "size-11", row: "gap-3 px-3.5 py-3", fileIcon: "size-9" },
  lg: { zone: "gap-4 px-8 py-12", icon: "size-12", row: "gap-4 px-4 py-3.5", fileIcon: "size-10" },
};

// Demo upload: steady steps that honor the abort signal, so a dropped file animates in the preview
const demoUpload: FileDropUpload = (item, { onProgress, signal }) =>
  new Promise((resolve, reject) => {
    let progress = 0;
    const steps = Math.max(8, Math.min(30, Math.round(item.size / 150_000)));
    const timer = setInterval(() => {
      progress = Math.min(1, progress + 1 / steps);
      onProgress(progress);
      if (progress >= 1) {
        clearInterval(timer);
        resolve();
      }
    }, 120);
    signal.addEventListener("abort", () => {
      clearInterval(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

export const fileDropDemo: FileDropProps = {
  defaultFiles: [
    { id: "demo-1", name: "setlist-autumn-tour-2026.pdf", size: 248_000, type: "application/pdf", status: "done", progress: 1 },
    { id: "demo-2", name: "stage-plot-barbican.png", size: 3_400_000, type: "image/png", status: "queued" },
    {
      id: "demo-3",
      name: "stems-final-mix.zip",
      size: 412_000_000,
      type: "application/zip",
      status: "error",
      error: "Connection lost",
    },
  ],
  upload: demoUpload,
  accept: "image/*,.pdf,.zip,audio/*",
  multiple: true,
  maxSize: 500 * 1024 * 1024,
  maxFiles: 8,
  paste: false,
  tone: "muted",
  size: "default",
  className: "w-full max-w-md",
};

export function FileDrop({
  files,
  defaultFiles = [],
  onFilesChange,
  upload,
  progress,
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  paste = false,
  disabled = false,
  title = "Drop files here or browse",
  description,
  size = "default",
  tone = "muted",
  className,
}: FileDropProps) {
  const [inner, setInner] = React.useState(defaultFiles);
  const items = files ?? inner;
  const itemsRef = React.useRef(items);
  itemsRef.current = items;
  const [errors, setErrors] = React.useState<string[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const [reduce, setReduce] = React.useState(false);
  const dragDepth = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const controllers = React.useRef(new Map<string, AbortController>());
  const uploadRef = React.useRef(upload);
  uploadRef.current = upload;
  const hintId = React.useId();

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Every change goes through here, so progress callbacks always build on the latest list
  const commit = React.useCallback(
    (update: (current: FileDropItem[]) => FileDropItem[]) => {
      const next = update(itemsRef.current);
      itemsRef.current = next;
      if (files === undefined) setInner(next);
      onFilesChange?.(next);
    },
    [files, onFilesChange],
  );

  const patch = React.useCallback(
    (id: string, change: Partial<FileDropItem>) => commit((list) => list.map((item) => (item.id === id ? { ...item, ...change } : item))),
    [commit],
  );

  const addFiles = (incoming: File[]) => {
    if (disabled || incoming.length === 0) return;
    const problems: string[] = [];
    const room = maxFiles ? Math.max(0, maxFiles - itemsRef.current.length) : Number.POSITIVE_INFINITY;
    const accepted: FileDropItem[] = [];
    for (const file of multiple ? incoming : incoming.slice(0, 1)) {
      if (!acceptsFile(file, accept)) problems.push(`${file.name} is not an accepted type.`);
      else if (maxSize && file.size > maxSize) problems.push(`${file.name} is larger than ${formatBytes(maxSize)}.`);
      else if (accepted.length >= room) problems.push(`Only ${maxFiles} files can be added.`);
      else accepted.push({ id: newId(), name: file.name, size: file.size, type: file.type, file, status: "queued", progress: 0 });
    }
    setErrors([...new Set(problems)]);
    if (accepted.length === 0) return;
    commit((list) => (multiple ? [...list, ...accepted] : accepted));
  };

  const remove = (id: string) => {
    controllers.current.get(id)?.abort();
    controllers.current.delete(id);
    commit((list) => list.filter((item) => item.id !== id));
  };

  const retry = (id: string) => patch(id, { status: "queued", progress: 0, error: undefined });

  // Starts queued items, a few at a time, whenever the list changes
  React.useEffect(() => {
    const run = uploadRef.current;
    if (!run) return;
    let slots = CONCURRENCY - controllers.current.size;
    for (const item of items) {
      if (slots <= 0) break;
      if (item.status !== "queued" || controllers.current.has(item.id)) continue;
      slots--;
      const controller = new AbortController();
      controllers.current.set(item.id, controller);
      patch(item.id, { status: "uploading", progress: 0 });
      run(item, {
        signal: controller.signal,
        onProgress: (value) => {
          if (!controller.signal.aborted) patch(item.id, { progress: Math.min(1, Math.max(0, value)) });
        },
      })
        .then(() => {
          if (!controller.signal.aborted) patch(item.id, { status: "done", progress: 1 });
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) patch(item.id, { status: "error", error: error instanceof Error ? error.message : "Upload failed" });
        })
        .finally(() => {
          if (controllers.current.get(item.id) === controller) controllers.current.delete(item.id);
        });
    }
  }, [items, patch]);

  React.useEffect(() => {
    const running = controllers.current;
    return () => {
      for (const controller of running.values()) controller.abort();
      running.clear();
    };
  }, []);

  React.useEffect(() => {
    if (!paste || disabled) return;
    const onPaste = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      const pasted = Array.from(event.clipboardData?.files ?? []);
      if (pasted.length === 0) return;
      event.preventDefault();
      addFiles(pasted);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  });

  const hint =
    description ??
    [accept ? accept.split(",").map(describeRule).filter(Boolean).join(", ") : null, maxSize ? `up to ${formatBytes(maxSize)}` : null]
      .filter(Boolean)
      .join(", ");
  const sizing = sizeStyles[size];
  const tones = toneStyles[tone];

  return (
    <div data-slot="file-drop" className={cn("flex w-full flex-col gap-2", className)}>
      <button
        type="button"
        disabled={disabled}
        data-dragging={dragging || undefined}
        aria-describedby={hint ? hintId : undefined}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          dragDepth.current++;
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = disabled ? "none" : "copy";
        }}
        onDragLeave={() => {
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          addFiles(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "group/zone relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl text-center outline-none",
          "transition-[translate,box-shadow,color,background-color] duration-500 motion-reduce:transition-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "data-[dragging]:-translate-y-1 data-[dragging]:text-primary data-[dragging]:shadow-lg data-[dragging]:shadow-primary/10",
          "disabled:cursor-not-allowed disabled:opacity-50",
          tones.zone,
          sizing.zone,
        )}
        style={{ transitionTimingFunction: SPRING_EASE }}
      >
        {/* Dashed edge drawn in SVG so it can march while a file is over the zone */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          <rect
            width="100%"
            height="100%"
            rx="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="6 5"
            className="transition-[stroke] duration-300"
          >
            {dragging && !reduce && <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="0.7s" repeatCount="indefinite" />}
          </rect>
        </svg>
        <span
          className={cn(
            "relative flex items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-transform duration-500 motion-reduce:transition-none",
            "group-data-[dragging]/zone:scale-110 group-data-[dragging]/zone:text-primary",
            sizing.icon,
          )}
          style={{ transitionTimingFunction: SPRING_EASE }}
        >
          <Upload className="size-[45%]" />
        </span>
        <span className="relative select-none text-sm font-medium text-foreground">
          {dragging ? "Drop to add" : title}
        </span>
        {hint && (
          <span id={hintId} className="relative select-none text-sm text-muted-foreground">
            {hint}
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        tabIndex={-1}
        className="sr-only"
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
          addFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />

      <div aria-live="polite" className="empty:hidden">
        {errors.length > 0 && (
          <ul className="flex flex-col gap-1 px-1">
            {errors.map((message) => (
              <li key={message} className="select-none text-sm text-destructive">
                {message}
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <ul className="flex flex-col gap-1.5" aria-label="Files">
          {items.map((item) => {
            const external = progress?.[item.id];
            const value = external ?? item.progress ?? 0;
            const status: FileDropStatus =
              item.status === "error" ? "error" : external === undefined ? item.status : external >= 1 ? "done" : "uploading";
            const Icon = iconFor(item);
            const [head, tail] = splitName(item.name);
            const percent = Math.round(value * 100);
            return (
              <li
                key={item.id}
                data-status={status}
                className={cn(
                  "relative flex items-center overflow-hidden rounded-xl transition-[opacity,translate] duration-500 motion-reduce:transition-none starting:-translate-y-1 starting:opacity-0",
                  tones.row,
                  sizing.row,
                )}
                style={{ transitionTimingFunction: SPRING_EASE }}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm",
                    status === "error" && "text-destructive",
                    sizing.fileIcon,
                  )}
                >
                  <Icon className="size-[48%]" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex min-w-0 select-none text-sm font-medium text-foreground" title={item.name}>
                    <span className="truncate">{head}</span>
                    <span className="shrink-0">{tail}</span>
                  </span>
                  <span className={cn("select-none text-sm tabular-nums text-muted-foreground", status === "error" && "text-destructive")}>
                    {formatBytes(item.size)}
                    {" · "}
                    {status === "queued" && (upload ? "Waiting" : "Ready")}
                    {status === "uploading" && `${percent}%`}
                    {status === "done" && "Uploaded"}
                    {status === "error" && (item.error ?? "Upload failed")}
                  </span>
                </div>
                {status === "done" && <Check aria-hidden="true" className="size-4 shrink-0 text-foreground" />}
                {status === "error" && upload && (
                  <button
                    type="button"
                    onClick={() => retry(item.id)}
                    aria-label={`Retry ${item.name}`}
                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <RotateCw className="size-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <X className="size-4" />
                </button>
                {(status === "uploading" || status === "queued") && (
                  <div
                    role="progressbar"
                    aria-label={`Uploading ${item.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground/5"
                  >
                    <div
                      className="h-full origin-left bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none"
                      style={{ transform: `scaleX(${value})` }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
