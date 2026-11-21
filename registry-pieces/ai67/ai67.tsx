"use client";

import type { ComponentProps } from "react";
import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

interface Ai67Props {
  title?: string;
  /** The assistant the connector is added to */
  agent?: ComponentProps<typeof AiMark>["brand"];
  /** A quiet line in the header in place of the assistant mark, e.g. a domain */
  meta?: string;
  /** Prefilled fields, a label over a value; multiline values wrap in a taller box */
  fields?: { label?: string; value: string; multiline?: boolean; prefix?: string; typing?: boolean }[];
  /** A quiet line under the fields */
  status?: string;
  /** A quiet line on the right of the status, which then sits on a ruled foot */
  note?: string;
  /** A ruled foot with a quiet label and a soft orange pill, e.g. a page with a missing title */
  warning?: { label: string; value: string };
  /** Ruled label/value rows under the fields; an accent row shows its value as a soft orange pill */
  rows?: { label: string; value: string; accent?: boolean }[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const ai67Demo: Ai67Props = {
  title: "Custom connector",
  agent: "claude",
  fields: [
    { value: "Beste" },
    { value: "https://api.beste.co/mcp" },
  ],
  framed: true,
};

const STYLES = `
@keyframes ai67-type { 0%, 8% { transform: none } 52%, 88% { transform: translateX(100%) } 96%, 100% { transform: none } }
@keyframes ai67-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.ai67-mask { animation: ai67-type 12s steps(1, end) -8s infinite }
.ai67-caret { animation: ai67-blink 1.1s step-end infinite }
@media (prefers-reduced-motion: reduce) { .ai67-mask, .ai67-caret { animation: none } .ai67-mask { transform: translateX(100%) } }
`;

export function Ai67({ title, agent, meta, fields = [], status, note, warning, rows = [], framed = true, fill = false, className }: Ai67Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {fields.some((field) => field.typing) && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && "max-w-75",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          <div className="flex items-center justify-between gap-3 text-sm font-semibold">
            <span className="truncate">{title}</span>
            {meta ? <span className="truncate text-xs font-normal text-muted-foreground">{meta}</span> : agent && <AiMark brand={agent} className="size-5 text-foreground/75" />}
          </div>
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col gap-2">
              {field.label && <span className="text-muted-foreground">{field.label}</span>}
              <span className={cn("rounded-lg px-2.5 py-2 ring-1 ring-border", field.multiline ? "min-h-12 leading-relaxed" : "truncate")}>
                {field.prefix && <span className="text-muted-foreground">{field.prefix}</span>}
                {field.typing ? (
                  <span className="relative inline-block max-w-full overflow-hidden align-top whitespace-nowrap">
                    {field.value}
                    <span aria-hidden="true" className="ai67-mask absolute inset-y-0 left-0 w-full bg-card" style={{ animationTimingFunction: `steps(${Math.max(field.value.length, 1)}, end)` }}>
                      <span className="ai67-caret absolute inset-y-px left-0 w-0.5 bg-chart-1" />
                    </span>
                  </span>
                ) : (
                  field.value
                )}
              </span>
            </div>
          ))}
          {rows.length > 0 && (
            <div className="mt-1 flex flex-col">
              {rows.map((row, index) => (
                <div key={index} className="flex items-center justify-between gap-3 border-t border-border py-2">
                  <span className="truncate">{row.label}</span>
                  {row.accent ? (
                    <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-accent-foreground">{row.value}</span>
                  ) : (
                    <span className="shrink-0 truncate text-muted-foreground">{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          {status && !note && (
            <div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{status}</span>
            </div>
          )}
          {note && (
            <div className="mt-0.5 flex items-center justify-between gap-3 border-t border-border pt-2.5 text-muted-foreground">
              <span className="flex min-w-0 items-center gap-1.5">
                {status && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-emerald-500" />}
                <span className="truncate">{status}</span>
              </span>
              <span className="shrink-0">{note}</span>
            </div>
          )}
          {warning && (
            <div className="mt-0.5 flex items-center justify-between gap-3 border-t border-border pt-2.5">
              <span className="truncate text-muted-foreground">{warning.label}</span>
              <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-accent-foreground">{warning.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
