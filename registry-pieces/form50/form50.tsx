"use client";

import { cn } from "@/lib/utils";

interface Form50Props {
  title?: string;
  meta?: string;
  /** Ruled rows, e.g. a service and its starting rate */
  rows?: { label: string; value?: string }[];
  /** Small stone chips under the rows, with a quiet label, e.g. the areas covered */
  tags?: { label?: string; values: string[] };
  /** A quiet label over the latest message */
  inboxLabel?: string;
  /** The latest message sent through the form */
  inquiry?: { name: string; time?: string; message?: string };
  /** A quiet line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const form50Demo: Form50Props = {
  title: "Services",
  rows: [
    { label: "Brand identity", value: "from €2,400" },
    { label: "Website design", value: "from €1,800" },
    { label: "Packaging", value: "from €900" },
  ],
  inboxLabel: "Inquiries",
  inquiry: { name: "Casa Tamarind", message: "Brand identity for a new guesthouse, starting in spring." },
  framed: true,
};

export function Form50({ title, meta, rows = [], tags, inboxLabel, inquiry, note, framed = true, fill = false, className }: Form50Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-75",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="truncate text-muted-foreground">{meta}</span>}
            </div>
          )}
          {rows.length > 0 && (
            <div className="flex flex-col border-b border-border">
              {rows.map((row, index) => (
                <div key={index} className="flex justify-between gap-3 border-t border-border py-2.5">
                  <span className="truncate">{row.label}</span>
                  {row.value && <span className="shrink-0 text-muted-foreground">{row.value}</span>}
                </div>
              ))}
            </div>
          )}
          {tags && tags.values.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {tags.label && <span className="text-muted-foreground">{tags.label}</span>}
              <div className="flex flex-wrap gap-1.5">
                {tags.values.map((value) => (
                  <span key={value} className="rounded-full bg-muted px-2.5 py-0.5 text-foreground/75">
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}
          {inboxLabel && <span className="mt-1 text-muted-foreground">{inboxLabel}</span>}
          {inquiry && (
            <div className="flex flex-col gap-1 rounded-lg bg-muted px-3 py-2.5">
              <div className="flex justify-between gap-2">
                <span className="truncate font-medium">{inquiry.name}</span>
                {inquiry.time && <span className="shrink-0 text-muted-foreground">{inquiry.time}</span>}
              </div>
              {inquiry.message && <p className="leading-snug text-muted-foreground">{inquiry.message}</p>}
            </div>
          )}
          {note && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
