"use client";

import { cn } from "@/lib/utils";

type Tag = "TODO" | "FIXME" | "NOTE" | "HACK";

interface Comment {
  tag: Tag;
  text: string;
}

interface Editor28Props {
  comments?: Comment[];
  className?: string;
}

const tagClasses: Record<Tag, string> = {
  TODO: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  FIXME: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  NOTE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  HACK: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

export const editor28Demo: Editor28Props = {
  comments: [
    { tag: "TODO", text: "migrate to server components" },
    { tag: "FIXME", text: "handles null state poorly" },
    { tag: "NOTE", text: "revisit once design lock lands" },
  ],
};

export function Editor28({ comments = [], className }: Editor28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <pre className="flex w-full max-w-80 flex-col gap-0.5 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs leading-relaxed shadow-sm">
        {comments.map((c, i) => (
          <div key={i} className="flex items-baseline gap-3">
            <span className="w-4 shrink-0 select-none text-right tabular-nums text-muted-foreground/60">
              {i + 1}
            </span>
            <code className="flex-1 italic text-muted-foreground">
              <span className="not-italic">{"// "}</span>
              <span
                className={cn(
                  "not-italic rounded-sm px-1 text-xs font-bold",
                  tagClasses[c.tag]
                )}
              >
                {c.tag}
              </span>{" "}
              {c.text}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}
