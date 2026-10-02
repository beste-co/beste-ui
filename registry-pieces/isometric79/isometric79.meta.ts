import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric79",
  title: "Isometric Reception Bell",
  description:
    "A hotel bell with a dome in the accent color sits on a counter beside a key tag. Its plunger is tapped down and short lines ring out above the dome.",
  category: "Isometric",
  usage: `import { Isometric79 } from "@/components/beste/piece/isometric79";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric79 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Guests check in on their phone in 30 seconds.
  </p>
</div>`,
};
