import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric192",
  title: "Isometric File Transfer",
  description:
    "Two phones lie side by side on a desk. A thick file tile in the accent color slides from the drop zone of one screen to the other and back, while the progress bar on each phone empties as the file leaves and fills as it arrives.",
  category: "Isometric",
  usage: `import { Isometric192 } from "@/components/beste/piece/isometric192";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric192 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Send files to any device nearby.
  </p>
</div>`,
};
