import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric170",
  title: "Isometric Hot Air Balloon",
  description:
    "A hot air balloon striped in the accent color drifts up and down over a small park with trees and a pond, its burner flickering while its shadow breathes on the grass.",
  category: "Isometric",
  usage: `import { Isometric170 } from "@/components/beste/piece/isometric170";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric170 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    See the valley from above.
  </p>
</div>`,
};
