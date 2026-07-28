# Ecommerce1: Product Card Grid

Responsive product grid for shop and catalog pages: image tile with an optional sale/bestseller badge, star rating, current and struck-through original price, and a full-width "Add to Cart" button per card.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/ecommerce1"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/ecommerce1"
```

This installs the block to `components/beste/block/ecommerce1.tsx` and the `Badge` and `Button` shadcn/ui primitives it uses.

## Quick start

The installed file exports `ecommerce1Demo` alongside the block: the exact props behind the preview above. Spread it to get a working product grid in one line.

```tsx
import { Ecommerce1, ecommerce1Demo } from "@/components/beste/block/ecommerce1";

export default function ShopPage() {
  return <Ecommerce1 {...ecommerce1Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Ecommerce1 } from "@/components/beste/block/ecommerce1";

export default function ShopPage() {
  return (
    <Ecommerce1
      heading="Shop our latest collection"
      currency="$"
      products={[
        {
          name: "Minimal Desk Lamp",
          price: 89,
          originalPrice: 129,
          image: "https://images.unsplash.com/photo-1731762524352-b5663f83a830?w=900&fit=crop",
          badge: "Sale",
          rating: 4.8,
          reviewCount: 124,
        },
        {
          name: "Ceramic Vase Set",
          price: 65,
          image: "https://images.unsplash.com/photo-1654856842864-145a630cd603?w=900&fit=crop",
          rating: 4.9,
          reviewCount: 89,
        },
      ]}
      onAddToCart={(product) => console.log("add to cart", product.name)}
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
| `products` | `Product[]` | `[]` | Products rendered as cards |
| `currency` | `string` | `"$"` | Symbol prefixed to every price and original price |
| `onAddToCart` | `(product: Product) => void` | – | Called with the clicked card's product when "Add to Cart" is pressed |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Product = {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
};
```

## Behavior notes

- Grid column count is derived from the product count: a count divisible by 4 gets `lg:grid-cols-4`, a count divisible by 3 (or greater than 4) gets `lg:grid-cols-3`, otherwise `lg:grid-cols-2`; `sm:grid-cols-2` is always the mobile baseline.
- Rating is a literal `★` glyph in `text-yellow-500` next to the numeric rating and review count, not the `Star` icon fill pattern used elsewhere in the Ecommerce category.
- `originalPrice` only draws a strikethrough price next to the current one; there's no automatic discount-percentage calculation or badge, the `badge` field (e.g. `"Sale"`) is plain text supplied by the caller, not derived from the price difference.
- The component returns `null` outright when `products` is empty, rather than rendering the header with an empty grid.
- `onAddToCart` is the only interactive callback; there's no wishlist toggle, quantity selector, or cart state inside the block itself, it's presentation plus a single click handler per card.
