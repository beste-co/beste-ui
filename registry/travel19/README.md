# Travel19: Tour Type Categories

A photo-tile grid for browsing tours by experience style (adventure, cultural, beach, and so on): each tile is a full-bleed image with a gradient scrim, a tour count, a name, a short description, and an arrow-led "Explore" link that fades in on hover.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/travel19"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/travel19"
```

This installs the block to `components/beste/block/travel19.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `travel19Demo` alongside the block: the exact props behind the preview above. Spread it to get a working category grid in one line.

```tsx
import { Travel19, travel19Demo } from "@/components/beste/block/travel19";

export default function TourTypesPage() {
  return <Travel19 {...travel19Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Travel19 } from "@/components/beste/block/travel19";

export default function TourTypesPage() {
  return (
    <Travel19
      heading="Explore by Tour Type"
      description="Find the perfect adventure style for your next trip"
      types={[
        {
          name: "Adventure Tours",
          description: "Thrilling experiences for the bold traveler",
          image: "https://images.unsplash.com/photo-1680974745644-46f41f65c516?w=500&fit=crop",
          tourCount: 45,
          href: "https://beste.co",
        },
        {
          name: "Beach Holidays",
          description: "Sun, sand, and relaxation",
          image: "https://images.unsplash.com/photo-1644899391215-7e7bf4467615?w=500&fit=crop",
          tourCount: 52,
          href: "https://beste.co",
        },
      ]}
      labels={{ tours: "tours", explore: "Explore" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `types` | `TourType[]` | `[]` | Category tiles, in order |
| `labels` | `{ tours?: string; explore?: string }` | `{}` | The "N tours" suffix and the hover CTA text, for i18n |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type TourType = {
  name: string;
  description: string;
  image: string;
  tourCount: number;
  href: string;
};
```

## Behavior notes

- Each tile is one single `<Link>` covering the image, gradient scrim, and caption block; there is no separate hit target for the "Explore" text.
- The caption (tour count, name, description, Explore link) sits absolutely at the bottom of the tile over a `from-black/70 via-black/20` gradient scrim, keeping white text legible against arbitrary Unsplash photos.
- The "Explore" link is invisible by default and only fades in on hover from the `md:` breakpoint up (`md:opacity-0 ... md:group-hover/travel19:opacity-100`); on mobile and tablet it is always visible since those opacity classes don't apply below `md:`.
- The tile image has a matching hover zoom (`scale-105`), tied to the same `group/travel19` hover state as the Explore link's fade-in.
- `labels.tours` and `labels.explore` have no built-in fallback strings; omitting them renders that piece of text blank rather than falling back to English defaults.
