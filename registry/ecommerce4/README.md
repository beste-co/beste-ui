# Ecommerce4: Shop by Category Grid

Storefront category browser: full-bleed photo tiles with a dark scrim for text legibility, a name, an optional description and product count, and an optional "Featured" badge, each tile a single clickable link to the category page.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/ecommerce4"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/ecommerce4"
```

This installs the block to `components/beste/block/ecommerce4.tsx` and the `Badge` shadcn/ui primitive it uses.

## Quick start

The installed file exports `ecommerce4Demo` alongside the block: the exact props behind the preview above. Spread it to get a working category grid in one line.

```tsx
import { Ecommerce4, ecommerce4Demo } from "@/components/beste/block/ecommerce4";

export default function ShopPage() {
  return <Ecommerce4 {...ecommerce4Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Ecommerce4 } from "@/components/beste/block/ecommerce4";

export default function ShopPage() {
  return (
    <Ecommerce4
      heading="Browse our collections"
      categories={[
        {
          name: "Living Room",
          description: "Sofas, tables and decor",
          image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
          href: "/categories/living-room",
          productCount: "124 products",
          featured: true,
        },
        {
          name: "Kitchen",
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
          href: "/categories/kitchen",
          productCount: "156 products",
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional pill badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `categories` | `Category[]` | `[]` | Category tiles rendered in the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Category = {
  name: string;
  description?: string;
  image: string;
  href: string;
  productCount?: string;
  featured?: boolean;
};
```

## Behavior notes

- Column count is fully dynamic: 5 or more categories render 3 columns; a count divisible by 4 renders 4; a count divisible by 3 renders 3; anything else falls back to 2 (with `sm:grid-cols-2` as the mobile baseline).
- Every tile is one clickable `Link` covering the whole card (image, name, description, and product count), not a card with a separate "shop now" sub-link.
- A `bg-gradient-to-t from-black/90 via-black/40 to-transparent` scrim sits over the image so the white overlay text stays legible regardless of the underlying photo's brightness.
- `featured` only adds a secondary "Featured" badge above the title, it has no effect on tile size or grid position.
- Image aspect ratio changes at the `md` breakpoint: `aspect-[3/2]` on mobile, `aspect-square` from `md` up.
- The component returns `null` outright when `categories` is empty, rather than rendering the header alone.
