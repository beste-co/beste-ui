import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric96",
  title: "Isometric Ferris Wheel",
  description:
    "A small Ferris wheel on an A frame turns one step at a time, its cabins in the accent color staying level as they ride around.",
  category: "Isometric",
  usage: `import { Isometric96 } from "@/components/beste/piece/isometric96";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric96 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Skip the line at 40 parks and piers.
  </p>
</div>`,
};
