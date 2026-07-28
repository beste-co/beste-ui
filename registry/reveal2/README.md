# Reveal2: Comparison Slider with Highlights

Split-layout comparison section pairing a benefits sidebar (badge, heading, description, up to six highlight rows) with the same drag-to-reveal before/after slider used in `reveal1`, embedded in a 12-column grid.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/reveal2"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/reveal2"
```

This installs the block to `components/beste/block/reveal2.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `reveal2Demo` alongside the block: the exact props behind the preview above. Spread it to get a working comparison section in one line.

```tsx
import { Reveal2, reveal2Demo } from "@/components/beste/block/reveal2";

export default function ShowcasePage() {
  return <Reveal2 {...reveal2Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Check, Zap } from "lucide-react";
import { Reveal2 } from "@/components/beste/block/reveal2";

export default function ShowcasePage() {
  return (
    <Reveal2
      badge={{ label: "Compare", variant: "secondary" }}
      heading="See the difference"
      description="Drag to compare the before and after states."
      highlights={[
        { id: "speed", icon: <Zap className="size-5" />, title: "Faster load times" },
        { id: "quality", icon: <Check className="size-5" />, title: "Sharper output" },
      ]}
      beforeImage={{ src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop&sat=-100", alt: "Before" }}
      afterImage={{ src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop", alt: "After" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Small badge above the heading |
| `heading` | `string` | – | Main headline |
| `description` | `string` | – | Supporting copy below the heading |
| `highlights` | `Highlight[]` | `[]` | Benefit rows in the sidebar, capped at six |
| `beforeImage` | `{ src: string; alt: string }` | – | Image clipped by the divider |
| `afterImage` | `{ src: string; alt: string }` | – | Full-bleed background image |
| `beforeLabel` | `string` | `"Before"` | Pill label over `beforeImage` |
| `afterLabel` | `string` | `"After"` | Pill label over `afterImage` |
| `showLabels` | `boolean` | `true` | Toggles the Before/After pill labels |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Drag axis and divider orientation |
| `initialPosition` | `number` | `50` | Starting divider position, 0-100 |
| `dividerWidth` | `number` | `4` | Divider bar thickness in pixels |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Highlight = {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
};
```

## Behavior notes

- Unlike `reveal1`, `beforeImage`/`afterImage` are optional here: if either is missing, its layer renders a muted placeholder box with "{label} image" text instead of an `<img>`, so the slider still works before real photography is wired in.
- `highlights` is sliced to the first six entries (`highlights.slice(0, 6)`) regardless of how many are passed, so extra items beyond six are silently dropped.
- The drag mechanics (pointer/touch listeners on `document`, clip-path reveal, ARIA `slider` role with no keyboard handling) are identical to `reveal1`; only the layout differs, splitting into a `lg:col-span-5` content column and a `lg:col-span-7` slider column that stack on smaller screens.
- The slider's aspect ratio is fixed at `16/10` here versus `reveal1`'s `aspect-video` (16/9), and the divider handle is styled inverted (white circle with a primary-colored grip icon and border) instead of `reveal1`'s primary-filled handle.
