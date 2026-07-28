# ComingSoon3: Social Connect Launch

Coming-soon hero for a pre-launch social push: a heading and description sit above a row of pill-shaped social links (icon plus label) and a small pulsing dot next to a "Launching soon" status line. No countdown or progress mechanic, just links and a status indicator.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/comingsoon3"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/comingsoon3"
```

This installs the block to `components/beste/block/comingsoon3.tsx`, plus the `badge` shadcn/ui primitive it uses for the eyebrow badge.

## Quick start

The installed file exports `comingsoon3Demo` alongside the block: the exact props behind the preview above. Spread it to get a working social launch section in one line.

```tsx
import { ComingSoon3, comingsoon3Demo } from "@/components/beste/block/comingsoon3";

export default function ComingSoonPage() {
  return <ComingSoon3 {...comingsoon3Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Github, Twitter } from "lucide-react";
import { ComingSoon3 } from "@/components/beste/block/comingsoon3";

export default function ComingSoonPage() {
  return (
    <ComingSoon3
      badge={{ label: "Launching Soon", variant: "secondary" }}
      heading="Stay connected"
      description="Follow us to get the latest updates before launch."
      socialHeading="Find us on"
      socialLinks={[
        { icon: <Twitter className="size-5" />, label: "Twitter", href: "https://x.com/withbeste" },
        { icon: <Github className="size-5" />, label: "GitHub", href: "https://beste.co" },
      ]}
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
| `socialHeading` | `string` | – | Small uppercase caption above the link row |
| `socialLinks` | `SocialLink[]` | `[]` | Pill-shaped links rendered below the caption |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type SocialLink = {
  icon?: React.ReactNode;
  label: string;
  href?: string;
};
```

## Behavior notes

- There is no countdown timer in this block; the only motion is a small `animate-pulse` green dot next to a "Launching soon" caption at the bottom, which is hardcoded in the component and not exposed as a prop.
- Each `icon` is passed in as a pre-sized `ReactNode` (the demo passes `<Twitter className="size-5" />` directly), not chosen from an icon-key enum, so the caller owns icon choice and sizing.
- A link only renders as a clickable `Link` when `href` is set; otherwise it renders as a plain, non-interactive `div` with identical pill styling, so a link without `href` looks the same as a real one until clicked.
- A social entry without `href` still receives the same hover treatment (background lift, icon scale to 110%) as a real link, since both the `Link` and the `div` share the same class string, only the underlying element differs.
