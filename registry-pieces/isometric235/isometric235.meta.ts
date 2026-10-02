import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric235",
  title: "Isometric Redirects",
  description:
    "Two address plates stand on a desk, the old one and the new one, with a signpost in front of them. The thick arrow on the post turns from the old address to the new, the old plate dims and the new one takes the accent color.",
  category: "Isometric",
  usage: `import { Isometric235 } from "@/components/beste/piece/isometric235";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric235 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Old links keep working.
  </p>
</div>`,
};
