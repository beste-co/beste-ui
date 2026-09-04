"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor49Props {
  documentTitle?: string;
  lines?: string[];
  draft?: string;
  editors?: string[];
  charMs?: number;
  holdMs?: number;
  hopMs?: number;
  className?: string;
}

export const editor49Demo: Editor49Props = {
  documentTitle: "Launch notes",
  lines: [
    "The beta opens to the waitlist on Monday.",
    "Support has the new macros ready.",
    "Pricing page copy is locked.",
  ],
  draft: "Adding one line about the migration guide.",
  editors: ["Joni Mitchell", "Thom Yorke"],
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Editor49({
  documentTitle = "Document",
  lines = [],
  draft = "",
  editors = ["Editor one", "Editor two"],
  charMs = 40,
  holdMs = 2200,
  hopMs = 2000,
  className,
}: Editor49Props) {
  const [hop, setHop] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (lines.length === 0) return;
    const id = setInterval(() => setHop((h) => (h + 1) % lines.length), hopMs);
    return () => clearInterval(id);
  }, [lines.length, hopMs]);

  useEffect(() => {
    if (count < draft.length) {
      const id = setTimeout(() => setCount((c) => c + 1), charMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setCount(0), holdMs);
    return () => clearTimeout(id);
  }, [count, draft.length, charMs, holdMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes editor49-blink { 0%, 45% { opacity: 1; } 55%, 100% { opacity: 0.15; } }
`}</style>

      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-card-foreground">
            {documentTitle}
          </span>
          <span className="ml-auto flex items-center gap-1" aria-hidden="true">
            <span className="flex size-6 items-center justify-center rounded-full bg-violet-500 text-xs font-medium text-white">
              {initials(editors[0] ?? "A")}
            </span>
            <span className="flex size-6 items-center justify-center rounded-full bg-amber-500 text-xs font-medium text-white">
              {initials(editors[1] ?? "B")}
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm leading-relaxed text-card-foreground">
          {lines.map((line, i) => (
            <p key={line}>
              {line}
              {i === hop && (
                <span className="relative inline-block" aria-hidden="true">
                  <span
                    className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-violet-500"
                    style={{ animation: "editor49-blink 1100ms steps(1) infinite" }}
                  />
                  <span className="absolute -top-4 left-0.5 whitespace-nowrap rounded-sm bg-violet-500 px-1 text-xs text-white">
                    {editors[0]}
                  </span>
                </span>
              )}
            </p>
          ))}

          <p className="relative text-muted-foreground">
            <span className="invisible" aria-hidden="true">
              {draft}
            </span>
            <span className="absolute inset-0">
              {draft.slice(0, count)}
              <span className="relative inline-block" aria-hidden="true">
                <span
                  className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-amber-500"
                  style={{ animation: "editor49-blink 900ms steps(1) infinite" }}
                />
                <span className="absolute -top-4 left-0.5 whitespace-nowrap rounded-sm bg-amber-500 px-1 text-xs text-white">
                  {editors[1]}
                </span>
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
