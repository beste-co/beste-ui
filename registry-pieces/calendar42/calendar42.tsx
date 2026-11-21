"use client";

import { cn } from "@/lib/utils";

interface Calendar42Item {
  day: string;
  month?: string;
  title: string;
  place?: string;
  description?: string;
  /** A stone pill under the description */
  status?: string;
  /** A later status on the orange tint that takes the pill's place on a loop */
  nextStatus?: string;
}

interface Calendar42Props {
  items?: Calendar42Item[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const calendar42Demo: Calendar42Props = {
  items: [
    { day: "14", month: "Oct", title: "Opening keynote", place: "Main hall", description: "Doors open at 6 pm.", status: "Free with any ticket" },
    { day: "15", month: "Oct", title: "Morning workshops", place: "Studio 1", description: "Bring a laptop.", status: "12 places left", nextStatus: "Full" },
    { day: "16", month: "Oct", title: "Closing party", place: "Terrace", description: "Music and food from 8 pm.", status: "All ticket holders" },
  ],
  framed: true,
};

const STYLES = `
@keyframes calendar42-a { 0%, 38% { opacity: 1 } 43%, 88% { opacity: 0 } 93%, 100% { opacity: 1 } }
@keyframes calendar42-b { 0%, 45% { opacity: 0 } 50%, 82% { opacity: 1 } 87%, 100% { opacity: 0 } }
.calendar42-a { animation: calendar42-a 11s ease infinite }
.calendar42-b { opacity: 0; animation: calendar42-b 11s ease infinite }
@media (prefers-reduced-motion: reduce) { .calendar42-a, .calendar42-b { animation: none } .calendar42-a { opacity: 0 } .calendar42-b { opacity: 1 } }
`;

const PILL = "col-start-1 row-start-1 justify-self-start rounded-full px-2 py-0.5 text-xs whitespace-nowrap";

export function Calendar42({ items = [], framed = true, fill = false, className }: Calendar42Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-105",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("rounded-2xl bg-card px-4.5 py-2 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {items.map((item, index) => (
            <div key={index} className={cn("flex items-start gap-3.5 py-3.5", index < items.length - 1 && "border-b border-border")}>
              <div className="w-11 shrink-0 rounded-lg bg-muted py-1.5 text-center">
                <p className="text-base leading-tight font-medium tracking-tight">{item.day}</p>
                {item.month && <p className="text-xs text-muted-foreground">{item.month}</p>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2.5">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.place && <span className="shrink-0 text-muted-foreground">{item.place}</span>}
                </div>
                {item.description && <p className="mt-0.5 leading-snug text-foreground/70">{item.description}</p>}
                {item.status && (
                  <div className="mt-2 grid">
                    <span className={cn(PILL, "bg-muted text-foreground/75", item.nextStatus && "calendar42-a")}>{item.status}</span>
                    {item.nextStatus && <span className={cn(PILL, "calendar42-b bg-accent text-accent-foreground")}>{item.nextStatus}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
