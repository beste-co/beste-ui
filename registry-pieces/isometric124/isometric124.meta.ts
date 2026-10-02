import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric124",
  title: "Isometric Birdhouse",
  description:
    "A gabled birdhouse sits on a wooden post. A small bird in the accent color pokes its round head out of the hole, glances left and right, nods and slips back inside.",
  category: "Isometric",
  usage: `import { Isometric124 } from "@/components/beste/piece/isometric124";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric124 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Spot 120 garden birds with 1 photo.
  </p>
</div>`,
};
