import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric86",
  title: "Isometric Barber Chair",
  description:
    "A salon chair with an accent seat and backrest faces an arched mirror, rising on its hydraulic column and sinking back down.",
  category: "Isometric",
  usage: `import { Isometric86 } from "@/components/beste/piece/isometric86";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric86 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Clients book their chair 24 hours a day.
  </p>
</div>`,
};
