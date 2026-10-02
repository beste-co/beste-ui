import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric222",
  title: "Isometric Media Library",
  description:
    "Six thick image tiles sit in a tray, each printed with a small picture. One after another, three of them are picked: the tile lifts a little, takes a frame and a check in the accent color, then settles back as the next one is chosen.",
  category: "Isometric",
  usage: `import { Isometric222 } from "@/components/beste/piece/isometric222";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric222 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every image in one library.
  </p>
</div>`,
};
