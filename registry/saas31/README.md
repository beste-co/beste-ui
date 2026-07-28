# Saas31: Job Listings

Career-page list of open roles, each rendered as one full-width clickable row: a title, an optional department badge, a row of icon-plus-label meta facts (location, employment type), and a trailing arrow that slides right on hover.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/saas31"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/saas31"
```

This installs the block to `components/beste/block/saas31.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `saas31Demo` alongside the block: the exact props behind the preview above. Spread it to get a working job list in one line.

```tsx
import { Saas31, saas31Demo } from "@/components/beste/block/saas31";

export default function CareersPage() {
  return <Saas31 {...saas31Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { MapPin, Clock } from "lucide-react";
import { Saas31 } from "@/components/beste/block/saas31";

export default function CareersPage() {
  return (
    <Saas31
      heading="Join our team"
      description="We're building something special and looking for talented people."
      positions={[
        {
          title: "Senior Frontend Engineer",
          badge: { label: "Engineering", variant: "secondary" },
          meta: [
            { label: "San Francisco, CA", icon: <MapPin className="size-4" /> },
            { label: "Full-time", icon: <Clock className="size-4" /> },
          ],
          href: "https://beste.co",
        },
        {
          title: "Product Designer",
          badge: { label: "Design", variant: "secondary" },
          meta: [{ label: "Remote", icon: <MapPin className="size-4" /> }],
          href: "https://beste.co",
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; icon?: React.ReactNode; variant?: "default" \| "secondary" \| "outline" }` | – | Optional badge above the section heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `positions` | `JobPosition[]` | `[]` | List of job rows, rendered in order |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type JobPosition = {
  title: string;
  badge?: { label: string; variant?: "default" | "secondary" | "outline" };
  meta?: MetaItem[];
  href: string;
};

type MetaItem = { label: string; icon?: React.ReactNode };
```

## Behavior notes

- Each row is one big `<Link>` spanning the whole card (title, badge, meta row, and arrow are all inside a single clickable area), not just the title text.
- `MetaItem.icon` is a raw `React.ReactNode`, so callers pass a rendered icon element directly in the data (as the demo does with `<MapPin className="size-4" />`), rather than an icon name resolved internally.
- On hover, the card border switches to `border-primary`, the title text and the arrow both turn primary-colored, and the arrow icon translates right, all scoped to the named group `group/saas31`.
- The section header block (badge, heading, description) is skipped entirely when none of the three are provided.
- `position.badge` is independent per row and defaults to the `secondary` variant when its own `variant` is omitted, distinct from the section-level badge.
