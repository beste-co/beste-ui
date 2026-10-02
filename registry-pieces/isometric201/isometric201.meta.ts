import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric201",
  title: "Isometric Page Builder",
  description:
    "A browser lies flat on a desk and its page builds itself: the navbar, a hero in the accent color with a media tile, three feature cards and the footer rise out of the page one after another as solid blocks, hold as a finished layout and sink back.",
  category: "Isometric",
  usage: `import { Isometric201 } from "@/components/beste/piece/isometric201";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric201 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Build pages from ready-made sections.
  </p>
</div>`,
};
