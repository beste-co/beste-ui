import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric75",
  title: "Isometric Clapperboard",
  description:
    "A film slate stands upright with striped bands in the accent color. Its hinged stick lifts open, snaps down on the board with a small bounce and holds shut.",
  category: "Isometric",
  usage: `import { Isometric75 } from "@/components/beste/piece/isometric75";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric75 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Cut 4K footage into 30 second clips.
  </p>
</div>`,
};
