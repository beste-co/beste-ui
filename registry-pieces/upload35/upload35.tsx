"use client";

import { ArrowRight } from "lucide-react";

import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

interface Upload35Stat {
  value?: string;
  label?: string;
}

interface Upload35Post {
  image?: string;
  title?: string;
  slug?: string;
  status?: string;
}

interface Upload35Props {
  source?: string;
  url?: string;
  status?: string;
  stats?: Upload35Stat[];
  posts?: Upload35Post[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  fill?: boolean;
  className?: string;
}

export const upload35Demo: Upload35Props = {
  source: "Imported from WordPress",
  stats: [
    { value: "38", label: "posts" },
    { value: "24", label: "tags" },
    { value: "214", label: "images" },
  ],
  posts: [
    { image: "https://oud.pics/b/beste/oriel-serum.webp", title: "How to layer a serum", status: "Draft" },
    { image: "https://oud.pics/b/beste/oriel-facial.webp", title: "What a facial actually does", status: "Draft" },
  ],
  framed: true,
};

export function Upload35({ source, url, status, stats = [], posts = [], framed = true, fill = false, className }: Upload35Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-sm",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-center gap-2.5">
            <AiMark brand="wordpress" colored label="" className="size-5" />
            <ArrowRight aria-hidden className="size-3.5 text-muted-foreground" />
            <AiMark brand="beste" label="" className="size-5" />
            {source && <span className="ml-1 text-sm font-semibold">{source}</span>}
          </div>

          {url && (
            <div className="flex h-9 items-center gap-2 rounded-lg bg-muted px-2.5 text-xs text-muted-foreground">
              <span className="truncate">{url}</span>
              {status && <span className="ml-auto text-emerald-600">{status}</span>}
            </div>
          )}

          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-0.5 rounded-lg border border-border bg-muted px-3 py-2.5">
                  <span className="text-lg font-medium tracking-tight">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {posts.length > 0 && (
            <div className="flex flex-col">
              {posts.map((post, i) => (
                <div key={i} className="flex items-center gap-3 border-t border-border px-1 py-2.5">
                  {post.image && <img src={post.image} alt="" aria-hidden className="h-8 w-11 shrink-0 rounded-md object-cover" />}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{post.title}</div>
                    {post.slug && <div className="truncate text-xs text-muted-foreground">{post.slug}</div>}
                  </div>
                  {post.status && (
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{post.status}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
