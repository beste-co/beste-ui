import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric37",
  title: "Isometric Living Room",
  description:
    "A corner of a living room with a sofa, a rug and a framed picture sits in the dim until the floor lamp flickers on, its shade glowing in the accent color while warm light washes the walls and floor and the sofa throws a soft shadow.",
  category: "Isometric",
  usage: `import { Isometric37 } from "@/components/beste/piece/isometric37";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric37 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Furniture delivered and assembled in 48 hours.
  </p>
</div>`,
};
