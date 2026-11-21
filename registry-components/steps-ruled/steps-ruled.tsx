import { cn } from "@/lib/utils";

export interface StepsRuledItem {
  title: string;
  description?: string;
  /** Overrides the automatic number for this row */
  marker?: string;
}

type Numbering = "roman" | "decimal" | "none";
type Size = "default" | "lg";
type MarkerTone = "primary" | "secondary" | "current";

export interface StepsRuledProps {
  items?: StepsRuledItem[];
  /** How rows are numbered when they carry no marker of their own */
  numbering?: Numbering;
  /** Default sets a small serif numeral beside each row; large sets a big figure and roomier rows */
  size?: Size;
  /** The numeral color: primary for light grounds, the bright secondary for deep ones, or the current text color */
  markerTone?: MarkerTone;
  className?: string;
}

export const stepsRuledDemo: StepsRuledProps = {
  numbering: "roman",
  items: [
    { title: "Time to talk", description: "First visits are 45 minutes, so nothing feels rushed." },
    { title: "Clear plans and prices", description: "You get a written plan and quote before any treatment starts." },
    { title: "Gentle for nervous patients", description: "Agreed stop signals, numbing gel first and sedation when it helps." },
  ],
};

const ROMAN: [number, string][] = [
  [10, "x"],
  [9, "ix"],
  [5, "v"],
  [4, "iv"],
  [1, "i"],
];

function toRoman(value: number) {
  let rest = value;
  let out = "";
  for (const [step, glyph] of ROMAN) {
    while (rest >= step) {
      out += glyph;
      rest -= step;
    }
  }
  return `${out}.`;
}

const markerToneClasses: Record<MarkerTone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  current: "text-current/60",
};

/** A ruled list of short points, each with a serif numeral, a title and a line of detail. Rules and quiet text follow the surface's text color. */
export function StepsRuled({ items = [], numbering = "roman", size = "default", markerTone = "primary", className }: StepsRuledProps) {
  const large = size === "lg";
  return (
    <ol className={cn("flex flex-col border-t border-current/15", className)}>
      {items.map((item, index) => {
        const marker = item.marker ?? (numbering === "roman" ? toRoman(index + 1) : numbering === "decimal" ? String(index + 1) : null);
        return (
          <li key={index} className={cn("flex border-b border-current/15", large ? "gap-6 py-6" : "gap-5 py-5.5")}>
            {marker && (
              <span
                aria-hidden="true"
                className={cn("shrink-0 font-serif", markerToneClasses[markerTone], large ? "w-11 text-4xl leading-none" : "w-7 text-2xl leading-tight")}
              >
                {marker}
              </span>
            )}
            <div className="flex flex-col gap-1">
              <div className={cn("font-semibold", large ? "text-lg" : "text-base md:text-lg")}>{item.title}</div>
              {item.description && <p className="text-sm leading-relaxed text-current/70 md:text-base">{item.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
