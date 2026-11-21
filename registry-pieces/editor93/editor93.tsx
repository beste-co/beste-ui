"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor93Step {
  label: string;
  /** A quiet line while the step waits */
  waitingLabel?: string;
  /** The green line once it is done */
  doneLabel?: string;
  /** Waits first, then ticks itself off on a loop; done steps are ticked from the start */
  pending?: boolean;
}

interface Editor93Props {
  title?: string;
  meta?: string;
  /** The address in the field under the header */
  domain?: string;
  steps?: Editor93Step[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor93Demo: Editor93Props = {
  title: "Custom domain",
  domain: "orielstudio.pt",
  steps: [
    { label: "Domain added in settings" },
    { label: "Records added at the registrar" },
    { label: "DNS records", waitingLabel: "Usually minutes", doneLabel: "Resolved", pending: true },
    { label: "SSL certificate", waitingLabel: "Issued for you", doneLabel: "Active", pending: true },
  ],
  framed: true,
};

const STYLES = `
@keyframes editor93-wait { 0%, 33% { opacity: 1 } 36%, 94% { opacity: 0 } 97%, 100% { opacity: 1 } }
@keyframes editor93-done { 0%, 37% { opacity: 0; transform: scale(0.7) } 40.5%, 89% { opacity: 1; transform: none } 92%, 100% { opacity: 0; transform: none } }
@keyframes editor93-pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.35 } }
.editor93-wait { animation: editor93-wait 12s ease infinite }
.editor93-done { opacity: 0; animation: editor93-done 12s ease infinite }
.editor93-pulse { animation: editor93-pulse 1.8s ease-in-out infinite }
@media (prefers-reduced-motion: reduce) {
  .editor93-wait, .editor93-done, .editor93-pulse { animation: none }
  .editor93-wait { opacity: 0 }
  .editor93-done { opacity: 1 }
}
`;

export function Editor93({ title, meta, domain, steps = [], framed = true, fill = false, className }: Editor93Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-85",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-semibold">{title}</span>
              {meta && <span className="shrink-0 text-muted-foreground">{meta}</span>}
            </div>
          )}
          {domain && <div className="truncate rounded-lg bg-background px-3 py-2.5 text-sm ring-1 ring-border">{domain}</div>}
          <div className="flex flex-col">
            {steps.map((step, index) => {
              const order = steps.slice(0, index).filter((item) => item.pending).length;
              const delay = step.pending ? { animationDelay: `${-1.6 * order}s` } : undefined;
              return (
                <div key={index} className="flex items-center gap-2.5 border-t border-border py-2.5">
                  {step.pending ? (
                    <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center">
                      <span className="editor93-wait col-start-1 row-start-1" style={delay}>
                        <span className="editor93-pulse block size-2 rounded-full ring-1 ring-muted-foreground/40" />
                      </span>
                      <Check className="editor93-done col-start-1 row-start-1 size-4" style={delay} />
                    </span>
                  ) : (
                    <Check aria-hidden="true" className="size-4 shrink-0" />
                  )}
                  <span className="min-w-0 flex-1 truncate">{step.label}</span>
                  {step.pending ? (
                    <span className="grid shrink-0 justify-items-end">
                      {step.waitingLabel && (
                        <span className="editor93-wait col-start-1 row-start-1 text-muted-foreground" style={delay}>
                          {step.waitingLabel}
                        </span>
                      )}
                      {step.doneLabel && (
                        <span className="editor93-done col-start-1 row-start-1 text-emerald-700" style={delay}>
                          {step.doneLabel}
                        </span>
                      )}
                    </span>
                  ) : (
                    step.doneLabel && <span className="shrink-0 text-emerald-700">{step.doneLabel}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
