import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric12",
  title: "Isometric Toggle Row",
  description:
    "Four chunky switches sit in a row on an isometric plate and flip on one after another, each track filling with the accent color before they all switch back off.",
  category: "Isometric",
  usage: `import { Isometric12 } from "@/components/beste/piece/isometric12";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric12 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Turn on 8 integrations with a single click.
  </p>
</div>`,
};
