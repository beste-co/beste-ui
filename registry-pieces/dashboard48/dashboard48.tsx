"use client";

import { cn } from "@/lib/utils";

type Tone = "success" | "accent" | "neutral" | "plain" | "value";

interface Dashboard48Row {
  /** One or two text columns, e.g. a setting, or an old and a new path */
  cells: string[];
  status?: string;
  /** A green pill, the soft orange pill, a stone pill, plain quiet text, or a figure at the row's own size */
  tone?: Tone;
  /** The row in focus, on a soft highlight */
  active?: boolean;
  /** A quiet line under the first cell */
  detail?: string;
  /** With pendingLabel: only rows marked pending crossfade, the rest show their status */
  pending?: boolean;
}

interface Dashboard48Props {
  title?: string;
  meta?: string;
  /** Quiet column labels over the rows, the last one over the status */
  columns?: string[];
  rows?: Dashboard48Row[];
  /** A quiet label over a soft box of label and value lines, under the rows */
  panel?: { label?: string; rows: { label: string; value?: string }[] };
  /** A quiet line at the foot */
  note?: string;
  /** A white card, or the bare ruled rows straight on the stage */
  surface?: "card" | "none";
  /** The rows rise in one after another on a loop */
  animated?: boolean;
  /** Every status starts as this stone pill and turns into its own status on a loop */
  pendingLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard48Demo: Dashboard48Props = {
  title: "Import redirects",
  meta: "redirects.csv",
  columns: ["Old path", "New path", "Preview"],
  rows: [
    { cells: ["/services/facials", "/treatments/facials"], status: "Matched", tone: "success" },
    { cells: ["/our-team", "/about"], status: "Matched", tone: "success" },
    { cells: ["/team", "/about"], status: "Duplicate", tone: "accent" },
    { cells: ["/shop", "/store"], status: "External", tone: "neutral" },
  ],
  framed: true,
};

const toneStyles: Record<Tone, string> = {
  success: "rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  accent: "rounded-full bg-accent px-2 py-0.5 text-accent-foreground",
  neutral: "rounded-full bg-muted px-2 py-0.5 text-foreground/75",
  plain: "text-muted-foreground",
  value: "font-medium text-foreground tabular-nums",
};

const STYLES = `
@keyframes dashboard48-row { 0%, 4% { opacity: 0; transform: translateY(8px) } 12%, 84% { opacity: 1; transform: none } 92%, 100% { opacity: 0; transform: none } }
.dashboard48-row { opacity: 0; animation: dashboard48-row 12s cubic-bezier(.3,0,.2,1) infinite }
@media (prefers-reduced-motion: reduce) { .dashboard48-row { animation: none; opacity: 1 } }
`;

const PENDING_STYLES = `
@keyframes dashboard48-wait { 0%, 34% { opacity: 1 } 40%, 90% { opacity: 0 } 96%, 100% { opacity: 1 } }
@keyframes dashboard48-done { 0%, 42% { opacity: 0 } 48%, 84% { opacity: 1 } 90%, 100% { opacity: 0 } }
.dashboard48-wait { animation: dashboard48-wait 12s ease infinite }
.dashboard48-done { opacity: 0; animation: dashboard48-done 12s ease infinite }
@media (prefers-reduced-motion: reduce) { .dashboard48-wait, .dashboard48-done { animation: none } .dashboard48-wait { opacity: 0 } .dashboard48-done { opacity: 1 } }
`;

export function Dashboard48({ title, meta, columns = [], rows = [], panel, note, surface = "card", animated = false, pendingLabel, framed = true, fill = false, className }: Dashboard48Props) {
  const card = surface === "card";
  const table = columns.length > 0;
  const onlyMarked = rows.some((row) => row.pending);
  // A column of figures sits centred under its label; pills keep to the left
  const figures = table && rows.some((row) => row.status) && rows.every((row) => !row.status || row.tone === "value");
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {animated && <style>{STYLES}</style>}
      {pendingLabel && <style>{PENDING_STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && (card ? "max-w-115" : "max-w-75"),
          card && framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3", card ? "rounded-2xl bg-card p-4 text-xs text-card-foreground" : "text-sm text-foreground", card && !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-semibold">{title}</span>
              {meta && <span className="shrink-0 text-muted-foreground">{meta}</span>}
            </div>
          )}
          <div className={cn("flex flex-col", !card && "border-b border-border")}>
            {table && (
              <div className="flex gap-2.5 pb-2 text-muted-foreground">
                {columns.slice(0, -1).map((column, index) => (
                  <span key={index} className="min-w-0 flex-1 truncate">
                    {column}
                  </span>
                ))}
                <span className={cn("w-20 shrink-0", figures && "text-center")}>{columns[columns.length - 1]}</span>
              </div>
            )}
            {rows.map((row, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2.5",
                  card ? "py-2.5" : "py-3",
                  row.active ? "-mx-2.5 rounded-lg bg-muted px-2.5" : "border-t border-border",
                  rows[index - 1]?.active && "border-t-0",
                  animated && "dashboard48-row",
                )}
                style={animated ? { animationDelay: `${-5 + 0.7 * index}s` } : undefined}
              >
                {row.cells.map((cell, cellIndex) =>
                  cellIndex === 0 && row.detail ? (
                    <span key={cellIndex} className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate">{cell}</span>
                      <span className="truncate text-muted-foreground">{row.detail}</span>
                    </span>
                  ) : (
                    <span key={cellIndex} className={cn("min-w-0 truncate", table ? "flex-1" : cellIndex === 0 ? "flex-1" : "text-muted-foreground")}>
                      {cell}
                    </span>
                  ),
                )}
                {!row.status && table && <span aria-hidden="true" className="w-20 shrink-0" />}
                {row.status &&
                  (pendingLabel && (!onlyMarked || row.pending) ? (
                    <span className={cn("grid shrink-0 justify-items-end", table && "w-20")}>
                      <span className={cn("dashboard48-wait col-start-1 row-start-1 text-xs", toneStyles.neutral)}>{pendingLabel}</span>
                      <span className={cn("dashboard48-done col-start-1 row-start-1 text-xs", toneStyles[row.tone ?? "neutral"])}>{row.status}</span>
                    </span>
                  ) : (
                    <span className={cn("shrink-0", table && "w-20", figures && "text-center")}>
                      <span className={cn(row.tone !== "value" && "text-xs", toneStyles[row.tone ?? "neutral"])}>{row.status}</span>
                    </span>
                  ))}
              </div>
            ))}
          </div>
          {panel && (
            <div className={cn("flex flex-col gap-1.5", card && "border-t border-border pt-2.5")}>
              {panel.label && <span className="text-muted-foreground">{panel.label}</span>}
              <div className="flex flex-col gap-1.5 rounded-lg bg-muted px-3 py-2.5">
                {panel.rows.map((row, index) => (
                  <div key={index} className="flex justify-between gap-3">
                    <span className="truncate">{row.label}</span>
                    {row.value && <span className="shrink-0 text-muted-foreground">{row.value}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
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
