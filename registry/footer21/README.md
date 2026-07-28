# Footer21: Compact E-commerce Footer

Centered, checkout-focused footer: a horizontal nav row on top, then a divider into a second row of trust badges, a payment-methods image, and the copyright line. Built for smaller storefronts that want reassurance signals without a full sitemap footer.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/footer21"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/footer21"
```

This installs the block to `components/beste/block/footer21.tsx` and its dependencies.

## Quick start

The installed file exports `footer21Demo` alongside the block: the exact props behind the preview above. Spread it to get a working footer in one line.

```tsx
import { Footer21, footer21Demo } from "@/components/beste/block/footer21";

export default function Layout() {
  return <Footer21 {...footer21Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Footer21 } from "@/components/beste/block/footer21";

export default function Layout() {
  return (
    <Footer21
      logo={{ text: "Northwind Goods", href: "/" }}
      links={[
        { label: "Shop", href: "/shop" },
        { label: "Shipping", href: "/shipping" },
        { label: "Returns", href: "/returns" },
      ]}
      trustBadges={[
        { icon: "shieldCheck", label: "Secure Checkout" },
        { icon: "lock", label: "SSL Encrypted" },
      ]}
      paymentImage={{
        src: "https://beste.co/payment-cards.png",
        alt: "Accepted payment methods",
      }}
      copyright="© 2026 Northwind Goods."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `logo` | `Logo` | – | Wordmark link; hidden entirely when `logo.text` is unset |
| `links` | `NavLink[]` | `[]` | Top nav row, centered above the divider |
| `trustBadges` | `TrustBadge[]` | `[]` | Icon + label reassurance badges under the divider |
| `paymentImage` | `PaymentImage` | – | Payment-network icon strip image |
| `copyright` | `string` | – | Copyright line, shown last |
| `className` | `string` | – | Extra classes for the outer `<footer>` |

```ts
type Logo = { text?: string; href?: string };
type NavLink = { label: string; href?: string };
type TrustBadge = { icon: "shieldCheck" | "lock"; label: string };
type PaymentImage = { src: string; alt: string };
```

## Behavior notes

- Two-tier layout: `links` render centered above a `border-t` divider; `trustBadges`, `paymentImage`, and `copyright` render together below it.
- `TrustBadge.icon` supports only `"shieldCheck" | "lock"`, mapped through a fixed `trustIcons` object.
- The demo's `paymentImage` points at a non-Unsplash asset (a payment-card icon strip), since it is a fixed graphic rather than a photo; the prop itself accepts any image `src`.
- `paymentImage` renders with explicit `width={200} height={32}` attributes and a fixed `h-8 w-auto` class, so a replacement image should keep roughly the same aspect ratio to avoid distortion.
