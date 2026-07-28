# Footer10: Split Brand Footer

Two-column footer with the brand identity (logo, tagline, copyright) stacked on the left and a run of navigation links on the right, collapsing to a single stacked column on mobile.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/footer10"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/footer10"
```

This installs the block to `components/beste/block/footer10.tsx` and its dependencies.

## Quick start

The installed file exports `footer10Demo` alongside the block: the exact props behind the preview above. Spread it to get a working footer in one line.

```tsx
import { Footer10, footer10Demo } from "@/components/beste/block/footer10";

export default function Layout() {
  return <Footer10 {...footer10Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Footer10 } from "@/components/beste/block/footer10";

export default function Layout() {
  return (
    <Footer10
      logo={{ text: "Northwind", href: "/" }}
      tagline="Tools for the modern web."
      links={[
        { label: "Careers", href: "/careers" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ]}
      copyright="© 2026 Northwind."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `logo` | `Logo` | – | Wordmark link; hidden entirely when `logo.text` is unset |
| `tagline` | `string` | – | One-line description shown under the logo |
| `links` | `NavLink[]` | `[]` | Right-column nav links |
| `copyright` | `string` | – | Copyright line, rendered under the tagline |
| `className` | `string` | – | Extra classes for the outer `<footer>` |

```ts
type Logo = { text?: string; href?: string };
type NavLink = { label: string; href?: string };
```

## Behavior notes

- Layout splits into a left brand block (logo, tagline, copyright) and a right `links` nav using `justify-between`; on mobile the brand block stacks above the links.
- `copyright` renders directly beneath the tagline inside the same left column, not as a separate bottom bar, and uses a smaller `text-xs` size than the tagline's `text-sm`.
- Link hover is an underline (`hover:underline hover:underline-offset-4`), unlike footer9 and footer11 which use a plain color swap.
