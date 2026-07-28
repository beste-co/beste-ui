"use client";

import { cn } from "@/lib/utils";

interface Socialproof9Props {
  quote?: string;
  author?: string;
  company?: string;
  className?: string;
}

export const socialproof9Demo: Socialproof9Props = {
  quote:
    "We migrated the marketing site in an afternoon. The team now ships a new section the same day they sketch it.",
  author: "Deniz Arslan",
  company: "Co-founder, Sable",
};

export function Socialproof9({
  quote,
  author,
  company,
  className,
}: Socialproof9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 text-center">
        {quote && (
          <p className="text-base leading-snug text-card-foreground">
            “{quote}”
          </p>
        )}
        {(author || company) && (
          <div className="flex flex-col">
            {author && (
              <span className="text-sm font-semibold text-card-foreground">
                {author}
              </span>
            )}
            {company && (
              <span className="text-xs text-muted-foreground">{company}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
