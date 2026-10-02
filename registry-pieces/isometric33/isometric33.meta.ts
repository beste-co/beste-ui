import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric33",
  title: "Isometric Storefront",
  description:
    "A small corner shop with a striped awning and a display window, where the open sign on the door flickers on and glows in the accent color.",
  category: "Isometric",
  usage: `import { Isometric33 } from "@/components/beste/piece/isometric33";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric33 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Your shop online in 1 afternoon, open 24/7.
  </p>
</div>`,
};
