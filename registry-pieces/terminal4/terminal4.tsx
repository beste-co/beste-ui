"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Manager = "npm" | "pnpm" | "yarn" | "bun";

interface Terminal4Props {
  packageName?: string;
  className?: string;
}

const MANAGERS: Manager[] = ["npm", "pnpm", "yarn", "bun"];

function buildCommand(manager: Manager, pkg: string) {
  const verb = manager === "npm" ? "install" : "add";
  return `${manager} ${verb} ${pkg}`;
}

export const terminal4Demo: Terminal4Props = {
  packageName: "beste-ui",
};

export function Terminal4({
  packageName = "beste-ui",
  className,
}: Terminal4Props) {
  const [active, setActive] = useState<Manager>("npm");
  const [copied, setCopied] = useState(false);
  const command = buildCommand(active, packageName);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* noop */
    }
  };

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-72 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-sm">
        <div className="flex items-center gap-1 border-b border-zinc-800 px-2 py-2">
          {MANAGERS.map((manager) => (
            <button
              key={manager}
              type="button"
              onClick={() => setActive(manager)}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                active === manager
                  ? "bg-zinc-800 text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {manager}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 font-mono text-xs text-zinc-50">
          <span className="shrink-0 text-emerald-400">$</span>
          <code className="flex-1 truncate">{command}</code>
          <button
            type="button"
            onClick={handleCopy}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:text-zinc-50"
            aria-label={copied ? "Copied" : "Copy command"}
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
