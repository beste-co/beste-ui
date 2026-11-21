"use client";

import type { ComponentProps } from "react";

import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

interface Ai65Props {
  /** The assistant's picture and name in the header */
  assistant?: { name: string; image?: string };
  /** An assistant's mark in the header instead of the picture */
  agent?: ComponentProps<typeof AiMark>["brand"];
  /** Where the conversation happens, e.g. the page that is open */
  context?: string;
  request?: string;
  reply?: string;
  /** The caption over the chips of what changed */
  changesLabel?: string;
  changes?: string[];
  /** A ruled foot row: a status on the left, a short note on the right */
  footer?: { status?: string; note?: string };
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const ai65Demo: Ai65Props = {
  assistant: { name: "Bestie", image: "https://oud.pics/b/beste/bestie-jelly.webp" },
  request: "Add a contact form under the pricing table",
  reply: "Added a contact form below the pricing table. It is in your draft.",
  changes: ["Pricing page", "Contact form"],
  framed: true,
};

export function Ai65({ assistant, agent, context, request, reply, changesLabel, changes = [], footer, framed = true, fill = false, className }: Ai65Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3.5 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(assistant || agent || context) && (
            <div className="flex items-center gap-2 border-b border-border pb-3">
              {agent && <AiMark brand={agent} label="" className="size-5 text-foreground/75" />}
              {!agent && assistant?.image && <img src={assistant.image} alt="" aria-hidden="true" className="size-5.5 object-contain" />}
              {assistant && <span className="text-sm font-semibold">{assistant.name}</span>}
              {context && <span className="ml-auto text-muted-foreground">{context}</span>}
            </div>
          )}
          {request && <p className="max-w-65 self-end rounded-xl rounded-br-sm bg-muted px-3 py-2.5 leading-relaxed">{request}</p>}
          {reply && <p className="leading-relaxed text-foreground/75">{reply}</p>}
          {changes.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-border pt-3">
              {changesLabel && <span className="text-muted-foreground">{changesLabel}</span>}
              <div className="flex flex-wrap gap-1.5">
                {changes.map((change, index) => (
                  <span key={index} className="rounded-full px-2.5 py-0.5 ring-1 ring-border">
                    {change}
                  </span>
                ))}
              </div>
            </div>
          )}
          {footer && (footer.status || footer.note) && (
            <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5 text-muted-foreground">
              <span>{footer.status}</span>
              {footer.note && <span className="truncate">{footer.note}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
