"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SuggestionLink {
  title: string;
  description?: string;
  href: string;
}

interface Error2Labels {
  placeholder?: string;
  submit?: string;
  suggestions?: string;
}

interface Error2Props {
  code?: string;
  heading?: string;
  description?: string;
  labels?: Error2Labels;
  suggestions?: SuggestionLink[];
  onSearch?: (query: string) => void;
  className?: string;
}

export const error2Demo: Error2Props = {
  code: "Error 404",
  heading: "We could not find that page",
  description:
    "Search the site instead, or jump straight to one of the pages people land on most.",
  labels: {
    placeholder: "Search documentation, guides, and posts",
    submit: "Search",
    suggestions: "Suggested pages",
  },
  suggestions: [
    {
      title: "Getting started",
      description: "Install the library and ship your first page",
      href: "https://beste.co",
    },
    {
      title: "Components",
      description: "Every block, grouped by category",
      href: "https://beste.co",
    },
    {
      title: "Pricing",
      description: "Plans, licensing, and what is included",
      href: "https://beste.co",
    },
    {
      title: "Support",
      description: "Get help from a human within one business day",
      href: "https://beste.co",
    },
  ],
};

export function Error2({
  code,
  heading,
  description,
  labels = {},
  suggestions = [],
  onSearch,
  className,
}: Error2Props) {
  const { placeholder, submit, suggestions: suggestionsLabel } = labels;
  const [query, setQuery] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <div className="text-center">
          {code && (
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {code}
            </p>
          )}

          {heading && (
            <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
              {heading}
            </h1>
          )}

          {description && (
            <p className="mt-4 text-balance text-base text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
              className="h-10 pl-9"
            />
          </div>
          {submit && (
            <Button type="submit" size="lg">
              {submit}
            </Button>
          )}
        </form>

        {suggestions.length > 0 && (
          <div className="mt-10">
            {suggestionsLabel && (
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {suggestionsLabel}
              </p>
            )}
            <div className="mt-4 divide-y rounded-md border">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={suggestion.href}
                  className="group/error2 flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-muted"
                >
                  <span>
                    <span className="block text-base font-semibold text-foreground">
                      {suggestion.title}
                    </span>
                    {suggestion.description && (
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {suggestion.description}
                      </span>
                    )}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover/error2:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
