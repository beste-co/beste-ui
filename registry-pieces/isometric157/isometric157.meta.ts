import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric157",
  title: "Isometric Satellite",
  description:
    "A satellite with two solar wings drifts slowly in place. Its dish glows in the accent color and sends rings of signal outward, one after another.",
  category: "Isometric",
  usage: `import { Isometric157 } from "@/components/beste/piece/isometric157";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric157 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Coverage in 140 countries, even offshore.
  </p>
</div>`,
};
