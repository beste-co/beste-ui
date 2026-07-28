"use client";
import { cn } from "@/lib/utils";

interface Student {
  name: string;
  initials: string;
  score: string;
  imageSrc?: string;
  alt?: string;
}

interface Education22Props {
  heading?: string;
  students?: Student[];
  className?: string;
}

export const education22Demo: Education22Props = {
  heading: "Top of the cohort",
  students: [
    {
      name: "Priya Shah",
      initials: "PS",
      score: "98",
      imageSrc: "https://images.unsplash.com/photo-1606122017369-d782bbb78f32?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzF8fHBvcnRyYWl0fGVufDB8fDB8fHww",
      alt: "Priya Shah",
    },
    {
      name: "Noor Ahmed",
      initials: "NA",
      score: "94",
      imageSrc: "https://images.unsplash.com/photo-1611695434398-4f4b330623e6?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
      alt: "Noor Ahmed",
    },
    {
      name: "Jordan Reyes",
      initials: "JR",
      score: "91",
      imageSrc: "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
      alt: "Jordan Reyes",
    },
    {
      name: "Beste Sözen",
      initials: "BS",
      score: "89",
      imageSrc: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
      alt: "Beste Sözen",
    },
  ],
};

export function Education22({
  heading,
  students = [],
  className,
}: Education22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex flex-col divide-y divide-border">
          {students.map((s, idx) => (
            <div key={idx} className="flex items-center gap-3 py-1.5">
              <span className="w-5 shrink-0 text-center font-mono text-xs font-bold text-muted-foreground">
                {idx + 1}
              </span>
              <div
                className={cn(
                  "relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white",
                  !s.imageSrc &&
                    "bg-gradient-to-br from-sky-500 to-indigo-500"
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
              <span className="flex-1 truncate text-sm font-medium text-card-foreground">
                {s.name}
              </span>
              <span className="shrink-0 rounded-md bg-emerald-500 px-2 py-0.5 font-mono text-xs font-semibold text-white">
                {s.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
