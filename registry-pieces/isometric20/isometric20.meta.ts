import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric20",
  title: "Isometric Battery Charge",
  description:
    "A flat isometric battery charges up as its five cells drop into place one by one in the accent color, then empties and starts again.",
  category: "Isometric",
  usage: `import { Isometric20 } from "@/components/beste/piece/isometric20";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric20 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Runs for 12 hours on a single charge.
  </p>
</div>`,
};
