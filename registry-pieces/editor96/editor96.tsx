"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Editor96Field {
  label?: string;
  value: string;
  /** A small picture before the value, for image fields */
  image?: string;
  /** The field being typed in, with a caret */
  focused?: boolean;
}

interface Editor96Props {
  domain?: string;
  page?: string;
  /** Language switch in the header; each one is clickable */
  languages?: { code: string; flag?: string }[];
  /** The section drawer on the left */
  panel?: { title: string; tabs?: string[]; fields?: Editor96Field[] };
  /** The client site in the preview on the right */
  site?: { brand?: string; links?: string; image?: string; heading?: string; description?: string; button?: string };
  /** A green dot line at the foot on the left */
  status?: string;
  /** A quiet line at the foot on the right */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor96Demo: Editor96Props = {
  domain: "orielstudio.pt",
  page: "Home",
  languages: [{ code: "EN", flag: "https://oud.pics/b/beste/flags/gb.svg" }, { code: "PT", flag: "https://oud.pics/b/beste/flags/pt.svg" }],
  panel: {
    title: "Hero",
    fields: [
      { value: "Calm skin care in Lisbon", focused: true },
      { value: "Facials and treatments in a quiet studio." },
      { value: "room.jpg", image: "https://oud.pics/b/beste/oriel-consultation.webp" },
    ],
  },
  site: {
    brand: "Oriel",
    image: "https://oud.pics/b/beste/oriel-consultation.webp",
    heading: "Calm skin care in Lisbon",
    description: "Facials and treatments in a quiet studio.",
    button: "Book a visit",
  },
  framed: true,
};

const STYLES = `
@keyframes editor96-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
.editor96-caret { animation: editor96-blink 1.1s step-end infinite; }
@media (prefers-reduced-motion: reduce) { .editor96-caret { animation: none; } }
`;

export function Editor96({ domain, page, languages = [], panel, site, status, note, framed = true, fill = false, className }: Editor96Props) {
  const [language, setLanguage] = useState(0);
  const tabs = panel?.tabs ?? [];

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-135",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col overflow-hidden rounded-2xl bg-card text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          <div className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-2.5">
            <span className="truncate text-sm font-semibold">
              {domain}
              {page && <span className="font-normal text-muted-foreground"> / {page}</span>}
            </span>
            {languages.length > 0 && (
              <span className="flex shrink-0 gap-0.5 rounded-full bg-muted p-0.5">
                {languages.map(({ code, flag }, index) => (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={index === language}
                    onClick={() => setLanguage(index)}
                    className={cn(
                      "flex cursor-pointer items-center rounded-full transition-colors",
                      flag ? "px-2 py-1" : "px-2.5 py-0.5",
                      index === language ? "bg-card ring-1 ring-border" : "text-muted-foreground"
                    )}
                  >
                    {flag ? <img src={flag} alt={code} className="h-3 w-4.5 rounded-[2px] object-cover" /> : code}
                  </button>
                ))}
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row">
            {panel && (
              <div className="flex flex-col gap-2.5 border-b border-border p-3 sm:w-5/12 sm:shrink-0 sm:border-r sm:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{panel.title}</span>
                  {tabs.length > 0 && (
                    <span className="flex gap-2">
                      {tabs.map((tab, index) => (
                        <span key={index} className={index === 0 ? "border-b border-foreground" : "text-muted-foreground"}>
                          {tab}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
                {panel.fields?.map((field, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    {field.label && <span className="text-muted-foreground">{field.label}</span>}
                    <div className={cn("flex min-w-0 items-center gap-2 rounded-lg px-2.5 py-1.5 leading-snug", field.focused ? "bg-muted ring-1 ring-foreground/20" : "text-foreground/80 ring-1 ring-border", field.image && "px-1.5")}>
                      {field.image && <img src={field.image} alt="" aria-hidden="true" className="h-6.5 w-8.5 shrink-0 rounded object-cover" />}
                      <span className="min-w-0">
                        {field.value}
                        {field.focused && <span aria-hidden="true" className="editor96-caret ml-0.5 inline-block h-3 w-px bg-foreground align-middle" />}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {site && (
              <div className="min-w-0 flex-1 bg-muted p-3">
                <div className="flex flex-col gap-2 rounded-lg bg-stone-50 p-2.5 text-stone-600 ring-1 ring-stone-200">
                  <div className="flex justify-between gap-2">
                    <span>{site.brand}</span>
                    <span className="truncate">{site.links}</span>
                  </div>
                  {site.image && <img src={site.image} alt="" aria-hidden="true" className="h-27 w-full rounded-md object-cover" />}
                  {site.heading && <p className="text-base leading-tight font-medium tracking-tight text-stone-900">{site.heading}</p>}
                  {site.description && <p className="leading-snug">{site.description}</p>}
                  {site.button && <span className="self-start rounded-full bg-stone-900 px-2.5 py-1 text-stone-50">{site.button}</span>}
                </div>
              </div>
            )}
          </div>
          {(status || note) && (
            <div className="flex items-center justify-between gap-3 border-t border-border px-3.5 py-2.5 text-muted-foreground">
              <span className="flex min-w-0 items-center gap-1.5">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="truncate">{status}</span>
              </span>
              {note && <span className="hidden shrink-0 sm:inline">{note}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
