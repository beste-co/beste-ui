"use client";

import { cn } from "@/lib/utils";

type TokenKind =
  | "keyword"
  | "string"
  | "fn"
  | "var"
  | "punct"
  | "plain"
  | "comment";

interface Token {
  kind: TokenKind;
  text: string;
}

interface Code5Props {
  tokens?: Token[];
  className?: string;
}

export const code5Demo: Code5Props = {
  tokens: [
    { kind: "keyword", text: "const" },
    { kind: "plain", text: " " },
    { kind: "var", text: "user" },
    { kind: "plain", text: " = " },
    { kind: "keyword", text: "await" },
    { kind: "plain", text: " " },
    { kind: "fn", text: "fetchUser" },
    { kind: "punct", text: "(" },
    { kind: "string", text: "\"42\"" },
    { kind: "punct", text: ");" },
  ],
};

const tokenClasses: Record<TokenKind, string> = {
  keyword: "text-violet-600 dark:text-violet-400",
  string: "text-emerald-600 dark:text-emerald-400",
  fn: "text-sky-600 dark:text-sky-400",
  var: "text-amber-600 dark:text-amber-400",
  punct: "text-muted-foreground",
  plain: "text-card-foreground",
  comment: "italic text-muted-foreground",
};

export function Code5({ tokens = [], className }: Code5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        <code className="block truncate font-mono text-sm">
          {tokens.map((token, i) => (
            <span key={i} className={tokenClasses[token.kind]}>
              {token.text}
            </span>
          ))}
        </code>
      </div>
    </div>
  );
}
