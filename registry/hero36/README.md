# Hero36: Centered Hero with Logo Cloud

Centered hero built for B2B landing pages: badge, a heading with a gradient-clipped highlighted phrase, description, CTA buttons, and a "trusted by" logo row beneath the buttons. The logos sit desaturated by default and turn to full color on hover, one at a time.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero36"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero36"
```

This installs the block to `components/beste/block/hero36.tsx` and the `Badge` and `Button` shadcn/ui primitives it uses.

## Quick start

The installed file exports `hero36Demo` alongside the block: the exact props behind the preview above. Spread it to get a working hero in one line.

```tsx
import { Hero36, hero36Demo } from "@/components/beste/block/hero36";

export default function Page() {
  return <Hero36 {...hero36Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero36 } from "@/components/beste/block/hero36";

export default function Page() {
  return (
    <Hero36
      badge={{ label: "Introducing v2.0", variant: "outline" }}
      heading="The future of <strong>product development</strong>"
      description="Build, test, and ship products faster, with tools your whole team can use."
      buttons={[
        { label: "Start Free Trial", href: "/signup" },
        { label: "Book a Demo", href: "/demo", variant: "outline" },
      ]}
      trustedBy={{
        label: "Trusted by innovative teams",
        logos: [
          { name: "Acme", logo: "/logos/acme.svg", href: "/customers/acme" },
          { name: "Northwind", logo: "/logos/northwind.svg" },
        ],
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional pill badge above the heading |
| `heading` | `string` | – | Headline HTML; wrap a phrase in `<strong>` to gradient-highlight it |
| `description` | `string` | – | Supporting paragraph under the heading |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons rendered in a centered, wrapping row |
| `trustedBy` | `{ label: string; logos: LogoItem[] }` | – | Caption plus a row of partner/customer logos |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
};

type LogoItem = { name: string; logo: string; href?: string };
```

## Behavior notes

- `heading` is rendered via `dangerouslySetInnerHTML`, following the project's highlighted-text convention: only the text wrapped in `<strong>` gets the gradient (`bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent`); plain text around it stays the normal heading color.
- Each logo starts at `grayscale opacity-50` and transitions to full color and opacity on hover, per logo, with a plain CSS `transition-all`; there is no JavaScript involved.
- The section has no image, video, or floating-card media slot at all: this hero is text plus a logo row only.
- Padding is `py-24 md:py-32`, heavier than the standard `py-16 md:py-24` section wrapper, which is intentional for a large top-of-page hero.
- Logo links fall back to `href="#"` when a `LogoItem` omits its `href`.
