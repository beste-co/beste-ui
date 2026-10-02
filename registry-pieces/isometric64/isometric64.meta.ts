import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric64",
  title: "Isometric Warehouse Shelf",
  description:
    "Pallet shelving holds stacked cartons on three levels, and a carton in the accent color slides into the one empty slot, rests there, then slides back out.",
  category: "Isometric",
  usage: `import { Isometric64 } from "@/components/beste/piece/isometric64";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric64 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Stock counted across 3 warehouses in real time.
  </p>
</div>`,
};
