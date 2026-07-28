# Fitness32: Gym Location Finder

Location section pairing a map image with an info card listing address, hours, phone, parking, and transit details. Each info row uses its own icon and accepts either a single line of text or a stacked list, so multi-line values like a street address or multiple transit lines render as a bullet list instead of one long string.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/fitness32"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/fitness32"
```

This installs the block to `components/beste/block/fitness32.tsx` and the shadcn/ui `badge` and `button` primitives it depends on.

## Quick start

The installed file exports `fitness32Demo` alongside the block: the exact props behind the preview above. Spread it to get a working location section in one line.

```tsx
import { Fitness32, fitness32Demo } from "@/components/beste/block/fitness32";

export default function ContactPage() {
  return <Fitness32 {...fitness32Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Clock, MapPin, Phone } from "lucide-react";
import { Fitness32 } from "@/components/beste/block/fitness32";

export default function ContactPage() {
  return (
    <Fitness32
      badge="Visit Us"
      heading="Find Our Studio"
      map={{
        image: "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?w=1200&h=800&fit=crop",
        url: "https://beste.co",
        directionsLabel: "Get Directions",
      }}
      items={[
        { icon: MapPin, label: "Address", value: "88 Market Street, Austin, TX" },
        { icon: Clock, label: "Hours", value: "Mon-Fri 6am-9pm" },
        { icon: Phone, label: "Phone", value: "(512) 555-0110" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `string` | – | Small label shown above the heading, prefixed with a pin icon |
| `heading` | `string` | – | Section heading |
| `map` | `MapInfo` | – | Map image plus its target link and directions button label |
| `items` | `InfoItem[]` | `[]` | Info rows (address, hours, phone, parking, transit, etc.) |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type MapInfo = {
  image: string;
  url: string;
  directionsLabel?: string;
};

type InfoItem = {
  icon: LucideIcon;
  label: string;
  value: string | string[];
};
```

## Behavior notes

- The component returns `null` entirely when both `map` and `items` are empty or absent, unlike most section blocks in this registry which always render their wrapper.
- The "Get Directions" button only appears when `map.directionsLabel` is set; without it the map renders as a plain image with a dark gradient overlay and no CTA.
- The map link opens in a new tab (`target="_blank" rel="noopener noreferrer"`).
- `InfoItem.value` accepts a plain string or a string array. Arrays render as a stacked `<ul>` (used by the demo for the two-line address and the two transit lines); single strings render as one `<p>`.
- Info rows use `mb-6` spacing on every row except the last, and every icon sits in the same fixed `bg-primary/10` chip regardless of which item it belongs to.
