"use client";
import { cn } from "@/lib/utils";

interface Logo8Props {
  brand?: string;
  metric?: string;
  description?: string;
  imageSrc?: string;
  alt?: string;
  className?: string;
}

export const logo8Demo: Logo8Props = {
  brand: "Notion",
  metric: "42.1M",
  description: "monthly active users",
  imageSrc: "https://oud.pics/sm/l/notion.png",
  alt: "Notion",
};

export function Logo8({
  brand,
  metric,
  description,
  imageSrc,
  alt,
  className,
}: Logo8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {imageSrc && (
          <span className="relative size-12 overflow-hidden rounded-xl bg-card shadow-sm">
            <img
              src={imageSrc}
              alt={alt ?? brand ?? ""}
              className="absolute inset-0 size-full object-cover"
            />
          </span>
        )}
        <div className="flex flex-col leading-tight">
          {brand && (
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {brand}
            </span>
          )}
          <span className="font-mono text-2xl font-bold text-card-foreground">
            {metric}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
