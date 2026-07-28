# Hero63: Changelog Hero with Updates List

Centered changelog hero: a headline and intro copy sit above a bordered card that lists recent updates as a checklist, each row optionally flagged with a small "New" badge. Two CTA buttons sit below the card, and the first one gets an arrow icon automatically.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero63"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero63"
```

This installs the block to `components/beste/block/hero63.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `hero63Demo` alongside the block: the exact props behind the preview above. Spread it to get a working hero in one line.

```tsx
import { Hero63, hero63Demo } from "@/components/beste/block/hero63";

export default function Page() {
  return <Hero63 {...hero63Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero63 } from "@/components/beste/block/hero63";

export default function Page() {
  return (
    <Hero63
      badge={{ label: "Changelog", variant: "outline" }}
      heading="What we shipped this quarter"
      description="A running log of the features and fixes that landed in production."
      updates={[
        { text: "Dark mode for the dashboard", isNew: true },
        { text: "CSV export for reports", isNew: true },
        { text: "Faster search indexing" },
      ]}
      buttons={[
        { label: "Read the full changelog", href: "/changelog" },
        { label: "Subscribe to updates", href: "/subscribe", variant: "outline" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Badge above the heading; renders with a fixed Bell icon and falls back to the `secondary` variant when `variant` is omitted |
| `heading` | `string` | – | Main headline |
| `description` | `string` | – | Supporting paragraph under the heading |
| `updates` | `{ text: string; isNew?: boolean }[]` | `[]` | Checklist rows shown inside the card below the description |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the update card |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
};
```

## Behavior notes

- Only the first button (index 0) gets an ArrowRight icon appended automatically; any other button renders label only.
- Each update row shows a CheckCircle icon; rows with `isNew: true` additionally render a small "New" badge pushed to the right edge with `ml-auto`.
- The badge always renders with a fixed Bell icon baked into the markup; the `label`/`variant` props only change its text and color, never the icon.
- The component holds no internal state. `"use client"` is present for registry consistency, but the output is fully static markup safe to server-render.
