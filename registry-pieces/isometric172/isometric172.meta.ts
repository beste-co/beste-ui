import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric172",
  title: "Isometric QR Scan",
  description:
    "A phone on a desk stand points its camera at a small sign with a QR code. The code shows in the viewfinder, a scan line in the accent color sweeps over it, the corner brackets lock and a result sheet slides up with a check.",
  category: "Isometric",
  usage: `import { Isometric172 } from "@/components/beste/piece/isometric172";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric172 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Scan to open the menu.
  </p>
</div>`,
};
