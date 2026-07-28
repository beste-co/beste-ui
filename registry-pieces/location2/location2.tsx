"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "rose" | "emerald" | "sky";

interface Location2Props {
  place?: string;
  address?: string;
  tone?: Tone;
  className?: string;
}

const tonePin: Record<Tone, string> = {
  primary: "fill-primary",
  foreground: "fill-foreground",
  rose: "fill-rose-500",
  emerald: "fill-emerald-500",
  sky: "fill-sky-500",
};

const toneRing: Record<Tone, string> = {
  primary: "fill-primary/15",
  foreground: "fill-foreground/10",
  rose: "fill-rose-500/15",
  emerald: "fill-emerald-500/15",
  sky: "fill-sky-500/15",
};

/** City blocks; the gaps between them read as streets. */
const blocks = [
  { x: 8, y: 10, w: 44, h: 30 },
  { x: 62, y: 10, w: 62, h: 30 },
  { x: 134, y: 10, w: 40, h: 30 },
  { x: 184, y: 10, w: 64, h: 30 },
  { x: 8, y: 50, w: 44, h: 26 },
  { x: 134, y: 50, w: 40, h: 26 },
  { x: 184, y: 50, w: 64, h: 26 },
  { x: 8, y: 86, w: 44, h: 32 },
  { x: 62, y: 86, w: 62, h: 32 },
  { x: 134, y: 86, w: 40, h: 32 },
  { x: 184, y: 86, w: 64, h: 32 },
];

export const location2Demo: Location2Props = {
  place: "Times Square",
  address: "Manhattan, New York",
  tone: "rose",
};

export function Location2({
  place,
  address,
  tone = "primary",
  className,
}: Location2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-64 overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="relative h-32 bg-background">
          <svg
            viewBox="0 0 256 128"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
            {blocks.map((block, index) => (
              <rect
                key={index}
                x={block.x}
                y={block.y}
                width={block.w}
                height={block.h}
                rx="3"
                className="fill-muted"
              />
            ))}

            {/* Park block */}
            <rect
              x="62"
              y="50"
              width="62"
              height="26"
              rx="3"
              className="fill-emerald-500/25"
            />

            {/* Navigation route — turns follow the streets between the blocks */}
            <path
              d="M57 122 L57 81 L150 81"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="0.5 7"
              className="stroke-muted-foreground"
            />
            {/* Origin */}
            <circle cx="57" cy="122" r="3.5" className="fill-muted-foreground" />
            <circle cx="57" cy="122" r="1.5" className="fill-background" />

            {/* Destination marker (tip sits on the street the route arrives on) */}
            <circle cx="150" cy="54" r="24" className={toneRing[tone]} />
            <ellipse cx="150" cy="80" rx="8" ry="2.5" className="fill-foreground/15" />
            <path
              d="M150 80 C150 80 138 66 138 54 A12 12 0 1 1 162 54 C162 66 150 80 150 80 Z"
              className={tonePin[tone]}
            />
            <circle cx="150" cy="54" r="4.5" className="fill-background" />
          </svg>
        </div>

        <div className="border-t border-border px-3 py-2.5">
          {place && (
            <div className="truncate text-sm font-semibold text-card-foreground">
              {place}
            </div>
          )}
          {address && (
            <div className="truncate text-sm text-muted-foreground">
              {address}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
