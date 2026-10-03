"use client";

import { cn } from "@/lib/utils";

type Tone = "keyword" | "string" | "fn" | "comment" | "plain";

interface Token {
  text: string;
  tone?: Tone;
}

interface Code13Props {
  filename?: string;
  lines?: Token[][];
  bordered?: boolean;
  className?: string;
}

const tokenStyles: Record<Tone, string> = {
  keyword: "text-sky-600",
  string: "text-emerald-600",
  fn: "text-primary",
  comment: "text-muted-foreground",
  plain: "text-card-foreground",
};

export const code13Demo: Code13Props = {
  filename: "members.ts",
  lines: [
    [
      { text: "import", tone: "keyword" },
      { text: " { Sirius } " },
      { text: "from", tone: "keyword" },
      { text: " " },
      { text: "'@sirius/sdk'", tone: "string" },
    ],
    [],
    [
      { text: "const", tone: "keyword" },
      { text: " client = " },
      { text: "new", tone: "keyword" },
      { text: " Sirius(apiKey)" },
    ],
    [
      { text: "await", tone: "keyword" },
      { text: " client.members." },
      { text: "create", tone: "fn" },
      { text: "({ name })" },
    ],
  ],
  bordered: false,
};

export function Code13({ filename, lines = [], bordered = false, className }: Code13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 overflow-hidden rounded-md bg-card shadow-xl", bordered && "border border-border")}>
        {filename && (
          <div className="border-b border-border bg-muted px-3 py-2">
            <span className="font-mono text-xs text-muted-foreground">
              {filename}
            </span>
          </div>
        )}
        <div className="overflow-x-auto p-4">
          <pre className="font-mono text-sm leading-relaxed">
            <code>
              {lines.map((tokens, lineIndex) => (
                <div key={lineIndex} className="flex gap-3">
                  <span
                    className="select-none text-muted-foreground/60"
                    aria-hidden="true"
                  >
                    {lineIndex + 1}
                  </span>
                  <span className="whitespace-pre">
                    {tokens.length === 0 ? (
                      " "
                    ) : (
                      tokens.map((token, tokenIndex) => (
                        <span
                          key={tokenIndex}
                          className={tokenStyles[token.tone ?? "plain"]}
                        >
                          {token.text}
                        </span>
                      ))
                    )}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
