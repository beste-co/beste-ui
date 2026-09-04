"use client";

import { useEffect, useState } from "react";
import { Nfc } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Card32Props {
  brand?: string;
  number?: string;
  holder?: string;
  expiry?: string;
  cvc?: string;
  intervalMs?: number;
  tone?: Tone;
  className?: string;
}

const faceClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-600 text-white",
  sky: "bg-sky-600 text-white",
  violet: "bg-violet-600 text-white",
};

export const card32Demo: Card32Props = {
  brand: "Beste Card",
  number: "4218",
  holder: "Herbie Hancock",
  expiry: "09/29",
  cvc: "318",
  tone: "primary",
};

export function Card32({
  brand = "Card",
  number = "0000",
  holder = "Card holder",
  expiry = "01/30",
  cvc = "000",
  intervalMs = 3200,
  tone = "primary",
  className,
}: Card32Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setFlipped((f) => !f), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  const face = cn(
    "absolute inset-0 flex flex-col overflow-hidden rounded-2xl p-4 shadow-md",
    faceClasses[tone]
  );

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="relative h-44 w-full max-w-72"
        style={{ perspective: "1200px" }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-in-out motion-reduce:transition-none"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div className={face} style={{ backfaceVisibility: "hidden" }}>
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium">{brand}</span>
              <Nfc className="size-5 opacity-80" aria-hidden="true" />
            </div>

            <span
              className="mt-3 h-8 w-11 rounded-md bg-current opacity-30"
              aria-hidden="true"
            />

            <p className="mt-auto font-mono text-lg tracking-widest">
              <span aria-hidden="true">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; </span>
              {number}
            </p>

            <div className="mt-2 flex items-end justify-between text-xs">
              <span className="uppercase tracking-wide">{holder}</span>
              <span className="tabular-nums opacity-80">{expiry}</span>
            </div>
          </div>

          <div
            className={face}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span
              className="-mx-4 mt-2 h-10 bg-current opacity-70"
              aria-hidden="true"
            />
            <div className="mt-4 flex items-center gap-2">
              <span className="h-8 flex-1 rounded-sm bg-current opacity-20" aria-hidden="true" />
              <span className="rounded-sm border border-current px-2 py-1 font-mono text-sm tabular-nums">
                {cvc}
              </span>
            </div>
            <p className="mt-auto text-xs opacity-80">
              Report a lost card at hello@beste.co
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
