"use client";

import { cn } from "@/lib/utils";

interface FooterColumn {
  heading: string;
  links: string[];
}

interface Nav21Props {
  columns?: FooterColumn[];
  className?: string;
}

export const nav21Demo: Nav21Props = {
  columns: [
    {
      heading: "Product",
      links: ["Overview", "Pricing", "Changelog", "Roadmap"],
    },
    {
      heading: "Company",
      links: ["About", "Careers", "Press", "Contact"],
    },
    {
      heading: "Resources",
      links: ["Docs", "Community", "Status"],
    },
  ],
};

export function Nav21({ columns = [], className }: Nav21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-80 grid-cols-3 gap-3">
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {col.heading}
            </span>
            <div className="flex flex-col gap-0.5">
              {col.links.map((link, lIdx) => (
                <button
                  key={lIdx}
                  type="button"
                  className="truncate text-left text-xs text-card-foreground hover:underline"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
