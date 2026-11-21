"use client";

import { Minus, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface Commerce51Item {
  image?: string;
  name: string;
  variant?: string;
  quantity?: number;
}

interface Commerce51Props {
  title?: string;
  /** Newest last; the last row is the one that arrives in the loop */
  items?: Commerce51Item[];
  notePlaceholder?: string;
  sendLabel?: string;
  /** A quiet line under the button */
  footnote?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const commerce51Demo: Commerce51Props = {
  title: "Quote list",
  items: [
    { image: "https://oud.pics/b/beste/object-bowls.webp", name: "Stoneware bowls", variant: "Set of 4, sand", quantity: 12 },
    { image: "https://oud.pics/b/beste/object-totes.webp", name: "Canvas tote", variant: "Natural, printed", quantity: 150 },
    { image: "https://oud.pics/b/beste/object-pencils.webp", name: "Pencil set", variant: "12 colors", quantity: 40 },
  ],
  notePlaceholder: "Add a note for the team",
  sendLabel: "Send request",
  footnote: "We reply with prices within a day",
  framed: true,
};

// The last row leaves and arrives again while the count follows it
const STYLES = `
@keyframes commerce51-row { 0%, 62% { opacity: 1; grid-template-rows: 1fr } 68%, 80% { opacity: 0; grid-template-rows: 0fr } 88%, 100% { opacity: 1; grid-template-rows: 1fr } }
@keyframes commerce51-full { 0%, 64% { opacity: 1 } 66%, 84% { opacity: 0 } 86%, 100% { opacity: 1 } }
@keyframes commerce51-less { 0%, 64% { opacity: 0 } 66%, 84% { opacity: 1 } 86%, 100% { opacity: 0 } }
@keyframes commerce51-pop { 0%, 85% { transform: scale(1) } 89% { transform: scale(1.25) } 94%, 100% { transform: scale(1) } }
.commerce51-row { display: grid; animation: commerce51-row 10s cubic-bezier(.65,0,.35,1) infinite }
.commerce51-full { animation: commerce51-full 10s ease infinite }
.commerce51-less { opacity: 0; animation: commerce51-less 10s ease infinite }
.commerce51-pop { animation: commerce51-pop 10s ease infinite }
@media (prefers-reduced-motion: reduce) { .commerce51-row, .commerce51-full, .commerce51-less, .commerce51-pop { animation: none } }
`;

export function Commerce51({ title, items = [], notePlaceholder, sendLabel = "Send request", footnote, framed = true, fill = false, className }: Commerce51Props) {
  const total = items.length;
  // `live` animates the last row; the still copy only holds the full height
  const card = (live: boolean) => (
    <div className={cn(framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md")}>
      <div className={cn("overflow-hidden rounded-2xl bg-card text-card-foreground", !framed && "shadow-lg")}>
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <span className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-tight">{title}</span>
            <span className={cn("grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground tabular-nums", live && "commerce51-pop")}>
              <span className={cn("col-start-1 row-start-1", live && "commerce51-full")}>{total}</span>
              {live && <span className="commerce51-less col-start-1 row-start-1">{Math.max(0, total - 1)}</span>}
            </span>
          </span>
          <X className="size-3.5 text-muted-foreground" />
        </div>
        <ul className="px-4">
          {items.map((item, index) => (
            <li key={index} className={cn(live && index === total - 1 && "commerce51-row")}>
              {live && index === total - 1 ? <div className="min-h-0 overflow-hidden">{renderRow(item, index > 0)}</div> : renderRow(item, index > 0)}
            </li>
          ))}
        </ul>
        <div className="px-4 pt-3 pb-4">
          {notePlaceholder && <div className="rounded-xl border border-border px-3 py-2.5 text-xs text-muted-foreground">{notePlaceholder}</div>}
          <span className="mt-3 flex h-9 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{sendLabel}</span>
          {footnote && <p className="mt-2 text-center text-xs text-muted-foreground">{footnote}</p>}
        </div>
      </div>
    </div>
  );
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      {/* The hidden still copy sizes the box, so the live card can shrink without moving anything around it */}
      <div aria-hidden="true" className={cn("grid w-full", !fill && "max-w-80")}>
        <div className="invisible col-start-1 row-start-1">{card(false)}</div>
        <div className="col-start-1 row-start-1 self-start">{card(true)}</div>
      </div>
    </div>
  );
}

// The divider sits on top of each row, so it leaves together with the row that collapses
function renderRow(item: Commerce51Item, divider: boolean) {
  return (
    <div className={cn("flex items-center gap-3 py-3", divider && "border-t border-border")}>
      {item.image ? (
        <img src={item.image} alt="" loading="lazy" decoding="async" className="size-10 shrink-0 rounded-lg bg-muted object-cover" />
      ) : (
        <span className="size-10 shrink-0 rounded-lg bg-muted" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium">{item.name}</span>
        {item.variant && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.variant}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-2 rounded-full border border-border px-1.5 py-1 text-xs tabular-nums">
        <Minus className="size-3 text-muted-foreground" />
        <span className="min-w-6 text-center">{item.quantity ?? 1}</span>
        <Plus className="size-3 text-muted-foreground" />
      </span>
    </div>
  );
}
