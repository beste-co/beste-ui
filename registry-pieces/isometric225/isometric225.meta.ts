import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric225",
  title: "Isometric Multi-Language Site",
  description:
    "A page stands on a desk stand with two more language versions fanned out behind it. The selector in the accent color slides across the three pills of the language switch, and each time the page's heading and text fade into lines of different lengths while the layout, the picture and the button stay where they are.",
  category: "Isometric",
  usage: `import { Isometric225 } from "@/components/beste/piece/isometric225";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric225 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    One site, every language.
  </p>
</div>`,
};
