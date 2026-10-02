import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric200",
  title: "Isometric Watch Sync",
  description:
    "A phone on a desk stand and a smartwatch lying beside it sync with each other: dots run along the link on both screens, then a matching check in the accent color appears on each.",
  category: "Isometric",
  usage: `import { Isometric200 } from "@/components/beste/piece/isometric200";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric200 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Your watch and phone, always in step.
  </p>
</div>`,
};
