"use client";

import { Bookmark02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { NewBadge, useIsNew } from "@/components/new-badge";
import { ProBadge } from "@/components/pro-badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import type { BlockMeta } from "@/lib/blocks";
import { getBlockObfuscated } from "@/lib/blocks-obfuscated";
import { useFavorites } from "@/lib/favorites-context";

/**
 * Card thumbnail — the block, rendered scaled down. It resolves the component
 * itself, from the obfuscated build, so a card never puts a Pro block's real
 * classes in the DOM and the live registry stays out of the browse bundles.
 * Obfuscation only mangles class names, so one build serves every visitor.
 * Cards therefore follow `pro:obfuscate`, not the last edit; the preview you
 * author against, /block/<name>, still hot-reloads.
 */
export const BlockPreview = ({ name }: { name: string }) => {
  const block = getBlockObfuscated(name);

  if (!block) {
    return null;
  }

  const Component: ComponentType<any> = block.component;
  const demoProps = block.demoProps;
  const isBottom = block.previewAlign === "bottom";

  try {
    return (
      <>
        {/* Mobile: scaled down to fit card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none isolate md:hidden">
          <div
            className={`absolute left-1/2 ${
              isBottom ? "bottom-0 origin-bottom" : "-top-4 origin-top"
            }`}
            style={{
              width: "430px",
              height: "800px",
              transform: `translateX(-50%) scale(0.65)`,
            }}
          >
            <Component {...demoProps} />
          </div>
        </div>
        {/* Desktop: centered, scaled down */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none isolate hidden md:block">
          <div
            className="absolute left-1/2 top-[55%] bg-background"
            style={{
              width: "1440px",
              height: "900px",
              transform: "translate(-50%, -50%) scale(0.24)",
            }}
          >
            <Component {...demoProps} />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.warn("Preview error:", error);
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="text-sm">Preview Error</div>
        </div>
      </div>
    );
  }
};

// Lazy loading wrapper for block cards with staggered rendering
const LazyBlock = ({
  block,
  renderCard,
  index = 0,
}: {
  block: BlockMeta;
  renderCard: (block: BlockMeta, shouldRenderPreview: boolean) => React.ReactNode;
  index?: number;
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce: false,
  });

  // Staggered rendering: delay based on index (100ms between each)
  useEffect(() => {
    if (inView && !shouldRender) {
      const delay = Math.min(index * 100, 500); // Cap at 500ms max delay
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [inView, index, shouldRender]);

  // Reset when going out of view
  useEffect(() => {
    if (!inView) {
      setShouldRender(false);
    }
  }, [inView]);

  return (
    <div ref={ref} className="h-full">
      {renderCard(block, inView && shouldRender)}
    </div>
  );
};

interface BlocksGridProps {
  blocks: BlockMeta[];
  /**
   * Ship dates, by block name, for anything recent enough to be worth a badge —
   * `recentBlockDates()` from a server component. Left out, no card is badged.
   */
  addedDates?: Readonly<Record<string, string>>;
  showFavoriteIndicator?: boolean;
  loading?: boolean;
  skeletonCount?: number;
}

export function BlocksGrid({
  blocks,
  addedDates,
  showFavoriteIndicator = true,
  loading = false,
  skeletonCount = 9,
}: BlocksGridProps) {
  const { isFavorite } = useFavorites();
  const isNewBlock = useIsNew(addedDates);

  const renderBlockCard = (block: BlockMeta, shouldRenderPreview: boolean) => {
    const isBlockFavorite = showFavoriteIndicator && isFavorite(block.name);
    const isNew = isNewBlock(block.name);
    return (
      /*
        The whole card is a link, and the link is a sibling of the card's contents
        rather than their ancestor: a block preview contains its own anchors, and an
        anchor inside an anchor is not a thing a parser keeps — it splits the outer
        one, which would break the card and the hydration with it.
        An overlay covering the card gives the same result with none of that: real
        href, middle-click, right-click, hover URL, and one crawlable link per card.
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
          The preview sits inside the card on a surface of its own: most blocks bring
          their own white background, and edge to edge that white read as the card
          rather than as the block. The gap and the change of surface do what the rule
          under it used to do.
        */}
        <div className="relative flex h-84 items-center justify-center overflow-hidden rounded-md bg-background md:h-48">
          {/* The card's own marks, in the corner the preview keeps clear: the
              badge takes the corner itself and the bookmark sits inside it, so a
              block that is both new and saved reads as one cluster. */}
          {(isBlockFavorite || isNew) && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 pointer-events-none">
              {isBlockFavorite && (
                <HugeiconsIcon icon={Bookmark02Icon} size={20} strokeWidth={2} className="fill-primary text-primary" />
              )}
              {isNew && <NewBadge />}
            </div>
          )}
          {shouldRenderPreview ? (
            <BlockPreview name={block.name} />
          ) : (
            // Skeleton loader - mimics a typical block layout
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3">
              {/* Badge skeleton */}
              <div className="h-3 w-12 bg-foreground/10 rounded-full animate-pulse" />
              {/* Heading skeleton */}
              <div className="h-3 w-36 bg-foreground/10 rounded animate-pulse" />
              {/* Description skeleton - two lines */}
              <div className="flex flex-col gap-1.5 items-center w-full max-w-[200px]">
                <div className="h-3 w-full bg-foreground/10 rounded animate-pulse" />
              </div>
              {/* Image/CTA skeleton */}
              <div className="h-12 w-48 bg-foreground/10 rounded-md animate-pulse mt-1" />
            </div>
          )}
        </div>

        {/* Block info */}
        <div className="relative flex-1 px-1 pb-1">
          <div className="flex items-center gap-1.5 mb-1">
            {block.isPro ? (
              <ProBadge />
            ) : (
              <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-black">
                FREE
              </span>
            )}
            <p className="text-sm text-foreground/60">{block.name}</p>
          </div>
          <h3 className="mb-1 text-base font-semibold tracking-tight">
            {/* Plain text: the card's own overlay link already carries this name, and
                two anchors to one page is one more than a reader or a crawler needs. */}
            {block.title}
          </h3>
          <p className="text-base text-muted-foreground line-clamp-2 min-h-[3rem]">
            {block.description}
          </p>
        </div>
      </div>
    );
  };

  // Loading state - show skeleton cards
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={index}
            className="group relative border border-border rounded-lg overflow-hidden"
          >
            <div className="h-84 md:h-48 bg-background border-b border-border flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3">
                <div className="h-3 w-12 bg-muted rounded-full animate-pulse" />
                <div className="h-3 w-36 bg-foreground/10 rounded animate-pulse" />
                <div className="flex flex-col gap-1.5 items-center w-full max-w-[200px]">
                  <div className="h-3 w-full bg-foreground/10 rounded animate-pulse" />
                </div>
                <div className="h-12 w-48 bg-muted rounded-md animate-pulse mt-1" />
              </div>
            </div>
            <div className="p-4 bg-background">
              <div className="h-5 w-32 bg-foreground/10 rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <Empty className="h-64">
        <EmptyHeader>
          <EmptyTitle>No blocks found</EmptyTitle>
          <EmptyDescription>No blocks found in this category.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blocks.map((block, index) => (
        <LazyBlock key={block.name} block={block} renderCard={renderBlockCard} index={index} />
      ))}
    </div>
  );
}
