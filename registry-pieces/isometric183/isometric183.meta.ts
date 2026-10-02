import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric183",
  title: "Isometric Notifications",
  description:
    "A phone on a desk stand shows its lock screen while notification cards drop in and stack, the newest in the accent color, and a badge grows on the dock. Then the cards are swiped away one by one.",
  category: "Isometric",
  usage: `import { Isometric183 } from "@/components/beste/piece/isometric183";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric183 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Reach customers the moment it matters.
  </p>
</div>`,
};
