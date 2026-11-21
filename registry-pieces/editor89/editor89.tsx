"use client";

import { cn } from "@/lib/utils";

interface Editor89Field {
  label?: string;
  value: string;
}

interface Editor89Props {
  title?: string;
  status?: string;
  /** The author field, with a round photo (or initial) before the name */
  author?: { label?: string; name: string; image?: string; initial?: string };
  date?: Editor89Field;
  summary?: Editor89Field;
  tags?: { label?: string; values: string[] };
  readingTime?: Editor89Field;
  /** The headings the table of contents is built from */
  contents?: { label: string; items: string[] };
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor89Demo: Editor89Props = {
  title: "Post settings",
  author: { name: "Norah Jones", image: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=400&h=400&auto=format&fit=crop" },
  date: { value: "Nov 12, 2026" },
  summary: { value: "What to expect at your first appointment." },
  tags: { values: ["studio", "first visit"] },
  contents: { label: "Table of contents", items: ["Before you arrive", "The skin consultation", "Aftercare at home"] },
  framed: true,
};

const LABEL = "mb-1.5 text-muted-foreground";
const BOX = "rounded-lg px-2.5 py-2 ring-1 ring-border";

export function Editor89({ title, status, author, date, summary, tags, readingTime, contents, note, framed = true, fill = false, className }: Editor89Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || status) && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {status && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/60" />
                  {status}
                </span>
              )}
            </div>
          )}
          {(author || date) && (
            <div className="grid grid-cols-2 gap-2.5">
              {author && (
                <div className="min-w-0">
                  {author.label && <p className={LABEL}>{author.label}</p>}
                  <div className={cn(BOX, "flex items-center gap-2")}>
                    {author.image ? <img src={author.image} alt="" className="size-4 shrink-0 rounded-full object-cover" /> : author.initial && <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-xs leading-none text-muted-foreground">{author.initial}</span>}
                    <span className="truncate">{author.name}</span>
                  </div>
                </div>
              )}
              {date && (
                <div className="min-w-0">
                  {date.label && <p className={LABEL}>{date.label}</p>}
                  <div className={cn(BOX, "truncate")}>{date.value}</div>
                </div>
              )}
            </div>
          )}
          {summary && (
            <div>
              {summary.label && <p className={LABEL}>{summary.label}</p>}
              <div className={cn(BOX, "leading-normal text-foreground/90")}>{summary.value}</div>
            </div>
          )}
          {(tags || readingTime) && (
            <div className="grid grid-cols-2 gap-2.5">
              {tags && (
                <div className="min-w-0">
                  {tags.label && <p className={LABEL}>{tags.label}</p>}
                  <div className="flex flex-wrap gap-1">
                    {tags.values.map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-foreground/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {readingTime && (
                <div className="min-w-0">
                  {readingTime.label && <p className={LABEL}>{readingTime.label}</p>}
                  <p className="pt-0.5">{readingTime.value}</p>
                </div>
              )}
            </div>
          )}
          {contents && (
            <div className="border-t border-border pt-2.5">
              {contents.label && <p className={LABEL}>{contents.label}</p>}
              <div className="flex flex-col gap-1.5 text-foreground/80">
                {contents.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          )}
          {note && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              {note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
