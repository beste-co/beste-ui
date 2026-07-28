"use client";

import { ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lesson {
  title: string;
  duration: string;
}

interface Education5Props {
  moduleTitle?: string;
  moduleIndex?: number;
  lessons?: Lesson[];
  expanded?: boolean;
  className?: string;
}

export const education5Demo: Education5Props = {
  moduleIndex: 2,
  moduleTitle: "Typography systems",
  lessons: [
    { title: "Choosing a type scale", duration: "9:12" },
    { title: "Vertical rhythm in the wild", duration: "14:30" },
    { title: "Pairing display with body", duration: "11:05" },
  ],
  expanded: true,
};

export function Education5({
  moduleTitle,
  moduleIndex = 1,
  lessons = [],
  expanded = true,
  className,
}: Education5Props) {
  const totalMin = lessons.reduce((acc, l) => {
    const [m] = l.duration.split(":");
    return acc + Number(m ?? 0);
  }, 0);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b border-border px-3 py-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-semibold text-card-foreground">
            {moduleIndex}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {moduleTitle}
            </span>
            <span className="text-xs text-muted-foreground">
              {lessons.length} lessons · {totalMin} min
            </span>
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-180"
            )}
            aria-hidden="true"
          />
        </div>
        {expanded && (
          <div className="flex flex-col divide-y divide-border">
            {lessons.map((lesson, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-2 text-xs"
              >
                <span className="font-mono text-muted-foreground">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <span className="flex-1 truncate text-card-foreground">
                  {lesson.title}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3" aria-hidden="true" />
                  {lesson.duration}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
