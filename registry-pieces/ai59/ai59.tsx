"use client";

import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

type Ai59Brand = "claude" | "openai" | "cursor" | "grok" | "gemini";

interface Ai59Row {
  label?: string;
  value?: string;
  highlight?: boolean;
}

interface Ai59Props {
  title?: string;
  tag?: string;
  rows?: Ai59Row[];
  caption?: string;
  marks?: Ai59Brand[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  fill?: boolean;
  className?: string;
}

export const ai59Demo: Ai59Props = {
  title: "AI agent edits",
  rows: [
    { label: "Free", value: "150 a month" },
    { label: "Pro, Team and Business", value: "Unlimited", highlight: true },
  ],
  marks: ["claude", "openai", "cursor", "grok", "gemini"],
  framed: true,
};

export function Ai59({ title, tag, rows = [], caption, marks = [], framed = true, fill = false, className }: Ai59Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-xs",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{title}</span>
            {tag && <span className="text-muted-foreground">{tag}</span>}
          </div>
          {rows.map((row, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5",
                row.highlight ? "border border-border" : "bg-muted",
              )}
            >
              <span>{row.label}</span>
              <span className={cn("shrink-0", row.highlight ? "font-semibold" : "text-muted-foreground")}>{row.value}</span>
            </div>
          ))}
          {(caption || marks.length > 0) && <div aria-hidden className="h-px bg-border" />}
          {caption && <div className="text-muted-foreground">{caption}</div>}
          {marks.length > 0 && (
            <div className="flex items-center gap-4.5 text-foreground/75">
              {marks.map((brand) => (
                <AiMark key={brand} brand={brand} className="size-4.5" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
