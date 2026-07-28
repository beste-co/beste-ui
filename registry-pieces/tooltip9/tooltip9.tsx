"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tooltip9Props {
  label?: string;
  className?: string;
}

export const tooltip9Demo: Tooltip9Props = {
  label: "Copied!",
};

export function Tooltip9({
  label = "Copied!",
  className,
}: Tooltip9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
          <Check className="size-3.5" aria-hidden="true" />
          {label}
        </div>
        <div
          className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-emerald-500"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
