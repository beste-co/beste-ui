import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric91",
  title: "Isometric Security Camera",
  description:
    "A wall camera on a short arm pans slowly across the floor, its view cone sweeping with it while a small recording light blinks on top.",
  category: "Isometric",
  usage: `import { Isometric91 } from "@/components/beste/piece/isometric91";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric91 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Motion alerts reach your phone in 2 seconds.
  </p>
</div>`,
};
