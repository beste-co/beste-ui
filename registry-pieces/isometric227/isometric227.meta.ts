import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric227",
  title: "Isometric Global Hosting",
  description:
    "A round world plate carries low landmass tiles and four server posts. The servers come on one after another, each tinting the land it covers, until the nearest one turns fully to the accent color; they hold together, then rest.",
  category: "Isometric",
  usage: `import { Isometric227 } from "@/components/beste/piece/isometric227";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric227 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Served from the nearest region.
  </p>
</div>`,
};
