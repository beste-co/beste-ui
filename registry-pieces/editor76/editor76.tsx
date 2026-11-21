"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Editor76Toggle {
  label: string;
  on: boolean;
  /** A quiet line under the label; rows with one are ruled */
  detail?: string;
}

interface Editor76Props {
  title?: string;
  tag?: string;
  /** A short paragraph under the title */
  description?: string;
  toggles?: Editor76Toggle[];
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor76Demo: Editor76Props = {
  title: "White label",
  toggles: [
    { label: "Beste badge on the site", on: false },
    { label: "White-label editor", on: true },
    { label: "White-label emails", on: true },
  ],
  framed: true,
};

export function Editor76({ title, tag, description, toggles = [], note, framed = true, fill = false, className }: Editor76Props) {
  const [states, setStates] = useState(() => toggles.map((toggle) => toggle.on));

  const ruled = toggles.some((toggle) => toggle.detail);
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
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold">{title}</span>
            {tag && <span className="truncate text-muted-foreground">{tag}</span>}
          </div>

          {description && <p className="-mt-1.5 leading-relaxed text-muted-foreground">{description}</p>}

          <div className={cn("flex flex-col", ruled ? "border-t border-border" : "gap-3")}>
            {toggles.map((toggle, index) => {
              const on = states[index] ?? toggle.on;
              return (
                <div key={toggle.label} className={cn("flex items-center justify-between gap-3", ruled && "border-b border-border py-2.5")}>
                  {toggle.detail ? (
                    <span>
                      <span className="block font-medium">{toggle.label}</span>
                      <span className="mt-0.5 block text-muted-foreground">{toggle.detail}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{toggle.label}</span>
                  )}
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
          </div>

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
