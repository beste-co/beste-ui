import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric229",
  title: "Isometric Custom Domain",
  description:
    "A browser stands on its desk stand behind a domain plate that carries a globe and a name in the accent color. A plug slides along its lead into the socket on the stand, the link light comes on and the address bar swaps its placeholder for the domain with a secure mark, then the plug pulls back out.",
  category: "Isometric",
  usage: `import { Isometric229 } from "@/components/beste/piece/isometric229";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric229 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Your name on the address bar.
  </p>
</div>`,
};
