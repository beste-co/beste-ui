"use client";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Food1Props {
  name?: string;
  description?: string;
  price?: string;
  calories?: string;
  tags?: string[];
  imageSrc?: string;
  alt?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=200&q=80";


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const food1Demo: Food1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  name: "Roasted miso salmon",
  description: "With charred leeks, lemon and toasted sesame",
  price: "₺240",
  calories: "520 kcal",
  tags: ["Chef's pick", "Gluten-free"],
  imageSrc: defaultImage,
  alt: "Roasted miso salmon · plated",
};

export function Food1({
  name,
  description,
  price,
  calories,
  tags = [],
  imageSrc = defaultImage,
  alt,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Food1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 gap-3 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-current/10">
          <img
            src={imageSrc}
            alt={alt ?? name ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-baseline justify-between gap-2">
            {name && (
              <span className="truncate text-sm font-semibold">
                {name}
              </span>
            )}
            {price && (
              <span className="shrink-0 font-mono text-sm font-bold">
                {price}
              </span>
            )}
          </div>
          {description && (
            <span className="line-clamp-2 text-xs text-current/60">
              {description}
            </span>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {calories && (
              <span className="rounded-full bg-current/10 px-1.5 py-0.5 text-xs text-current/60">
                {calories}
              </span>
            )}
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-xs font-semibold text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
