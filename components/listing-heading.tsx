import Link from "next/link";
import { Fragment } from "react";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * A listing's title: the trail back up as a small line above, and an h1 that
 * says what the page holds, with its count.
 */
export function ListingHeading({ heading, count, crumbs }: { heading: string; count: number; crumbs: Crumb[] }) {
  return (
    <>
      {crumbs.length > 1 && (
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted-foreground">
          {crumbs.map((crumb, index) => (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && <span className="mx-2">/</span>}
              {crumb.href && index < crumbs.length - 1 ? (
                <Link href={crumb.href} className="transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </Fragment>
          ))}
        </nav>
      )}
      {/*
        The count is centred against the title rather than sat on its baseline:
        its parentheses are drawn taller than the digits and hang below the line.
      */}
      <h1 className={cn(typography.h1, "flex flex-wrap items-center gap-x-3")}>
        <span>{heading}</span>
        <span className="text-2xl font-medium text-primary md:text-3xl">({count})</span>
      </h1>
    </>
  );
}
