import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric195",
  title: "Isometric One-Time Code",
  description:
    "A phone on a desk stand asks for a verification code: four keys light up in the accent color one after another, the code boxes fill, and the padlock badge turns into a check as the boxes take an accent outline. A security key lies on the base beside the stand.",
  category: "Isometric",
  usage: `import { Isometric195 } from "@/components/beste/piece/isometric195";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric195 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Verify every sign in with a one-time code.
  </p>
</div>`,
};
