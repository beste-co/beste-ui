import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric31",
  title: "Isometric Coffee Cup",
  description:
    "A cup of dark coffee with latte art sits on a round saucer, while soft wisps of steam curl up from the rim and fade out.",
  category: "Isometric",
  usage: `import { Isometric31 } from "@/components/beste/piece/isometric31";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric31 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Orders ready in 4 minutes, 7 days a week.
  </p>
</div>`,
};
