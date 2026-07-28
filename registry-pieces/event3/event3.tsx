"use client";
import { cn } from "@/lib/utils";

interface Speaker {
  name: string;
  role: string;
  initials: string;
  image?: string;
}

interface Event3Props {
  heading?: string;
  speakers?: Speaker[];
  className?: string;
}

export const event3Demo: Event3Props = {
  heading: "Opening-day speakers",
  speakers: [
    {
      name: "Priya Shah",
      role: "Design · Linear",
      initials: "PS",
      image:
        "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      name: "Kian Okafor",
      role: "Engineering · Beste",
      initials: "KO",
      image:
        "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
  ],
};

export function Event3({ heading, speakers = [], className }: Event3Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="grid grid-cols-2 gap-2">
          {speakers.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-md bg-muted p-2">
              <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500 text-xs font-bold text-white">
                {s.image ? (
                  <img src={s.image} alt={s.name} className="absolute inset-0 size-full object-cover" />
                ) : (
                  s.initials
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-card-foreground">
                  {s.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">{s.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
