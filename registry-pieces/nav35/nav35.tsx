"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

interface Nav35Language {
  code?: string;
  /** Flag image shown in place of the code */
  flag?: string;
  label?: string;
  path?: string;
  url?: string;
  heading?: string;
  description?: string;
  button?: string;
}

interface Nav35MoreLanguage {
  code?: string;
  flag?: string;
  label?: string;
  path?: string;
}

interface Nav35Props {
  image?: string;
  languages?: Nav35Language[];
  moreLanguages?: Nav35MoreLanguage[];
  title?: string;
  addLabel?: string;
  className?: string;
}

export const nav35Demo: Nav35Props = {
  image: "https://oud.pics/b/beste/oriel-consultation.webp",
  languages: [
    {
      code: "EN",
      flag: "https://flagcdn.com/gb.svg",
      label: "English",
      path: "/",
      url: "orielstudio.pt/treatments",
      heading: "Skin care that takes its time",
      description: "Facials and skin consultations in Lisbon.",
      button: "Book a treatment",
    },
    {
      code: "ES",
      flag: "https://flagcdn.com/es.svg",
      label: "Español",
      path: "/es",
      url: "orielstudio.pt/es/tratamientos",
      heading: "Cuidar la piel, sin prisas",
      description: "Faciales y consultas de piel en Lisboa.",
      button: "Reserva un tratamiento",
    },
  ],
  moreLanguages: [{ code: "DE", flag: "https://flagcdn.com/de.svg", label: "Deutsch", path: "/de" }],
  addLabel: "+ Add language",
};

function CodeChip({ code, flag }: { code?: string; flag?: string }) {
  if (flag) return <img src={flag} alt={code ?? ""} className="h-3.5 w-5 shrink-0 rounded-[3px] object-cover" />;
  return <span className="w-6 shrink-0 rounded bg-muted py-px text-center text-xs font-semibold text-muted-foreground">{code}</span>;
}

export function Nav35({ image, languages = [], moreLanguages = [], title, addLabel, className }: Nav35Props) {
  const [selected, setSelected] = useState(0);
  const active = languages[Math.min(selected, languages.length - 1)];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="relative mb-5 w-full max-w-md pl-16 sm:pl-28">
        <div className="overflow-hidden rounded-2xl bg-stone-50 text-stone-800 shadow-lg">
          <div className="flex items-center gap-1.5 border-b border-stone-200 px-3 py-2 text-xs text-stone-600">
            <Lock aria-hidden className="size-2.5 shrink-0" />
            <span className="truncate">{active?.url}</span>
          </div>
          {image && <img src={image} alt="" aria-hidden className="h-28 w-full object-cover" />}
          <div className="flex flex-col gap-1.5 px-4.5 pt-4 pb-4.5">
            <div className="h-11 overflow-hidden text-xl leading-tight font-medium tracking-tight">{active?.heading}</div>
            <div className="h-9 overflow-hidden text-xs leading-normal text-stone-600">{active?.description}</div>
            {active?.button && (
              <span className="mt-1 self-start rounded-full bg-stone-800 px-3 py-1.5 text-xs text-stone-50">{active.button}</span>
            )}
          </div>
        </div>

        <div className="absolute -bottom-5 left-0 flex w-52 flex-col gap-0.5 rounded-2xl bg-card p-1.5 text-xs text-card-foreground shadow-lg">
          {title && <div className="px-2 pt-1.5 pb-1 text-muted-foreground">{title}</div>}
          {languages.map((language, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-lg p-2 text-left transition-colors",
                i === selected ? "bg-secondary" : "hover:bg-muted",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <CodeChip code={language.code} flag={language.flag} />
                <span className="truncate">{language.label}</span>
              </span>
              <span className="text-muted-foreground">{language.path}</span>
            </button>
          ))}
          {moreLanguages.map((language, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <span className="flex min-w-0 items-center gap-2">
                <CodeChip code={language.code} flag={language.flag} />
                <span className="truncate">{language.label}</span>
              </span>
              <span className="text-muted-foreground">{language.path}</span>
            </div>
          ))}
          {addLabel && <div className="border-t border-border p-2 text-muted-foreground">{addLabel}</div>}
        </div>
      </div>
    </div>
  );
}
