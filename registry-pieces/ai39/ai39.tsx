"use client";

import { cn } from "@/lib/utils";

type Provider = "openai" | "anthropic" | "google" | "mistral" | "meta";

interface Ai39Props {
  provider?: Provider;
  model?: string;
  className?: string;
}

const PROVIDERS: Record<
  Provider,
  { label: string; initial: string; classes: string }
> = {
  openai: { label: "OpenAI", initial: "O", classes: "bg-emerald-500" },
  anthropic: { label: "Anthropic", initial: "A", classes: "bg-orange-500" },
  google: { label: "Google", initial: "G", classes: "bg-sky-500" },
  mistral: { label: "Mistral", initial: "M", classes: "bg-rose-500" },
  meta: { label: "Meta", initial: "M", classes: "bg-indigo-500" },
};

export const ai39Demo: Ai39Props = {
  provider: "anthropic",
  model: "claude-sonnet-4",
};

export function Ai39({
  provider = "openai",
  model = "model",
  className,
}: Ai39Props) {
  const p = PROVIDERS[provider];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 shadow-sm">
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-full text-xs font-bold text-white",
            p.classes
          )}
          aria-hidden="true"
        >
          {p.initial}
        </span>
        <div className="flex items-baseline gap-1.5 pr-1">
          <span className="text-xs font-semibold text-card-foreground">
            {p.label}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {model}
          </span>
        </div>
      </div>
    </div>
  );
}
