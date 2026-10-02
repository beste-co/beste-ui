import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric171",
  title: "Isometric Seesaw",
  description:
    "A playground seesaw tips back and forth on its central pivot with a block riding each end, one of them in the accent color, easing gently into each landing.",
  category: "Isometric",
  usage: `import { Isometric171 } from "@/components/beste/piece/isometric171";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric171 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Balance work and play.
  </p>
</div>`,
};
