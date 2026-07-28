"use client";

import { Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Realestate5Props {
  name?: string;
  firm?: string;
  initials?: string;
  rating?: string;
  deals?: string;
  phone?: string;
  image?: string;
  tone?: Tone;
  className?: string;
}

const avatarClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white",
  violet: "bg-gradient-to-br from-indigo-500 via-violet-500 to-rose-500 text-white",
  amber: "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white",
  rose: "bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 text-white",
};

export const realestate5Demo: Realestate5Props = {
  name: "Sofia Romano",
  firm: "Riverside Realty · Broker",
  initials: "SR",
  rating: "4.9",
  deals: "42 deals closed",
  phone: "+90 532 000 12 34",
  image:
    "https://images.unsplash.com/photo-1763478959183-136fe6bdcc93?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlYWwlMjBlc3RhdGUlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D",
  tone: "primary",
};

export function Realestate5({
  name,
  firm,
  initials = "??",
  rating,
  deals,
  phone,
  image,
  tone = "primary",
  className,
}: Realestate5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold shadow-md",
              avatarClasses[tone]
            )}
          >
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
            {firm && (
              <span className="truncate text-sm text-muted-foreground">
                {firm}
              </span>
            )}
            {rating && (
              <span className="inline-flex items-center gap-1 text-xs">
                <Star
                  className="size-3 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                <span className="font-semibold text-card-foreground">
                  {rating}
                </span>
                {deals && (
                  <span className="text-muted-foreground">· {deals}</span>
                )}
              </span>
            )}
          </div>
        </div>
        {phone && (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-sm font-semibold text-background hover:opacity-90"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            {phone}
          </button>
        )}
      </div>
    </div>
  );
}
