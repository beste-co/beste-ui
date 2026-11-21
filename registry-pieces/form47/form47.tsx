"use client";

import { cn } from "@/lib/utils";

interface Form47Field {
  label: string;
  /** The field type, e.g. "Email" or "Dropdown" */
  type: string;
  required?: boolean;
}

interface Form47Place {
  label: string;
  /** How the form shows there, e.g. "Section" */
  detail?: string;
}

interface Form47Props {
  title?: string;
  meta?: string;
  fields?: Form47Field[];
  requiredLabel?: string;
  /** A quiet line over the places, e.g. "Used in 3 places" */
  placesLabel?: string;
  places?: Form47Place[];
  /** A dot line on a ruled foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const form47Demo: Form47Props = {
  title: "Contact form",
  fields: [
    { label: "Name", type: "Text" },
    { label: "Email", type: "Email" },
    { label: "Treatment", type: "Dropdown" },
  ],
  placesLabel: "Used in 3 places",
  places: [
    { label: "Contact", detail: "Section" },
    { label: "Home", detail: "Modal" },
    { label: "Treatments", detail: "Section" },
  ],
  framed: true,
};

export function Form47({ title, meta, fields = [], requiredLabel, placesLabel, places = [], note, framed = true, fill = false, className }: Form47Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="truncate text-muted-foreground">{meta}</span>}
            </div>
          )}
          {fields.length > 0 && (
            <div className="flex flex-col border-t border-border">
              {fields.map((field, index) => (
                <div key={index} className="flex items-center justify-between gap-3 border-b border-border py-2">
                  <span className="truncate">{field.label}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className="text-muted-foreground">{field.type}</span>
                    {field.required && requiredLabel && <span className="rounded-full bg-muted px-2 py-0.5 text-foreground/70">{requiredLabel}</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
          {placesLabel && <p className="mt-1 text-muted-foreground">{placesLabel}</p>}
          {places.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {places.map((place, index) => (
                <div key={index} className="flex items-center justify-between gap-3 rounded-lg bg-muted px-2.5 py-2">
                  <span className="truncate">{place.label}</span>
                  {place.detail && <span className="shrink-0 text-muted-foreground">{place.detail}</span>}
                </div>
              ))}
            </div>
          )}
          {note && (
            <div className="flex items-center gap-1.5 border-t border-border pt-2.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
