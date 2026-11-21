"use client";

import { cn } from "@/lib/utils";

interface Editor60Hero {
  image?: string;
  tag?: string;
  heading?: string;
}

interface Editor60Feature {
  title?: string;
  description?: string;
}

interface Editor60Features {
  tag?: string;
  items?: Editor60Feature[];
}

interface Editor60Footer {
  brand?: string;
  tag?: string;
}

interface Editor60Props {
  /** Photo section on top */
  hero?: Editor60Hero;
  /** White section with three columns */
  features?: Editor60Features;
  /** Ink footer bar shared across pages */
  footer?: Editor60Footer;
  /** Stretch to the slot it sits in instead of keeping a card-sized stack */
  fill?: boolean;
  className?: string;
}

export const editor60Demo: Editor60Props = {
  hero: {
    image: "https://oud.pics/b/beste/oriel-studio.webp",
    tag: "Hero",
    heading: "Skin care that takes its time",
  },
  features: {
    tag: "Features",
    items: [
      { title: "Unhurried" },
      { title: "Consult first" },
      { title: "Gentle products" },
    ],
  },
  footer: {
    brand: "Oriel",
    tag: "Footer",
  },
};

const tagClasses = "absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs ring-1 ring-border";

export function Editor60({ hero = {}, features = {}, footer = {}, fill = false, className }: Editor60Props) {
  const items = features.items ?? [];

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div className={cn("flex w-full flex-col gap-2.5", !fill && "max-w-115")}>
        <div className={cn("relative overflow-hidden rounded-2xl shadow-lg", "h-52")}>
          {hero.image && <img src={hero.image} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 to-stone-950/0" aria-hidden="true" />
          {hero.tag && <span className={cn(tagClasses, "bg-card text-card-foreground/80")}>{hero.tag}</span>}
          {hero.heading && (
            <div className="absolute bottom-6 left-6 max-w-58 text-2xl leading-none font-medium tracking-tight text-white">
              {hero.heading}
            </div>
          )}
        </div>

        <div className="relative grid grid-cols-3 gap-3.5 rounded-2xl bg-card px-5.5 pt-11.5 pb-5.5 text-card-foreground shadow-lg">
          {features.tag && <span className={cn(tagClasses, "bg-secondary text-card-foreground/80")}>{features.tag}</span>}
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              {item.title && <span className="text-sm font-semibold">{item.title}</span>}
              {item.description && <span className="text-xs leading-snug text-muted-foreground">{item.description}</span>}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl bg-primary px-5.5 py-4.5 text-primary-foreground shadow-lg">
          {footer.brand && <span className="text-sm font-semibold tracking-tight">{footer.brand}</span>}
          {footer.tag && <span className="rounded-full bg-primary-foreground/10 px-2.5 py-1 text-xs">{footer.tag}</span>}
        </div>
      </div>
    </div>
  );
}
