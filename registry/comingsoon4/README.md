# ComingSoon4: Animated Icons Preview

Coming-soon hero with a decorative floating-icon field driven by CSS keyframes, plus a Framer Motion status pill: user-supplied icons drift and fade at percentage-based positions behind the heading, while a pulsing dot and a glowing ring around the status text signal ongoing activity. No countdown is involved.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/comingsoon4"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/comingsoon4"
```

This installs the block to `components/beste/block/comingsoon4.tsx`, plus the `badge` shadcn/ui primitive it uses for the eyebrow badge.

## Quick start

The installed file exports `comingsoon4Demo` alongside the block: the exact props behind the preview above. Spread it to get a working animated preview in one line.

```tsx
import { ComingSoon4, comingsoon4Demo } from "@/components/beste/block/comingsoon4";

export default function ComingSoonPage() {
  return <ComingSoon4 {...comingsoon4Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Rocket, Sparkles, Star } from "lucide-react";
import { ComingSoon4 } from "@/components/beste/block/comingsoon4";

export default function ComingSoonPage() {
  return (
    <ComingSoon4
      badge={{ label: "Preview", variant: "secondary" }}
      heading="The future is almost here"
      description="We're putting the finishing touches on something extraordinary."
      showFloatingElements
      floatingElements={[
        { icon: <Rocket className="w-full h-full" />, size: "lg", position: { x: 10, y: 20 } },
        { icon: <Star className="w-full h-full" />, size: "md", position: { x: 85, y: 15 } },
        { icon: <Sparkles className="w-full h-full" />, size: "sm", position: { x: 15, y: 70 } },
      ]}
      notifyText="Big things are coming"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Section eyebrow badge |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `showFloatingElements` | `boolean` | `true` | Whether the floating icon layer renders at all |
| `floatingElements` | `FloatingElement[]` | `[]` | Icons drifting behind the content |
| `notifyText` | `string` | – | Label inside the pulsing status pill |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FloatingElement = {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  position?: { x: number; y: number };
};
```

## Behavior notes

- Floating icons are pure CSS, not Framer Motion: each icon gets an inline `@keyframes float` animation (defined via `<style jsx>`) with a duration of `3 + (index % 3)` seconds and a `index * 0.5`s delay, so icons drift at three different speeds and start staggered rather than in sync.
- `position` is a percentage coordinate (`x`/`y`, roughly 0 to 100) applied via inline `left`/`top` styles, not a grid or flex layout, so icons can be placed anywhere over the section, including off-center or near the edges.
- Only the status pill uses Framer Motion: the pill's `box-shadow` pulses through three keyframe values on a 2s loop, and its leading dot separately scales and fades opacity on a 1.5s loop; both animations repeat infinitely and run independently of each other.
- The floating icon layer only renders when both `showFloatingElements` is true and `floatingElements` is non-empty, and sits behind the content via `pointer-events-none` plus a `z-10` text column on top.
- There is no countdown or timer logic anywhere in this block; `notifyText` is a single static status label, not a computed value.
