import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric108",
  title: "Isometric Hourglass",
  description:
    "Sand in the accent color runs through the neck of a glass hourglass held between two round plates and three slender posts. The level in the top bulb sinks as the pile below rises, then the sand fades back to the top and starts again.",
  category: "Isometric",
  usage: `import { Isometric108 } from "@/components/beste/piece/isometric108";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric108 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Deadlines tracked across 12 time zones.
  </p>
</div>`,
};
