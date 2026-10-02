import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric163",
  title: "Isometric Garage Door",
  description:
    "A sectional garage door rolls up and a small car in the accent color drives out through the doorway onto the drive, then the door comes back down.",
  category: "Isometric",
  usage: `import { Isometric163 } from "@/components/beste/piece/isometric163";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric163 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Parking included with every unit.
  </p>
</div>`,
};
