import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { LiveFrame } from "./live-frame";
import { getBlock } from "@/lib/blocks";

interface LiveBlockProps {
  /** Registry block name, e.g. "hero7" */
  name: string;
  /**
   * Placeholder height in px until the embed reports its real height.
   * The frame auto-sizes to the block's content after load, so this only
   * affects how much the page shifts while loading.
   *
   * Accepts a string ("760") as well as a number: next-mdx-remote strips JSX
   * expression attributes (`height={760}`), so in MDX this must be written as
   * `height="760"`, which arrives here as a string.
   */
  height?: number | string;
  /** Optional caption shown under the frame */
  caption?: string;
}

/**
 * Embeds a real registry block, live, inside a blog post. Renders the existing
 * `/embed/{name}` isolated preview (in ?fit=1 mode) so the block's full-width
 * section styles never bleed into the article column, and the iframe adopts
 * the block's exact content height (no inner scrolling).
 *
 * Full-bleed: the figure carries `blog-bleed`, which the `.blog-article` grid
 * expands to the full page width, with 24px side gutters and the content
 * capped at 1920px.
 *
 * Server component: `getBlock` pulls in the whole registry, so this must never
 * be imported into a client bundle (the iframe itself is the client part).
 */
export function LiveBlock({ name, height = 480, caption }: LiveBlockProps) {
  const block = getBlock(name);
  if (!block) return null;

  const initialHeight = Number(height) || 480;

  return (
    <figure className="blog-bleed my-10 px-6">
      <div className="mx-auto w-full max-w-[1920px] overflow-hidden rounded-xl bg-muted/60">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium">{block.title}</span>
          </div>
          <Link
            href={`/block/${name}`}
            className="inline-flex items-center gap-1 text-base text-foreground/50 transition-colors hover:text-foreground"
          >
            View block
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2} />
          </Link>
        </div>
        <LiveFrame
          src={`/embed/${name}?fit=1`}
          title={block.title}
          initialHeight={initialHeight}
        />
        {caption ? (
          <figcaption className="px-6 py-3 text-center text-base text-foreground/50">
            {caption}
          </figcaption>
        ) : null}
      </div>
    </figure>
  );
}
