import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric15",
  title: "Isometric Summit Flag",
  description:
    "A low-poly mountain with a snow cap stands on a rounded base. Trail markers light up one by one from the foot to the summit, then a flag in the accent color runs up the pole and waves.",
  category: "Isometric",
  usage: `import { Isometric15 } from "@/components/beste/piece/isometric15";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric15 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    From first sale to 10,000 customers.
  </p>
</div>`,
};
