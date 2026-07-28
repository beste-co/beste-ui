"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type FileTone = "doc" | "pdf" | "sheet";

interface FileRow {
  name: string;
  tone?: FileTone;
}

interface Dashboard31Props {
  title?: string;
  items?: FileRow[];
  className?: string;
}

const toneStyles: Record<FileTone, string> = {
  doc: "bg-indigo-500 text-white",
  pdf: "bg-rose-500 text-white",
  sheet: "bg-emerald-500 text-white",
};

export const dashboard31Demo: Dashboard31Props = {
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
  className,
}: Dashboard31Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-4 shadow-xl">
        <p className="mb-3 text-sm font-semibold text-card-foreground">
          {title}
        </p>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 rounded-md border border-border px-2.5 py-2"
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
              <span className="truncate text-sm text-card-foreground">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
