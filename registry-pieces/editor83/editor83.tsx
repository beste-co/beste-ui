"use client";

import { cn } from "@/lib/utils";

interface Editor83Props {
  /** The name of the look, top left */
  label?: string;
  domain?: string;
  image?: { src: string; alt: string };
  /** A serif heading that appears word by word */
  heading?: string;
  description?: string;
  tags?: string[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor83Demo: Editor83Props = {
  image: { src: "https://oud.pics/b/beste/oriel-consultation.webp", alt: "A skin consultation at the Oriel studio" },
  heading: "Skin care that takes its time",
  framed: true,
};

const STYLES = `
@keyframes editor83-word { 0%, 4% { opacity: 0; transform: translateY(0.5rem); } 10%, 86% { opacity: 1; transform: none; } 94%, 100% { opacity: 0; transform: none; } }
.editor83-word { display: inline-block; animation: editor83-word 11s cubic-bezier(.3,0,.2,1) infinite; }
@media (prefers-reduced-motion: reduce) { .editor83-word { animation: none; } }
`;

export function Editor83({ label, domain, image, heading = "", description, tags = [], framed = true, fill = false, className }: Editor83Props) {
  const words = heading.split(" ").filter(Boolean);

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
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-stone-50 p-3.5 text-xs text-stone-900", !framed && "shadow-lg", fill && "justify-center")}>
          {(label || domain) && (
            <div className="flex justify-between gap-3 text-stone-500">
              <span>{label}</span>
              <span className="truncate">{domain}</span>
            </div>
          )}
          {image && <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-33 w-full rounded-lg object-cover" />}
          {words.length > 0 && (
            <p className="font-serif text-2xl leading-tight text-stone-900">
              <span className="sr-only">{heading}</span>
              <span aria-hidden="true">
                {words.map((word, index) => (
                  <span key={index}>
                    <span className="editor83-word" style={{ animationDelay: `${-3 + index * 0.22}s` }}>
                      {word}
                    </span>{" "}
                  </span>
                ))}
              </span>
            </p>
          )}
          {description && <p className="leading-normal text-stone-600">{description}</p>}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5 text-stone-600">
              {tags.map((tag, index) => (
                <span key={index} className="rounded-full px-2.5 py-1 ring-1 ring-stone-200">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
