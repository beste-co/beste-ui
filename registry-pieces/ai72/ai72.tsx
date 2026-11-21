"use client";

import { cn } from "@/lib/utils";

interface Ai72Props {
  title?: string;
  meta?: string;
  /** Ruled parts of the prompt, a quiet label over a sentence */
  fields?: { label: string; value: string }[];
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const ai72Demo: Ai72Props = {
  title: "Your prompt",
  fields: [
    { label: "What you do", value: "A ceramics studio in Porto with weekend classes." },
    { label: "Who it is for", value: "People booking a class for a birthday." },
    { label: "How it should feel", value: "Warm, quiet, photography-led." },
  ],
  framed: true,
};

export function Ai72({ title, meta, fields = [], note, framed = true, fill = false, className }: Ai72Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-100",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col rounded-2xl bg-card p-4 text-sm text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-semibold">{title}</span>
              {meta && <span className="truncate text-xs text-muted-foreground">{meta}</span>}
            </div>
          )}
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col gap-1.5 border-t border-border py-2.5">
              <span className="text-xs text-muted-foreground">{field.label}</span>
              <span className="leading-normal">{field.value}</span>
            </div>
          ))}
          {note && <div className="border-t border-border pt-2.5 text-xs text-muted-foreground">{note}</div>}
        </div>
      </div>
    </div>
  );
}
