import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric65",
  title: "Isometric EV Charger",
  description:
    "An electric car sits plugged into a charging post, and the segments of the charge bar on the post fill one by one in the accent color, hold full, then start over.",
  category: "Isometric",
  usage: `import { Isometric65 } from "@/components/beste/piece/isometric65";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric65 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Charge to 80 percent in 25 minutes.
  </p>
</div>`,
};
