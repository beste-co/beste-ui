"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Person {
  name: string;
  initials: string;
  role?: string;
  online?: boolean;
  image?: string;
}

interface Search17Props {
  query?: string;
  people?: Person[];
  className?: string;
}

export const search17Demo: Search17Props = {
  query: "and",
  people: [
    {
      name: "Andrea Kim",
      initials: "AK",
      role: "Design",
      online: true,
      image:
        "https://images.unsplash.com/photo-1709428731946-963de989d963?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM4fHx8ZW58MHx8fHx8",
    },
    {
      name: "Andre Costa",
      initials: "AC",
      role: "Growth",
      image:
        "https://images.unsplash.com/photo-1596975806371-53084eb61b5c?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHx8",
    },
    {
      name: "Anders Lee",
      initials: "AL",
      role: "Engineering",
      online: true,
      image:
        "https://images.unsplash.com/photo-1595745688820-1a8bca9dd00f?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIyfHx8ZW58MHx8fHx8",
    },
  ],
};

export function Search17({ query = "", people = [], className }: Search17Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="flex-1 truncate text-sm text-card-foreground">{query}</span>
        </div>
        <div className="flex flex-col p-1">
          {people.map((p, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2 py-1.5",
                idx === 0 && "bg-muted"
              )}
            >
              <div className="relative shrink-0">
                <div className="relative flex size-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-xs font-semibold text-white">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="absolute inset-0 size-full object-cover" />
                  ) : (
                    p.initials
                  )}
                </div>
                {p.online && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card bg-emerald-500"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-card-foreground">{p.name}</span>
                {p.role && <span className="truncate text-xs text-muted-foreground">{p.role}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
