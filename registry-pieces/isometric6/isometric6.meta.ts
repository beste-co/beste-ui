import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric6",
  title: "Isometric Phone Cards",
  description:
    "A phone lies flat with three interface cards hovering above its screen, each one rising and settling in turn while its shadow softens below.",
  category: "Isometric",
  usage: `import { Isometric6 } from "@/components/beste/piece/isometric6";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric6 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Ship to iOS and Android from 1 codebase.
  </p>
</div>`,
};
