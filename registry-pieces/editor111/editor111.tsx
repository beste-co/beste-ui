"use client";

import { Check, Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type Swatch = "orange" | "sky" | "emerald" | "rose" | "foreground";

interface Editor111Props {
  /** The section being edited */
  section?: string;
  heading?: string;
  description?: string;
  button?: string;
  /** A photo over the copy in the preview, so the page side is not an empty panel */
  image?: string;
  colorLabel?: string;
  /** Three accents the demo steps through, in order */
  swatches?: Swatch[];
  sizeLabel?: string;
  /** The heading size at each step, as shown in the stepper */
  sizes?: string[];
  fontLabel?: string;
  font?: string;
  /** Step through the swatches and sizes on a loop */
  animated?: boolean;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor111Demo: Editor111Props = {
  section: "Hero",
  heading: "Bread from the wood oven",
  description: "Sourdough and pastries, every morning on Rua da Prata.",
  button: "See the menu",
  colorLabel: "Accent",
  swatches: ["orange", "sky", "emerald", "rose", "foreground"],
  sizeLabel: "Heading size",
  sizes: ["40", "48", "56"],
  fontLabel: "Font",
  font: "Inter Tight",
  animated: true,
  framed: true,
};

const swatchClasses: Record<Swatch, string> = {
  orange: "bg-[#c4673f]",
  sky: "bg-[#47709e]",
  emerald: "bg-[#5d8468]",
  rose: "bg-[#b9677c]",
  foreground: "bg-foreground",
};

// Three steps of a 12s loop; step one is the resting frame
const STYLES = `
@keyframes editor111-s0 { 0%, 30% { opacity: 1 } 33%, 97% { opacity: 0 } 100% { opacity: 1 } }
@keyframes editor111-s1 { 0%, 30% { opacity: 0 } 33%, 63% { opacity: 1 } 66%, 100% { opacity: 0 } }
@keyframes editor111-s2 { 0%, 63% { opacity: 0 } 66%, 97% { opacity: 1 } 100% { opacity: 0 } }
@keyframes editor111-size { 0%, 30% { transform: scale(1) } 33%, 63% { transform: scale(1.1) } 66%, 97% { transform: scale(1.2) } 100% { transform: scale(1) } }
.editor111-s0 { animation: editor111-s0 12s ease infinite }
.editor111-s1 { opacity: 0; animation: editor111-s1 12s ease infinite }
.editor111-s2 { opacity: 0; animation: editor111-s2 12s ease infinite }
.editor111-size { transform-origin: left bottom; animation: editor111-size 12s cubic-bezier(.65,0,.35,1) infinite }
@media (prefers-reduced-motion: reduce) { .editor111-s0, .editor111-s1, .editor111-s2, .editor111-size { animation: none } .editor111-s1, .editor111-s2 { opacity: 0 } }
`;

export function Editor111({
  section,
  heading,
  description,
  button,
  image,
  colorLabel,
  swatches = [],
  sizeLabel,
  sizes = [],
  fontLabel,
  font,
  animated = true,
  framed = true,
  fill = false,
  className,
}: Editor111Props) {
  const steps = swatches.slice(0, 3);
  const step = (index: number) => (animated ? `editor111-s${index}` : index === 0 ? undefined : "hidden");
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {animated && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          fill ? "h-full" : "max-w-xl",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div aria-hidden="true" className={cn("grid grid-cols-5 overflow-hidden bg-card text-xs text-card-foreground", fill && "h-full", !(fill && !framed) && "rounded-2xl", !framed && !fill && "shadow-lg")}>
          <div className="col-span-3 flex min-h-0 flex-col justify-end gap-2.5 bg-muted p-5">
            {image && <img src={image} alt="" className="mb-2 min-h-20 w-full flex-1 rounded-xl bg-card object-cover" />}
            <p className={cn("max-w-48 text-xl leading-tight font-medium tracking-tight", animated && "editor111-size")}>{heading}</p>
            {description && <p className="max-w-52 leading-relaxed text-muted-foreground">{description}</p>}
            {button && (
              <span className="mt-1 grid w-fit">
                {steps.map((swatch, index) => (
                  <span
                    key={index}
                    className={cn("col-start-1 row-start-1 rounded-lg px-3.5 py-1.5 font-medium", swatch === "foreground" ? "text-background" : "text-white", swatchClasses[swatch], step(index))}
                  >
                    {button}
                  </span>
                ))}
              </span>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-3.5 p-3.5">
            <span className="text-sm font-semibold">{section}</span>
            {swatches.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground">{colorLabel}</span>
                <div className="flex gap-1">
                  {swatches.map((swatch, index) => (
                    <span key={index} className={cn("flex h-6 flex-1 items-center justify-center rounded-md", swatchClasses[swatch])}>
                      {index < 3 && <Check className={cn("size-3", swatch === "foreground" ? "text-background" : "text-white", step(index))} strokeWidth={2.5} />}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {sizes.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground">{sizeLabel}</span>
                <div className="flex items-center justify-between rounded-lg border border-border px-1.5 py-1">
                  <Minus className="size-3 text-muted-foreground" />
                  <span className="grid tabular-nums">
                    {sizes.slice(0, 3).map((size, index) => (
                      <span key={index} className={cn("col-start-1 row-start-1 text-center", step(index))}>
                        {size}
                      </span>
                    ))}
                  </span>
                  <Plus className="size-3 text-muted-foreground" />
                </div>
              </div>
            )}
            {font && (
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground">{fontLabel}</span>
                <span className="rounded-lg border border-border px-2.5 py-1.5">{font}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
