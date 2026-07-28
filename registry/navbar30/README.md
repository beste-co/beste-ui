# Navbar30: Centered Logo Split Nav

Symmetrical navbar with the logo centered between two independent groups of nav links, either of which can carry a click-to-open dropdown. Built for fashion and lifestyle sites that want balanced left/right visual weight instead of a single leading logo.

<FreeCta />

## Installation

```bash
npx shadcn add "https://ui.beste.co/r/navbar30"
```

```bash
npx shadcn add "https://ui.beste.co/r-base/navbar30"
```

This installs the block to `components/beste/block/navbar30.tsx` and the shadcn/ui dependency it needs (`button`).

## Quick start

The installed file exports `navbar30Demo` alongside the block: the exact props behind the preview above. Spread it to get a working navbar in one line.

```tsx
import { Navbar30, navbar30Demo } from "@/components/beste/block/navbar30";

export default function Layout() {
  return <Navbar30 {...navbar30Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Navbar30 } from "@/components/beste/block/navbar30";

export default function Layout() {
  return (
    <Navbar30
      logo={{ text: "Acme", href: "/" }}
      leftNavItems={[
        {
          label: "Products",
          dropdown: [
            { title: "Analytics", description: "Track your metrics", href: "/analytics" },
            { title: "Automation", description: "Streamline workflows", href: "/automation" },
          ],
        },
        { label: "Pricing", href: "/pricing" },
      ]}
      rightNavItems={[
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ]}
      button={{ label: "Get started", href: "/signup" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `logo` | `{ text: string; href?: string }` | – | Brand text and link, rendered centered; falls back to "Brand" / `#` when omitted |
| `leftNavItems` | `NavItem[]` | `[]` | Nav entries rendered to the left of the logo |
| `rightNavItems` | `NavItem[]` | `[]` | Nav entries rendered to the right of the logo, followed by `button` |
| `button` | `{ label: string; href?: string }` | – | Single call-to-action button after the right nav group; omitted if not passed |
| `className` | `string` | – | Extra classes for the outer `<nav>` |

```ts
type NavItem = { label: string; href?: string; dropdown?: DropdownItem[] };

type DropdownItem = { title: string; href?: string; description?: string };
```

## Behavior notes

- Items with a non-empty `dropdown` render as a button that toggles a small absolutely-positioned panel on click; a single shared ref plus an outside-`mousedown` listener closes whichever dropdown is open when the click lands outside it.
- The logo sits in a `flex-1 justify-center` wrapper on desktop so it stays visually centered regardless of how many items are on each side; on mobile it collapses to the same centered treatment.
- The mobile breakpoint is `lg` (1024px). Below it, `leftNavItems` and `rightNavItems` are concatenated into one stacked list; items with a `dropdown` show their sub-items expanded inline under a non-interactive label heading rather than as a separate accordion toggle.
- The bar is sticky (`sticky top-0 z-50`) with a solid `bg-background` and a bottom border, no blur.
