"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type FileTone = "doc" | "pdf" | "sheet";

interface FileRow {
  name: string;
  tone?: FileTone;
}

interface Dashboard31Props {
  title?: string;
  items?: FileRow[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const toneStyles: Record<FileTone, string> = {
  doc: "bg-indigo-500 text-white",
  pdf: "bg-rose-500 text-white",
  sheet: "bg-emerald-500 text-white",
};


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

export const dashboard31Demo: Dashboard31Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Shared Drive",
  items: [
    { name: "Northwind_Brand_Guidelines.pdf", tone: "pdf" },
    { name: "Launch_Copy_Deck_v4.docx", tone: "doc" },
    { name: "Media_Budget_2026.xlsx", tone: "sheet" },
    { name: "Homepage_Wireframes.pdf", tone: "pdf" },
    { name: "Retro_Notes_March.docx", tone: "doc" },
  ],
};

export function Dashboard31({
  title = "Files",
  items = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard31Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md p-4 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <p className="mb-3 text-sm font-semibold">
          {title}
        </p>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 rounded-md border border-current/15 px-2.5 py-2"
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md",
                  toneStyles[item.tone ?? "doc"]
                )}
                aria-hidden="true"
              >
                <FileText className="size-4" />
              </span>
              <span className="truncate text-sm">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
