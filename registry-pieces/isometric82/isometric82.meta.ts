import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric82",
  title: "Isometric Barn Silo",
  description:
    "A gabled barn stands beside a tall round silo whose bands fill with the accent color from the bottom up, like grain rising, before the level resets.",
  category: "Isometric",
  usage: `import { Isometric82 } from "@/components/beste/piece/isometric82";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric82 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Track 12 silos and every tonne they hold.
  </p>
</div>`,
};
