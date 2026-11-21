"use client";

import { cn } from "@/lib/utils";

interface Editor67Item {
  image?: string;
  name?: string;
  kind?: string;
}

interface Editor67Props {
  title?: string;
  tag?: string;
  item?: Editor67Item;
  priceLabel?: string;
  oldPrice?: string;
  newPrice?: string;
  descriptionLabel?: string;
  description?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor67Demo: Editor67Props = {
  title: "Most booked",
  item: { image: "https://oud.pics/b/beste/oriel-facial.webp", name: "Signature facial" },
  oldPrice: "€85",
  newPrice: "€90",
  description: "Cleanse, massage and a mask chosen for your skin.",
  framed: true,
};

export function Editor67({
  title,
  tag,
  item,
  priceLabel,
  oldPrice,
  newPrice,
  descriptionLabel,
  description,
  framed = true,
  fill = false,
  className,
}: Editor67Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-semibold">{title}</span>
            {tag && <span className="shrink-0 text-muted-foreground">{tag}</span>}
          </div>
          {item && (
            <div className="flex items-center gap-2.5 rounded-lg bg-muted p-1.5">
              {item.image && <img src={item.image} alt={item.name ?? ""} className="size-10 shrink-0 rounded-md object-cover" />}
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
              {item.kind && <span className="shrink-0 pr-1 text-muted-foreground">{item.kind}</span>}
            </div>
          )}
          {priceLabel && <span className="text-muted-foreground">{priceLabel}</span>}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 ring-3 ring-chart-1/20">
            {oldPrice && <span className="text-muted-foreground line-through">{oldPrice}</span>}
            <span>{newPrice}</span>
          </div>
          {descriptionLabel && <span className="text-muted-foreground">{descriptionLabel}</span>}
          {description && <div className="rounded-lg border border-border px-2.5 py-2 leading-normal">{description}</div>}
        </div>
      </div>
    </div>
  );
}
