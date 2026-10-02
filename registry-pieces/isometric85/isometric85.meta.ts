import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric85",
  title: "Isometric Car Lift",
  description:
    "A car in the accent color rides a service lift up out of the floor of a garage bay, holds at working height and sinks back down.",
  category: "Isometric",
  usage: `import { Isometric85 } from "@/components/beste/piece/isometric85";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric85 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Book a service slot in under 60 seconds.
  </p>
</div>`,
};
