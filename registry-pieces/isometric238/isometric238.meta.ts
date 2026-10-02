import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric238",
  title: "Isometric Cookie Consent",
  description:
    "A browser on a desk stand shows a page while a consent banner slides up from its bottom edge. Three toggles switch on one after another in the accent color, the accept button is pressed and the banner slides away again, with a cookie resting on the desk beside it.",
  category: "Isometric",
  usage: `import { Isometric238 } from "@/components/beste/piece/isometric238";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric238 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Consent handled, choices respected.
  </p>
</div>`,
};
