"use client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Brand {
  name: string;
  src: string;
  alt?: string;
}

interface Logo6Props {
  source?: Brand;
  target?: Brand;
  status?: string;
  note?: string;
  className?: string;
}

export const logo6Demo: Logo6Props = {
  source: {
    name: "Stripe",
    src: "https://oud.pics/sm/l/stripe.jpeg",
  },
  target: {
    name: "Notion",
    src: "https://oud.pics/sm/l/notion.png",
  },
  status: "Integration live",
  note: "Syncing payments to your database every 15 minutes.",
};

function BrandTile({ brand }: { brand?: Brand }) {
  if (!brand) return null;
  return (
    <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <img
        src={brand.src}
        alt={brand.alt ?? brand.name}
        className="absolute inset-0 size-full object-cover"
      />
    </span>
  );
}

export function Logo6({
  source,
  target,
  status,
  note,
  className,
}: Logo6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <BrandTile brand={source} />
          <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
            <Check className="size-3" aria-hidden="true" />
          </div>
          <BrandTile brand={target} />
        </div>
        {status && (
          <span className="text-sm font-semibold text-card-foreground">
            {status}
          </span>
        )}
        {note && (
          <span className="text-center text-xs text-muted-foreground">
            {note}
          </span>
        )}
      </div>
    </div>
  );
}
