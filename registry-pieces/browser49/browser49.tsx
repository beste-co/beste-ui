"use client";

import { Lock, LockOpen } from "lucide-react";

import { cn } from "@/lib/utils";

interface Browser49State {
  label: string;
  /** A quiet word after the label */
  detail?: string;
}

interface Browser49Props {
  domain?: string;
  /** The line under the address while the site is behind a password */
  locked?: Browser49State;
  /** The line once it is open to everyone */
  open?: Browser49State;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const browser49Demo: Browser49Props = {
  domain: "lisboncraftsummit.com",
  locked: { label: "Password on" },
  open: { label: "Open to everyone" },
};

const STYLES = `
@keyframes browser49-a { 0%, 38% { opacity: 1 } 43%, 88% { opacity: 0 } 93%, 100% { opacity: 1 } }
@keyframes browser49-b { 0%, 45% { opacity: 0 } 50%, 82% { opacity: 1 } 87%, 100% { opacity: 0 } }
.browser49-a { animation: browser49-a 11s ease infinite }
.browser49-b { opacity: 0; animation: browser49-b 11s ease infinite }
@media (prefers-reduced-motion: reduce) { .browser49-a, .browser49-b { animation: none } .browser49-a { opacity: 0 } .browser49-b { opacity: 1 } }
`;

function Line({ state, className }: { state?: Browser49State; className: string }) {
  if (!state) return null;
  return (
    <span className={cn("col-start-1 row-start-1 flex items-center justify-center gap-2", className)}>
      {state.label}
      {state.detail && <span className="text-muted-foreground">{state.detail}</span>}
    </span>
  );
}

export function Browser49({ domain, locked, open, fill = false, className }: Browser49Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div className={cn("flex w-full flex-col items-center gap-4.5", !fill && "max-w-100")} aria-hidden="true">
        <div className="flex h-14.5 w-full items-center gap-3 rounded-full bg-card px-5 text-card-foreground shadow-lg">
          <span className="grid size-3.5 shrink-0">
            <Lock className="browser49-a col-start-1 row-start-1 size-3.5 text-chart-1" />
            <LockOpen className="browser49-b col-start-1 row-start-1 size-3.5 text-muted-foreground" />
          </span>
          <span className="truncate text-base tracking-tight">{domain}</span>
        </div>
        <span className="grid w-full text-sm text-foreground/80">
          <Line state={locked} className="browser49-a" />
          <Line state={open} className="browser49-b" />
        </span>
      </div>
    </div>
  );
}
