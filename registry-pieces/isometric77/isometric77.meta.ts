import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric77",
  title: "Isometric Pet Bowl",
  description:
    "A round food bowl sits on a mat with a paw print beside it. Kibble in the accent color drops in and the pile rises to the rim, then settles back.",
  category: "Isometric",
  usage: `import { Isometric77 } from "@/components/beste/piece/isometric77";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric77 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Book a vet visit in 2 taps, any day of the week.
  </p>
</div>`,
};
