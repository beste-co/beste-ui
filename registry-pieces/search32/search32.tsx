"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Search32Field {
  label?: string;
  value: string;
  /** Sit beside the next half field instead of taking the full row */
  half?: boolean;
}

interface Search32Props {
  title?: string;
  meta?: string;
  typeLabel?: string;
  /** The entity types in the segmented switch */
  types?: string[];
  /** Type picked on first render */
  defaultType?: number;
  fields?: Search32Field[];
  profilesLabel?: string;
  profiles?: string[];
  idLabel?: string;
  id?: string;
  /** A quiet line with a dot at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const search32Demo: Search32Props = {
  title: "Entity Identity",
  types: ["Organization", "Person", "LocalBusiness"],
  defaultType: 2,
  fields: [{ value: "Oriel Skin Studio" }],
  profiles: ["LinkedIn", "X", "Instagram"],
  framed: true,
};

export function Search32({
  title,
  meta,
  typeLabel,
  types = [],
  defaultType = 0,
  fields = [],
  profilesLabel,
  profiles = [],
  idLabel,
  id,
  note,
  framed = true,
  fill = false,
  className,
}: Search32Props) {
  const [type, setType] = useState(defaultType);

  useEffect(() => setType(defaultType), [defaultType]);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-90",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-semibold">{title}</span>
              {meta && <span className="shrink-0 text-muted-foreground">{meta}</span>}
            </div>
          )}

          {types.length > 0 && (
            <>
              {typeLabel && <span className="text-muted-foreground">{typeLabel}</span>}
              <div role="radiogroup" aria-label={typeLabel} className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
                {types.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    role="radio"
                    aria-checked={index === type}
                    onClick={() => setType(index)}
                    className={cn(
                      "min-w-0 flex-1 cursor-pointer truncate rounded-md py-1.5 transition-colors",
                      index === type ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {fields.length > 0 && (
            <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
              {fields.map((field, index) => (
                <div key={index} className={cn("flex min-w-0 flex-col gap-1.5", !field.half && "col-span-2")}>
                  {field.label && <span className="text-muted-foreground">{field.label}</span>}
                  <span className="truncate rounded-lg px-2.5 py-2 ring-1 ring-border">{field.value}</span>
                </div>
              ))}
            </div>
          )}

          {profiles.length > 0 && (
            <>
              {profilesLabel && <span className="text-muted-foreground">{profilesLabel}</span>}
              <div className="flex flex-wrap gap-1.5">
                {profiles.map((profile, index) => (
                  <span key={index} className="rounded-full bg-muted px-2.5 py-0.5 ring-1 ring-border">
                    {profile}
                  </span>
                ))}
              </div>
            </>
          )}

          {(idLabel || id) && (
            <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5">
              <span className="text-muted-foreground">{idLabel}</span>
              <span className="truncate text-foreground/80">{id}</span>
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
