"use client";

import { Check, ChevronDown, Globe } from "lucide-react";

import { cn } from "@/lib/utils";

interface Nav40Language {
  /** The short code on the switcher pill, e.g. "EN"; shown when there is no flag */
  code: string;
  /** A flag picture for the pill and the list row */
  flag?: string;
  /** The language in its own words, e.g. "Deutsch" */
  name: string;
  /** The page heading in this language */
  heading: string;
  /** BCP 47 tag for the heading, e.g. "de" */
  lang?: string;
}

interface Nav40Props {
  brand?: string;
  languages?: Nav40Language[];
  /** Seconds each language stays before the next */
  interval?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const nav40Demo: Nav40Props = {
  brand: "Oriel",
  languages: [
    { code: "EN", flag: "https://oud.pics/b/beste/flags/gb.svg", name: "English", heading: "Skin care that starts with listening", lang: "en" },
    { code: "DE", flag: "https://oud.pics/b/beste/flags/de.svg", name: "Deutsch", heading: "Hautpflege, die mit Zuhören beginnt", lang: "de" },
    { code: "FR", flag: "https://oud.pics/b/beste/flags/fr.svg", name: "Français", heading: "Des soins qui commencent par l'écoute", lang: "fr" },
    { code: "ES", flag: "https://oud.pics/b/beste/flags/es.webp", name: "Español", heading: "Cuidado de la piel que empieza escuchando", lang: "es" },
    { code: "IT", flag: "https://oud.pics/b/beste/flags/it.svg", name: "Italiano", heading: "Cura della pelle che inizia dall'ascolto", lang: "it" },
    { code: "JA", flag: "https://oud.pics/b/beste/flags/jp.svg", name: "日本語", heading: "耳を傾けることから始まるスキンケア", lang: "ja" },
  ],
  interval: 2.6,
  framed: true,
};

// One keyframe per slot width; each language runs it with its own negative delay
function keyframes(count: number) {
  const slot = 100 / count;
  const fade = Math.min(4, slot / 4);
  return `
@keyframes nav40-slot-${count} { 0%, ${(slot - fade).toFixed(2)}% { opacity: 1 } ${slot.toFixed(2)}%, ${(100 - fade).toFixed(2)}% { opacity: 0 } 100% { opacity: 1 } }
@media (prefers-reduced-motion: reduce) { .nav40-slot { animation: none !important } }
`;
}

export function Nav40({ brand, languages = [], interval = 2.6, framed = true, fill = false, className }: Nav40Props) {
  const count = Math.max(1, languages.length);
  const period = count * interval;
  // The first language is on screen at once; the others wait their turn
  const slot = (index: number) => ({
    opacity: index === 0 ? 1 : 0,
    animation: `nav40-slot-${count} ${period}s ease-in-out ${-((count - index) % count) * interval}s infinite`,
  });

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{keyframes(count)}</style>
      <div className={cn("w-full", !fill && "max-w-80", framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md")}>
        <div className={cn("relative overflow-hidden rounded-2xl bg-card text-card-foreground", !framed && "shadow-lg")} aria-hidden="true">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <span className="text-sm font-medium tracking-tight">{brand}</span>
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border px-2.5 text-xs">
              {!languages.some((language) => language.flag) && <Globe className="size-3 text-muted-foreground" />}
              <span className="grid">
                {languages.map((language, index) => (
                  <span key={index} className="nav40-slot col-start-1 row-start-1 flex items-center" style={slot(index)}>
                    {language.flag ? <img src={language.flag} alt="" className="h-3.5 w-5 rounded-[3px] object-cover" /> : language.code}
                  </span>
                ))}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </span>
          </div>
          <div className="relative px-4 pt-0 pb-5">
            {/* The switcher list stays open, pinned under its pill */}
            <ul className="relative z-10 -mt-3 mb-5 ml-auto w-36 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg">
              {languages.map((language, index) => (
                <li key={index} className="relative flex items-center justify-between rounded-lg px-2 py-1.5 text-xs">
                  <span className="nav40-slot absolute inset-0 rounded-lg bg-muted" style={slot(index)} />
                  <span className="relative flex items-center gap-2" lang={language.lang}>
                    {language.flag && <img src={language.flag} alt="" className="h-3 w-4.5 shrink-0 rounded-[2px] object-cover" />}
                    {language.name}
                  </span>
                  <Check className="nav40-slot relative size-3 text-foreground" style={slot(index)} />
                </li>
              ))}
            </ul>
            <div className="grid">
              {languages.map((language, index) => (
                <p key={index} lang={language.lang} className="nav40-slot col-start-1 row-start-1 text-lg leading-snug font-medium tracking-tight text-balance" style={slot(index)}>
                  {language.heading}
                </p>
              ))}
            </div>
            <div className="mt-4 space-y-1.5">
              <span className="block h-1.5 w-1/2 rounded-full bg-muted" />
              <span className="block h-1.5 w-2/5 rounded-full bg-muted" />
            </div>
            <span className="mt-5 block h-7 w-20 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
