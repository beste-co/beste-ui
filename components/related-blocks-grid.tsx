"use client";

// Live-preview grid for related blocks. The card is the catalog's card — same
// surface, same preview box, same overlay link — so the strip at the bottom of a
// detail page and the grid on the home page are recognisably the same object.
// (Reusing BlocksGrid itself here is unsafe: its URL-sync would auto-open a
// modal on a /block/<name> detail page.)
import Link from "next/link";
import { useEffect, useState } from "react";
import { BlockPreview } from "@/components/blocks-grid";
import { ProBadge } from "@/components/pro-badge";
import type { BlockMeta } from "@/lib/blocks";

export function RelatedBlocksGrid({ blocks }: { blocks: BlockMeta[] }) {
  // Render the live block previews only after mount. They embed full block
  // markup (multiple <h1>s etc.); rendering them during SSR dumps every related
  // block's HTML into the page source and creates duplicate headings. The cards
  // (link/title/description) still render server-side for crawlers and SEO.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (blocks.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blocks.map((block) => (
        /*
          The whole card is a link, and the link is a sibling of the card's
          contents rather than their ancestor: a block preview contains its own
          anchors, and an anchor inside an anchor is not a thing a parser keeps.
          An overlay covering the card gives the same result with none of that:
          real href, middle-click, hover URL, and one crawlable link per card.
        */
        <div
          key={block.name}
          className="group relative flex h-full flex-col gap-3 rounded-xl bg-muted p-3 transition-colors hover:bg-muted-foreground/15 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
        >
          <Link
            href={`/block/${block.name}`}
            aria-label={block.title}
            className="absolute inset-0 z-10 rounded-xl outline-none"
          />
          {/*
            The preview sits inside the card on a surface of its own: most blocks
            bring their own white background, and edge to edge that white read as
            the card rather than as the block.

            `inert` on top of that keeps a demo from autofocusing on mount, which
            would scroll the page out from under the reader.
          */}
          <div
            inert
            className="relative flex h-84 items-center justify-center overflow-hidden rounded-md bg-background md:h-48"
          >
            {mounted ? (
              <BlockPreview
                component={block.component}
                demoProps={block.demoProps}
                previewAlign={block.previewAlign}
              />
            ) : (
              <div className="size-full animate-pulse bg-foreground/5" />
            )}
          </div>

          <div className="relative flex-1 px-1 pb-1">
            <div className="mb-1 flex items-center gap-1.5">
              {block.isPro ? (
                <ProBadge />
              ) : (
                <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-black">
                  FREE
                </span>
              )}
              <p className="font-mono text-sm text-foreground/60">{block.name}</p>
            </div>
            {/* Plain text: the card's own overlay link already carries this name,
                and two anchors to one page is one more than anyone needs. */}
            <h3 className="mb-1 text-base font-semibold tracking-tight">{block.title}</h3>
            <p className="line-clamp-2 min-h-[3rem] text-base text-muted-foreground">
              {block.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
