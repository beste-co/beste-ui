"use client";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Speaker {
  name: string;
  role: string;
  initials: string;
  image?: string;
}

interface Event3Props {
  heading?: string;
  speakers?: Speaker[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const event3Demo: Event3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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

export function Event3({ heading, speakers = [], surface = "card", bordered = true, inverted = false, className }: Event3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {heading}
          </span>
        )}
        <div className="grid grid-cols-2 gap-2">
          {speakers.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-md bg-current/10 p-2">
              <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500 text-xs font-bold text-white">
                {s.image ? (
                  <img src={s.image} alt={s.name} className="absolute inset-0 size-full object-cover" />
                ) : (
                  s.initials
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold">
                  {s.name}
                </span>
                <span className="truncate text-xs text-current/60">{s.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
