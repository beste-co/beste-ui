"use client";
import { cn } from "@/lib/utils";

interface Card29Props {
  name?: string;
  handle?: string;
  bio?: string;
  initials?: string;
  stats?: { label: string; value: string }[];
  image?: string;
  bordered?: boolean;
  className?: string;
}

export const card29Demo: Card29Props = {
  name: "Kaitlyn Aurelia Smith",
  handle: "kaitlyn.smith",
  initials: "KS",
  stats: [
    { label: "Posts", value: "142" },
    { label: "Following", value: "318" },
    { label: "Followers", value: "4.2K" },
  ],
  image:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop",
  bordered: false,
};

export function Card29({
  name,
  handle,
  bio,
  initials = "??",
  stats = [],
  image,
  bordered = false,
  className,
}: Card29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-2 rounded-xl bg-card p-3 shadow-md", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-xs font-bold text-white">
            {image ? (
              <img
                src={image}
                alt={name ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {handle && (
              <span className="truncate text-xs text-muted-foreground">
                @{handle}
              </span>
            )}
          </div>
        </div>
        {bio && (
          <p className="line-clamp-2 text-sm text-card-foreground">{bio}</p>
        )}
        <div className="grid grid-cols-3 gap-1 border-t border-border pt-2 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-sm font-semibold tabular-nums text-card-foreground">
                {s.value}
              </span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
