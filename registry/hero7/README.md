# Hero7: Centered Hero with Media

Centered, text-first hero: badge, heading, description, and up to two CTA buttons stacked in a single column, with an optional full-width featured image below the text block. The image is not clipped into a card or aspect box; it renders edge to edge inside a `max-w-4xl` wrapper with rounded corners.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero7"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero7"
```

This installs the block to `components/beste/block/hero7.tsx` and the `Badge` and `Button` shadcn/ui primitives it uses.

## Quick start

The installed file exports `hero7Demo` alongside the block: the exact props behind the preview above. Spread it to get a working hero in one line.

```tsx
import { Hero7, hero7Demo } from "@/components/beste/block/hero7";

export default function Page() {
  return <Hero7 {...hero7Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero7 } from "@/components/beste/block/hero7";

export default function Page() {
  return (
    <Hero7
      badge={{ label: "New Release", variant: "secondary" }}
      heading="Build stunning websites with easy tools"
      description="Drag, drop, and customize templates without writing a line of code."
      buttons={[
        { label: "Get Started", href: "/signup" },
        { label: "Watch Demo", href: "/demo", variant: "outline" },
      ]}
      image={{
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
        alt: "Product dashboard screenshot",
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional pill badge above the heading |
| `heading` | `string` | – | Main headline (required, no fallback) |
| `description` | `string` | – | Supporting paragraph under the heading |
| `buttons` | `Hero7Button[]` | – | CTA buttons rendered in a centered, wrapping row |
| `image` | `{ src: string; alt: string }` | – | Featured image below the text block |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Hero7Button = {
  label: string;
  href: string;
  variant?: "default" | "outline";
};
```

## Behavior notes

- `heading` is the only required prop; badge, description, buttons, and image are all conditionally rendered and the section still lays out cleanly with just a heading.
- The image sits below the text block, capped at `max-w-4xl`, and is not wrapped in a card or bordered container: it is a plain `<img>` with `w-full rounded-lg`, so its own aspect ratio drives the height.
- Buttons wrap in a centered `flex flex-wrap` row; each button's `variant` defaults to `"default"` only when the array item omits it, so mixed default/outline pairs (as in the demo) are explicit per button.
- There is no animation or client-side state in this component; it is a static server-renderable layout.
