"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Size = "default" | "lg";

interface Form46Props {
  label?: string;
  /** A mark before the value in place of the label, e.g. an assistant's logo */
  icon?: ReactNode;
  /** The value that types itself into the field */
  value?: string;
  /** The line that appears once the value is in */
  savedLabel?: string;
  /** A dot line shown while the value types, which gives way to the saved line */
  waitingLabel?: string;
  /** A taller field with larger type */
  size?: Size;
  /** A soft panel behind the field (default), or none so it sits on the card it is in */
  surface?: "panel" | "none";
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const form46Demo: Form46Props = {
  label: "Email",
  value: "hello@beste.co",
  savedLabel: "New submission saved",
};

const STYLES = `
@keyframes form46-clock { to { opacity: 1; } }
@keyframes form46-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes form46-saved { 0%, 42% { opacity: 0; } 48%, 84% { opacity: 1; } 90%, 100% { opacity: 0; } }
.form46-clock { animation: form46-clock 11s linear -6s infinite; }
.form46-caret { animation: form46-blink 1.1s step-end infinite; }
@keyframes form46-wait { 0%, 40% { opacity: 1; } 45%, 90% { opacity: 0; } 96%, 100% { opacity: 1; } }
.form46-saved { animation: form46-saved 11s ease -6s infinite; }
.form46-wait { animation: form46-wait 11s ease -6s infinite; }
@media (prefers-reduced-motion: reduce) {
  .form46-clock, .form46-caret, .form46-saved, .form46-wait { animation: none; }
  .form46-wait { opacity: 0; }
  .form46-saved.form46-swap { opacity: 1; }
}
`;

export function Form46({ label, icon, value = "", savedLabel, waitingLabel, size = "default", surface = "panel", fill = false, className }: Form46Props) {
  // Real letters are typed, so the caret always sits right after the last one
  const [typed, setTyped] = useState(value.length);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const clock = clockRef.current;
    if (!clock || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(value.length);
      return;
    }
    let frame = 0;
    const tick = () => {
      // The count follows the CSS loop of the labels: type from 8% to 40%, hold, delete from 84% to 94%
      // Progress, not currentTime: it counts the negative delay the labels' loops share
      const at = clock.getAnimations()[0]?.effect?.getComputedTiming().progress ?? 1;
      const share = at < 0.08 ? 0 : at < 0.4 ? (at - 0.08) / 0.32 : at < 0.84 ? 1 : at < 0.94 ? 1 - (at - 0.84) / 0.1 : 0;
      setTyped(Math.round(share * value.length));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div className={cn("flex w-full flex-col items-center justify-center gap-3.5 rounded-2xl px-5.5", surface === "panel" && "bg-background", fill ? "w-full" : "max-w-100 py-8")} aria-hidden="true">
        <div className={cn("flex w-full items-center rounded-full bg-card ring-1 ring-border", size === "lg" ? "h-14.5 max-w-100 gap-3 px-5" : "h-12 max-w-80 gap-2.5 px-4.5")}>
          {icon ?? (label && <span className="text-xs text-muted-foreground">{label}</span>)}
          <span className={cn("flex items-center text-foreground", size === "lg" ? "text-base" : "text-sm")}>
            <span ref={clockRef} className="form46-clock whitespace-pre">
              {value.slice(0, typed)}
            </span>
            <span className={cn("form46-caret ml-0.5 w-0.5 bg-chart-1", size === "lg" ? "h-5" : "h-4")} />
          </span>
        </div>
        {waitingLabel ? (
          <div className={cn("relative h-4.5 w-full", size === "lg" ? "text-sm" : "text-xs")}>
            <span className="form46-wait absolute inset-0 flex items-center justify-center gap-2 text-muted-foreground">
              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
              {waitingLabel}
            </span>
            {savedLabel && <span className="form46-saved form46-swap absolute inset-0 flex items-center justify-center text-foreground/80">{savedLabel}</span>}
          </div>
        ) : (
          savedLabel && <div className="form46-saved text-xs text-foreground/80">{savedLabel}</div>
        )}
      </div>
    </div>
  );
}
