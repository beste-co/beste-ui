# Footer9: Minimal Inline Footer

Compact single-row footer that packs a logo, a run of horizontal nav links, and a copyright line into one bar, collapsing to a stacked layout on mobile. The leanest footer in the set, with no social icons, columns, or forms.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/footer9"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/footer9"
```

This installs the block to `components/beste/block/footer9.tsx` and its dependencies.

## Quick start

The installed file exports `footer9Demo` alongside the block: the exact props behind the preview above. Spread it to get a working footer in one line.

```tsx
import { Footer9, footer9Demo } from "@/components/beste/block/footer9";

export default function Layout() {
  return <Footer9 {...footer9Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Footer9 } from "@/components/beste/block/footer9";

export default function Layout() {
  return (
    <Footer9
      logo={{ text: "Northwind", href: "/" }}
      links={[
        { label: "About", href: "/about" },
        { label: "Pricing", href: "/pricing" },
        { label: "Contact", href: "/contact" },
      ]}
      copyright="© 2026 Northwind. All rights reserved."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `logo` | `Logo` | – | Wordmark link; the whole logo block is skipped when `logo.text` is unset |
| `links` | `NavLink[]` | `[]` | Inline nav links, rendered in order |
| `copyright` | `string` | – | Copyright line |
| `className` | `string` | – | Extra classes for the outer `<footer>` |

```ts
type Logo = { text?: string; href?: string };
type NavLink = { label: string; href?: string };
```

## Behavior notes

- On mobile, the logo and links stack above the copyright line; at `md:` they sit on one row with the copyright pushed to the far edge via `justify-between`.
- Any `link` without an `href` falls back to `#` rather than being dropped from the list.
- Nav link hover uses a plain color swap (`hover:text-foreground`), not an underline.
