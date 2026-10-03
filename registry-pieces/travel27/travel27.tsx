"use client";

import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface Phrase {
  en: string;
  local: string;
  romanized?: string;
}

interface Travel27Props {
  languageLabel?: string;
  phrases?: Phrase[];
  bordered?: boolean;
  className?: string;
}

export const travel27Demo: Travel27Props = {
  languageLabel: "Japanese",
  phrases: [
    {
      en: "Thank you",
      local: "ありがとう",
    },
    {
      en: "Excuse me",
      local: "すみません",
    },
    {
      en: "Where's the station?",
      local: "駅はどこですか",
    },
  ],
  bordered: false,
};

export function Travel27({
  languageLabel,
  phrases = [],
  bordered = false,
  className,
}: Travel27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Languages className="size-4 shrink-0 text-rose-500" aria-hidden="true" />
          {languageLabel && (
            <span className="text-xs font-semibold text-muted-foreground">
              {languageLabel}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {phrases.map((p, idx) => (
            <div key={idx} className="flex flex-col gap-0.5 py-1.5">
              <span className="text-xs text-muted-foreground">
                {p.en}
              </span>
              <span className="text-sm font-semibold text-card-foreground">
                {p.local}
              </span>
              {p.romanized && (
                <span className="text-xs italic text-muted-foreground">
                  {p.romanized}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
