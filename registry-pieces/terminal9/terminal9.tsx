"use client";

import { cn } from "@/lib/utils";

type DiffType = "add" | "remove" | "context";

interface DiffLine {
  type: DiffType;
  text: string;
}

interface Terminal9Props {
  filename?: string;
  lines?: DiffLine[];
  className?: string;
}

const rowClasses: Record<DiffType, string> = {
  add: "bg-emerald-500/10 text-emerald-300",
  remove: "bg-rose-500/10 text-rose-300",
  context: "text-zinc-400",
};

const signs: Record<DiffType, string> = {
  add: "+",
  remove: "-",
  context: " ",
};

export const terminal9Demo: Terminal9Props = {
  filename: "components/Button.tsx",
  lines: [
    { type: "context", text: "function Button({ label }) {" },
    { type: "remove", text: "  return <button>{label}</button>;" },
    { type: "add", text: '  return <button className="btn">{label}</button>;' },
    { type: "context", text: "}" },
  ],
};

export function Terminal9({ filename, lines = [], className }: Terminal9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-72 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs shadow-sm">
        {filename && (
          <div className="border-b border-zinc-800 px-3 py-2 text-zinc-400">
            {filename}
          </div>
        )}
        <div className="flex flex-col py-1.5">
          {lines.map((line, index) => (
            <div
              key={index}
              className={cn("flex gap-2 px-3 py-0.5", rowClasses[line.type])}
            >
              <span className="w-2 shrink-0 select-none" aria-hidden="true">
                {signs[line.type]}
              </span>
              <span className="truncate">{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
