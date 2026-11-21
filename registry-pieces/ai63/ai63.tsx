"use client";

import { Layers } from "lucide-react";
import type { ComponentProps } from "react";
import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

interface Ai63Props {
  /** The assistant sending the changes */
  agent?: ComponentProps<typeof AiMark>["brand"];
  /** How many change batches wait in the draft */
  batches?: number;
  /** The note under the publish mark */
  publishLabel?: string;
  className?: string;
}

const STYLES = `
@keyframes ai63-flow { to { stroke-dashoffset: -32 } }
@keyframes ai63-pop {
  0%, 20%, 100% { box-shadow: 0 0 0 1px var(--border) }
  30%, 60% { box-shadow: 0 0 0 1px var(--chart-1), 0 0 0 4px color-mix(in oklab, var(--chart-1) 12%, transparent) }
}
.ai63-flow { animation: ai63-flow 3s linear infinite }
.ai63-batch { box-shadow: 0 0 0 1px var(--border); animation: ai63-pop 9s ease infinite }
@media (prefers-reduced-motion: reduce) { .ai63-flow, .ai63-batch { animation: none } }
`;

export const ai63Demo: Ai63Props = {
  agent: "openai",
  batches: 3,
  publishLabel: "Published when you ask",
};

export function Ai63({ agent = "openai", batches = 3, publishLabel, className }: Ai63Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <div className="relative h-65 w-75 shrink-0 text-xs">
        <svg viewBox="0 0 300 260" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
          {["M66 44 H140 Q150 44 150 54 V102", "M150 158 V204 Q150 214 160 214 H240"].map((d) => (
            <path key={d} d={d} fill="none" strokeWidth="1.2" strokeDasharray="4 4" className="ai63-flow stroke-border" />
          ))}
        </svg>
        <div className="absolute top-5.5 left-5.5 flex size-11 items-center justify-center rounded-full bg-card text-foreground/75 shadow-md ring-1 ring-border">
          <AiMark brand={agent} className="size-5" />
        </div>
        <div aria-hidden="true" className="absolute top-25.5 left-16 flex h-14 w-42.5 items-center justify-center gap-2.5 rounded-full bg-muted ring-1 ring-border">
          {Array.from({ length: Math.min(batches, 3) }, (_, index) => (
            <span key={index} className="ai63-batch flex size-10 items-center justify-center rounded-full bg-card" style={{ animationDelay: `${-index * 3}s` }}>
              <Layers className="size-4.5 text-chart-1" strokeWidth={1.4} />
            </span>
          ))}
        </div>
        <div className="absolute top-48 left-60 flex size-11 items-center justify-center rounded-full bg-primary shadow-md">
          <AiMark brand="beste" className="size-4.5" />
        </div>
        {publishLabel && <span className="absolute top-59 left-1/2 -translate-x-1/2 whitespace-nowrap text-muted-foreground">{publishLabel}</span>}
      </div>
    </div>
  );
}
