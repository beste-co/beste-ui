import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric230",
  title: "Isometric Search Ranking",
  description:
    "A results board stands on a desk with three thick result tiles under a search field. The tile in the accent color pulls out of third place, rises in front of the others while they move down, and settles into first place before the order returns.",
  category: "Isometric",
  usage: `import { Isometric230 } from "@/components/beste/piece/isometric230";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric230 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Built to be found.
  </p>
</div>`,
};
