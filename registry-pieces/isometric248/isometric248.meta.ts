import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric248",
  title: "Isometric Version History",
  description:
    "Snapshots of a page stand in a holder like files, the newest in front. An older one comes up out of the row, its tab takes the accent color and the front page takes on its content before everything returns.",
  category: "Isometric",
  usage: `import { Isometric248 } from "@/components/beste/piece/isometric248";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric248 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every version is kept.
  </p>
</div>`,
};
