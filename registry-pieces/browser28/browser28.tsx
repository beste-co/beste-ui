"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Browser28Props {
  domains?: string[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


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

export const browser28Demo: Browser28Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  domains: [
    "customer.beste.co",
    "project.beste.co",
    "jane.beste.co",
    "joe.beste.co",
  ],
};

const LAYERS = [
  {
    radius: 8,
    py: 8,
    px: 12,
    barH: 16,
    fontSize: 12,
    buttonSize: 8,
    buttonGap: 4,
    iconSize: 12.5,
  },
  {
    radius: 7,
    py: 6.75,
    px: 10,
    barH: 14,
    fontSize: 9.5,
    buttonSize: 7,
    buttonGap: 4,
    iconSize: 10.5,
  },
  {
    radius: 6,
    py: 6,
    px: 8.75,
    barH: 12,
    fontSize: 7.75,
    buttonSize: 6,
    buttonGap: 2,
    iconSize: 9,
  },
  {
    radius: 5,
    py: 5,
    px: 7.5,
    barH: 10,
    fontSize: 6,
    buttonSize: 5,
    buttonGap: 2,
    iconSize: 7,
  },
];

const TRAFFIC = ["bg-rose-400", "bg-amber-400", "bg-emerald-400"];

export function Browser28({ domains = [], surface = "card", bordered = true, inverted = false, className }: Browser28Props) {
  const list = domains.slice(0, LAYERS.length);
  const label = `Stacked browser windows for ${list.join(", ")}`;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        aria-label={label}
        className="mx-auto flex h-full w-11/12 max-w-80 flex-col-reverse items-center justify-center"
      >
        {list.map((domain, i) => {
          const l = LAYERS[i]!;
          return (
            <div
              key={i}
              aria-hidden="true"
              className={cn("relative flex w-full items-center shadow-sm", surfaceTone, bordered && "border border-current/15")}
              style={{
                width: `calc(100% - ${32 * i}px)`,
                borderRadius: `${l.radius}px ${l.radius}px 0 0`,
                padding: `${l.py}px ${l.px}px`,
                zIndex: 10 - i,
                opacity: 1 - i * 0.1,
                marginBottom: -2,
              }}
            >
              <div
                className="flex items-center"
                style={{ gap: `${l.buttonGap}px` }}
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className={cn(
                      "shrink-0 rounded-full",
                      i === 0 ? TRAFFIC[d] : "bg-current/10"
                    )}
                    style={{
                      width: `${l.buttonSize}px`,
                      height: `${l.buttonSize}px`,
                    }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div
                className="mx-auto flex items-center justify-center gap-1 rounded-full"
                style={{
                  height: `${l.barH}px`,
                  fontSize: `${l.fontSize}px`,
                }}
              >
                <Lock
                  className="text-current/60"
                  style={{
                    width: `${l.iconSize}px`,
                    height: `${l.iconSize}px`,
                  }}
                  aria-hidden="true"
                />
                <span className="truncate">{domain}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
