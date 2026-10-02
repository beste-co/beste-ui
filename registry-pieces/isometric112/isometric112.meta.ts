import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric112",
  title: "Isometric Wallet Cards",
  description:
    "A leather bifold lies open with stitched edges and a row of card pockets on one side. The card in the accent color slides out of its pocket, rests, then tucks back in.",
  category: "Isometric",
  usage: `import { Isometric112 } from "@/components/beste/piece/isometric112";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric112 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Issue virtual cards in 2 seconds, freeze them in 1.
  </p>
</div>`,
};
