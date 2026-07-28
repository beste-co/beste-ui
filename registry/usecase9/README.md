# UseCase9: Masonry Bento Grid

CSS-columns masonry layout where each card's height is set by a `size` field (small, medium, or large) rather than by content, and cards with an image show it as a full-bleed background under a gradient scrim with icon, title, and description overlaid at the bottom.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/usecase9"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/usecase9"
```

This installs the block to `components/beste/block/usecase9.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `usecase9Demo` alongside the block: the exact props behind the preview above. Spread it to get a working section in one line.

```tsx
import { UseCase9, usecase9Demo } from "@/components/beste/block/usecase9";

export default function Page() {
  return <UseCase9 {...usecase9Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Rocket, ShoppingCart, Users } from "lucide-react";
import { UseCase9 } from "@/components/beste/block/usecase9";

export default function Page() {
  return (
    <UseCase9
      badge={{ label: "Solutions", variant: "secondary" }}
      heading="Built for Every Use Case"
      description="Discover how our platform adapts to your unique needs."
      columns={3}
      items={[
        {
          id: "startups",
          icon: <Rocket className="size-5" />,
          title: "Startups",
          description: "Launch faster with pre-built templates.",
          size: "large",
          image: { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c", alt: "Startups" },
        },
        {
          id: "agencies",
          icon: <Users className="size-5" />,
          title: "Agencies",
          description: "Manage multiple client projects with ease.",
          size: "small",
        },
        {
          id: "ecommerce",
          icon: <ShoppingCart className="size-5" />,
          title: "E-Commerce",
          description: "Build and scale online stores.",
          size: "medium",
          image: { src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8", alt: "E-Commerce" },
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Pill shown above the heading; omitted when `badge.label` is falsy |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `items` | `UseCaseItem[]` | – | Masonry cards |
| `columns` | `2 \| 3 \| 4` | `3` | CSS column count at `md`/`sm`/`lg` |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type UseCaseItem = {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  size?: "small" | "medium" | "large";
};
```

## Behavior notes

- The grid is implemented with CSS multi-column layout (`columns-1 sm:columns-2 lg:columns-4` for `columns={4}`, similarly for `2`/`3`) and `break-inside-avoid` on each card, not CSS Grid, which is what produces the true masonry (variable vertical offset) effect rather than an aligned grid.
- `size` maps to a fixed pixel height at `sm` and above: `large` is `sm:h-[632px]`, `medium` is `sm:h-[416px]`, and `small`/unset is `sm:h-[200px]`; below `sm` every card falls back to `min-h-72` regardless of `size`.
- When `item.image` is present it fills the card as an absolutely positioned background (`absolute inset-0 size-full object-cover`) with a `bg-gradient-to-t from-background via-background/90 to-transparent` scrim on top, and zooms to 105% on hover; without an image the card is a flat `bg-muted/30` surface with no scrim.
- Icon, title, and description are always anchored to the bottom of the card (`flex-1 flex flex-col justify-end`), so taller `large`/`medium` cards push their text down rather than centering it.
- Two `group` classes are nested per card: an unnamed `group` on the card wrapping the image's own hover zoom, and a named `group/usecase9` further out driving the icon swatch's hover color inversion.
