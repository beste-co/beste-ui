import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric40",
  title: "Isometric Gift Box",
  description:
    "A gift box wrapped in an accent ribbon with a bow on top. The bow is pulled undone, the ribbon slides off over the edges, and the lid lifts to show a glow inside before it is all wrapped up again.",
  category: "Isometric",
  usage: `import { Isometric40 } from "@/components/beste/piece/isometric40";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric40 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Send a gift card in 1 minute, redeemable for 12 months.
  </p>
</div>`,
};
