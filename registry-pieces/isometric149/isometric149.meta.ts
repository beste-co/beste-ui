import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric149",
  title: "Isometric Cell Tower",
  description:
    "A tapered lattice tower carries antenna panels on a small platform, and signal arcs in the accent color light up one ring after another on both sides before fading.",
  category: "Isometric",
  usage: `import { Isometric149 } from "@/components/beste/piece/isometric149";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric149 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    5G coverage for 98 percent of the country.
  </p>
</div>`,
};
