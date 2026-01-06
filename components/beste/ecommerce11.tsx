"use client";

import { Ruler } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface SizeRow {
  size: string;
  chest?: string;
  waist?: string;
  hips?: string;
  length?: string;
}

interface Ecommerce11Props {
  heading?: string;
  description?: string;
  unit?: "in" | "cm";
  sizes?: SizeRow[];
  className?: string;
}

export const ecommerce11Demo: Ecommerce11Props = {
  heading: "Size Guide",
  description:
    "Measurements are in inches. For the best fit, measure yourself and compare with the chart below.",
  unit: "in",
  sizes: [
    { size: "XS", chest: "32-34", waist: "26-28", hips: "34-36", length: "26" },
    { size: "S", chest: "34-36", waist: "28-30", hips: "36-38", length: "27" },
    { size: "M", chest: "38-40", waist: "32-34", hips: "40-42", length: "28" },
    { size: "L", chest: "42-44", waist: "36-38", hips: "44-46", length: "29" },
    { size: "XL", chest: "46-48", waist: "40-42", hips: "48-50", length: "30" },
  ],
};

export function Ecommerce11({
  heading,
  description,
  unit = "in",
  sizes = [],
  className,
}: Ecommerce11Props) {
  const columns = sizes[0]
    ? Object.keys(sizes[0]).filter((key) => key !== "size")
    : [];

  return (
    <section className={cn("py-12 md:py-24", className)}>
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <Ruler className="size-6" />
          </div>
          {heading && <h2 className="text-2xl font-semibold">{heading}</h2>}
          {description && (
            <p className="mt-2 text-balance text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="h-14 text-center">Size</TableHead>
                {columns.map((col) => (
                  <TableHead key={col} className="h-14 text-center capitalize">
                    {col} ({unit})
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizes.map((row, index) => (
                <TableRow
                  key={row.size}
                  className={cn(
                    index % 2 === 0 ? "bg-background" : "bg-muted/30"
                  )}
                >
                  <TableCell className="h-14 text-center font-medium">
                    {row.size}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell
                      key={col}
                      className="h-14 text-center text-muted-foreground"
                    >
                      {row[col as keyof SizeRow] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
