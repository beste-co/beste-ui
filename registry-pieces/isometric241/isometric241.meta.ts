import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric241",
  title: "Isometric Assistant Connector",
  description:
    "A chat app and a site builder stand side by side on a desk, joined by a rail. The two halves of a connector slide together on the rail and lock, a link light comes on in the accent color and the same check appears on both screens before the halves part again.",
  category: "Isometric",
  usage: `import { Isometric241 } from "@/components/beste/piece/isometric241";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric241 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Your assistant, connected to your site.
  </p>
</div>`,
};
