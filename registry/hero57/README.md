# Hero57: Full-height Hero with Scroll Indicator

Vertically centered, near-fullscreen hero (`min-h-[80vh]`) for single-page and landing-page openers, with a scroll-down affordance pinned to the bottom of the viewport: a bouncing dot inside a pill "mouse" shape plus a bouncing arrow.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero57"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero57"
```

This installs the block to `components/beste/block/hero57.tsx` and its shadcn/ui dependencies: `Badge`, `Button`.

## Quick start

The installed file exports `hero57Demo` alongside the block: the exact props behind the preview above. Spread it to get a working hero in one line.

```tsx
import { Hero57, hero57Demo } from "@/components/beste/block/hero57";

export default function Page() {
  return <Hero57 {...hero57Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero57 } from "@/components/beste/block/hero57";

export default function Page() {
  return (
    <Hero57
      badge={{ label: "Launching Soon", variant: "outline" }}
      heading="Transform your workflow with intelligent automation"
      description="Streamline operations and focus on what matters most."
      buttons={[
        { label: "Get Started Free", href: "https://beste.co" },
        { label: "Watch Demo", href: "https://beste.co", variant: "outline" },
      ]}
      scrollText="Scroll to explore"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Pill above the heading |
| `heading` | `string` | – | Main heading |
| `description` | `string` | – | Supporting paragraph |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons; the first one gets a trailing arrow icon |
| `scrollText` | `string` | – | Label shown above the scroll indicator |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
};
```

## Behavior notes

- The section is `min-h-[80vh]` with `flex flex-col`; the text block sits in a `flex-1 justify-center` wrapper, so it stays vertically centered in whatever height the section ends up at instead of being pinned to a fixed offset.
- The scroll indicator is absolutely positioned at `inset-x-0 bottom-8`, independent of the centered content above it, and only renders when `scrollText` is provided.
- Both moving parts of the indicator (the dot inside the pill outline and the standalone `ArrowDown` icon) use Tailwind's built-in `animate-bounce` utility, not a custom keyframe or a JS animation library.
- There is no click handler on the indicator: it is a purely visual cue, not a working "scroll to next section" link, so wiring an actual scroll target is left to the consumer.
