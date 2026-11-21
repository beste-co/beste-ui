"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "draft" | "live" | "neutral";

interface Editor79Entry {
  title: string;
  /** Who made the change and when */
  byline?: string;
  /** A small picture of who made it; a person icon when unset */
  image?: string;
  status: string;
  tone?: Status;
  /** A quiet time above the status pill, e.g. "2 min ago" */
  time?: string;
  /** The newest entry: a tinted row that drops in on a loop */
  fresh?: boolean;
}

interface Editor79Props {
  title?: string;
  meta?: string;
  entries?: Editor79Entry[];
  /** Show a small picture or person icon before each entry */
  avatars?: boolean;
  /** A dot line at the foot, e.g. how many changes wait */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

const statusClasses: Record<Status, string> = {
  draft: "bg-accent text-accent-foreground",
  live: "bg-emerald-50 text-emerald-700",
  neutral: "bg-muted text-foreground/70",
};

const STYLES = `
@keyframes editor79-drop { 0%, 8% { opacity: 0; transform: translateY(-0.625rem); } 14%, 100% { opacity: 1; transform: none; } }
@keyframes editor79-glow { 0%, 10% { background-color: var(--accent); } 30%, 100% { background-color: var(--muted); } }
.editor79-fresh { animation: editor79-drop 10s cubic-bezier(.3,0,.2,1) infinite, editor79-glow 10s ease infinite; animation-delay: -2s; }
@media (prefers-reduced-motion: reduce) { .editor79-fresh { animation: none; } }
`;

export const editor79Demo: Editor79Props = {
  title: "Draft history",
  entries: [
    { title: "Contact form", image: "https://oud.pics/b/beste/bestie-jelly.webp", status: "Draft", tone: "draft" },
    { title: "Hero headline", image: "https://oud.pics/b/beste/bestie-jelly.webp", status: "Draft", tone: "draft" },
    { title: "Pricing page", status: "Live", tone: "live" },
  ],
  framed: true,
};

export function Editor79({ title, meta, entries = [], avatars = true, note, framed = true, fill = false, className }: Editor79Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {entries.some((entry) => entry.fresh) && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="truncate text-muted-foreground">{meta}</span>}
            </div>
          )}
          {entries.map((entry, index) => (
            <div key={index} className={cn("flex items-center gap-2.5 py-2.5", entry.fresh ? "editor79-fresh my-1 rounded-lg bg-muted px-2.5" : "border-t border-border")}>
              {!avatars ? null : entry.image ? (
                <img src={entry.image} alt="" aria-hidden="true" className="size-5.5 shrink-0 object-contain" />
              ) : (
                <span aria-hidden="true" className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-muted text-foreground/70">
                  <User className="size-3" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate">{entry.title}</div>
                {entry.byline && <div className="text-muted-foreground">{entry.byline}</div>}
              </div>
              {entry.time ? (
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-muted-foreground">{entry.time}</span>
                  <span className={cn("rounded-full px-2 py-0.5", statusClasses[entry.tone ?? "draft"])}>{entry.status}</span>
                </span>
              ) : (
                <span className={cn("shrink-0 rounded-full px-2 py-0.5", statusClasses[entry.tone ?? "draft"])}>{entry.status}</span>
              )}
            </div>
          ))}
          {note && (
            <div className="flex items-center gap-1.5 border-t border-border pt-2.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
