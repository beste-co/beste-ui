"use client";

import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the slots. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Slot size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export type OtpStatus = "idle" | "checking" | "error" | "success";

export interface FieldOtpProps {
  /** Number of slots. @defaultValue 6 */
  length?: number;
  /** Controlled code. */
  value?: string;
  /** Initial code when uncontrolled. @defaultValue "" */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once each time every slot is filled. */
  onComplete?: (code: string) => void;
  /** Checks a complete code. Resolving `false` shakes and clears the slots; `true` locks them in the success state. */
  validate?: (code: string) => boolean | Promise<boolean>;
  /** Controlled status; overrides what `validate` would set. */
  status?: OtpStatus;
  /** Which characters a slot accepts. `alphanumeric` upper-cases letters. @defaultValue "numeric" */
  pattern?: "numeric" | "alphanumeric";
  /** A small dash after these slot counts, e.g. `3` for 123-456. */
  separator?: number | number[];
  /** Show dots instead of the characters. */
  mask?: boolean;
  label?: string;
  /** Help text under the slots, read with them. */
  description?: string;
  /** Shown and announced when the code is wrong. @defaultValue "That code didn't work. Try again." */
  errorMessage?: string;
  /** Shown and announced when the code is right. @defaultValue "Verified" */
  successMessage?: string;
  name?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  /** @defaultValue "outline" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  className?: string;
}

export const fieldOtpDemo: FieldOtpProps = {
  label: "Verification code",
  description: "We sent a code to hello@beste.co. Try 246810.",
  length: 6,
  separator: 3,
  validate: (code) => new Promise((resolve) => setTimeout(() => resolve(code === "246810"), 600)),
  onComplete: (code) => console.log("Entered", code),
  className: "w-fit",
};

const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const toneStyles: Record<Tone, string> = {
  muted: "rounded-lg border border-transparent bg-muted",
  outline: "rounded-lg border border-border bg-background shadow-xs",
  ghost: "rounded-none border-0 border-b-2 border-border bg-transparent",
};

const sizeStyles: Record<Size, { slot: string; gap: string; caret: string; dash: string }> = {
  sm: { slot: "h-9 w-8 text-sm", gap: "gap-1.5", caret: "h-4", dash: "w-2" },
  default: { slot: "h-12 w-10 text-lg", gap: "gap-2", caret: "h-5", dash: "w-3" },
  lg: { slot: "h-14 w-12 text-2xl", gap: "gap-2.5", caret: "h-7", dash: "w-4" },
};

const clean = (text: string, pattern: "numeric" | "alphanumeric") =>
  pattern === "numeric" ? text.replace(/\D/g, "") : text.replace(/[^a-z0-9]/gi, "").toUpperCase();

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One real input carries the code, so paste, SMS autofill, IME and password managers all work;
 * the slots are only a picture of it.
 */
export function FieldOtp({
  length = 6,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onComplete,
  validate,
  status: statusProp,
  pattern = "numeric",
  separator,
  mask = false,
  label,
  description,
  errorMessage = "That code didn't work. Try again.",
  successMessage = "Verified",
  name,
  autoFocus,
  disabled = false,
  tone = "outline",
  size = "default",
  className,
}: FieldOtpProps) {
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rowRef = React.useRef<HTMLDivElement>(null);
  const [inner, setInner] = React.useState(() => clean(defaultValue, pattern).slice(0, length));
  const value = valueProp !== undefined ? clean(valueProp, pattern).slice(0, length) : inner;
  const [innerStatus, setInnerStatus] = React.useState<OtpStatus>("idle");
  const status = statusProp ?? innerStatus;
  const [focused, setFocused] = React.useState(false);
  const [caret, setCaret] = React.useState(0);
  const check = React.useRef(0);
  const callbacks = React.useRef({ onValueChange, onComplete, validate });
  callbacks.current = { onValueChange, onComplete, validate };

  const locked = disabled || status === "success" || status === "checking";
  const s = sizeStyles[size];
  const gaps = new Set(Array.isArray(separator) ? separator : separator !== undefined ? [separator] : []);

  const moveCaret = (at: number) => {
    const el = inputRef.current;
    const next = Math.max(0, Math.min(at, length));
    setCaret(next);
    requestAnimationFrame(() => el?.setSelectionRange(next, next));
  };

  const commit = (next: string, at = next.length) => {
    if (next !== value) {
      if (valueProp === undefined) setInner(next);
      callbacks.current.onValueChange?.(next);
      if (innerStatus === "error") setInnerStatus("idle");
    }
    moveCaret(at);
    if (next.length === length && next !== value) {
      callbacks.current.onComplete?.(next);
      const run = callbacks.current.validate;
      if (run) {
        const ticket = ++check.current;
        setInnerStatus("checking");
        Promise.resolve(run(next)).then((ok) => {
          if (ticket !== check.current) return;
          setInnerStatus(ok ? "success" : "error");
        });
      }
    }
  };

  // A wrong code shakes the row, then clears so the next attempt starts fresh
  React.useEffect(() => {
    if (status !== "error") return;
    if (!reduced()) {
      rowRef.current?.animate(
        [{ translate: "0" }, { translate: "-7px" }, { translate: "6px" }, { translate: "-4px" }, { translate: "2px" }, { translate: "0" }],
        { duration: 420, easing: "ease-out" },
      );
    }
    if (statusProp !== undefined) return;
    const timer = window.setTimeout(() => {
      if (valueProp === undefined) setInner("");
      callbacks.current.onValueChange?.("");
      setCaret(0);
      inputRef.current?.setSelectionRange(0, 0);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [status, statusProp, valueProp]);

  // Success settles each slot in turn, left to right
  React.useEffect(() => {
    if (status !== "success" || reduced()) return;
    const slots = rowRef.current?.querySelectorAll<HTMLElement>("[data-slot=field-otp-slot]");
    slots?.forEach((slot, index) => {
      slot.animate([{ scale: "1" }, { scale: "1.08" }, { scale: "1" }], { duration: 360, delay: index * 45, easing: "ease-out" });
    });
  }, [status]);

  const syncCaret = () => {
    const el = inputRef.current;
    if (el) setCaret(Math.min(el.selectionStart ?? value.length, length));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.metaKey || event.ctrlKey || event.altKey || locked) return;
    const el = event.currentTarget;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? start;
    if (event.key.length === 1) {
      // A character overwrites the slot under the caret instead of pushing the rest along
      event.preventDefault();
      const char = clean(event.key, pattern);
      if (!char || start >= length) return;
      commit((value.slice(0, start) + char + value.slice(Math.max(end, start + 1))).slice(0, length), start + 1);
    } else if (event.key === "Backspace" && start === end) {
      event.preventDefault();
      if (start === 0) return;
      commit(value.slice(0, start - 1) + value.slice(start), start - 1);
    } else if (event.key === "Delete" && start === end) {
      event.preventDefault();
      commit(value.slice(0, start) + value.slice(start + 1), start);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End") {
      requestAnimationFrame(syncCaret);
    }
  };

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (locked) return;
    const pasted = clean(event.clipboardData.getData("text"), pattern);
    if (!pasted) return;
    const start = inputRef.current?.selectionStart ?? 0;
    const next = pasted.length >= length ? pasted.slice(0, length) : (value.slice(0, start) + pasted).slice(0, length);
    commit(next);
  };

  const focusSlot = (index: number) => (event: React.PointerEvent) => {
    if (locked) return;
    event.preventDefault();
    inputRef.current?.focus();
    moveCaret(Math.min(index, value.length));
  };

  const active = focused && !locked ? Math.min(caret, length - 1) : -1;
  const message = status === "error" ? errorMessage : status === "success" ? successMessage : null;
  const describedBy = [description && `${id}-description`, message && `${id}-status`].filter(Boolean).join(" ") || undefined;

  return (
    <div data-slot="field-otp" data-status={status} className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label htmlFor={id} className="select-none text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative flex items-center gap-3">
        <div ref={rowRef} className={cn("relative flex items-center", s.gap)}>
          <input
            ref={inputRef}
            id={id}
            name={name}
            value={value}
            autoFocus={autoFocus}
            disabled={disabled}
            readOnly={status === "success" || status === "checking"}
            autoComplete="one-time-code"
            inputMode={pattern === "numeric" ? "numeric" : "text"}
            pattern={pattern === "numeric" ? `\\d{${length}}` : `[A-Za-z0-9]{${length}}`}
            maxLength={length}
            spellCheck={false}
            aria-invalid={status === "error" || undefined}
            aria-describedby={describedBy}
            onChange={(event) => commit(clean(event.target.value, pattern).slice(0, length))}
            onKeyDown={onKeyDown}
            onKeyUp={syncCaret}
            onSelect={syncCaret}
            onPaste={onPaste}
            onFocus={() => {
              setFocused(true);
              moveCaret(Math.min(value.length, length));
            }}
            onBlur={() => setFocused(false)}
            // Covers the slots for autofill and assistive tech; the slots take the pointer
            className="pointer-events-none absolute inset-0 size-full bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent"
          />
          {Array.from({ length }, (_, index) => {
            const char = value[index];
            const isActive = index === active;
            return (
              <React.Fragment key={index}>
                {/* biome-ignore lint/a11y/noStaticElementInteractions: a picture of the input; the input itself is the control */}
                <div
                  aria-hidden="true"
                  data-slot="field-otp-slot"
                  data-active={isActive}
                  data-filled={Boolean(char)}
                  onPointerDown={focusSlot(index)}
                  className={cn(
                    "relative grid shrink-0 cursor-text select-none place-items-center font-semibold tabular-nums text-foreground",
                    "transition-[border-color,box-shadow,background-color,color] duration-200",
                    toneStyles[tone],
                    s.slot,
                    isActive && (tone === "ghost" ? "border-foreground" : "border-ring ring-3 ring-ring/25"),
                    status === "error" && "border-destructive text-destructive ring-destructive/20",
                    status === "success" && "border-emerald-500/70 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                    status === "checking" && "text-muted-foreground",
                    disabled ? "cursor-not-allowed opacity-50" : status === "success" ? "cursor-default" : "cursor-text",
                  )}
                >
                  {char ? (
                    <span
                      key={char}
                      className="transition-[opacity,scale] duration-300 motion-safe:starting:scale-50 starting:opacity-0"
                      style={{ transitionTimingFunction: SPRING_EASE }}
                    >
                      {mask ? "•" : char}
                    </span>
                  ) : (
                    isActive && <span className={cn("w-0.5 rounded-full bg-foreground motion-safe:animate-pulse", s.caret)} />
                  )}
                </div>
                {gaps.has(index + 1) && index + 1 < length && (
                  <span aria-hidden="true" className={cn("h-0.5 shrink-0 rounded-full bg-border", s.dash)} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-white transition-[opacity,scale] duration-500",
            status === "success" ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
          style={{ transitionTimingFunction: SPRING_EASE }}
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      </div>
      {description && (
        <p id={`${id}-description`} className="select-none text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <p
        id={`${id}-status`}
        aria-live="polite"
        className={cn(
          "select-none text-sm empty:hidden",
          status === "error" ? "text-destructive" : "text-emerald-700 dark:text-emerald-400",
        )}
      >
        {message}
      </p>
    </div>
  );
}
