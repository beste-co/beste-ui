import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric69",
  title: "Isometric Bike Dock",
  description:
    "A share bike with a front basket rests in its dock until the light on the post turns to the accent color, then rolls back out, waits, and glides in again.",
  category: "Isometric",
  usage: `import { Isometric69 } from "@/components/beste/piece/isometric69";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric69 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Unlock a bike in 5 seconds from any of 300 docks.
  </p>
</div>`,
};
