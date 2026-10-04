"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai8Props {
  user?: string;
  assistant?: string;
  bordered?: boolean;
  className?: string;
}

export const ai8Demo: Ai8Props = {
  user: "What's the capital of Japan?",
  assistant:
    "Tokyo. It's been the capital since 1868, after Kyoto held the title for over a thousand years.",
  bordered: false,
};

export function Ai8({
  user,
  assistant,
  bordered = false,
  className,
}: Ai8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2">
        {user && (
          <div className="ml-auto max-w-64 rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm leading-snug text-primary-foreground shadow-sm">
            {user}
          </div>
        )}
        {assistant && (
          <div className="flex items-start gap-2">
            <Sparkles className="mt-2 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div className={cn("max-w-64 rounded-2xl rounded-bl-md bg-card px-3 py-2 text-sm leading-snug text-card-foreground shadow-sm", bordered && "border border-border")}>
              {assistant}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
