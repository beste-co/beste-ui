"use client";
import { cn } from "@/lib/utils";

interface Suggestion {
  name: string;
  handle: string;
  initials: string;
  imageSrc?: string;
  alt?: string;
}

interface Form15Props {
  label?: string;
  leading?: string;
  query?: string;
  suggestions?: Suggestion[];
  bordered?: boolean;
  className?: string;
}

export const form15Demo: Form15Props = {
  label: "Mention a teammate",
  leading: "Looks good, ",
  query: "ni",
  suggestions: [
    {
      name: "Nils Frahm",
      handle: "nils",
      initials: "NF",
      imageSrc: "https://oud.pics/sm/l/gmail.jpeg",
      alt: "Nils Frahm",
    },
    {
      name: "Nina Simone",
      handle: "nina",
      initials: "NS",
      imageSrc: "https://oud.pics/sm/l/stripe.jpeg",
      alt: "Nina Simone",
    },
    {
      name: "Nico Muhly",
      handle: "nico",
      initials: "NM",
      imageSrc: "https://oud.pics/sm/l/notion.png",
      alt: "Nico Muhly",
    },
  ],
  bordered: false,
};

export function Form15({
  label,
  leading,
  query = "",
  suggestions = [],
  bordered = false,
  className,
}: Form15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <div className={cn("rounded-md bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
            <span className="text-sm text-card-foreground">
              {leading}
              <span className="rounded bg-sky-500/10 px-1 text-sky-700 dark:text-sky-400">
                @{query}
                <span
                  className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-sky-500 align-middle"
                  aria-hidden="true"
                />
              </span>
            </span>
          </div>
          <div className={cn("mt-1 flex flex-col overflow-hidden rounded-lg bg-card shadow-md", bordered && "border border-border")}>
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5",
                  idx === 0 && "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white",
                    !s.imageSrc &&
                      "bg-gradient-to-br from-indigo-500 to-violet-500"
                  )}
                >
                  {s.imageSrc ? (
                    <img
                      src={s.imageSrc}
                      alt={s.alt ?? s.name}
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    s.initials
                  )}
                </div>
                <span className="flex-1 truncate text-sm text-card-foreground">
                  {s.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  @{s.handle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
