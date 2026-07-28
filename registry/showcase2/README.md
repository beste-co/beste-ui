# Showcase2: Split Hotspot Feature Section

Two-column feature section: text content and CTA buttons on one side, a screenshot on the other with clickable pulsing hotspot markers that open a `Popover` describing that part of the image. The column order can be reversed.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/showcase2"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/showcase2"
```

This installs the block to `components/beste/block/showcase2.tsx` and the `badge`, `button`, and `popover` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `showcase2Demo` alongside the block: the exact props behind the preview above. Spread it to get a working hotspot section in one line.

```tsx
import { Showcase2, showcase2Demo } from "@/components/beste/block/showcase2";

export default function FeaturePage() {
  return <Showcase2 {...showcase2Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Zap, Shield } from "lucide-react";
import { Showcase2 } from "@/components/beste/block/showcase2";

export default function FeaturePage() {
  return (
    <Showcase2
      heading="Powerful analytics at your fingertips"
      description="Explore the interactive dashboard and see how data turns into insight."
      buttons={[{ id: "btn-1", label: "Get started", href: "https://beste.co" }]}
      image={{
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
        alt: "Analytics dashboard",
      }}
      hotspots={[
        {
          id: "hotspot-1",
          x: 20,
          y: 35,
          icon: <Zap className="size-4" />,
          title: "Quick Actions",
          description: "Access frequently used features from the sidebar.",
        },
        {
          id: "hotspot-2",
          x: 55,
          y: 50,
          icon: <Shield className="size-4" />,
          title: "Data Protection",
          description: "Your data is encrypted end-to-end.",
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `buttons` | `ButtonItem[]` | `[]` | CTAs rendered below the description |
| `image` | `{ src: string; alt: string }` | – | Screenshot the hotspots sit on top of; falls back to a placeholder box if omitted |
| `hotspots` | `Hotspot[]` | `[]` | Clickable markers positioned over the image |
| `reversed` | `boolean` | `false` | Flips text and image columns |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};

type Hotspot = {
  id: string;
  x: number;
  y: number;
  icon?: React.ReactNode;
  title: string;
  description: string;
  link?: { href: string; label?: string };
  size?: "sm" | "md" | "lg";
  appearance?: "light" | "dark";
};
```

## Behavior notes

- Hotspot markers are positioned with inline `style={{ left: x%, top: y% }}`, so `x`/`y` are percentages of the image box rather than a grid or pixel coordinate.
- Each marker has a `animate-ping` pulse ring behind the solid circular button; `size` (`sm`/`md`/`lg`) scales both the button and its pulse ring together, and `appearance` (`light`/`dark`) swaps which of foreground/background fills the marker versus the pulse.
- Markers open their `Popover` on click (the underlying primitive's default trigger behavior), showing the hotspot's icon, title, description, and an optional "Learn more" link; there is no hover-to-open mode.
- A `bg-gradient-to-t from-black/20` scrim sits over the whole image purely to keep the light-appearance markers legible against bright photos.
- `reversed` swaps column order with arbitrary CSS (`lg:[&>*:first-child]:order-2` / `order-1`) rather than reordering the JSX, so it only takes effect at the `lg` breakpoint.
- If `image.src` is omitted, a muted placeholder box with the text "Showcase image" renders instead of an empty frame, and no hotspots have anything to overlay.
