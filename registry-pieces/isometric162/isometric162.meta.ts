import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric162",
  title: "Isometric Elevator",
  description:
    "A floor indicator in the accent color counts down as the lift arrives, then the doors slide apart into the wall to show the cabin and close again.",
  category: "Isometric",
  usage: `import { Isometric162 } from "@/components/beste/piece/isometric162";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric162 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Access to every floor.
  </p>
</div>`,
};
