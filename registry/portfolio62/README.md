# Portfolio62: Social Media Connect Grid

Responsive grid of outlined pill buttons, one per social platform, each showing a platform icon, name, and optional follower count.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/portfolio62"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/portfolio62"
```

This installs the block to `components/beste/block/portfolio62.tsx` and the `button` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `portfolio62Demo` alongside the block: the exact props behind the preview above. Spread it to get a working social grid in one line.

```tsx
import { Portfolio62, portfolio62Demo } from "@/components/beste/block/portfolio62";

export default function AboutPage() {
  return <Portfolio62 {...portfolio62Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Portfolio62 } from "@/components/beste/block/portfolio62";

export default function AboutPage() {
  return (
    <Portfolio62
      heading="Find me online"
      description="Follow along for behind-the-scenes updates."
      links={[
        { platform: "twitter", href: "https://twitter.com/example", followers: "9.4K" },
        { platform: "github", href: "https://github.com/example" },
        { platform: "instagram", href: "https://instagram.com/example", followers: "18K" },
      ]}
      labels={{ followers: "followers" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `links` | `SocialLink[]` | `[]` | Platform buttons rendered in the grid |
| `labels` | `{ followers?: string }` | `{}` | Suffix shown after a link's follower count |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type SocialLink = {
  platform: string;
  href: string;
  followers?: string;
};
```

## Behavior notes

- `link.platform` is matched case-insensitively against a fixed icon map (`github`, `linkedin`, `twitter`, `dribbble`, `instagram`, `youtube`); any platform string outside that list silently falls back to the GitHub icon rather than a generic placeholder.
- A link's follower count only renders when both `link.followers` and `labels.followers` are set. Supplying `followers` without setting `labels.followers` hides the count entirely, since the label suffix is what gates it.
- The grid is capped at `max-w-4xl` with up to three columns (`sm:grid-cols-2 md:grid-cols-3`), so a link count that isn't a clean multiple of the column count leaves a ragged last row rather than centering it.
