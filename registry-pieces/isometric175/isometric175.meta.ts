import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric175",
  title: "Isometric Fountain",
  description:
    "A two tier round fountain sends jets up from its center, which arc over and fall into the bowls. Water in the accent color spills over the rim while rings spread across the basin.",
  category: "Isometric",
  usage: `import { Isometric175 } from "@/components/beste/piece/isometric175";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric175 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Meet us in the square.
  </p>
</div>`,
};
