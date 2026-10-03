"use client";

import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Assignee {
  name: string;
  initials: string;
  imageSrc?: string;
  alt?: string;
  selected?: boolean;
}

interface Form20Props {
  label?: string;
  query?: string;
  people?: Assignee[];
  bordered?: boolean;
  className?: string;
}

export const form20Demo: Form20Props = {
  label: "Assign to",
  query: "",
  people: [
    {
      name: "Nils Frahm",
      initials: "NF",
      imageSrc: "https://oud.pics/sm/l/gmail.jpeg",
      alt: "Nils Frahm",
      selected: true,
    },
    {
      name: "Hania Rani",
      initials: "HR",
      imageSrc: "https://oud.pics/sm/l/stripe.jpeg",
      alt: "Hania Rani",
      selected: true,
    },
    {
      name: "Ólafur Arnalds",
      initials: "ÓA",
      imageSrc: "https://oud.pics/sm/l/notion.png",
      alt: "Ólafur Arnalds",
    },
  ],
  bordered: false,
};

export function Form20({
  label,
  query = "",
  people = [],
  bordered = false,
  className,
}: Form20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-lg bg-card shadow-md", bordered && "border border-border")}>
        {label && (
          <div className="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground">
            {label}
          </div>
        )}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            {query || "Filter people…"}
          </span>
        </div>
        <div className="flex flex-col p-1">
          {people.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5"
            >
              <div
                className={cn(
                  "relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white",
                  !p.imageSrc &&
                    "bg-gradient-to-br from-sky-500 to-indigo-500"
                )}
              >
                {p.imageSrc ? (
                  <img
                    src={p.imageSrc}
                    alt={p.alt ?? p.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  p.initials
                )}
              </div>
              <span className="flex-1 truncate text-sm text-card-foreground">
                {p.name}
              </span>
              {p.selected && (
                <Check
                  className="size-3.5 shrink-0 text-emerald-500"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
