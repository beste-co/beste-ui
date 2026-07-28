"use client";

import {
  FastForward,
  Pause,
  Play,
  Rewind,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";

type State = "playing" | "paused";

interface Keyboard16Props {
  state?: State;
  track?: string;
  elapsed?: string;
  className?: string;
}

export const keyboard16Demo: Keyboard16Props = {
  state: "playing",
  track: "Porcelain · Moby",
  elapsed: "2:18 / 4:01",
};

export function Keyboard16({
  state = "paused",
  track,
  elapsed,
  className,
}: Keyboard16Props) {
  const keys = [
    { icon: SkipBack, label: "Previous" },
    { icon: Rewind, label: "Rewind" },
    {
      icon: state === "playing" ? Pause : Play,
      label: state === "playing" ? "Pause" : "Play",
      active: true,
    },
    { icon: FastForward, label: "Forward" },
    { icon: SkipForward, label: "Next" },
  ];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        {track && (
          <span className="text-xs font-medium text-muted-foreground">
            {track}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          {keys.map((key, idx) => {
            const Icon = key.icon;
            return (
              <kbd
                key={idx}
                aria-label={key.label}
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg border font-mono shadow-sm",
                  key.active
                    ? "border-primary bg-primary text-primary-foreground border-b-2"
                    : "border-border border-b-2 bg-gradient-to-b from-card to-muted text-card-foreground"
                )}
              >
                <Icon
                  className={cn("size-4", key.active && "fill-current")}
                  aria-hidden="true"
                />
              </kbd>
            );
          })}
        </div>
        {elapsed && (
          <span className="font-mono text-xs text-muted-foreground">
            {elapsed}
          </span>
        )}
      </div>
    </div>
  );
}
