# Careers51: Filterable Open Roles List

Careers section with a monospace eyebrow over a hairline rule and a two-column heading, then a sticky culture photo beside a filterable role list: team pills carrying live counts above hairline rows that pair the job title and team with location, contract type, and a hover arrow.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/careers51"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/careers51"
```

This installs the block to `components/beste/block/careers51.tsx` plus the `badge23` and `button21` components it uses for the eyebrow and the closing action.

## Quick start

The installed file exports `careers51Demo` alongside the block: the exact props behind the preview above. Spread it to get a working careers list in one line.

```tsx
import { Careers51, careers51Demo } from "@/components/beste/block/careers51";

export default function CareersPage() {
  return <Careers51 {...careers51Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Careers51 } from "@/components/beste/block/careers51";

export default function CareersPage() {
  return (
    <Careers51
      badge={{ label: "Careers" }}
      heading="Open roles"
      description="Small teams, long horizons, and work you can point at a year from now."
      allLabel="All roles"
      media={{
        image: { src: "/images/studio.jpg", alt: "The team around a laptop" },
        title: "42 people, 9 countries",
        description: "Four-day summer weeks and a real budget for craft.",
      }}
      items={[
        {
          title: "Senior Product Designer",
          team: "Design",
          location: "Remote, Europe",
          type: "Full-time",
          href: "/careers/senior-product-designer",
        },
        {
          title: "Backend Engineer",
          team: "Engineering",
          location: "Berlin, hybrid",
          type: "Full-time",
          href: "/careers/backend-engineer",
        },
      ]}
      footnote={{
        label: "Nothing here fits?",
        button: { label: "Send an open application", href: "/careers/open" },
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Monospace eyebrow above the hairline rule, rendered via `Badge23` |
| `heading` | `string` | – | Section heading in the left column |
| `description` | `string` | – | Supporting paragraph, right-aligned from `md` up |
| `media` | `Media` | – | Sticky photo column on the left, with an optional caption over a gradient |
| `allLabel` | `string` | – | Label of the first filter pill, the one that clears the team filter |
| `items` | `Role[]` | `[]` | Job rows, and the source of the team filter list |
| `footnote` | `{ label: string; button: ActionLink }` | – | Closing line and outline button under the list |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ActionLink = { label: string; href: string };

type Media = {
  image: { src: string; alt: string };
  title?: string;
  description?: string;
};

type Role = {
  title: string;
  team: string;
  location: string;
  type: string;
  href: string;
};
```

## Behavior notes

- The filter pills are derived from the data, not configured: the block collects `items[].team` through a `Set`, so a team appears exactly once and in first-seen order, and each pill's count is recomputed from `items` on every render.
- Filtering is local `useState` holding the active team string. The empty string is the "everything" state, which is why `allLabel` sits on a pill whose value is `""` and why its count is always `items.length`.
- The media column is `lg:sticky lg:top-24 lg:self-start`, so on desktop the photo stays in place while a long role list scrolls past it; below `lg` it collapses into a `h-64` band above the list, `sm:h-80`.
- The caption block over the photo only renders when `media.title` or `media.description` is set. Without either, the gradient scrim is skipped too and the image shows clean.
- Each row is a `next/link` wrapping the whole row, so the entire strip is the hit target. The arrow's hover nudge and the title's colour change are driven from a single named group (`group/careers51`) on that link.
- Nothing guards an empty result: filtering to a team with no roles renders the hairline container with no rows inside it rather than an empty state.
