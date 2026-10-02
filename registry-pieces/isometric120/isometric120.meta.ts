import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric120",
  title: "Isometric Ski Lift",
  description:
    "A cabin in the accent color glides down a cable strung between two masts on a snowy slope dotted with pine trees.",
  category: "Isometric",
  usage: `import { Isometric120 } from "@/components/beste/piece/isometric120";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric120 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Lift passes for 80 resorts in 1 app.
  </p>
</div>`,
};
