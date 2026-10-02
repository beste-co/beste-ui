import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric217",
  title: "Isometric Products Catalog",
  description:
    "A catalog page lies on a desk with six thick product cards standing on it, each with its item and a price. One card lifts off the page and settles back while its price shows in the accent color and the cart counter lights up.",
  category: "Isometric",
  usage: `import { Isometric217 } from "@/components/beste/piece/isometric217";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric217 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Your whole catalog on one page.
  </p>
</div>`,
};
