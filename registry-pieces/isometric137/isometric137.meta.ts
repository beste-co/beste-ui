import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric137",
  title: "Isometric Ring Box",
  description:
    "An open ring box shows a velvet lining in the accent color. The ring lifts from its slot and a small sparkle flashes on the stone.",
  category: "Isometric",
  usage: `import { Isometric137 } from "@/components/beste/piece/isometric137";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric137 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Engraving included on every ring, ready in 5 days.
  </p>
</div>`,
};
