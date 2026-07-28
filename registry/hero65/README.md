# Hero65: Split Hero with YouTube Video

Two-column hero pairing a headline, copy, and CTA buttons on one side with a responsive YouTube embed on the other. The `displayPosition` prop lets the video sit to the left or right of the text at the `lg` breakpoint.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero65"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero65"
```

This installs the block to `components/beste/block/hero65.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `hero65Demo` alongside the block: the exact props behind the preview above. Spread it to get a working hero in one line.

```tsx
import { Hero65, hero65Demo } from "@/components/beste/block/hero65";

export default function Page() {
  return <Hero65 {...hero65Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero65 } from "@/components/beste/block/hero65";

export default function Page() {
  return (
    <Hero65
      badge={{ label: "Product Tour", variant: "secondary" }}
      heading="See the product in two minutes"
      description="A quick walkthrough of the workflow your team will use every day."
      buttons={[
        { label: "Start Free Trial", href: "/signup" },
        { label: "View Pricing", href: "/pricing", variant: "outline" },
      ]}
      videoId="dQw4w9WgXcQ"
      displayPosition="left"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Badge above the heading, rendered with a fixed Play icon |
| `heading` | `string` | – | Main headline |
| `description` | `string` | – | Supporting paragraph |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons under the description |
| `videoId` | `string` | – | YouTube video ID embedded as `youtube.com/embed/{videoId}` |
| `displayPosition` | `"left" \| "right"` | `"right"` | Which side the video column renders on at the `lg` breakpoint |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
};
```

## Behavior notes

- The video column only renders when `videoId` is set. It is a plain `<iframe>` pointed at `https://www.youtube.com/embed/{videoId}`; there is no lazy-loading or click-to-play thumbnail, the iframe loads immediately.
- `displayPosition` swaps `lg:order-1`/`lg:order-2` on the text column and the video column. Below `lg` both stack in source order (text first), since the order classes only apply at `lg` and up.
- The iframe's `allow` attribute grants autoplay, fullscreen, and clipboard-write permissions, but playback itself is controlled entirely by YouTube's own embedded player, not by any prop on this component.
- Only the first button (index 0) gets an ArrowRight icon.
