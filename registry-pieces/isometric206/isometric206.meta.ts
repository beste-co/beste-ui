import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric206",
  title: "Isometric Section Library",
  description:
    "An open file box on a desk holds four section cards of stepped height, each showing its header above the one in front. Two of them rise out of the box in turn to show their layout, a hero and a row of feature cards with details in the accent color, then sink back in.",
  category: "Isometric",
  usage: `import { Isometric206 } from "@/components/beste/piece/isometric206";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric206 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Hundreds of sections, ready to drop in.
  </p>
</div>`,
};
