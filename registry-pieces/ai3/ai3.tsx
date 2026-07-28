"use client";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai3Props {
  model?: string;
  speed?: string;
  image?: string;
  alt?: string;
  className?: string;
}

export const ai3Demo: Ai3Props = {
  model: "Claude Opus 4.6",
  speed: "Balanced",
  image: "https://oud.pics/sm/l/claude.png",
  alt: "Claude",
};

export function Ai3({
  model = "Model",
  speed,
  image,
  alt,
  className,
}: Ai3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm transition-colors hover:bg-muted"
      >
        {image ? (
          <span className="relative size-5 shrink-0 overflow-hidden rounded-full bg-card">
            <img
              src={image}
              alt={alt ?? model}
              className="absolute inset-0 size-full object-cover"
            />
          </span>
        ) : (
          <div className="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
            <Sparkles className="size-3" aria-hidden="true" />
          </div>
        )}
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-card-foreground">
            {model}
          </span>
          {speed && (
            <span className="text-xs text-muted-foreground">{speed}</span>
          )}
        </div>
        <ChevronDown
          className="size-3.5 text-muted-foreground"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
