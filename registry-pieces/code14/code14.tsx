"use client";

import { useEffect, useState } from "react";
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
  bordered?: boolean;
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
    { text: "export function total(cart: Cart) {" },
    { text: "  const sum = cart.lines.reduce(add, 0)" },
    { text: "  return sum", kind: "removed" },
    { text: "  const discount = coupon(cart, sum)", kind: "added" },
    { text: "  return sum - discount", kind: "added" },
    { text: "}" },
  ],
  bordered: false,
};

export function Code14({
  filename = "diff",
  lines = [],
  stepMs = 350,
  bordered = false,
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
  const rows = lines.map((line) => {
    const kind = line.kind ?? "context";
    if (kind === "context") return { line, kind, visible: true };
    const visible = seen < revealed;
    seen += 1;
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
      <div className={cn("w-full max-w-80 overflow-hidden rounded-md bg-card shadow-xl", bordered && "border border-border")}>
        <div className="border-b border-border bg-muted px-3 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            {filename}
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
