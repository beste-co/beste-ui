"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Person {
  src?: string;
  alt?: string;
  fallback: string;
}

interface Money10Props {
  total?: string;
  perPerson?: string;
  people?: Person[];
  className?: string;
}

export const money10Demo: Money10Props = {
  total: "$248.60",
  perPerson: "$62.15",
  people: [
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      alt: "Ayşe",
      fallback: "AK",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      alt: "Merve",
      fallback: "MÖ",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      alt: "Sarah",
      fallback: "SB",
    },
    {
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      alt: "John",
      fallback: "JD",
    },
  ],
};

export function Money10({
  total = "$0",
  perPerson,
  people = [],
  className,
}: Money10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Split bill
          </span>
          <span className="text-lg font-bold tabular-nums text-card-foreground">
            {total}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-2">
          <div className="flex items-center -space-x-2">
            {people.slice(0, 4).map((person, i) => (
              <Avatar
                key={i}
                className="size-7 border-2 border-card"
              >
                <AvatarImage
                  src={person.src}
                  alt={person.alt}
                  className="object-cover"
                />
                <AvatarFallback className="text-xs font-semibold">
                  {person.fallback}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">
              {people.length} ways
            </span>
            {perPerson && (
              <span className="text-sm font-semibold tabular-nums text-card-foreground">
                {perPerson} each
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
