"use client";

import { cn } from "@/lib/utils";

interface Editor74Author {
  name: string;
  image?: string;
}

interface Editor74Props {
  title?: string;
  status?: string;
  titleLabel?: string;
  postTitle?: string;
  summaryLabel?: string;
  summary?: string;
  author?: Editor74Author;
  readTime?: string;
  tags?: string[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor74Demo: Editor74Props = {
  title: "Post",
  status: "Draft",
  postTitle: "Preparing your skin for a Lisbon winter",
  summary: "What changes when the air turns dry, and the 3 steps we suggest after every facial.",
  author: { name: "Laura Marling", image: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=400&h=400&auto=format&fit=crop" },
  framed: true,
};

export function Editor74({
  title,
  status,
  titleLabel,
  postTitle,
  summaryLabel,
  summary,
  author,
  readTime,
  tags = [],
  framed = true,
  fill = false,
  className,
}: Editor74Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-100",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-2 rounded-2xl bg-card p-3.5 text-xs text-card-foreground",
            !framed && "shadow-lg"
          )}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{title}</span>
            {status && <span className="text-muted-foreground">{status}</span>}
          </div>

          {titleLabel && <div className="text-muted-foreground">{titleLabel}</div>}
          <div className="rounded-lg border border-border px-2.5 py-2 text-sm font-semibold ring-2 ring-foreground/10">
            {postTitle}
          </div>

          {summaryLabel && <div className="text-muted-foreground">{summaryLabel}</div>}
          <div className="rounded-lg px-2.5 py-2 leading-relaxed ring-1 ring-border">{summary}</div>

          <div className="flex items-center justify-between gap-3">
            {author && (
              <span className="flex min-w-0 items-center gap-1.5">
                {author.image && (
                  <img src={author.image} alt="" aria-hidden="true" className="size-5 shrink-0 rounded-full object-cover" />
                )}
                <span className="truncate">{author.name}</span>
              </span>
            )}
            {readTime && <span className="shrink-0 text-muted-foreground">{readTime}</span>}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 text-muted-foreground">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2.5 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
