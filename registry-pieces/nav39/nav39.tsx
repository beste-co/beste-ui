"use client";

import { cn } from "@/lib/utils";

interface Nav39Language {
  /** The short code in the switcher, e.g. ES */
  code: string;
  /** Flag image shown in the switcher in place of the code */
  flag?: string;
  /** The large word shown in this language */
  text: string;
  /** The page's address in this language */
  url?: string;
}

interface Nav39Props {
  /** The site name in the header */
  brand?: string;
  /** Up to five languages, shown in turn */
  languages?: Nav39Language[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const nav39Demo: Nav39Props = {
  brand: "Lumen",
  languages: [
    { code: "EN", flag: "https://flagcdn.com/gb.svg", text: "Hello", url: "lumenlanguages.com" },
    { code: "ES", flag: "https://flagcdn.com/es.svg", text: "Hola", url: "lumenlanguages.com/es" },
    { code: "JA", flag: "https://flagcdn.com/jp.svg", text: "こんにちは", url: "lumenlanguages.com/ja" },
  ],
  framed: true,
};

const STEP = 3;

// Each language holds the stage for one step of the loop
function styles(count: number) {
  const span = 100 / count;
  const a = (span * 0.15).toFixed(2);
  const b = (span * 0.85).toFixed(2);
  const c = span.toFixed(2);
  return `
@keyframes nav39-word { 0% { opacity: 0; transform: translateY(8px) } ${a}%, ${b}% { opacity: 1; transform: none } ${c}%, 100% { opacity: 0; transform: translateY(-8px) } }
@keyframes nav39-dot { 0% { opacity: 0 } ${a}%, ${b}% { opacity: 1 } ${c}%, 100% { opacity: 0 } }
.nav39-word { opacity: 0; animation: nav39-word ${count * STEP}s ease infinite }
.nav39-dot { opacity: 0; animation: nav39-dot ${count * STEP}s ease infinite }
.nav39-first { opacity: 1 }
@media (prefers-reduced-motion: reduce) { .nav39-word, .nav39-dot { animation: none } }
`;
}

export function Nav39({ brand, languages = [], framed = true, fill = false, className }: Nav39Props) {
  const shown = languages.slice(0, 5);
  const count = Math.max(shown.length, 1);
  const delay = (index: number) => ({ animationDelay: `${-((count - index) % count) * STEP}s` });

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{styles(count)}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-90",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("overflow-hidden rounded-2xl bg-card text-card-foreground", !framed && "shadow-lg")} aria-hidden="true">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4.5 py-3.5">
            <span className="truncate text-sm font-semibold">{brand}</span>
            <span className="flex gap-3 text-xs text-muted-foreground">
              {shown.map((language, index) => (
                <span key={index} className="relative flex items-center">
                  {language.flag ? <img src={language.flag} alt="" className="h-3.5 w-5 rounded-[3px] object-cover opacity-40" /> : language.code}
                  <span className={cn("nav39-dot absolute top-0 left-0 flex border-b border-foreground pb-0.5 text-foreground", index === 0 && "nav39-first")} style={delay(index)}>
                    {language.flag ? <img src={language.flag} alt="" className="h-3.5 w-5 rounded-[3px] object-cover" /> : language.code}
                  </span>
                </span>
              ))}
            </span>
          </div>
          <div className="px-4.5 pt-7.5 pb-6">
            <div className="relative h-15">
              {shown.map((language, index) => (
                <span key={index} className={cn("nav39-word absolute top-0 left-0 text-5xl leading-tight font-medium tracking-tight whitespace-nowrap", index === 0 && "nav39-first")} style={delay(index)}>
                  {language.text}
                </span>
              ))}
            </div>
            <div className="relative mt-2.5 h-4.5 text-xs text-muted-foreground">
              {shown.map(
                (language, index) =>
                  language.url && (
                    <span key={index} className={cn("nav39-dot absolute top-0 left-0 truncate", index === 0 && "nav39-first")} style={delay(index)}>
                      {language.url}
                    </span>
                  ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
