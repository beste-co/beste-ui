"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface Terminal16Step {
  tool?: string;
  detail?: string;
}

interface Terminal16Props {
  title?: string;
  /** The request typed after the chevron */
  prompt?: string;
  /** Tool calls that tick in one after another */
  steps?: Terminal16Step[];
  /** Green line shown once every step is done */
  summary?: string;
  /** Delay between two steps */
  stepMs?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const terminal16Demo: Terminal16Props = {
  title: "claude · ~/oriel",
  prompt: "Build a site for a skin studio in Lisbon, in English and Portuguese.",
  steps: [
    { tool: "create_website", detail: "Oriel Skin Studio" },
    { tool: "add_section", detail: "home · hero" },
    { tool: "add_language", detail: "pt" },
    { tool: "apply_look", detail: "warm, calm" },
  ],
  summary: "4 changes waiting in your draft",
  stepMs: 450,
  framed: true,
};

// Rows keep their place from the first frame; reduced motion shows them all at once
const STYLES = `
@keyframes terminal16-in { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }
.terminal16-in { animation: terminal16-in 280ms ease-out both; }
.terminal16-wait { visibility: hidden; }
@media (prefers-reduced-motion: reduce) {
  .terminal16-in { animation: none; }
  .terminal16-wait { visibility: visible; }
}
`;

export function Terminal16({
  title,
  prompt,
  steps = [],
  summary,
  stepMs = 450,
  framed = true,
  fill = false,
  className,
}: Terminal16Props) {
  const total = steps.length + (summary ? 1 : 0);
  const [shown, setShown] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(still);
    setShown(still ? total : 0);
  }, [steps.length, prompt, total]);

  useEffect(() => {
    if (reduced || shown >= total) return;
    const id = setTimeout(() => setShown((value) => value + 1), stepMs);
    return () => clearTimeout(id);
  }, [shown, total, stepMs, reduced]);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>

      <div
        className={cn(
          "w-full",
          !fill && "max-w-100",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("overflow-hidden rounded-2xl bg-neutral-900 text-xs", !framed && "shadow-lg ring-1 ring-white/5")}>
          {title && (
            <div className="border-b border-neutral-800 px-3.5 py-2.5">
              <span className="text-xs text-neutral-400">{title}</span>
            </div>
          )}

          <div className="flex flex-col px-4 pt-3.5 pb-4">
            {prompt && (
              <div className="pb-2.5 text-sm leading-normal text-neutral-300">
                <span className="text-chart-1" aria-hidden="true">
                  ›
                </span>{" "}
                {prompt}
              </div>
            )}

            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2.5 border-b border-neutral-800 py-2",
                  index < shown ? "terminal16-in" : "terminal16-wait"
                )}
              >
                <Check className="size-3.5 shrink-0 text-emerald-400" strokeWidth={2.6} aria-hidden="true" />
                {step.tool && <span className="text-neutral-100">{step.tool}</span>}
                {step.detail && <span className="ml-auto max-w-1/2 truncate text-neutral-500">{step.detail}</span>}
              </div>
            ))}

            {summary && (
              <div
                className={cn(
                  "mt-3 rounded-lg bg-emerald-400/10 px-3 py-2.5 text-xs text-emerald-300",
                  shown > steps.length ? "terminal16-in" : "terminal16-wait"
                )}
              >
                {summary}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
