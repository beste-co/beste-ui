import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric103",
  title: "Isometric Refrigerator",
  description:
    "A tall refrigerator swings its main door open to show a lit interior in the accent color, with shelves of jars, bottles and two crisper drawers. After a moment the door closes again.",
  category: "Isometric",
  usage: `import { Isometric103 } from "@/components/beste/piece/isometric103";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric103 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Groceries at your door in 30 minutes.
  </p>
</div>`,
};
