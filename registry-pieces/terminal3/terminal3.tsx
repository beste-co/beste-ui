"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Terminal3Props {
  title?: string;
  prompt?: string;
  command?: string;
  output?: string[];
  success?: string;
  className?: string;
}

export const terminal3Demo: Terminal3Props = {
  title: "deploy",
  prompt: "$",
  command: "beste deploy --prod",
  output: ["Building application…", "Uploading assets…"],
  success: "Deployed in 4.2s",
};

export function Terminal3({
  title,
  prompt = "$",
  command,
  output = [],
  success,
  className,
}: Terminal3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-72 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-zinc-800 px-3 py-2">
          <span className="size-2.5 rounded-full bg-red-500" aria-hidden="true" />
          <span
            className="size-2.5 rounded-full bg-yellow-500"
            aria-hidden="true"
          />
          <span
            className="size-2.5 rounded-full bg-green-500"
            aria-hidden="true"
          />
          {title && <span className="ml-1 text-zinc-500">{title}</span>}
        </div>
        <div className="flex flex-col gap-1.5 px-3 py-3">
          <div className="flex gap-2">
            <span className="shrink-0 text-emerald-400">{prompt}</span>
            <span className="text-zinc-50">{command}</span>
          </div>
          {output.map((line, index) => (
            <span key={index} className="text-zinc-400">
              {line}
            </span>
          ))}
          {success && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
              {success}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
