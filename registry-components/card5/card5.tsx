import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground";

interface Card5Props {
  /** Cover image URL */
  src: string;
  /** Category chip above the title */
  category?: string;
  /** Article title */
  title: string;
  /** Short excerpt under the title */
  excerpt?: string;
  /** Author name */
  authorName: string;
  /** Author avatar URL. Falls back to an initial circle when omitted */
  authorSrc?: string;
  /** Publish date (e.g. "Jun 12, 2026") */
  date: string;
  /** Read time (e.g. "6 min read") */
  readTime?: string;
  /** If set, the whole card links to this href */
  href?: string;
  /** Category chip color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
};

export const card5Demo: Card5Props = {
  src: "https://images.unsplash.com/photo-1781902834597-25a42a64b3c9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  category: "Engineering",
  title: "Shipping faster with a component registry",
  excerpt:
    "How we cut landing page build time from days to hours by treating sections as installable units.",
  authorName: "Jane Posford",
  authorSrc: "https://i.pravatar.cc/64?img=26",
  date: "Jun 12, 2026",
  readTime: "6 min read",
  href: "#",
};

/**
 * A blog article card: cover image with hover zoom, category chip, clamped
 * title and excerpt, and an author row with date and read time. The whole
 * card becomes a link when href is set.
 */
export function Card5({
  src,
  category,
  title,
  excerpt,
  authorName,
  authorSrc,
  date,
  readTime,
  href,
  tone = "primary",
  className,
}: Card5Props) {
  return (
    <article
      className={cn(
        "group/card5 relative w-full max-w-sm overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/20",
        className
      )}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={src}
          alt=""
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover/card5:scale-105"
        />
        {category && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-sm font-semibold",
              toneStyles[tone]
            )}
          >
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-card-foreground">
          {href ? (
            <a
              href={href}
              className="rounded-sm before:absolute before:inset-0 before:z-10 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {excerpt && <p className="line-clamp-2 text-base text-muted-foreground">{excerpt}</p>}

        <div className="mt-3 flex items-center gap-3">
          {authorSrc ? (
            <img
              src={authorSrc}
              alt=""
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
              {authorName.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-card-foreground">{authorName}</span>
            <span className="truncate text-sm text-muted-foreground">
              {date}
              {readTime && <> &middot; {readTime}</>}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
