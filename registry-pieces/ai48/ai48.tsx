"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai48Props {
  src?: string;
  alt?: string;
  size?: string;
  model?: string;
  stepMs?: number;
  holdMs?: number;
  className?: string;
}

const steps = [
  { label: "Sketching", pct: 12, blur: 28, sat: 0.1 },
  { label: "Composing", pct: 38, blur: 16, sat: 0.35 },
  { label: "Refining", pct: 64, blur: 8, sat: 0.65 },
  { label: "Upscaling", pct: 88, blur: 3, sat: 0.9 },
  { label: "Done", pct: 100, blur: 0, sat: 1 },
];

export const ai48Demo: Ai48Props = {
  src: "https://images.unsplash.com/photo-1519627457373-b60a0da1706b?w=300&auto=format&fit=crop&q=60",
  alt: "Generated image preview",
  size: "1024 x 1024",
  model: "image-1",
};

export function Ai48({
  src = "https://images.unsplash.com/photo-1519627457373-b60a0da1706b?w=300&auto=format&fit=crop&q=60",
  alt = "Generated image preview",
  size = "1024 x 1024",
  model = "image-1",
  stepMs = 1300,
  holdMs = 2800,
  className,
}: Ai48Props) {
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);
  const last = steps.length - 1;
  const current = steps[step];
  const done = step >= last;

  useEffect(() => {
    const id = setTimeout(
      () => {
        if (done) setPct(0);
        setStep((s) => (s >= last ? 0 : s + 1));
      },
      done ? holdMs : stepMs
    );
    return () => clearTimeout(id);
  }, [step, done, last, stepMs, holdMs]);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => (p >= current.pct ? p : p + 1));
    }, 30);
    return () => clearInterval(id);
  }, [step, current.pct]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes ai48-in { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-64 flex-col gap-2.5 rounded-2xl border border-border bg-card p-2.5 shadow-sm">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
          <img
            src={src}
            alt={alt}
            className="size-full object-cover transition-all duration-700 ease-out motion-reduce:transition-none"
            style={{
              filter: `blur(${current.blur}px) saturate(${current.sat})`,
              transform: done ? "scale(1)" : "scale(1.08)",
            }}
          />
          <span
            className="absolute top-2 left-2 inline-flex h-6 items-center gap-1.5 rounded-full bg-card px-2 text-xs font-medium text-card-foreground shadow-sm"
          >
            {done ? (
              <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
            ) : (
              <Loader2
                className="size-3.5 animate-spin text-violet-500 motion-reduce:animate-none"
                aria-hidden="true"
              />
            )}
            <span
              key={current.label}
              className="inline-block"
              style={{ animation: "ai48-in 300ms ease-out" }}
            >
              {current.label}
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-1.5 px-0.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">{model}</span>
            <span className="tabular-nums">
              {size}
              <span className="mx-1.5" aria-hidden="true">
                &middot;
              </span>
              <span className="font-medium text-card-foreground">{pct}%</span>
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300 ease-out motion-reduce:transition-none",
                done ? "bg-emerald-500" : "bg-violet-500"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
