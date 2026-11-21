"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form48Props {
  /** The page address in the card's top bar */
  url?: string;
  heading?: string;
  lines?: string[];
  /** The link on the page that opens the form */
  link?: string;
  /** The small tag beside the selected link */
  tag?: string;
  /** The form that opens in a modal */
  form?: { title: string; fields: { label?: string; value: string }[]; note?: string };
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  className?: string;
}

export const form48Demo: Form48Props = {
  url: "orielstudio.pt/treatments",
  heading: "Signature facial",
  lines: ["60 minutes, for reactive skin"],
  link: "Get a quote",
  form: {
    title: "Request a quote",
    fields: [{ value: "Norah Jones" }, { value: "Signature facial" }],
  },
  framed: true,
};

const STYLES = `
@keyframes form48-select { 0%, 30% { opacity: 1; } 35%, 94% { opacity: 0; } 99%, 100% { opacity: 1; } }
@keyframes form48-modal { 0%, 37% { opacity: 0; transform: translateY(0.375rem) scale(0.98); } 46%, 86% { opacity: 1; transform: none; } 92%, 100% { opacity: 0; transform: translateY(0.375rem) scale(0.98); } }
@keyframes form48-dim { 0%, 37% { opacity: 0; } 46%, 86% { opacity: 1; } 92%, 100% { opacity: 0; } }
.form48-select { opacity: 0; animation: form48-select 12s ease infinite; }
.form48-modal { animation: form48-modal 12s cubic-bezier(.3,0,.2,1) infinite; }
.form48-dim { animation: form48-dim 12s ease infinite; }
@media (prefers-reduced-motion: reduce) { .form48-select, .form48-modal, .form48-dim { animation: none; } }
`;

const HANDLES = ["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-right-1 -bottom-1"];

export function Form48({ url, heading, lines = [], link, tag, form, framed = true, className }: Form48Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-72",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div aria-hidden="true" className={cn("relative min-h-56 overflow-hidden rounded-2xl bg-card text-card-foreground", !framed && "shadow-lg")}>
          {url && <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground">{url}</div>}
          <div className="px-4 py-4">
            {heading && <p className="text-base font-medium tracking-tight">{heading}</p>}
            {lines.map((line, index) => (
              <p key={index} className={cn("text-xs text-muted-foreground", index === 0 && "mt-1.5")}>
                {line}
              </p>
            ))}
            {link && (
              <div className="relative mt-5 inline-block">
                <span className="border-b border-chart-1/45 text-sm text-chart-1">{link}</span>
                <span className="form48-select absolute -inset-x-2 -inset-y-1.5">
                  <span className="absolute inset-0 rounded-sm border border-dashed border-muted-foreground/50" />
                  {HANDLES.map((position) => (
                    <span key={position} className={cn("absolute size-1.5 rounded-xs bg-card ring-1 ring-muted-foreground/60", position)} />
                  ))}
                  {tag && <span className="absolute top-1/2 left-full ml-3 -translate-y-1/2 rounded-sm bg-accent px-1 text-xs whitespace-nowrap text-accent-foreground">{tag}</span>}
                </span>
              </div>
            )}
          </div>
          {form && (
            <>
              <div className="form48-dim absolute inset-0 bg-foreground/15" />
              <div className="absolute inset-x-0 top-4 flex justify-center">
                <div className="form48-modal w-48 rounded-xl bg-card p-3 shadow-xl">
                  <p className="text-sm font-medium">{form.title}</p>
                  {form.fields.map((field, index) => (
                    <div key={index} className="mt-2">
                      {field.label && <p className="mb-1 text-xs text-muted-foreground">{field.label}</p>}
                      <p className="truncate rounded-md px-2 py-1 text-xs ring-1 ring-border ring-inset">{field.value}</p>
                    </div>
                  ))}
                  {form.note && (
                    <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="size-3 shrink-0 text-emerald-600" />
                      {form.note}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
