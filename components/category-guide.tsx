import Link from "next/link";
import type { ReactNode } from "react";
import { RelatedCategoryPreview } from "@/components/related-category-preview";
import { DEFAULT_STACK, StackLogos } from "@/components/stack-logos";
import { blocks } from "@/lib/blocks";
import { buildFaqPageJsonLd } from "@/lib/breadcrumb-jsonld";
import { sortByAdded } from "@/lib/browse-sort";
import type { CategoryGuide as CategoryGuideData, GuideBlock, RelatedCategory } from "@/lib/category-guides";
import { getCategoryInfo } from "@/lib/category-info";
import { getBlockAddedDate, getComponentAddedDate } from "@/lib/changelog-dates";
import { getPreviewMedia } from "@/lib/preview-media";
import { registryComponents } from "@/lib/registry-components";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const INLINE = /\[([^\]]+)\]\((\/(?:blocks|components)\/[a-z0-9-]+)\)|\*\*([^*]+)\*\*/g;

/** `[label](/blocks/slug)` becomes a link, `**text**` a strong phrase; the rest stays text. */
function rich(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) out.push(text.slice(last, match.index));
    if (match[2]) {
      out.push(
        <Link
          key={match.index}
          href={match[2]}
          className="text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
        >
          {match[1]}
        </Link>
      );
    } else {
      out.push(
        <strong key={match.index} className="font-medium text-foreground">
          {match[3]}
        </strong>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** The same text without markup, for the FAQ structured data. */
const plain = (text: string) => text.replace(INLINE, (_, label, _href, bold) => label ?? bold);

function GuideBody({ blocks: body }: { blocks: GuideBlock[] }) {
  return (
    <div className="mt-4 space-y-4">
      {body.map((block, index) => {
        if (typeof block === "string") {
          return (
            <p key={index} className={cn(typography.body, "leading-7 text-muted-foreground")}>
              {rich(block)}
            </p>
          );
        }
        if ("heading" in block) {
          return (
            <h3 key={index} className={cn(typography.h3, "pt-2")}>
              {block.heading}
            </h3>
          );
        }
        return (
          <ul key={index} className={cn(typography.body, "list-disc space-y-2 pl-5 leading-7 text-muted-foreground marker:text-foreground/40")}>
            {block.list.map((item, i) => (
              <li key={i}>{rich(item)}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

const slugOf = (category: string) => category.toLowerCase().replace(/\s+/g, "-");

/**
 * The item that stands in for a related category: its newest one, shown by its
 * captured image when there is one and rendered live otherwise.
 */
function categoryPreview(item: RelatedCategory): { name: string; image?: string } | undefined {
  const kind = item.kind === "blocks" ? "block" : "component";
  const entries = (item.kind === "blocks" ? blocks : registryComponents).filter(
    (entry) => slugOf(entry.category) === item.slug
  );
  const added = item.kind === "blocks" ? getBlockAddedDate : getComponentAddedDate;
  const name = sortByAdded(entries, "newest", added)[0]?.name;
  if (!name) return undefined;
  return { name, image: getPreviewMedia(kind, name)?.image };
}

function relatedLink(item: RelatedCategory): { href: string; label: string } | null {
  if (item.kind === "blocks") {
    const info = getCategoryInfo(item.slug);
    // getCategoryInfo falls back to the site-wide copy for an unknown slug.
    if (info.title === "shadcn") return null;
    return { href: `/blocks/${item.slug}`, label: `${info.title} blocks` };
  }
  const name = item.slug.replace(/(^|-)(\w)/g, (_, sep: string, c: string) => `${sep ? " " : ""}${c.toUpperCase()}`);
  return { href: `/components/${item.slug}`, label: `${name} components` };
}

export function CategoryGuide({ guide }: { guide: CategoryGuideData }) {
  const related = guide.related.flatMap((item) => {
    const link = relatedLink(item);
    return link ? [{ ...link, kind: item.kind, reason: item.reason, preview: categoryPreview(item) }] : [];
  });
  const faqJsonLd = buildFaqPageJsonLd(guide.faqs.map((faq) => ({ question: faq.question, answer: plain(faq.answer) })));

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className={typography.h2}>{guide.heading}</h2>
            <GuideBody blocks={guide.intro} />
          </div>
          {guide.faqs.length > 0 && (
            <div>
              <h2 className={typography.h2}>Questions</h2>
              {/* details rather than a JS accordion: closed answers stay in the HTML for crawlers */}
              <div className="mt-4 divide-y divide-border border-y border-border">
                {guide.faqs.map((faq) => (
                  <details key={faq.question} className="group/faq">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                      <span className={cn(typography.body, "font-medium")}>{faq.question}</span>
                      <span
                        aria-hidden
                        className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-open/faq:rotate-45"
                      >
                        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className={cn(typography.body, "pb-5 leading-7 text-muted-foreground")}>{rich(faq.answer)}</p>
                  </details>
                ))}
              </div>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
              />
            </div>
          )}
        </div>

        <StackLogos stack={guide.stack ?? DEFAULT_STACK} className="mt-12 border-t border-border pt-8 md:mt-16" />

        {related.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className={typography.h2}>Often used together</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex h-full cursor-pointer flex-col rounded-xl bg-muted p-3 transition-colors hover:bg-muted-foreground/15"
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden rounded-md bg-background">
                      {item.preview && (
                        <RelatedCategoryPreview kind={item.kind} name={item.preview.name} image={item.preview.image} />
                      )}
                    </span>
                    <span className="flex flex-1 flex-col px-1 pt-3 pb-1">
                      <span className={typography.cardTitle}>
                        {item.label}
                        <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                      <span className={cn(typography.cardText, "mt-1.5 leading-6")}>{item.reason}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
