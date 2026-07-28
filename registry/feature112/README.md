# Feature112: Tabbed Feature Cards

Client-side tabbed feature showcase: a row of toggle buttons switches between named tabs (for example "Marketing", "Sales", "Engineering"), each rendering its own set of three cards below in a `md:grid-cols-3` grid.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature112"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature112"
```

This installs the block to `components/beste/block/feature112.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `feature112Demo` alongside the block: the exact props behind the preview above. Spread it to get a working tabbed grid in one line.

```tsx
import { Feature112, feature112Demo } from "@/components/beste/block/feature112";

export default function Page() {
  return <Feature112 {...feature112Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Feature112 } from "@/components/beste/block/feature112";

export default function Page() {
  return (
    <Feature112
      badge={{ label: "Solutions", variant: "default" }}
      heading="Solutions for every team"
      description="Discover how different teams use our platform."
      tabs={[
        {
          label: "Marketing",
          content: [
            { title: "Campaign Management", description: "Plan and execute campaigns.", href: "/features/campaigns" },
            { title: "Analytics Dashboard", description: "Track performance with insights.", href: "/features/analytics" },
          ],
        },
        {
          label: "Sales",
          content: [
            { title: "Lead Tracking", description: "Monitor leads through the pipeline.", href: "/features/leads" },
          ],
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `tabs` | `TabItem[]` | `[]` | Tab buttons and their associated card sets |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type TabItem = {
  label: string;
  content: TabContent[];
};

type TabContent = {
  title: string;
  description?: string;
  href?: string;
};

type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- Tab state is local component state (`useState(0)`), not driven by shadcn's `Tabs` primitive: the tab row is a set of plain `Button`s toggling `variant="default"`/`"outline"` based on `activeIndex`, and only that tab's `content` array is rendered below.
- The active tab defaults to index `0`, so `tabs[0]` is shown on first render; if `tabs` is empty, `activeContent` resolves to `[]` via optional chaining (`tabs[activeIndex]?.content ?? []`) and the card grid renders empty rather than throwing.
- The card grid is a fixed `md:grid-cols-3`, independent of how many items are in the active tab's `content` array, so a tab with fewer than three cards leaves empty columns rather than reflowing.
- Switching tabs is instant with no transition or animation; the card grid's content simply swaps.
- A card renders as a `Link` when its `href` is set (with a `hover:shadow-lg` transition via `group/feature112`) and as a plain non-interactive `<div>` otherwise.
