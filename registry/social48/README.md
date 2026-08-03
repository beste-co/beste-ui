# Social48: Community Channels

A community section listing four linked places to join as full-width hairline rows, each with an icon tile, a description, a light membership figure and an arrow that shifts on hover.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/social48"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/social48"
```

This installs the block to `components/beste/block/social48.tsx` plus the `badge23` component it uses for the eyebrow.

## Quick start

The installed file exports `social48Demo` alongside the block: the exact props behind the preview above. Spread it to get a working section in one line.

```tsx
import { Social48, social48Demo } from "@/components/beste/block/social48";

export default function CommunityPage() {
  return <Social48 {...social48Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { BookOpen, MessagesSquare } from "lucide-react";
import { Social48 } from "@/components/beste/block/social48";

export default function CommunityPage() {
  return (
    <Social48
      badge={{ label: "Where people talk" }}
      heading="The rooms our users are already in"
      description="None of these are marketing lists."
      channels={[
        {
          icon: MessagesSquare,
          name: "The forum",
          description: "Practices swapping rota patterns and insurer quirks.",
          count: "2,140",
          countLabel: "members",
          href: "/community/forum",
        },
        {
          icon: BookOpen,
          name: "The monthly note",
          description: "One letter on the first Tuesday about what shipped and what broke.",
          count: "3,860",
          countLabel: "subscribers",
          href: "/newsletter",
        },
      ]}
      footnote="We read everything and answer in public wherever we can."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Eyebrow above the hairline rule, rendered through `Badge23` |
| `heading` | `string` | – | Section heading in the left column of the header |
| `description` | `string` | – | Supporting paragraph, right-aligned from `md` up |
| `channels` | `Channel[]` | `[]` | Linked places to join, as hairline rows |
| `footnote` | `string` | – | Closing note under the list |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
import type { LucideIcon } from "lucide-react";

type Channel = {
  icon: LucideIcon;
  name: string;
  description: string;
  count: string;
  countLabel: string;
  href: string;
};
```

## Behavior notes

- `count` and `countLabel` are separate so the figure can take the display treatment while its unit stays small. The figure uses `tabular-nums`, so the column aligns down the list.
- Rows are whole `Link` elements in a three-track grid from `md`: name and description, the figure, then the arrow. Below `md` the arrow is hidden entirely, since the row is already obviously tappable.
- The figure block carries `pl-14 md:pl-0` on mobile, which indents it to line up under the description rather than under the icon tile.
- The hover arrow uses a named group, `group/social48`, rather than the bare `group` class, and its shift is wrapped in `motion-safe:`.
- Icons are passed as components, not names. Import the `lucide-react` icon and hand it over; the block renders it at `size-5` in a `size-10` tinted tile marked `aria-hidden`.
- Rows carry `md:px-4` alongside the hover fill, so the highlight extends slightly past the text on wider screens.
- Rows use `border-t` with no closing rule, so the list flows into the footnote rather than boxing itself off.
