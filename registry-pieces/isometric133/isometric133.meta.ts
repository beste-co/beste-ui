import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric133",
  title: "Isometric Watering Can",
  description:
    "A watering can tilts over a raised flower bed and sprinkles it, and small flowers with heads in the accent color rise from the soil one after another.",
  category: "Isometric",
  usage: `import { Isometric133 } from "@/components/beste/piece/isometric133";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric133 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Garden care plans for 4 seasons a year.
  </p>
</div>`,
};
