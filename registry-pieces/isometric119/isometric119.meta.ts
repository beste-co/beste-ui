import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric119",
  title: "Isometric Beach Umbrella",
  description:
    "A striped umbrella in the accent color shades a lounger on a patch of sand, while a line of foam washes in and out along the shore.",
  category: "Isometric",
  usage: `import { Isometric119 } from "@/components/beste/piece/isometric119";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric119 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Book 300 beach stays with free cancellation.
  </p>
</div>`,
};
