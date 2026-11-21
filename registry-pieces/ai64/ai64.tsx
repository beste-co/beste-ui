"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai64Step {
  label: string;
  /** A quiet note after the label, e.g. "5 pages" */
  note?: string;
}

interface Ai64Props {
  /** What the person asked for */
  request?: string;
  /** What the agent did, ticked off in turn */
  steps?: Ai64Step[];
  /** The agent's answer at the foot */
  reply?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

const STYLES = `
@keyframes ai64-step { 0% { opacity: 0; transform: translateY(4px) } 8%, 86% { opacity: 1; transform: none } 93%, 100% { opacity: 0; transform: none } }
.ai64-step { opacity: 0; animation: ai64-step 12s ease infinite }
@media (prefers-reduced-motion: reduce) { .ai64-step { animation: none; opacity: 1 } }
`;

export const ai64Demo: Ai64Props = {
  request: "Add our three facials to the Treatments page, with durations.",
  steps: [
    { label: "list_pages" },
    { label: "Picked a pricing section from the library" },
    { label: "update_section", note: "saved to draft" },
  ],
  reply: "The facials are in your draft. Tell me when to publish.",
  framed: true,
};

export function Ai64({ request, steps = [], reply, framed = true, fill = false, className }: Ai64Props) {
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
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {request && <p className="max-w-75 self-end rounded-xl rounded-br-sm bg-muted px-3 py-2.5 leading-relaxed">{request}</p>}
          {steps.length > 0 && (
            <ul className="flex flex-col gap-2">
              {steps.map((step, index) => (
                <li key={index} className="ai64-step flex items-center gap-2" style={{ animationDelay: `${index * 1.44}s` }}>
                  <Check aria-hidden="true" className="size-4 shrink-0" />
                  <span>{step.label}</span>
                  {step.note && <span className="text-muted-foreground">{step.note}</span>}
                </li>
              ))}
            </ul>
          )}
          {reply && <p className="border-t border-border pt-2.5 leading-relaxed text-foreground/75">{reply}</p>}
        </div>
      </div>
    </div>
  );
}
