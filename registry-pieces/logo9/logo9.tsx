"use client";
import { cn } from "@/lib/utils";

interface Brand {
  name: string;
  src: string;
  alt?: string;
}

interface Logo9Props {
  left?: Brand;
  right?: Brand;
  separator?: string;
  caption?: string;
  className?: string;
}

export const logo9Demo: Logo9Props = {
  left: { name: "Stripe", src: "https://oud.pics/sm/l/stripe.jpeg" },
  right: { name: "Notion", src: "https://oud.pics/sm/l/notion.png" },
  separator: "vs",
  caption: "Head-to-head comparison",
};

function Side({ brand }: { brand?: Brand }) {
  if (!brand) return null;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="relative size-12 overflow-hidden rounded-xl bg-card shadow-sm">
        <img
          src={brand.src}
          alt={brand.alt ?? brand.name}
          className="absolute inset-0 size-full object-cover"
        />
      </span>
      <span className="text-sm font-semibold text-card-foreground">
        {brand.name}
      </span>
    </div>
  );
}

export function Logo9({
  left,
  right,
  separator = "vs",
  caption,
  className,
}: Logo9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <Side brand={left} />
          <span className="font-serif text-xs italic uppercase tracking-widest text-muted-foreground">
            {separator}
          </span>
          <Side brand={right} />
        </div>
        {caption && (
          <span className="text-xs text-muted-foreground">{caption}</span>
        )}
      </div>
    </div>
  );
}
