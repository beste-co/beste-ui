"use client";

import { LinkSquare01Icon, SearchRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
// Button12's seal takes a Lucide component, not a Hugeicons definition.
import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button12 } from "@/components/beste/component/button12";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { HOSTED_ONLY_PATHS, HOSTED_SITE } from "@/lib/site-links";

/*
 * Empty is built for a panel inside a page: a small heading over a line of
 * explanation, sized to sit in a grid where something is missing. This is the
 * whole page, so it is scaled up to be read as one — the type a step larger,
 * the column wide enough that the sentence does not break every four words.
 */
const EMPTY = "gap-8";
const HEADER = "max-w-xl gap-3";
// The icon carries its own size class: EmptyMedia's default targets svgs that
// have none, through a :not() that would otherwise outrank an override here.
const MEDIA = "size-14";
const TITLE = "text-2xl font-semibold tracking-tight md:text-3xl";
const DESCRIPTION = "text-base/relaxed md:text-lg/relaxed";
const CONTENT = "max-w-none flex-row flex-wrap justify-center gap-3";

/**
 * What a reader sees at an address that leads nowhere.
 *
 * It answers two different questions with the same shape. In the open-source
 * build a reader can arrive at /pricing or a Pro block's page from a search
 * result or an old bookmark, and those pages are not missing: they are
 * somewhere else, and the useful thing to do is hand over the address rather
 * than a dead end. Any other path is an ordinary 404, and gets told so.
 *
 * The distinction comes from HOSTED_ONLY_PATHS, which is empty in the private
 * build — there, a 404 on /pricing is a real bug and should look like one.
 *
 * The chrome is deliberately not here: this renders under two different
 * not-found boundaries, one of which already sits inside the site layout. See
 * app/not-found.tsx.
 */
export function NotFoundContent() {
  const pathname = usePathname();
  const movedElsewhere = HOSTED_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center px-4 py-16 md:px-6 md:py-24">
      {movedElsewhere ? (
        <Empty className={EMPTY}>
          <EmptyHeader className={HEADER}>
            <EmptyMedia variant="icon" className={MEDIA}>
              <HugeiconsIcon icon={LinkSquare01Icon} className="size-7" strokeWidth={2} />
            </EmptyMedia>
            <EmptyTitle className={TITLE}>This page lives on the hosted site</EmptyTitle>
            <EmptyDescription className={DESCRIPTION}>
              You are looking at the open-source build: every free block, piece and
              component, with the previews and the registry that serve them. The Pro
              catalogue, plans, accounts, the docs and the blog belong to ui.beste.co, and
              the page you asked for is waiting there.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className={CONTENT}>
            {/* The address is carried over, so /block/error19 lands on /block/error19. */}
            <Button12 asChild label="Continue on ui.beste.co">
              <a href={`${HOSTED_SITE}${pathname}`} rel="noreferrer" target="_blank" />
            </Button12>
            <Button12 asChild label="Browse the blocks" tone="outline" icon={ArrowRight}>
              <Link href="/blocks" />
            </Button12>
          </EmptyContent>
        </Empty>
      ) : (
        <Empty className={EMPTY}>
          <EmptyHeader className={HEADER}>
            <EmptyMedia variant="icon" className={MEDIA}>
              <HugeiconsIcon icon={SearchRemoveIcon} className="size-7" strokeWidth={2} />
            </EmptyMedia>
            <EmptyTitle className={TITLE}>Page not found</EmptyTitle>
            <EmptyDescription className={DESCRIPTION}>
              There is nothing at{" "}
              <span className="font-medium text-foreground">{pathname}</span>. It may have
              moved, or the link that brought you here may be older than the page it
              points to.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className={CONTENT}>
            <Button12 asChild label="Back to the library" icon={Home}>
              <Link href="/" />
            </Button12>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
