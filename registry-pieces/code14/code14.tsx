"use client";

import { useEffect, useState } from "react";
import { GitCommit } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "context" | "added" | "removed";

interface DiffLine {
  text: string;
  kind?: Kind;
}

interface Code14Props {
  filename?: string;
  lines?: DiffLine[];
  stepMs?: number;
  className?: string;
}

const rowClasses: Record<Kind, string> = {
  context: "text-card-foreground",
  added: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  removed: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

const signs: Record<Kind, string> = {
  context: " ",
  added: "+",
  removed: "-",
};

export const code14Demo: Code14Props = {
  filename: "pricing.ts",
  lines: [
    { text: 'import { coupon } from "./coupon"' },
    { text: "" },
    { text: "export function total(cart: Cart) {" },
    { text: "  const sum = cart.lines.reduce(add, 0)", kind: "removed" },
    { text: "  return sum", kind: "removed" },
    { text: "  const sum = cart.lines.reduce(add, 0)", kind: "added" },
    { text: "  const discount = coupon(cart, sum)", kind: "added" },
    { text: "  return sum - discount", kind: "added" },
    { text: "}" },
  ],
};

export function Code14({
  filename = "diff",
  lines = [],
  stepMs = 350,
  className,
}: Code14Props) {
  const changeOrder = lines.map((line) => line.kind ?? "context");
  const changes = changeOrder.filter((kind) => kind !== "context").length;
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= changes) return;
    const id = setTimeout(
      () => setRevealed((r) => r + 1),
      revealed === 0 ? 500 : stepMs
    );
    return () => clearTimeout(id);
  }, [revealed, changes, stepMs]);

  let seen = 0;
  let added = 0;
  let removed = 0;
  const rows = lines.map((line) => {
    const kind = line.kind ?? "context";
    if (kind === "context") return { line, kind, visible: true };
    const visible = seen < revealed;
    seen += 1;
    if (visible && kind === "added") added += 1;
    if (visible && kind === "removed") removed += 1;
    return { line, kind, visible };
  });

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes code14-in { from { opacity: 0; transform: translateX(-0.5rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="w-full max-w-80 overflow-hidden rounded-md border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <GitCommit className="size-3.5" aria-hidden="true" />
            {filename}
          </span>
          <span className="text-xs tabular-nums">
            <span className="text-emerald-600 dark:text-emerald-400">{added} added</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-rose-600 dark:text-rose-400">{removed} removed</span>
          </span>
        </div>
        <div className="overflow-x-auto py-3">
          <pre className="font-mono text-sm leading-relaxed">
            <code>
              {rows.map(({ line, kind, visible }, i) => (
                <div
                  key={i}
                  className={cn("flex gap-3 px-4", rowClasses[kind], !visible && "opacity-0")}
                  style={visible && kind !== "context" ? { animation: "code14-in 400ms ease-out" } : undefined}
                >
                  <span className="w-2 shrink-0 select-none" aria-hidden="true">
                    {signs[kind]}
                  </span>
                  <span className="whitespace-pre">{line.text || " "}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
