# Logos12: Hairline Client Wall

Client wall that sets six greyscale logos in a hairline cell grid, each lifting to full colour on hover, with an eyebrow and a short claim on the left, a reach line on the right, and a credit note underneath.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/logos12"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/logos12"
```

This installs the block to `components/beste/block/logos12.tsx` plus the `badge23` component it uses for the eyebrow.

## Quick start

The installed file exports `logos12Demo` alongside the block: the exact props behind the preview above. Spread it to get a working logo wall in one line.

```tsx
import { Logos12, logos12Demo } from "@/components/beste/block/logos12";

export default function Page() {
  return <Logos12 {...logos12Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Logos12 } from "@/components/beste/block/logos12";

export default function Page() {
  return (
    <Logos12
      badge={{ label: "Trusted by" }}
      heading="Groups, clinics, and single rooms, running the same quiet workflow"
      items={[
        { src: "/logos/brightwell.svg", alt: "Brightwell Group" },
        { src: "/logos/northgate.svg", alt: "Northgate Clinics" },
        { src: "/logos/meadowline.svg", alt: "Meadowline Care" },
        { src: "/logos/coastline.svg", alt: "Coastline Health" },
        { src: "/logos/alder.svg", alt: "Alder and Finch" },
        { src: "/logos/rowan.svg", alt: "Rowan Practice" },
      ]}
      stat="240 practices, 9 countries, one shared way of working"
      footnote="Names used with permission."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Monospace eyebrow above the claim, rendered via `Badge23` |
| `heading` | `string` | – | Short claim in the left column |
| `items` | `Logo[]` | `[]` | Logo cells, filling the grid in source order |
| `stat` | `string` | – | Reach line, right-aligned from `md` up |
| `footnote` | `string` | – | Credit note under the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Logo = { src: string; alt: string };
```

## Behavior notes

- The grid draws its rules from the cells: every cell carries a right and bottom rule while the container supplies the left and top, so a filled grid closes on all four sides with one hairline everywhere and no doubling.
- That trick assumes full rows. Seven logos in a three-column grid leave the last row's missing cells without their share of the outline, so pass a count that divides by three, or by two at `sm`.
- Logos render greyscale at half opacity and come back to full colour on hover, which keeps a wall of mismatched brand colours from competing with the copy beside it.
- Each logo is capped by height (`h-7`, `md:h-8`) with `w-auto` and `object-contain`, so wordmarks of very different aspect ratios sit optically level without being stretched.
- `alt` carries the company name, so the wall still says who these customers are when images fail or a screen reader is doing the reading.
- The header row aligns on `md:items-end`, which drops the reach line onto the same baseline as the last line of the claim rather than centring it against the block.
