"use client";

import { School } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education29Props {
  student?: string;
  grade?: string;
  school?: string;
  photo?: string;
  imageSrc?: string;
  alt?: string;
  id?: string;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHBvcnRyYWl0fGVufDB8fDB8fHww";

export const education29Demo: Education29Props = {
  student: "Elara Martin",
  grade: "Grade 7 · 7B",
  school: "Redwood Middle School",
  photo: "EM",
  imageSrc: defaultImage,
  alt: "Elara Martin",
  id: "STD-24-00281",
};

export function Education29({
  student,
  grade,
  school,
  photo = "??",
  imageSrc = defaultImage,
  alt,
  id,
  className,
}: Education29Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 overflow-hidden rounded-xl border border-border bg-card shadow-md">
        <div className="flex shrink-0 flex-col items-center justify-center gap-2 border-r border-border bg-muted p-3 text-muted-foreground">
          <School className="size-4" aria-hidden="true" />
          <div
            className={cn(
              "relative flex size-14 items-center justify-center overflow-hidden rounded-md text-xl font-bold text-card-foreground",
              !imageSrc && "bg-card"
            )}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={alt ?? student ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              photo
            )}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 p-3">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Student ID
            </span>
            {student && (
              <span className="truncate text-sm font-semibold text-card-foreground">{student}</span>
            )}
            {grade && <span className="truncate text-xs text-card-foreground">{grade}</span>}
            {school && <span className="truncate text-xs text-muted-foreground">{school}</span>}
          </div>
          {id && <span className="truncate font-mono text-xs text-muted-foreground">{id}</span>}
        </div>
      </div>
    </div>
  );
}
