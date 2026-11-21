"use client";

import { cn } from "@/lib/utils";

interface Commerce47Props {
  title?: string;
  /** Quiet text on the right of the title, e.g. the unit */
  meta?: string;
  columns?: string[];
  /** One row per size; the first cell is the size name */
  rows?: string[][];
  /** The row on a soft highlight, by index */
  active?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const commerce47Demo: Commerce47Props = {
  title: "Size Guide",
  columns: ["Size", "Chest", "Waist", "Hips", "Length"],
  rows: [
    ["S", "34-36", "28-30", "36-38", "27"],
    ["M", "38-40", "32-34", "40-42", "28"],
    ["L", "42-44", "36-38", "44-46", "29"],
    ["XL", "46-48", "40-42", "48-50", "30"],
  ],
  active: 1,
  framed: true,
};

export function Commerce47({ title, meta, columns = [], rows = [], active, framed = true, fill = false, className }: Commerce47Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-75",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="text-muted-foreground">{meta}</span>}
            </div>
          )}
          <table className="w-full table-fixed border-collapse text-center">
            {columns.length > 0 && (
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index} scope="col" className="border-b border-border py-2 font-normal text-muted-foreground">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={cn(rowIndex === active && "bg-muted")}>
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th key={cellIndex} scope="row" className="border-b border-border py-2 font-semibold">
                        {cell}
                      </th>
                    ) : (
                      <td key={cellIndex} className="border-b border-border py-2">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
