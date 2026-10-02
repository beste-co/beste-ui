import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric29",
  title: "Isometric Gear Pair",
  description:
    "Two thick gears lie flat side by side and turn against each other, the smaller one in the accent color spinning faster as its teeth pass through the larger one.",
  category: "Isometric",
  usage: `import { Isometric29 } from "@/components/beste/piece/isometric29";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric29 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    40 integrations that just mesh.
  </p>
</div>`,
};
