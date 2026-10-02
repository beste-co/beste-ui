import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric155",
  title: "Isometric Drone",
  description:
    "A quadcopter carrying a parcel in the accent color hovers above a round landing pad. Its four rotors spin while it bobs gently and its shadow breathes on the pad below.",
  category: "Isometric",
  usage: `import { Isometric155 } from "@/components/beste/piece/isometric155";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric155 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Same-day drops within 25 km of the hub.
  </p>
</div>`,
};
