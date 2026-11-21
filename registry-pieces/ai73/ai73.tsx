"use client";

import { ArrowUpRight, Check } from "lucide-react";

import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

type Ai73Brand = "claude" | "openai" | "cursor" | "grok" | "gemini";

interface Ai73Step {
  /** The tool the assistant called, e.g. "add_section" */
  tool?: string;
  detail?: string;
}

interface Ai73Props {
  brand?: Ai73Brand;
  client?: string;
  prompt?: string;
  steps?: Ai73Step[];
  /** The closing card with the draft preview */
  result?: { title?: string; url?: string };
  /** Let the tool calls tick in one by one on a loop */
  animated?: boolean;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const ai73Demo: Ai73Props = {
  brand: "claude",
  client: "Claude",
  prompt: "Build a site for Prata, our bakery in Lisbon. Warm, simple, with the menu and opening hours.",
  steps: [
    { tool: "create_website", detail: "Prata, English" },
    { tool: "add_section", detail: "Hero with a photo" },
    { tool: "add_section", detail: "Menu cards" },
    { tool: "set_theme", detail: "Warm sand" },
  ],
  result: { title: "Draft ready to review", url: "preview.beste.co/prata" },
  animated: true,
  framed: true,
};

// One keyframe per row: everything shows first, then the rows replay in order
const MAX_ROWS = 6;
const STYLES = [
  ...Array.from({ length: MAX_ROWS }, (_, index) => {
    const start = 16 + index * 9;
    return `@keyframes ai73-row-${index} { 0%, 8% { opacity: 1; transform: none } 11%, ${start}% { opacity: 0; transform: translateY(4px) } ${start + 4}%, 100% { opacity: 1; transform: none } }
.ai73-row-${index} { animation: ai73-row-${index} 14s ease infinite }`;
  }),
  `@media (prefers-reduced-motion: reduce) { ${Array.from({ length: MAX_ROWS }, (_, index) => `.ai73-row-${index}`).join(", ")} { animation: none } }`,
].join("\n");

export function Ai73({ brand = "claude", client, prompt, steps = [], result, animated = true, framed = true, fill = false, className }: Ai73Props) {
  const rowClass = (index: number) => (animated ? `ai73-row-${Math.min(index, MAX_ROWS - 1)}` : undefined);
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {animated && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div aria-hidden="true" className={cn("flex flex-col gap-3 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-center gap-2 text-sm">
            <AiMark brand={brand} label="" className="size-4.5" />
            <span className="font-semibold">{client}</span>
          </div>
          {prompt && <p className="ml-6 rounded-2xl rounded-tr-md bg-muted px-3 py-2.5 leading-relaxed">{prompt}</p>}
          {steps.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {steps.map((step, index) => (
                <div key={index} className={cn("flex items-center gap-2.5 rounded-lg border border-border px-2.5 py-2", rowClass(index))}>
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  <span className="shrink-0 font-medium">{step.tool}</span>
                  {step.detail && <span className="min-w-0 truncate text-muted-foreground">{step.detail}</span>}
                </div>
              ))}
            </div>
          )}
          {result && (
            <div className={cn("flex items-center gap-2.5 rounded-xl bg-muted p-2.5", rowClass(steps.length))}>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{result.title}</span>
                {result.url && <span className="block truncate text-muted-foreground">{result.url}</span>}
              </span>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
