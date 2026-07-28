# Ecommerce32: Shop by Brand Grid

Brand-discovery grid for multi-brand storefronts: grayscale logo tiles that turn full color on hover, each linking out to its brand page with an optional product count beneath the name.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/ecommerce32"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/ecommerce32"
```

This installs the block to `components/beste/block/ecommerce32.tsx` and the `Badge` shadcn/ui primitive it uses.

## Quick start

The installed file exports `ecommerce32Demo` alongside the block: the exact props behind the preview above. Spread it to get a working brand grid in one line.

```tsx
import { Ecommerce32, ecommerce32Demo } from "@/components/beste/block/ecommerce32";

export default function ShopPage() {
  return <Ecommerce32 {...ecommerce32Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Ecommerce32 } from "@/components/beste/block/ecommerce32";

export default function ShopPage() {
  return (
    <Ecommerce32
      heading="Shop by Brand"
      productCountLabel="products"
      brands={[
        { name: "Nike", logo: "/logos/nike.png", href: "/brands/nike", productCount: 342 },
        { name: "Adidas", logo: "/logos/adidas.png", href: "/brands/adidas", productCount: 287 },
        { name: "Puma", logo: "/logos/puma.png", href: "/brands/puma", productCount: 198 },
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
| `brands` | `Brand[]` | `[]` | Brand tiles rendered in the grid |
| `productCountLabel` | `string` | – | Trailing unit label appended after each brand's product count (e.g. "products") |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Brand = {
  name: string;
  logo: string;
  href?: string;
  productCount?: number;
};
```

## Behavior notes

- Brand tiles use manual flex-basis width classes (`w-[calc(50%-0.5rem)]` on mobile, `md:w-[calc(33.333%-0.75rem)]`, `lg:w-[calc(16.666%-0.85rem)]`) inside a `flex flex-wrap` container instead of a CSS grid, yielding 2, 3, and 6 columns at the three breakpoints.
- Each logo starts at `grayscale opacity-50` and animates to full color and opacity on hover via the named group `group/ecommerce32-brand`, the same "trusted-by" hover treatment used by logo-cloud sections elsewhere in the catalog.
- `productCount` only renders when both it and `productCountLabel` are supplied; either one missing hides the whole product-count line, not just the missing part.
- A brand without `href` falls back to `href="#"` rather than rendering as static, non-linked content.
- The demo's logo URLs point to `oud.pics`, not Unsplash; swap in your own hosted brand marks. The image itself is only constrained by `max-h-full object-contain` inside a fixed `h-12` box.
