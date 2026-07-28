"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TimelineTone = "primary" | "emerald" | "amber" | "rose" | "violet" | "sky";

export interface TimelineEvent {
  id: string;
  label: string;
  /** Start hour as a decimal, e.g. 9 or 10.5 */
  start: number;
  /** End hour as a decimal */
  end: number;
  tone?: TimelineTone;
}

export interface TimelineRow {
  id: string;
  label: string;
  sublabel?: string;
  events: TimelineEvent[];
}

interface ScheduleTimelineProps {
  rows: TimelineRow[];
  /** First hour on the axis (default 8) */
  dayStart?: number;
  /** Last hour on the axis (default 18) */
  dayEnd?: number;
  /** Axis tick interval in hours (default 2) */
  step?: number;
  /** Draw a "now" marker at this hour (omit to hide) */
  nowAt?: number;
  onEventClick?: (rowId: string, eventId: string) => void;
  className?: string;
}

const toneClass: Record<TimelineTone, string> = {
  primary: "bg-primary text-primary-foreground",
  emerald: "bg-emerald-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
  violet: "bg-violet-500 text-white",
  sky: "bg-sky-500 text-white",
};

function formatHour(h: number) {
  const hour = Math.floor(h);
  const min = Math.round((h - hour) * 60);
  const period = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return min === 0
    ? `${h12} ${period}`
    : `${h12}:${String(min).padStart(2, "0")} ${period}`;
}

export const scheduleTimelineDemo: ScheduleTimelineProps = {
  dayStart: 8,
  dayEnd: 18,
  step: 2,
  nowAt: 11.5,
  rows: [
    {
      id: "loft",
      label: "Atrium Loft",
      sublabel: "Floor 3 · 12 seats",
      events: [
        { id: "a1", label: "Planning sync", start: 9, end: 11, tone: "primary" },
        { id: "a2", label: "Design review", start: 14, end: 15.5, tone: "emerald" },
      ],
    },
    {
      id: "studio",
      label: "Studio B",
      sublabel: "Floor 2 · 8 seats",
      events: [
        { id: "b1", label: "Brand shoot", start: 10.5, end: 13, tone: "amber" },
        { id: "b2", label: "Editing block", start: 15, end: 17, tone: "sky" },
      ],
    },
    {
      id: "garden",
      label: "Garden Room",
      sublabel: "Ground · 20 seats",
      events: [
        { id: "c1", label: "Standup", start: 8.5, end: 9, tone: "rose" },
        { id: "c2", label: "Vendor walkthrough", start: 12, end: 13.5, tone: "violet" },
        { id: "c3", label: "Workshop", start: 16, end: 18, tone: "primary" },
      ],
    },
    {
      id: "rooftop",
      label: "Rooftop Deck",
      sublabel: "Level 5 · 40 seats",
      events: [
        { id: "d1", label: "Networking", start: 17, end: 18, tone: "emerald" },
      ],
    },
  ],
};

export function ScheduleTimeline({
  rows,
  dayStart = 8,
  dayEnd = 18,
  step = 2,
  nowAt,
  onEventClick,
  className,
}: ScheduleTimelineProps) {
  const span = Math.max(1, dayEnd - dayStart);
  const pos = (h: number) => ((h - dayStart) / span) * 100;

  const ticks: number[] = [];
  for (let h = dayStart; h <= dayEnd; h += step) ticks.push(h);

  const showNow = nowAt != null && nowAt >= dayStart && nowAt <= dayEnd;

  return (
    <div className={cn("w-full", className)}>
      {/* Axis */}
      <div className="flex items-end">
        <div className="w-28 shrink-0 sm:w-40" />
        <div className="relative h-5 flex-1">
          {ticks.map((tick, i) => (
            <span
              key={tick}
              className={cn(
                "absolute whitespace-nowrap text-sm tabular-nums text-muted-foreground",
                i === 0
                  ? "translate-x-0"
                  : i === ticks.length - 1
                    ? "-translate-x-full"
                    : "-translate-x-1/2"
              )}
              style={{ left: `${pos(tick)}%` }}
            >
              {formatHour(tick)}
            </span>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="mt-2 space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-2">
            <div className="w-28 shrink-0 sm:w-40">
              <p className="truncate text-sm font-medium text-foreground">
                {row.label}
              </p>
              {row.sublabel && (
                <p className="truncate text-sm text-muted-foreground">
                  {row.sublabel}
                </p>
              )}
            </div>
            <div className="relative h-11 flex-1 overflow-hidden rounded-lg bg-muted/50">
              {/* grid lines */}
              {ticks.map((tick) => (
                <div
                  key={tick}
                  className="absolute inset-y-0 w-px bg-border/70"
                  style={{ left: `${pos(tick)}%` }}
                />
              ))}
              {/* now marker */}
              {showNow && (
                <div
                  className="absolute inset-y-0 z-10 w-0.5 bg-primary"
                  style={{ left: `${pos(nowAt as number)}%` }}
                />
              )}
              {/* event bars */}
              {row.events.map((event) => (
                <Tooltip key={event.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onEventClick?.(row.id, event.id)}
                      className={cn(
                        "absolute inset-y-1 flex cursor-pointer items-center overflow-hidden rounded-md px-2 text-left text-sm font-medium shadow-sm transition-opacity hover:opacity-90",
                        toneClass[event.tone ?? "primary"]
                      )}
                      style={{
                        left: `${pos(event.start)}%`,
                        width: `${((event.end - event.start) / span) * 100}%`,
                      }}
                    >
                      <span className="truncate">{event.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{event.label}</p>
                    <p className="text-background/70">
                      {formatHour(event.start)} – {formatHour(event.end)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
