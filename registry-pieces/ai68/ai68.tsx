"use client";

import type { ComponentProps } from "react";
import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

interface Ai68Props {
  /** The assistant on the left of the link */
  agent?: ComponentProps<typeof AiMark>["brand"];
  /** Shown while the line draws across */
  waitingLabel?: string;
  /** Shown once the two are linked */
  doneLabel?: string;
  className?: string;
}

export const ai68Demo: Ai68Props = {
  agent: "claude",
  waitingLabel: "Signing in to Beste",
  doneLabel: "Allowed, back in Claude",
};

const STYLES = `
@keyframes ai68-link { 0%, 14% { transform: scaleX(0) } 40%, 88% { transform: scaleX(1) } 96%, 100% { transform: scaleX(0) } }
@keyframes ai68-wait { 0%, 36% { opacity: 1 } 41%, 91% { opacity: 0 } 97%, 100% { opacity: 1 } }
@keyframes ai68-ok { 0%, 43% { opacity: 0 } 48%, 84% { opacity: 1 } 89%, 100% { opacity: 0 } }
.ai68-link { transform: scaleX(0); transform-origin: 0 50%; animation: ai68-link 10s cubic-bezier(.45,0,.25,1) infinite }
.ai68-wait { animation: ai68-wait 10s ease infinite }
.ai68-ok { opacity: 0; animation: ai68-ok 10s ease infinite }
@media (prefers-reduced-motion: reduce) {
  .ai68-link, .ai68-wait, .ai68-ok { animation: none }
  .ai68-link { transform: none }
  .ai68-ok { opacity: 1 }
  .ai68-wait { opacity: 0 }
}
`;

const circle = "flex size-16 shrink-0 items-center justify-center rounded-full bg-card shadow-lg";

export function Ai68({ agent = "claude", waitingLabel, doneLabel, className }: Ai68Props) {
  return (
    <div className={cn("relative flex size-full flex-col items-center justify-center gap-6.5 p-4", className)}>
      <style>{STYLES}</style>
      <div aria-hidden="true" className="flex items-center">
        <span className={circle}>
          <AiMark brand={agent} label="" className="size-5 text-foreground/75" />
        </span>
        <span className="relative h-0.5 w-24 bg-border">
          <span className="ai68-link absolute inset-0 bg-chart-1" />
        </span>
        <span className={circle}>
          <AiMark brand="beste" label="" className="size-5" />
        </span>
      </div>
      <div className="relative h-5 w-56 text-sm">
        {waitingLabel && (
          <span className="ai68-wait absolute inset-0 flex items-center justify-center gap-2 text-muted-foreground">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/60" />
            {waitingLabel}
          </span>
        )}
        {doneLabel && <span className="ai68-ok absolute inset-0 flex items-center justify-center text-foreground/80">{doneLabel}</span>}
      </div>
    </div>
  );
}
