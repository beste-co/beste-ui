import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric207",
  title: "Isometric Side Panel Editor",
  description:
    "A browser on a desk stand shows a page with its heading selected. A settings panel slides in from the side of the frame, the text in its field is retyped, and the heading on the page changes with it in the accent color before the panel slides away again.",
  category: "Isometric",
  usage: `import { Isometric207 } from "@/components/beste/piece/isometric207";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric207 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Click a section, edit it in the side panel.
  </p>
</div>`,
};
