"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface Dashboard56Group {
  /** The quiet group name, e.g. Analytics */
  label?: string;
  /** The tool in this group */
  name: string;
  /** The tool's logo before the name */
  logo?: string;
  /** Letters in a small square chip when there is no logo */
  initials?: string;
  /** The ID or number in the field */
  value?: string;
  /** A hint in the empty field when there is no value */
  placeholder?: string;
  /** A green pill when the tool is connected; without it the row shows the idle label */
  status?: string;
  /** The value types itself in and the idle label turns into the status on a loop */
  typing?: boolean;
}

interface Dashboard56Props {
  title?: string;
  meta?: string;
  groups?: Dashboard56Group[];
  /** What a tool without a value shows, e.g. Not connected */
  idleLabel?: string;
  /** A dot line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard56Demo: Dashboard56Props = {
  title: "Integrations",
  groups: [
    { name: "Google Analytics", logo: "https://cdn.simpleicons.org/googleanalytics", value: "G-4kx7q2m9pl", status: "Active", typing: true },
    { name: "Tawk.to", logo: "https://www.tawk.to/icon.png", placeholder: "Property ID" },
    { name: "WhatsApp", logo: "https://cdn.simpleicons.org/whatsapp", value: "+351 912 345 678", status: "Active" },
  ],
  idleLabel: "Not connected",
  framed: true,
};

const STYLES = `
@keyframes dashboard56-type { 0%, 6% { width: 0 } 30%, 86% { width: var(--dashboard56-w) } 94%, 100% { width: 0 } }
@keyframes dashboard56-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
@keyframes dashboard56-on { 0%, 32% { opacity: 0 } 37%, 86% { opacity: 1 } 92%, 100% { opacity: 0 } }
@keyframes dashboard56-off { 0%, 32% { opacity: 1 } 37%, 86% { opacity: 0 } 92%, 100% { opacity: 1 } }
.dashboard56-type { width: var(--dashboard56-w); animation: dashboard56-type 11s infinite; animation-delay: -5s }
.dashboard56-caret { animation: dashboard56-blink 1.1s step-end infinite }
.dashboard56-on { animation: dashboard56-on 11s ease infinite; animation-delay: -5s }
.dashboard56-off { opacity: 0; animation: dashboard56-off 11s ease infinite; animation-delay: -5s }
@media (prefers-reduced-motion: reduce) { .dashboard56-type, .dashboard56-caret, .dashboard56-on, .dashboard56-off { animation: none } .dashboard56-off { opacity: 0 } .dashboard56-on { opacity: 1 } }
`;

const pill = "rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";

export function Dashboard56({ title, meta, groups = [], idleLabel, note, framed = true, fill = false, className }: Dashboard56Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-98",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-semibold">{title}</span>
              {meta && <span className="shrink-0 text-muted-foreground">{meta}</span>}
            </div>
          )}

          {groups.map((group, index) => {
            const typing = Boolean(group.typing && group.value);
            const style = typing
              ? ({ "--dashboard56-w": `${(group.value?.length ?? 0) + 1}ch`, animationTimingFunction: `steps(${Math.max(group.value?.length ?? 1, 1)}, end)` } as CSSProperties)
              : undefined;
            return (
              <div key={index} className="flex flex-col gap-1.5 border-t border-border pt-2.5">
                {group.label && <span className="text-muted-foreground">{group.label}</span>}
                <div className="flex items-center justify-between gap-2.5">
                  <span className="flex min-w-0 items-center gap-2 text-sm">
                    {group.logo ? (
                      <img src={group.logo} alt="" className="size-5 shrink-0 object-contain" />
                    ) : group.initials && (
                      <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-foreground/70 ring-1 ring-border">
                        {group.initials}
                      </span>
                    )}
                    <span className="truncate">{group.name}</span>
                  </span>
                  {typing && group.status ? (
                    <span className="grid shrink-0 justify-items-end">
                      <span className={cn("dashboard56-on col-start-1 row-start-1", pill)}>{group.status}</span>
                      <span className="dashboard56-off col-start-1 row-start-1 self-center text-muted-foreground">{idleLabel}</span>
                    </span>
                  ) : group.status && group.value ? (
                    <span className={cn("shrink-0", pill)}>{group.status}</span>
                  ) : (
                    <span className="shrink-0 text-muted-foreground">{idleLabel}</span>
                  )}
                </div>
                <div className="flex items-center rounded-lg px-2.5 py-2 ring-1 ring-border">
                  {typing ? (
                    <>
                      <span className="dashboard56-type inline-block overflow-hidden whitespace-nowrap" style={style}>
                        {group.value}
                      </span>
                      <span aria-hidden="true" className="dashboard56-caret ml-px h-3.5 w-0.5 bg-chart-1" />
                    </>
                  ) : group.value ? (
                    <span className="truncate">{group.value}</span>
                  ) : (
                    <span className="truncate text-muted-foreground">{group.placeholder}</span>
                  )}
                </div>
              </div>
            );
          })}

          {note && (
            <div className="flex items-center gap-1.5 border-t border-border pt-2.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
