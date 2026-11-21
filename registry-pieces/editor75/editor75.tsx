"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

interface Editor75Toggle {
  label: string;
  on: boolean;
}

interface Editor75Props {
  title?: string;
  tag?: string;
  domain?: string;
  connectedLabel?: string;
  sslLabel?: string;
  ssl?: string;
  pagesLabel?: string;
  pages?: string;
  toggles?: Editor75Toggle[];
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor75Demo: Editor75Props = {
  title: "Domain",
  domain: "orielstudio.pt",
  connectedLabel: "Connected",
  sslLabel: "SSL certificate",
  ssl: "Active",
  toggles: [
    { label: "Password protection", on: true },
    { label: "Maintenance mode", on: false },
  ],
  framed: true,
};

export function Editor75({
  title,
  tag,
  domain,
  connectedLabel,
  sslLabel,
  ssl,
  pagesLabel,
  pages,
  toggles = [],
  note,
  framed = true,
  fill = false,
  className,
}: Editor75Props) {
  const [states, setStates] = useState(() => toggles.map((toggle) => toggle.on));

  const initial = toggles.map((toggle) => (toggle.on ? "1" : "0")).join("");

  useEffect(() => setStates(initial.split("").map((value) => value === "1")), [initial]);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-90",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-3 rounded-2xl bg-card p-3.5 text-xs text-card-foreground",
            !framed && "shadow-lg"
          )}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{title}</span>
            {tag && <span className="text-muted-foreground">{tag}</span>}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 ring-1 ring-border">
            <span className="truncate text-sm font-medium">{domain}</span>
            {connectedLabel && (
              <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {connectedLabel}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">{sslLabel}</span>
            <span className="flex items-center gap-1.5">
              <Lock className="size-3 shrink-0" aria-hidden="true" />
              {ssl}
            </span>
          </div>

          {pagesLabel && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{pagesLabel}</span>
              <span>{pages}</span>
            </div>
          )}

          {toggles.length > 0 && <div className="h-px bg-border" aria-hidden="true" />}

          {toggles.map((toggle, index) => {
            const on = states[index] ?? toggle.on;
            return (
              <div key={toggle.label} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{toggle.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={toggle.label}
                  onClick={() => setStates((prev) => prev.map((value, i) => (i === index ? !value : value)))}
                  className={cn(
                    "relative inline-flex h-4.5 w-7.5 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                    on ? "bg-primary" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block size-3.5 rounded-full bg-background shadow-sm transition-transform",
                      on ? "translate-x-3.5" : "translate-x-0.5"
                    )}
                    aria-hidden="true"
                  />
                </button>
              </div>
            );
          })}

          {note && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden="true" />
              {note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
