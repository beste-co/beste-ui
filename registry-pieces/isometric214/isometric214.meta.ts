import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric214",
  title: "Isometric Build From a Brief",
  description:
    "A written brief lies beside an empty page on a desk. The lines of the brief light up one after another in the accent color and the page fills in with them, part by part: navigation, hero, cards, footer. The finished page holds, then clears for the next brief.",
  category: "Isometric",
  usage: `import { Isometric214 } from "@/components/beste/piece/isometric214";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric214 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    From a few lines to a full site.
  </p>
</div>`,
};
