import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric117",
  title: "Isometric Water Tap",
  description:
    "A faucet arches over a sink set into the counter. Drops in the accent color fall from the spout into a glass that slowly fills to the top.",
  category: "Isometric",
  usage: `import { Isometric117 } from "@/components/beste/piece/isometric117";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric117 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Meter readings every 15 minutes, leaks flagged in 1.
  </p>
</div>`,
};
