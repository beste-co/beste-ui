"use client";
import { cn } from "@/lib/utils";

interface Commerce26Props {
  buyer?: string;
  city?: string;
  product?: string;
  ago?: string;
  initials?: string;
  imageSrc?: string;
  alt?: string;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA3fHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D";

export const commerce26Demo: Commerce26Props = {
  buyer: "Mia R.",
  initials: "MR",
  city: "Los Angeles",
  product: "Air Max 90",
  ago: "3 min ago",
  imageSrc: defaultImage,
  alt: "Mia R.",
};

export function Commerce26({
  buyer = "Someone",
  initials,
  city,
  product = "a product",
  ago,
  imageSrc = defaultImage,
  alt,
  className,
}: Commerce26Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 items-center gap-2.5 rounded-md border border-border bg-card p-2.5 shadow-md">
        <span
          className={cn(
            "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white",
            !imageSrc && "bg-gradient-to-br from-violet-500 to-fuchsia-500"
          )}
          aria-hidden={imageSrc ? undefined : "true"}
        >
          {imageSrc ? (
            <img src={imageSrc} alt={alt ?? buyer} className="absolute inset-0 size-full object-cover" />
          ) : (
            (initials ?? buyer.charAt(0))
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-xs leading-snug text-card-foreground">
            <span className="font-semibold">{buyer}</span>
            {city && <span className="text-muted-foreground"> in {city}</span>} just bought{" "}
            <span className="font-semibold">{product}</span>
          </p>
          {ago && <span className="font-mono text-xs text-muted-foreground">{ago}</span>}
        </div>
      </div>
    </div>
  );
}
