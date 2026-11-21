"use client";

import { cn } from "@/lib/utils";

interface Form51Entry {
  /** A round photo; without it the initials show */
  image?: string;
  /** Shown in the round chip; taken from the name when unset */
  initials?: string;
  name: string;
  detail?: string;
  time?: string;
}

interface Form51Props {
  /** Up to three new entries that take turns on top */
  incoming?: Form51Entry[];
  /** Up to two older entries fading out underneath */
  earlier?: Form51Entry[];
  /** A dot line at the foot */
  note?: string;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const form51Demo: Form51Props = {
  incoming: [
    { image: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=400&h=400&auto=format&fit=crop", name: "Norah Jones", detail: "Spanish A1" },
    { image: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=400&h=400&auto=format&fit=crop", name: "Jacob Collier", detail: "German B2" },
    { image: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=400&h=400&auto=format&fit=crop", name: "Laura Marling", detail: "French A1" },
  ],
  earlier: [
    { image: "https://images.unsplash.com/photo-1618673747378-7e0d3561371a?q=80&w=400&h=400&auto=format&fit=crop", name: "Thom Yorke", detail: "Spanish B1" },
    { image: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=400&h=400&auto=format&fit=crop", name: "Joni Mitchell", detail: "French A2" },
  ],
};

const STYLES = `
@keyframes form51-cycle { 0% { opacity: 0; transform: translateY(-10px) } 4%, 29% { opacity: 1; transform: none } 33%, 100% { opacity: 0; transform: translateY(6px) } }
.form51-in { opacity: 0; animation: form51-cycle 12s ease infinite }
.form51-k0 { opacity: 1; animation-delay: 0s } .form51-k1 { animation-delay: -8s } .form51-k2 { animation-delay: -4s }
@media (prefers-reduced-motion: reduce) { .form51-in { animation: none } }
`;

const FADES = ["w-11/12 opacity-70", "w-5/6 opacity-40"];

function initialsOf(entry: Form51Entry) {
  return entry.initials ?? entry.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
}

function Row({ entry }: { entry: Form51Entry }) {
  return (
    <div className="flex h-15 items-center gap-3 rounded-2xl bg-card px-4 text-card-foreground shadow-lg">
      {entry.image ? (
        <img src={entry.image} alt="" className="size-8 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground/75">{initialsOf(entry)}</span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{entry.name}</span>
        {entry.detail && <span className="block truncate text-xs text-muted-foreground">{entry.detail}</span>}
      </span>
      {entry.time && <span className="shrink-0 text-xs text-muted-foreground">{entry.time}</span>}
    </div>
  );
}

export function Form51({ incoming = [], earlier = [], note, fill = false, className }: Form51Props) {
  const shown = incoming.slice(0, 3);
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div className={cn("flex w-full flex-col items-center gap-2", !fill && "max-w-95")} aria-hidden="true">
        <div className="relative h-17 w-full">
          {shown.map((entry, index) => (
            <div key={index} className={cn("form51-in absolute inset-x-0 top-0", `form51-k${index}`)}>
              <Row entry={entry} />
            </div>
          ))}
        </div>
        {earlier.slice(0, 2).map((entry, index) => (
          <div key={index} className={FADES[index]}>
            <Row entry={entry} />
          </div>
        ))}
        {note && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-muted-foreground/60" />
            {note}
          </div>
        )}
      </div>
    </div>
  );
}
