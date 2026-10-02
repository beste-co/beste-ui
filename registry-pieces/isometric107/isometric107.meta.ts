import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric107",
  title: "Isometric Light Bulb",
  description:
    "A light bulb stands in a socket on a round base. It flickers on, fills with the accent color and spreads a soft glow before it dims again.",
  category: "Isometric",
  usage: `import { Isometric107 } from "@/components/beste/piece/isometric107";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric107 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Turn 1 idea into a launch plan in 10 minutes.
  </p>
</div>`,
};
