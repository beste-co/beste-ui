# Education86: Social Media Links Grid

Campus social-media hub for university marketing pages: a badge, a required heading, and a description above a two-column grid of clickable platform cards showing handle and follower count.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/education86"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/education86"
```

This installs the block to `components/beste/block/education86.tsx` and the `Badge` and `Button` shadcn/ui primitives declared for it.

## Quick start

The installed file exports `education86Demo` alongside the block: the exact props behind the preview above. Spread it to get a working social grid in one line.

```tsx
import { Education86, education86Demo } from "@/components/beste/block/education86";

export default function Page() {
  return <Education86 {...education86Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Education86 } from "@/components/beste/block/education86";

export default function Page() {
  return (
    <Education86
      badge={{ label: "Connect", variant: "outline" }}
      heading="Follow Us on Social Media"
      description="Stay updated with campus news, events, and student life."
      socialLinks={[
        { platform: "Instagram", handle: "@universitylife", url: "https://instagram.com/universitylife", followers: "125K" },
        { platform: "LinkedIn", handle: "University", url: "https://linkedin.com/company/university", followers: "245K" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional pill badge above the heading |
| `heading` | `string` | – | Section heading (required, unlike most section components) |
| `description` | `string` | – | Supporting text under the heading |
| `socialLinks` | `SocialLink[]` | `[]` | Platform cards rendered in a two-column grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type SocialLink = {
  platform: string;
  handle: string;
  url: string;
  followers?: string;
};
```

## Behavior notes

- `heading` is a required prop (no `?` in the interface) and is rendered unconditionally with no `heading &&` guard, unlike most section components where the header block only shows up if content is present.
- Each social card is one clickable `Link` wrapping platform name, handle, and follower count together, not just an icon or a "visit" sub-link.
- `followers` is an arbitrary string (e.g. `"125K"`), not a number: the block does no formatting or aggregation, it echoes whatever is passed in.
- The `socialLinks` grid is the only conditionally rendered part of the block (`socialLinks.length > 0`); the badge/heading/description block above it always renders.
- The `.meta.ts` declares `button` as a `registryDependencies` entry and `lucide-react` as an npm dependency, but the component only ever renders `Badge` and `Link` and never imports a Lucide icon, so both installs go unused by this block on its own.
