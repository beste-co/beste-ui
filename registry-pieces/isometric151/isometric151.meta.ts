import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric151",
  title: "Isometric Parcel Locker",
  description:
    "A wall of locker doors with a small control panel stands on a plinth. One door swings open to show a parcel in the accent color, which hops once before the door closes again.",
  category: "Isometric",
  usage: `import { Isometric151 } from "@/components/beste/piece/isometric151";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric151 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Pick up parcels 24/7 from 900 lockers.
  </p>
</div>`,
};
