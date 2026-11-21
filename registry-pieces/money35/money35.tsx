"use client";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface Money35Option {
  label: string;
  price: string;
  /** The option on a soft tint with a darker ring */
  selected?: boolean;
}

interface Money35Props {
  title?: string;
  meta?: string;
  options?: Money35Option[];
  /** A visitor question at the foot that gives way to its answer */
  question?: string;
  answer?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const money35Demo: Money35Props = {
  title: "Prices",
  options: [
    { label: "Single visit", price: "€85" },
    { label: "Course of 4", price: "€300", selected: true },
    { label: "Membership", price: "€60/mo" },
  ],
  question: "Can I pay per visit?",
  answer: "Yes, a single visit is €85.",
  framed: true,
};

const STYLES = `
@keyframes money35-q { 0%, 40% { opacity: 1; } 46%, 90% { opacity: 0; } 96%, 100% { opacity: 1; } }
@keyframes money35-a { 0%, 48% { opacity: 0; } 54%, 84% { opacity: 1; } 89%, 100% { opacity: 0; } }
.money35-q { animation: money35-q 12s ease -2s infinite; }
.money35-a { opacity: 0; animation: money35-a 12s ease -2s infinite; }
@media (prefers-reduced-motion: reduce) {
  .money35-q, .money35-a { animation: none; }
  .money35-q { opacity: 0; }
  .money35-a { opacity: 1; }
}
`;

export function Money35({ title, meta, options = [], question, answer, framed = true, fill = false, className }: Money35Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-75",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">{title}</span>
              {meta && <span className="truncate text-muted-foreground">{meta}</span>}
            </div>
          )}
          {options.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5">
              {options.map((option, index) => (
                <div key={index} className={cn("flex min-w-0 flex-col gap-0.5 rounded-lg px-2 py-2 ring-1", option.selected ? "bg-muted ring-muted-foreground/30" : "ring-border")}>
                  <span className="truncate text-muted-foreground">{option.label}</span>
                  <span className="truncate text-base font-medium tracking-tight">{option.price}</span>
                </div>
              ))}
            </div>
          )}
          {(question || answer) && (
            <div className="relative h-6 border-t border-border">
              {question && (
                <span className="money35-q absolute inset-x-0 bottom-0 flex h-4 items-center gap-1.5 truncate text-foreground/80">
                  <Plus aria-hidden="true" className="size-2.5 shrink-0 text-muted-foreground" strokeWidth={2.4} />
                  {question}
                </span>
              )}
              {answer && <span className="money35-a absolute inset-x-0 bottom-0 flex h-4 items-center truncate text-muted-foreground">{answer}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
