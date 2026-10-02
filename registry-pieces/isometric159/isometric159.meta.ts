import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric159",
  title: "Isometric Aquarium",
  description:
    "A glass tank sits on a low stand with gravel, stones and plants inside. A fish in the accent color swims across, turns and swims back while bubbles rise to the surface.",
  category: "Isometric",
  usage: `import { Isometric159 } from "@/components/beste/piece/isometric159";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric159 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Care tips for 200 kinds of fish.
  </p>
</div>`,
};
