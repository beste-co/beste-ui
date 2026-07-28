// Server wrapper for a "related / more in category" block: heading + optional
// "view all" link around a grid (BlocksGrid for blocks, RelatedPreviewGrid for
// pieces/components).
import Link from "next/link";
import type { ReactNode } from "react";

export function RelatedSection({
  heading,
  viewAllHref,
  viewAllLabel,
  children,
}: {
  heading: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode;
}) {
  return (
    // Full-width muted band + top border so the related grid reads as its own
    // section instead of blending into the showcase above (same surface color).
    <section className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">{heading}</h2>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="shrink-0 text-base text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {viewAllLabel ?? "View all"}
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
