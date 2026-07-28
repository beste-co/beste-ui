// Server component: renders a category chip + cross-category tag chips as real
// links. Used on detail pages to surface internal links to the category page
// and to tag archive hubs.
import Link from "next/link";
import { getTagsForCategory } from "@/lib/tags";

export function TagChips({ categorySlug }: { categorySlug: string }) {
  // Only cross-category tag hubs are shown here. The category itself is already
  // linked in the breadcrumb, so repeating it as a chip would be redundant.
  const tags = getTagsForCategory(categorySlug);
  if (tags.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/blocks/tag/${tag.slug}`}
          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          #{tag.label}
        </Link>
      ))}
    </div>
  );
}
