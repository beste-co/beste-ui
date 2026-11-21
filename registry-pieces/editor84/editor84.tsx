"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Editor84Props {
  /** A cover picture across the top of the card */
  image?: { src: string; alt: string };
  label?: string;
  meta?: string;
  heading?: string;
  /** Label and value cells in a two-column grid of hairlines */
  fields?: { label: string; value: string }[];
  note?: string;
  /** Makes the whole card a link */
  href?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor84Demo: Editor84Props = {
  image: { src: "https://oud.pics/b/beste/oriel-facial.webp", alt: "A facial treatment at the Oriel studio" },
  heading: "Book a facial in under a minute",
  fields: [
    { label: "Next free slot", value: "Thu, 10:30" },
    { label: "Treatment", value: "Signature facial" },
    { label: "Length", value: "60 min" },
    { label: "Studio", value: "Príncipe Real" },
  ],
  href: "https://beste.co",
  framed: true,
};

// The rim and card become one link when the piece has somewhere to go
function Frame({ href, className, children }: { href?: string; className?: string; children: ReactNode }) {
  return href ? (
    <a href={href} className={cn("block", className)}>
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  );
}

export function Editor84({ image, label, meta, heading, fields = [], note, href, framed = true, fill = false, className }: Editor84Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <Frame
        href={href}
        className={cn(
          "w-full",
          href && "cursor-pointer transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3.5 rounded-2xl bg-card p-4.5 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {image && (
            <div className="aspect-16/10 overflow-hidden rounded-xl bg-muted">
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="size-full object-cover" />
            </div>
          )}
          {(label || meta) && (
            <div className="flex justify-between gap-3 text-muted-foreground">
              <span>{label}</span>
              <span className="truncate">{meta}</span>
            </div>
          )}
          {heading && <p className="text-xl leading-tight font-medium tracking-tight">{heading}</p>}
          {fields.length > 0 && (
            <div className="grid grid-cols-2 border-t border-l border-border">
              {fields.map((field, index) => (
                <div key={index} className="min-w-0 border-r border-b border-border p-3">
                  <p className="truncate text-muted-foreground">{field.label}</p>
                  <p className="mt-1 truncate font-medium">{field.value}</p>
                </div>
              ))}
            </div>
          )}
          {note && <p className="text-muted-foreground">{note}</p>}
        </div>
      </Frame>
    </div>
  );
}
