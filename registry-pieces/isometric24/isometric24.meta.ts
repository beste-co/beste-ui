import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric24",
  title: "Isometric Card Terminal",
  description:
    "A payment card slides into the slot of an isometric terminal and a check in the accent color pops up on its screen before the card slides back out.",
  category: "Isometric",
  usage: `import { Isometric24 } from "@/components/beste/piece/isometric24";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric24 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Payments approved in 2 seconds or less.
  </p>
</div>`,
};
