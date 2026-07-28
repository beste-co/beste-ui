"use client";
import { cn } from "@/lib/utils";

interface Food1Props {
  name?: string;
  description?: string;
  price?: string;
  calories?: string;
  tags?: string[];
  imageSrc?: string;
  alt?: string;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=200&q=80";

export const food1Demo: Food1Props = {
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
  className,
}: Food1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
          <img
            src={imageSrc}
            alt={alt ?? name ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-baseline justify-between gap-2">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {price && (
              <span className="shrink-0 font-mono text-sm font-bold text-card-foreground">
                {price}
              </span>
            )}
          </div>
          {description && (
            <span className="line-clamp-2 text-xs text-muted-foreground">
              {description}
            </span>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {calories && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
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
