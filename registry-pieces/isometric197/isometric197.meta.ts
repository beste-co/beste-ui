import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric197",
  title: "Isometric Earbuds Pairing",
  description:
    "A phone lies flat on the desk next to an open earbuds case with both buds in the accent color. A pairing card slides up the screen, the connect button is pressed, three battery levels fill and a check confirms the connection while the light on the case settles.",
  category: "Isometric",
  usage: `import { Isometric197 } from "@/components/beste/piece/isometric197";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric197 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Open the case and you are connected.
  </p>
</div>`,
};
