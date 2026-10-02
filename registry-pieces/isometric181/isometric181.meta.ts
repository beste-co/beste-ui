import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric181",
  title: "Isometric Map Navigation",
  description:
    "A phone leans back on a small desk stand showing a map of city blocks. A route in the accent color draws itself along the roads while a puck follows it and the distance bar shrinks, then a pin drops on the destination with a check.",
  category: "Isometric",
  usage: `import { Isometric181 } from "@/components/beste/piece/isometric181";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric181 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Reach every customer on the fastest route.
  </p>
</div>`,
};
