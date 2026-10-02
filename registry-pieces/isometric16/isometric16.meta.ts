import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric16",
  title: "Isometric Plug and Socket",
  description:
    "A plug in the accent color drops into the middle socket of a power strip, its pins sliding into their holes. The socket light comes on and a pulse runs along the cable before the plug lifts out again.",
  category: "Isometric",
  usage: `import { Isometric16 } from "@/components/beste/piece/isometric16";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric16 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Plug in 120 integrations in a few clicks.
  </p>
</div>`,
};
