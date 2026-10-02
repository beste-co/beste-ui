import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric9",
  title: "Isometric Cloud Upload",
  description:
    "Small packets in the accent color lift off a flat pad and rise one by one into a soft cloud built from rounded blocks.",
  category: "Isometric",
  usage: `import { Isometric9 } from "@/components/beste/piece/isometric9";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric9 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Files sync to the cloud in under 2 seconds.
  </p>
</div>`,
};
