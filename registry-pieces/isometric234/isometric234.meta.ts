import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric234",
  title: "Isometric Site Search",
  description:
    "A web page stands on a desk stand and a search palette rises in front of it out of the stand. A query writes itself into the field, three results fade in with the first one picked out in the accent color, and the palette sinks back down.",
  category: "Isometric",
  usage: `import { Isometric234 } from "@/components/beste/piece/isometric234";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric234 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Visitors find it in one search.
  </p>
</div>`,
};
