import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric174",
  title: "Isometric Espresso Machine",
  description:
    "An espresso machine pours a stream of coffee in the accent color into a cup on its drip tray. The cup fills and the gauge needle swings up before it all resets.",
  category: "Isometric",
  usage: `import { Isometric174 } from "@/components/beste/piece/isometric174";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric174 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Fresh coffee, every morning.
  </p>
</div>`,
};
