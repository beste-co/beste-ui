"use client";

import { cn } from "@/lib/utils";

type Pill = "neutral" | "accent" | "plain";

interface Nav38Language {
  name: string;
  /** Flag image before the name */
  flag?: string;
  /** The address this language lives at */
  path?: string;
  status?: string;
  /** A stone pill, the soft orange pill, or plain text */
  pill?: Pill;
  /** The row being edited, on a soft highlight */
  active?: boolean;
}

interface Nav38Props {
  title?: string;
  domain?: string;
  languages?: Nav38Language[];
  /** A quiet line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const nav38Demo: Nav38Props = {
  title: "Languages",
  languages: [
    { name: "English", flag: "https://oud.pics/b/beste/flags/gb.svg", status: "Default", pill: "neutral" },
    { name: "Português", flag: "https://oud.pics/b/beste/flags/pt.svg", status: "Editing now", pill: "plain", active: true },
    { name: "Español", flag: "https://oud.pics/b/beste/flags/es.webp", status: "Filling in over time", pill: "accent" },
  ],
  framed: true,
};

const pillStyles: Record<Pill, string> = {
  neutral: "rounded-full bg-muted px-2 py-0.5 text-foreground/75",
  accent: "rounded-full bg-accent px-2 py-0.5 text-accent-foreground",
  plain: "text-foreground/80",
};

export function Nav38({ title, domain, languages = [], note, framed = true, fill = false, className }: Nav38Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-90",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-1 rounded-2xl bg-card p-3.5 text-sm text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="font-semibold">{title}</span>
            {domain && <span className="truncate text-xs text-muted-foreground">{domain}</span>}
          </div>
          <div className="flex flex-col">
            {languages.map((language, index) => (
              <div
                key={index}
                className={cn("flex items-center justify-between gap-3 py-2.5", language.active ? "-mx-3 rounded-xl bg-muted px-3" : "border-t border-border", languages[index - 1]?.active && "border-t-0")}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  {language.flag && <img src={language.flag} alt="" className="h-3.5 w-5 shrink-0 rounded-[3px] object-cover" />}
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className={cn(language.active && "font-medium")}>{language.name}</span>
                    {language.path && <span className="truncate text-xs text-muted-foreground">{language.path}</span>}
                  </span>
                </span>
                {language.status && <span className={cn("shrink-0 text-xs", pillStyles[language.pill ?? "neutral"])}>{language.status}</span>}
              </div>
            ))}
          </div>
          {note && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
