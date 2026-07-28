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
  className?: string;
}

export const travel27Demo: Travel27Props = {
  languageLabel: "Japanese · Quick phrases",
  phrases: [
    {
      en: "Thank you",
      local: "ありがとう",
      romanized: "arigatō",
    },
    {
      en: "Excuse me",
      local: "すみません",
      romanized: "sumimasen",
    },
    {
      en: "Where's the station?",
      local: "駅はどこですか",
      romanized: "eki wa doko desu ka",
    },
  ],
};

export function Travel27({
  languageLabel,
  phrases = [],
  className,
}: Travel27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-rose-500/15 text-rose-500">
            <Languages className="size-3.5" aria-hidden="true" />
          </div>
          {languageLabel && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                <span className="font-mono text-xs italic text-muted-foreground">
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
