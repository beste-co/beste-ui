"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor99Section {
  label: string;
  detail?: string;
  /** The section open in the editor, on a soft highlight */
  active?: boolean;
}

interface Editor99Props {
  /** The studio's name and square image (or initial) in the editor header */
  studio?: { name: string; image?: string; initial?: string };
  /** The editor's own address, after a lock */
  domain?: string;
  page?: string;
  status?: string;
  sections?: Editor99Section[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor99Demo: Editor99Props = {
  studio: { name: "Halden Studio", image: "https://oud.pics/b/gradients/gradient-silk-orange.webp" },
  domain: "edit.haldenstudio.com",
  page: "Home",
  sections: [
    { label: "Hero", active: true },
    { label: "Treatments" },
    { label: "Visit the studio" },
  ],
  framed: true,
};

export function Editor99({ studio, domain, page, status, sections = [], framed = true, fill = false, className }: Editor99Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-78",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col overflow-hidden rounded-2xl bg-card text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(studio || domain) && (
            <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5">
              <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                {studio?.image ? (
                  <img src={studio.image} alt="" className="size-5.5 shrink-0 rounded-md object-cover" />
                ) : studio?.initial && (
                  <span aria-hidden="true" className="flex size-5.5 shrink-0 items-center justify-center rounded-md bg-emerald-900 text-xs text-emerald-50">
                    {studio.initial}
                  </span>
                )}
                <span className="truncate">{studio?.name}</span>
              </span>
              {domain && (
                <span className="flex min-w-0 items-center gap-1 text-muted-foreground">
                  <Lock aria-hidden="true" className="size-3 shrink-0" />
                  <span className="truncate">{domain}</span>
                </span>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1 p-3">
            {(page || status) && (
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="truncate font-semibold">{page}</span>
                {status && <span className="shrink-0 text-muted-foreground">{status}</span>}
              </div>
            )}
            {sections.map((section, index) => (
              <div key={index} className={cn("flex items-center justify-between gap-3 rounded-lg px-2.5 py-2", section.active && "bg-muted")}>
                <span className="truncate">{section.label}</span>
                {section.detail && <span className="shrink-0 text-muted-foreground">{section.detail}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
