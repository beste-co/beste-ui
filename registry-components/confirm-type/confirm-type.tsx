"use client";

import { Check, Copy, LoaderCircle, TriangleAlert } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Whether the action destroys something or only commits it. */
type Tone = "default" | "destructive";

/** Density preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

type Phase = "idle" | "pending" | "done";

export interface ConfirmTypeProps {
  /** The exact text the reader has to type, usually the name of what is about to go. */
  name: string;
  /** A short warning above the field. */
  warning?: React.ReactNode;
  /** Runs on an exact match. Return a promise to show a loading state until it settles. */
  onConfirm?: () => void | Promise<unknown>;
  /** Button label. */
  confirmLabel?: string;
  /** Button label once the action has run. */
  doneLabel?: string;
  /** Compare letter case too. @defaultValue true */
  caseSensitive?: boolean;
  /** The typed text, controlled. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  tone?: Tone;
  size?: Size;
  className?: string;
}

export const confirmTypeDemo: ConfirmTypeProps = {
  name: "Blue Lines",
  warning: "Deleting the album removes its 9 tracks, the artwork and every play count. This cannot be undone.",
  confirmLabel: "Delete this album",
  doneLabel: "Album deleted",
  tone: "destructive",
  onConfirm: () => new Promise((resolve) => setTimeout(resolve, 900)),
  className: "w-full max-w-md",
};

// Soft ease-out for the per-key feedback; the spring is kept for the one-off check
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const toneStyles: Record<Tone, { icon: string; button: string; match: string; miss: string }> = {
  default: {
    icon: "bg-muted text-foreground",
    button: "bg-primary text-primary-foreground hover:bg-primary/90",
    match: "text-foreground",
    miss: "decoration-foreground",
  },
  destructive: {
    icon: "bg-destructive/10 text-destructive",
    button: "bg-destructive text-white hover:bg-destructive/90",
    match: "text-destructive",
    miss: "decoration-destructive",
  },
};

const sizeStyles: Record<Size, { root: string; field: string; button: string; icon: string }> = {
  sm: { root: "gap-3 text-sm", field: "h-9 px-3 text-sm", button: "h-9 px-3 text-sm", icon: "size-8" },
  default: { root: "gap-4 text-sm", field: "h-10 px-3 text-sm", button: "h-10 px-4 text-sm", icon: "size-9" },
  lg: { root: "gap-5 text-base", field: "h-12 px-4 text-base", button: "h-12 px-5 text-base", icon: "size-10" },
};

const SHAKE: Keyframe[] = [
  { transform: "translateX(0)" },
  { transform: "translateX(-6px)" },
  { transform: "translateX(5px)" },
  { transform: "translateX(-3px)" },
  { transform: "translateX(2px)" },
  { transform: "translateX(0)" },
];

/**
 * Type-to-confirm for destructive actions: the field shows, letter by letter, how close the
 * typing is to the name, and the button only arms on an exact match.
 */
export function ConfirmType({
  name,
  warning,
  onConfirm,
  confirmLabel = "Confirm",
  doneLabel = "Done",
  caseSensitive = true,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  disabled = false,
  tone = "destructive",
  size = "default",
  className,
}: ConfirmTypeProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [copied, setCopied] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const copyTimer = React.useRef(0);
  const inputId = React.useId();
  const hintId = React.useId();

  React.useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const same = (a: string, b: string) => (caseSensitive ? a === b : a.toLowerCase() === b.toLowerCase());
  const matched = same(value, name);
  // Index of the first character that departs from the name, or -1 while every typed character fits
  let firstMiss = -1;
  for (let i = 0; i < value.length; i++) {
    if (i >= name.length || !same(value[i] ?? "", name[i] ?? "")) {
      firstMiss = i;
      break;
    }
  }
  const busy = phase !== "idle";
  const locked = disabled || busy;

  const setValue = (next: string) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };

  const submit = async () => {
    if (locked) return;
    if (!matched) {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        fieldRef.current?.animate(SHAKE, { duration: 420, easing: "ease-out" });
      }
      setAnnouncement(`The text does not match ${name} yet.`);
      inputRef.current?.focus();
      return;
    }
    setPhase("pending");
    setAnnouncement("Working");
    try {
      await onConfirm?.();
      setPhase("done");
      setAnnouncement(doneLabel);
    } catch {
      setPhase("idle");
      setAnnouncement("That did not work. Try again.");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard can be blocked; the name stays selectable by hand
    }
  };

  const t = toneStyles[tone];
  const s = sizeStyles[size];

  return (
    <form
      data-slot="confirm-type"
      data-phase={phase}
      data-matched={matched || undefined}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className={cn("flex flex-col", s.root, disabled && "opacity-50", className)}
    >
      {warning && (
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className={cn("grid shrink-0 place-items-center rounded-full", t.icon, s.icon)}>
            <TriangleAlert className="size-[45%]" />
          </span>
          <p className="select-none pt-1 leading-relaxed text-muted-foreground">{warning}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {/* No <label>: it may not hold the copy button, so the three parts name the field instead */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-foreground">
          <span id={`${inputId}-a`} className="select-none">Type</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted py-0.5 pr-0.5 pl-2 font-medium">
            <span id={`${inputId}-b`} className="select-all">{name}</span>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? `Copied ${name}` : `Copy ${name}`}
              className="grid size-6 cursor-pointer place-items-center rounded text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
            </button>
          </span>
          <span id={`${inputId}-c`} className="select-none">to confirm</span>
        </div>

        {/* The input is the field; the overlay behind it repeats the text with each letter's verdict */}
        <div ref={fieldRef} className={cn("relative rounded-md border bg-background", matched ? "border-foreground/30" : "border-input", "focus-within:ring-2 focus-within:ring-ring/40")}>
          <div
            ref={overlayRef}
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre", s.field)}
          >
            {[...value].map((char, i) => {
              const good = firstMiss === -1 || i < firstMiss;
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: one span per typed position
                <span
                  key={i}
                  className={cn(
                    "transition-colors duration-200",
                    good ? t.match : "text-foreground",
                    i === firstMiss && cn("underline decoration-2 underline-offset-4", t.miss),
                  )}
                  style={{ transitionTimingFunction: EASE }}
                >
                  {char}
                </span>
              );
            })}
          </div>
          <input
            ref={inputRef}
            id={inputId}
            aria-labelledby={`${inputId}-a ${inputId}-b ${inputId}-c`}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onScroll={(event) => {
              if (overlayRef.current) overlayRef.current.scrollLeft = event.currentTarget.scrollLeft;
            }}
            disabled={locked}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby={hintId}
            aria-invalid={value.length > 0 && firstMiss !== -1 ? true : undefined}
            className={cn(
              "relative block w-full bg-transparent text-transparent caret-foreground outline-none selection:bg-primary/20 disabled:cursor-not-allowed",
              s.field,
            )}
          />
        </div>
        <p id={hintId} className="sr-only">
          {matched ? "The name matches. The button is ready." : `Type ${name} exactly${caseSensitive ? ", with the same capital letters" : ""}.`}
        </p>
      </div>

      <button
        type="submit"
        // Stays enabled while unmatched (only dimmed), so Enter and clicks can answer with the shake
        disabled={disabled || busy}
        aria-disabled={!matched || undefined}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-[background-color,opacity] duration-300 outline-none select-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "aria-disabled:opacity-40 disabled:cursor-not-allowed",
          phase === "pending" && "disabled:opacity-80",
          t.button,
          s.button,
        )}
        style={{ transitionTimingFunction: EASE }}
      >
        {/* The widest label is laid out invisibly under the live one, so the button never changes width */}
        <span className="inline-grid">
          <span className="invisible col-start-1 row-start-1 flex items-center gap-2" aria-hidden="true">
            <span className="size-4" />
            {confirmLabel.length >= doneLabel.length ? confirmLabel : doneLabel}
          </span>
          <span className="col-start-1 row-start-1 flex items-center justify-center gap-2">
            {phase === "pending" && <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
            {phase === "done" && (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  pathLength={1}
                  className="[stroke-dasharray:1] [stroke-dashoffset:0] motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500 motion-safe:starting:[stroke-dashoffset:1]"
                />
              </svg>
            )}
            {phase === "done" ? doneLabel : confirmLabel}
          </span>
        </span>
      </button>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </form>
  );
}
