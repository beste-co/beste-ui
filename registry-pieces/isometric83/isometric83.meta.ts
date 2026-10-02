import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric83",
  title: "Isometric Hard Hat",
  description:
    "A hard hat in the accent color sits on a blueprint that unrolls across the ground, the floor plan drawing in once the sheet lies flat.",
  category: "Isometric",
  usage: `import { Isometric83 } from "@/components/beste/piece/isometric83";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric83 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Share drawings with 25 crews on site.
  </p>
</div>`,
};
