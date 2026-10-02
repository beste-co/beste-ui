import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric41",
  title: "Isometric Pill Bottle",
  description:
    "Two capsules drop one after the other into an open pill bottle standing on a small tray, while its cap and a few loose capsules rest beside it.",
  category: "Isometric",
  usage: `import { Isometric41 } from "@/components/beste/piece/isometric41";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric41 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Prescriptions refilled in 2 taps.
  </p>
</div>`,
};
