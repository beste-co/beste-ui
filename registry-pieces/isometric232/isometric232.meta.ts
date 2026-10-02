import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric232",
  title: "Isometric Agent Ready",
  description:
    "A web page and its plain text twin stand side by side on a desk stand. A scan bar in the accent color slides down the text document while a small agent module on the desk reads it, and its indicator light comes on when the read is done.",
  category: "Isometric",
  usage: `import { Isometric232 } from "@/components/beste/piece/isometric232";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric232 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every page, readable by agents.
  </p>
</div>`,
};
