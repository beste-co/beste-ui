import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric216",
  title: "Isometric No Maintenance",
  description:
    "A finished page rests on a pedestal with its status light on, while the small service unit beside it updates itself: a ring fills in the accent color, a check draws in, and the unit goes quiet again.",
  category: "Isometric",
  usage: `import { Isometric216 } from "@/components/beste/piece/isometric216";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric216 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Updates run themselves.
  </p>
</div>`,
};
