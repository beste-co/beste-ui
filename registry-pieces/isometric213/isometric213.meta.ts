import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric213",
  title: "Isometric Site Navigation",
  description:
    "A site map laid out on a board: the home page tile at the back is joined by raised connectors to three child page tiles in front. Each page comes into view in turn, standing up from its tile in the accent color while the breadcrumb on the board changes to its name, then the board rests.",
  category: "Isometric",
  usage: `import { Isometric213 } from "@/components/beste/piece/isometric213";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric213 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every page is one step from home.
  </p>
</div>`,
};
