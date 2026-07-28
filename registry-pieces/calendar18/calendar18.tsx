"use client";

import { DoorOpen, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Room {
  name: string;
  floor: string;
  capacity: number;
  availableFrom: string;
  video?: boolean;
  active?: boolean;
}

interface Calendar18Props {
  heading?: string;
  rooms?: Room[];
  className?: string;
}

export const calendar18Demo: Calendar18Props = {
  heading: "Pick a room · Thu 14:00 – 14:30",
  rooms: [
    {
      name: "The Archive",
      floor: "Floor 2 · North",
      capacity: 8,
      availableFrom: "Free now",
      video: true,
      active: true,
    },
    {
      name: "Orbit",
      floor: "Floor 3",
      capacity: 4,
      availableFrom: "Free from 14:15",
    },
    {
      name: "Boardroom",
      floor: "Floor 5 · Executive",
      capacity: 12,
      availableFrom: "Booked · next at 16:00",
      video: true,
    },
  ],
};

export function Calendar18({
  heading,
  rooms = [],
  className,
}: Calendar18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          {rooms.map((room, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-3 rounded-md border p-2",
                room.active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              )}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <DoorOpen className="size-4" aria-hidden="true" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-card-foreground">
                  {room.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {room.floor}
                </span>
              </div>
              <div className="flex flex-col items-end text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Users className="size-3" aria-hidden="true" />
                  {room.capacity}
                </span>
                {room.video && (
                  <Video
                    className="size-3 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                  room.availableFrom.startsWith("Booked")
                    ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                    : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                )}
              >
                {room.availableFrom}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
