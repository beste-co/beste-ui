"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat34Props {
  question?: string;
  answer?: string;
  sourcesLabel?: string;
  sources?: string[];
  className?: string;
}

export const chat34Demo: Chat34Props = {
  question: "How many rooms were unused last Tuesday?",
  answer:
    "Three, all at Kingsway between 13:00 and 16:00. Two were held for a clinic that was cancelled on the Friday before.",
  sourcesLabel: "Answered from",
  sources: ["Rota", "Bookings", "Cancellations"],
};

export function Chat34({ question, answer, sourcesLabel, sources = [], className }: Chat34Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-96 rounded-md border border-border bg-card p-5 shadow-xl">
        {question && (
          <p className="ml-auto w-fit max-w-[85%] rounded-md bg-muted px-3 py-2 text-sm text-card-foreground">
            {question}
          </p>
        )}

        <div className="mt-3 flex gap-2.5">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Sparkles className="size-3.5" />
          </span>
          {answer && (
            <p className="text-sm leading-relaxed text-card-foreground">{answer}</p>
          )}
        </div>

        {sources.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            {sourcesLabel && (
              <span className="text-sm text-muted-foreground">{sourcesLabel}</span>
            )}
            {sources.map((source, index) => (
              <span
                key={index}
                className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {source}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
