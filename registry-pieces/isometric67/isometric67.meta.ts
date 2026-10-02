import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric67",
  title: "Isometric Wind Farm",
  description:
    "Three wind turbines of different sizes stand on a small hill with a hut and an access road, their long blades turning steadily around hubs in the accent color while light gusts drift past.",
  category: "Isometric",
  usage: `import { Isometric67 } from "@/components/beste/piece/isometric67";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric67 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Clean power for 40,000 homes.
  </p>
</div>`,
};
