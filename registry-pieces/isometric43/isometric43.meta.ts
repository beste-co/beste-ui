import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric43",
  title: "Isometric First Aid Kit",
  description:
    "A first aid case with a cross in the accent color on its lid. The lid lifts off and a bandage roll, a small bottle and a pack of plasters rise out of the case before it closes again.",
  category: "Isometric",
  usage: `import { Isometric43 } from "@/components/beste/piece/isometric43";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric43 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Care guides for 40 common injuries.
  </p>
</div>`,
};
