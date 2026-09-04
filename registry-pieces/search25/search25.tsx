"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "typing" | "hold" | "deleting" | "pause";

interface ResultRow {
  title: string;
  meta?: string;
  avatar?: string;
}

interface Search25Props {
  placeholder?: string;
  queries?: string[];
  results?: ResultRow[];
  maxVisible?: number;
  charMs?: number;
  holdMs?: number;
  className?: string;
}

export const search25Demo: Search25Props = {
  placeholder: "Search people",
  queries: ["miles", "herbie", "joni"],
  results: [
    {
      title: "Nina Simone",
      meta: "Vocals, piano",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    },
    {
      title: "Miles Davis",
      meta: "Trumpet",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    },
    {
      title: "Herbie Hancock",
      meta: "Keys",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    },
    { title: "Joni Mitchell", meta: "Guitar, vocals" },
    { title: "Erykah Badu", meta: "Vocals" },
  ],
};

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0] ?? "")
    .join("")
    .toUpperCase();
}

function Highlight({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-sm bg-amber-500/20 text-card-foreground">
        {text.slice(at, at + query.length)}
      </mark>
      {text.slice(at + query.length)}
    </>
  );
}

export function Search25({
  placeholder = "Search",
  queries = [],
  results = [],
  maxVisible = 3,
  charMs = 140,
  holdMs = 2000,
  className,
}: Search25Props) {
  const [qi, setQi] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  const target = queries[qi % Math.max(1, queries.length)] ?? "";
  const query = target.slice(0, count);

  useEffect(() => {
    if (!queries.length) return;
    let id: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      id =
        count < target.length
          ? setTimeout(() => setCount((c) => c + 1), charMs)
          : setTimeout(() => setPhase("hold"), 200);
    } else if (phase === "hold") {
      id = setTimeout(() => setPhase("deleting"), holdMs);
    } else if (phase === "deleting") {
      id =
        count > 0
          ? setTimeout(() => setCount((c) => c - 1), 45)
          : setTimeout(() => setPhase("pause"), 100);
    } else {
      id = setTimeout(() => {
        setQi((i) => (i + 1) % queries.length);
        setPhase("typing");
      }, 500);
    }
    return () => clearTimeout(id);
  }, [phase, count, target.length, queries.length, charMs, holdMs]);

  // Only the first few matches stay open, so the card never grows past maxVisible rows.
  const needle = query.toLowerCase();
  const shown = new Set<number>();
  results.forEach((r, i) => {
    if (shown.size >= maxVisible) return;
    if (r.title.toLowerCase().includes(needle)) shown.add(i);
  });

  const typing = phase === "typing" || phase === "deleting";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes search25-blink { 0%, 45% { opacity: 1; } 55%, 100% { opacity: 0; } }`}</style>
      <div className="w-full max-w-80 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-border px-3 py-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="flex min-w-0 flex-1 items-center text-sm">
            {query ? (
              <span className="truncate text-card-foreground">{query}</span>
            ) : (
              <span className="truncate text-muted-foreground">{placeholder}</span>
            )}
            <span
              className="ml-0.5 h-4 w-0.5 shrink-0 bg-foreground"
              style={
                typing
                  ? undefined
                  : { animation: "search25-blink 1100ms steps(1) infinite" }
              }
              aria-hidden="true"
            />
          </span>
        </div>

        <div className="flex flex-col p-1.5">
          {results.map((r, i) => {
            const match = shown.has(i);
            return (
              <div
                key={i}
                className="grid transition-all duration-300 ease-in-out motion-reduce:transition-none"
                style={{ gridTemplateRows: match ? "1fr" : "0fr", opacity: match ? 1 : 0 }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted">
                    {r.avatar ? (
                      <img
                        src={r.avatar}
                        alt=""
                        className="size-7 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
                        aria-hidden="true"
                      >
                        {initials(r.title)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-card-foreground">
                        <Highlight text={r.title} query={query} />
                      </p>
                      {r.meta && (
                        <p className="truncate text-xs text-muted-foreground">{r.meta}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="border-t border-border px-3 py-2 text-xs tabular-nums text-muted-foreground">
          Showing {shown.size} of {results.length} results
        </p>
      </div>
    </div>
  );
}
