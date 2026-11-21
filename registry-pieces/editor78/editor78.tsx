"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor78Props {
  /** The page the section sits on */
  page?: string;
  status?: string;
  image?: string;
  heading?: string;
  /** A short line under the heading */
  description?: string;
  /** Ruled rows, a name with a quiet value */
  items?: { label: string; value?: string }[];
  /** A ruled line at the foot with an arrow, e.g. where booking opens */
  note?: string;
  /** Plays a motion preset on a loop: the photo and heading blur in, or the photo drifts as on scroll */
  motion?: "none" | "blur-in" | "parallax";
  /** The client site's warm stone, or the plain card color */
  surface?: "warm" | "card";
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor78Demo: Editor78Props = {
  status: "Draft",
  image: "https://oud.pics/b/beste/oriel-consultation.webp",
  heading: "Facials",
  items: [
    { label: "Signature facial", value: "60 min" },
    { label: "Calming facial", value: "45 min" },
    { label: "Renewal facial", value: "75 min" },
  ],
  framed: true,
};

const STYLES = `
@keyframes editor78-blur { 0% { opacity: 0.25; filter: blur(8px); transform: translateY(8px) } 24%, 100% { opacity: 1; filter: blur(0); transform: none } }
@keyframes editor78-drift { 0%, 100% { transform: translateY(-14px) } 50% { transform: translateY(14px) } }
.editor78-blur { animation: editor78-blur 7s cubic-bezier(.2,.7,.2,1) -3s infinite }
.editor78-blur-late { animation: editor78-blur 7s cubic-bezier(.2,.7,.2,1) -2.8s infinite }
.editor78-drift { animation: editor78-drift 9s ease-in-out infinite }
@media (prefers-reduced-motion: reduce) { .editor78-blur, .editor78-blur-late, .editor78-drift { animation: none } }
`;

export function Editor78({ page, status, image, heading, description, items = [], note, motion = "none", surface = "warm", framed = true, fill = false, className }: Editor78Props) {
  const warm = surface === "warm";
  const quiet = warm ? "text-stone-500" : "text-muted-foreground";
  const rule = warm ? "border-stone-200" : "border-border";
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {motion !== "none" && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && "max-w-70",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl p-3", warm ? "bg-stone-50 text-stone-900" : "bg-card text-card-foreground", !framed && "shadow-lg")}>
          {(page || status) && (
            <div className={cn("flex justify-between gap-3 text-xs", quiet)}>
              <span>{page}</span>
              {status && <span>{status}</span>}
            </div>
          )}
          {image &&
            (motion === "parallax" ? (
              <div className={cn("relative h-32 w-full overflow-hidden rounded-lg", warm ? "bg-stone-200" : "bg-muted")}>
                <img src={image} alt="" aria-hidden="true" className="editor78-drift absolute inset-x-0 -top-5 h-42 w-full object-cover" />
              </div>
            ) : (
              <img src={image} alt="" aria-hidden="true" className={cn("h-32 w-full rounded-lg object-cover", warm ? "bg-stone-200" : "bg-muted", motion === "blur-in" && "editor78-blur")} />
            ))}
          {heading && <div className={cn("text-base font-medium tracking-tight", motion === "blur-in" && "editor78-blur-late")}>{heading}</div>}
          {description && <div className={cn("text-xs leading-relaxed", quiet)}>{description}</div>}
          {items.length > 0 && (
            <div className="flex flex-col text-xs">
              {items.map((item, index) => (
                <div key={index} className={cn("flex justify-between gap-3 border-t py-1.5", rule)}>
                  <span className="truncate">{item.label}</span>
                  {item.value && <span className={cn("shrink-0", quiet)}>{item.value}</span>}
                </div>
              ))}
            </div>
          )}
          {note && (
            <div className={cn("flex items-center gap-1.5 border-t pt-2 text-xs", rule, quiet)}>
              <ArrowUpRight aria-hidden="true" className="size-3 shrink-0" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
