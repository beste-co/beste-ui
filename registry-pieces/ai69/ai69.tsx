"use client";

import { Check, Lock, X } from "lucide-react";
import type { ComponentProps } from "react";
import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

interface Ai69Props {
  /** The assistant asking for access */
  agent?: ComponentProps<typeof AiMark>["brand"];
  title?: string;
  /** The site it asks about, after a lock */
  domain?: string;
  /** Ticked rows: what it may do */
  allowed?: string[];
  /** Crossed rows with a quiet pill: what it may never do */
  denied?: { label: string; value?: string }[];
  /** A quiet line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const ai69Demo: Ai69Props = {
  agent: "claude",
  title: "Give Claude access",
  allowed: ["Read every page and section", "Write changes into your draft", "Publish when you ask"],
  denied: [{ label: "Projects in other accounts", value: "Never" }],
  framed: true,
};

export function Ai69({ agent = "claude", title, domain, allowed = [], denied = [], note, framed = true, fill = false, className }: Ai69Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-90",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-1 rounded-2xl bg-card p-4 text-sm text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          <div aria-hidden="true" className="mb-1 flex items-center gap-2">
            <AiMark brand={agent} label="" className="size-5 text-foreground/75" />
            <span className="text-muted-foreground/70">+</span>
            <AiMark brand="beste" label="" className="size-4.5" />
          </div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="truncate text-sm font-semibold">{title}</span>
            {domain && (
              <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                <Lock aria-hidden="true" className="size-3" />
                {domain}
              </span>
            )}
          </div>
          {allowed.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5 border-t border-border py-2">
              <Check aria-hidden="true" className="size-4 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
          {denied.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5 border-t border-border py-2 text-muted-foreground">
              <X aria-hidden="true" className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.value && <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground/75">{item.value}</span>}
            </div>
          ))}
          {note && (
            <div className="flex items-center gap-1.5 border-t border-border pt-2.5 text-xs text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
