"use client";

import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Card17Props {
  amount?: string;
  brand?: string;
  code?: string;
  expiry?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}

const cardClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-gradient-to-br from-emerald-600 via-teal-500 to-sky-500 text-white",
  sky: "bg-gradient-to-br from-sky-600 via-indigo-500 to-violet-500 text-white",
  violet: "bg-gradient-to-br from-violet-600 via-fuchsia-500 to-rose-500 text-white",
  amber: "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white",
  rose: "bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 text-white",
};

export const card17Demo: Card17Props = {
  amount: "$50",
  brand: "Beste",
  code: "BSTE-7Z91-X2Q",
  expiry: "Expires 31 Dec 2027",
  label: "Gift card",
  tone: "emerald",
};

export function Card17({
  amount,
  brand = "Brand",
  code,
  expiry,
  label = "Gift card",
  tone = "emerald",
  className,
}: Card17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-72 flex-col rounded-xl p-4 shadow-xl",
          cardClasses[tone]
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest">
            {label}
          </span>
          <Gift className="size-5" aria-hidden="true" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-4xl font-bold">{amount}</span>
          <span className="text-sm opacity-70">·</span>
          <span className="text-sm font-semibold">{brand}</span>
        </div>
        {code && (
          <span className="mt-3 truncate rounded-md bg-current/15 px-2 py-1 font-mono text-xs font-semibold tracking-widest">
            {code}
          </span>
        )}
        {expiry && (
          <span className="mt-2 text-xs opacity-70">{expiry}</span>
        )}
      </div>
    </div>
  );
}
