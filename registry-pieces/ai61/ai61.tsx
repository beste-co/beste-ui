"use client";

import { cn } from "@/lib/utils";

type Access = "read" | "write";

interface Ai61Tool {
  name: string;
  /** The tag on the right, e.g. "reads" or "writes draft" */
  tag: string;
  access?: Access;
}

interface Ai61Props {
  title?: string;
  count?: string;
  tools?: Ai61Tool[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

const accessClasses: Record<Access, string> = {
  read: "bg-muted text-muted-foreground",
  write: "bg-accent text-accent-foreground",
};

export const ai61Demo: Ai61Props = {
  title: "Tools",
  tools: [
    { name: "list_pages", tag: "reads", access: "read" },
    { name: "update_section", tag: "writes draft", access: "write" },
    { name: "create_page", tag: "writes draft", access: "write" },
    { name: "undo_batch", tag: "writes draft", access: "write" },
  ],
  framed: true,
};

export function Ai61({ title, count, tools = [], framed = true, fill = false, className }: Ai61Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2 rounded-2xl bg-card p-3.5 pb-10 text-xs text-card-foreground", !framed && "shadow-lg ring-1 ring-border")}>
          <div className="mb-1 flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full bg-border" />
            <span aria-hidden="true" className="size-2 rounded-full bg-border" />
            <span aria-hidden="true" className="size-2 rounded-full bg-border" />
            {title && <span className="ml-2 text-sm font-semibold">{title}</span>}
            {count && <span className="ml-auto text-muted-foreground">{count}</span>}
          </div>
          {tools.map((tool, index) => (
            <div key={index} className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 ring-1 ring-border">
              <span className="truncate">{tool.name}</span>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5", accessClasses[tool.access ?? "read"])}>{tool.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
