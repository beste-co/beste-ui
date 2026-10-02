import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric30",
  title: "Isometric Pin Drop",
  description:
    "A map pin in the accent color drops onto the middle block of a small isometric city, bounces once and sends a ring across the rooftop.",
  category: "Isometric",
  usage: `import { Isometric30 } from "@/components/beste/piece/isometric30";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric30 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Deliveries tracked to within 5 meters.
  </p>
</div>`,
};
