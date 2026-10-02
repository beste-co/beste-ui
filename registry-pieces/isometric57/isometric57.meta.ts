import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric57",
  title: "Isometric Signed Contract",
  description:
    "A pen stands on a two page contract and writes a looping signature above the line, the ink in the accent color, then lifts away before the page resets.",
  category: "Isometric",
  usage: `import { Isometric57 } from "@/components/beste/piece/isometric57";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric57 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Contracts signed in 3 clicks, from any device.
  </p>
</div>`,
};
