"use client";

import { cn } from "@/lib/utils";

interface Nav37Language {
  /** The short tab name, e.g. EN */
  code: string;
  /** Flag image shown on the tab in place of the code */
  flag?: string;
  /** The field's text in this language */
  text: string;
  /** A quiet line under the field while this language is open */
  status?: string;
}

interface Nav37Props {
  /** The section being edited */
  title?: string;
  /** Up to three languages, shown in turn */
  languages?: Nav37Language[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const nav37Demo: Nav37Props = {
  title: "Hero",
  languages: [
    { code: "EN", flag: "https://flagcdn.com/gb.svg", text: "Skin care without the rush" },
    { code: "PT", flag: "https://flagcdn.com/pt.svg", text: "Cuidados de pele sem pressa" },
    { code: "ES", flag: "https://flagcdn.com/es.svg", text: "Cuidado de la piel sin prisa" },
  ],
  framed: true,
};

const STYLES = `
@keyframes nav37-cycle { 0% { opacity: 0; transform: translateY(6px) } 4%, 29% { opacity: 1; transform: none } 33%, 100% { opacity: 0; transform: translateY(-6px) } }
@keyframes nav37-tab { 0% { opacity: 0 } 3%, 30% { opacity: 1 } 33%, 100% { opacity: 0 } }
.nav37-c { opacity: 0; animation: nav37-cycle 12s ease infinite }
.nav37-t { opacity: 0; animation: nav37-tab 12s ease infinite }
.nav37-k0 { opacity: 1; animation-delay: 0s } .nav37-k1 { animation-delay: -8s } .nav37-k2 { animation-delay: -4s }
@media (prefers-reduced-motion: reduce) { .nav37-c, .nav37-t { animation: none } }
`;

export function Nav37({ title, languages = [], framed = true, fill = false, className }: Nav37Props) {
  const shown = languages.slice(0, 3);
  const hasStatus = shown.some((language) => language.status);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-background p-4 text-xs text-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">{title}</span>
            <span className="flex gap-0.5 rounded-lg bg-muted p-0.5 text-muted-foreground">
              {shown.map((language, index) => (
                <span key={index} className={cn("relative flex items-center", language.flag ? "px-2 py-1.5" : "px-2.5 py-1")}>
                  {language.flag ? <img src={language.flag} alt={language.code} className="h-3 w-4.5 rounded-[2px] object-cover opacity-50" /> : language.code}
                  <span aria-hidden="true" className={cn("nav37-t absolute inset-0 flex items-center justify-center rounded-md bg-card text-foreground shadow-sm", `nav37-k${index}`)}>
                    {language.flag ? <img src={language.flag} alt="" className="h-3 w-4.5 rounded-[2px] object-cover" /> : language.code}
                  </span>
                </span>
              ))}
            </span>
          </div>
          <div className="rounded-xl bg-card px-3.5 py-4 ring-1 ring-border">
            <div className="relative h-6.5 text-lg font-medium tracking-tight whitespace-nowrap">
              {shown.map((language, index) => (
                <span key={index} className={cn("nav37-c absolute inset-x-0 top-0 truncate", `nav37-k${index}`)}>
                  {language.text}
                </span>
              ))}
            </div>
          </div>
          {hasStatus && (
          <div className="relative h-4 text-muted-foreground">
            {shown.map(
              (language, index) =>
                language.status && (
                  <span key={index} className={cn("nav37-c absolute inset-x-0 top-0 flex items-center gap-1.5 truncate", `nav37-k${index}`)}>
                    {index === 0 && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />}
                    {language.status}
                  </span>
                ),
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
