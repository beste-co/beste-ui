"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type Show = "all" | "published" | "draft";

interface Dashboard46Post {
  image?: string;
  title: string;
  /** A quiet line under the title, e.g. the category and reading time */
  meta?: string;
  author?: string;
  /** Each language the post is in, shown as its flag */
  languages?: { code: string; flag?: string }[];
  status: string;
  /** Published posts get the green status, the rest a dot */
  published?: boolean;
  date?: string;
  /** The row on a soft highlight */
  active?: boolean;
}

interface Dashboard46Props {
  title?: string;
  domain?: string;
  /** Filter tabs; the first one starts picked */
  tabs?: { label: string; show?: Show }[];
  columns?: { post?: string; author?: string; languages?: string; status?: string; date?: string };
  posts?: Dashboard46Post[];
  /** A dot line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  className?: string;
}

export const dashboard46Demo: Dashboard46Props = {
  title: "Posts",
  tabs: [
    { label: "All", show: "all" },
    { label: "Published", show: "published" },
    { label: "Drafts", show: "draft" },
  ],
  columns: { post: "Post", author: "Author", languages: "Languages", status: "Status", date: "Date" },
  posts: [
    { image: "https://oud.pics/b/beste/oriel-facial.webp", title: "What a calming facial does for reactive skin", author: "Norah Jones", languages: [{ code: "EN", flag: "https://flagcdn.com/gb.svg" }, { code: "PT", flag: "https://flagcdn.com/pt.svg" }], status: "Published", published: true, date: "Oct 28, 2026", active: true },
    { image: "https://oud.pics/b/beste/oriel-serum.webp", title: "How to layer a serum under your day cream", author: "Laura Marling", languages: [{ code: "EN", flag: "https://flagcdn.com/gb.svg" }, { code: "PT", flag: "https://flagcdn.com/pt.svg" }], status: "Published", published: true, date: "Oct 14, 2026" },
    { image: "https://oud.pics/b/beste/oriel-consultation.webp", title: "Your first visit to the studio, step by step", author: "Norah Jones", languages: [{ code: "EN", flag: "https://flagcdn.com/gb.svg" }], status: "Draft", date: "Nov 3, 2026" },
  ],
  framed: true,
};

const COLS = {
  author: "hidden w-28 shrink-0 md:block",
  languages: "hidden w-22 shrink-0 lg:flex",
  status: "w-22 shrink-0",
  date: "hidden w-24 shrink-0 sm:block",
};

export function Dashboard46({ title, domain, tabs = [], columns = {}, posts = [], note, framed = true, className }: Dashboard46Props) {
  const [picked, setPicked] = useState(0);
  const show = tabs[picked]?.show ?? "all";
  const rows = posts.filter((post) => show === "all" || (show === "published" ? post.published : !post.published));

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div
        className={cn(
          "w-full max-w-215",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("overflow-hidden rounded-2xl bg-card text-sm text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex min-w-0 items-baseline gap-2.5">
              <span className="text-base font-semibold">{title}</span>
              {domain && <span className="truncate text-xs text-muted-foreground">{domain}</span>}
            </div>
            {tabs.length > 0 && (
              <div className="flex gap-1 text-xs">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-pressed={picked === index}
                    onClick={() => setPicked(index)}
                    className={cn("cursor-pointer rounded-full px-2.5 py-1 transition-colors", picked === index ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 border-b border-border px-5 py-2.5 text-xs text-muted-foreground">
            <span className="min-w-0 flex-1">{columns.post}</span>
            <span className={COLS.author}>{columns.author}</span>
            <span className={COLS.languages}>{columns.languages}</span>
            <span className={COLS.status}>{columns.status}</span>
            <span className={COLS.date}>{columns.date}</span>
          </div>

          {rows.map((post, index) => (
            <div key={post.title} className={cn("flex items-center gap-4 px-5 py-3", index < rows.length - 1 && "border-b border-border", post.active && "bg-muted/50")}>
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {post.image && <img src={post.image} alt="" aria-hidden="true" className="size-11 shrink-0 rounded-lg object-cover" />}
                <div className="min-w-0">
                  <p className="truncate font-medium">{post.title}</p>
                  {post.meta && <p className="mt-0.5 truncate text-xs text-muted-foreground">{post.meta}</p>}
                </div>
              </div>
              <span className={cn(COLS.author, "truncate text-foreground/80")}>{post.author}</span>
              <span className={cn(COLS.languages, "gap-1 text-xs text-foreground/70")}>
                {post.languages?.map((language) =>
                  language.flag ? (
                    <img key={language.code} src={language.flag} alt={language.code} className="h-3.5 w-5 shrink-0 rounded-[3px] object-cover" />
                  ) : (
                    <span key={language.code} className={cn("rounded-md px-1.5 py-0.5 ring-1 ring-border", post.active && "bg-card")}>
                      {language.code}
                    </span>
                  )
                )}
              </span>
              <span className={cn(COLS.status, "flex items-center gap-1.5", post.published ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>
                {!post.published && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />}
                {post.status}
              </span>
              <span className={cn(COLS.date, "truncate text-muted-foreground")}>{post.date}</span>
            </div>
          ))}

          {note && (
            <div className="flex items-center gap-1.5 border-t border-border bg-background px-5 py-3 text-xs text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              {note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
