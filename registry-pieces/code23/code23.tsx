"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface Code23Props {
  title?: string;
  meta?: string;
  /** The prompt before the command, e.g. "$" */
  prompt?: string;
  command?: string;
  /** The files the command added, each with a tick */
  files?: string[];
  /** A dot line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const code23Demo: Code23Props = {
  title: "Terminal",
  prompt: "$",
  command: "npx shadcn@latest add @beste-ui/hero181",
  files: ["components/hero181.tsx", "components/ui/button.tsx"],
  note: "Styles come from your own theme tokens",
  framed: true,
};

export function Code23({ title, meta, prompt, command, files = [], note, framed = true, fill = false, className }: Code23Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-105",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="truncate text-muted-foreground">{meta}</span>}
            </div>
          )}
          {command && (
            <div className="rounded-lg bg-muted px-3.5 py-3 leading-relaxed break-all text-foreground/90">
              {prompt && <span className="text-muted-foreground">{prompt} </span>}
              {command}
            </div>
          )}
          {files.length > 0 && (
            <div className="flex flex-col text-foreground/80">
              {files.map((file, index) => (
                <div key={index} className={cn("flex items-center gap-2 px-0.5 py-2", index < files.length - 1 && "border-b border-border")}>
                  <Check aria-hidden="true" className="size-3.5 shrink-0 text-foreground" />
                  <span className="truncate">{file}</span>
                </div>
              ))}
            </div>
          )}
          {note && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              {note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
