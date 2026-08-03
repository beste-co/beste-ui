# About69: Mission Band With Principles

Company story section that runs a two-column heading over a wide photo band, then sets the founding principles as numbered hairline columns underneath, each one a short title and the reasoning behind it.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/about69"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/about69"
```

This installs the block to `components/beste/block/about69.tsx` plus the `badge23` component it uses for the eyebrow.

## Quick start

The installed file exports `about69Demo` alongside the block: the exact props behind the preview above. Spread it to get a working about section in one line.

```tsx
import { About69, about69Demo } from "@/components/beste/block/about69";

export default function AboutPage() {
  return <About69 {...about69Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { About69 } from "@/components/beste/block/about69";

export default function AboutPage() {
  return (
    <About69
      badge={{ label: "About" }}
      heading="Software for people who cannot afford a bad Tuesday"
      description="We started after a decade of watching good teams run on the wrong tools."
      image={{ src: "/images/team.jpg", alt: "The team around a laptop" }}
      items={[
        {
          title: "We sit behind the desk first",
          description: "Nothing ships until someone has watched it used on a busy morning.",
        },
        {
          title: "The record belongs to the practice",
          description: "Export everything, any time, in an open format.",
        },
        {
          title: "Quiet beats clever",
          description: "A feature that needs explaining is a feature that failed.",
        },
      ]}
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
| `image` | `{ src: string; alt: string }` | – | Wide photo band between the heading and the principles |
| `items` | `Principle[]` | `[]` | Principle columns under the photo |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Principle = { title: string; description: string };
```

## Behavior notes

- The numbers are positional, printed as `String(index + 1).padStart(2, "0")`, so principles read `01`, `02`, `03` and reordering the array renumbers them without touching the copy.
- The grid is `md:grid-cols-3`, so the layout is built for three principles. A fourth wraps onto a row of its own rather than reflowing into a four-up.
- The photo band is a fixed-height crop (`h-72`, `md:h-96`) inside the container rather than a full-bleed strip, so it stays aligned with the text margins above and below it.
- The image sits absolutely inside a `relative` wrapper with `object-cover`, which is what keeps a wide photo filling the band at any viewport instead of letterboxing.
- Each principle title is set in the editorial light face rather than a heavier UI weight, which is what stops the three columns reading like a feature grid.
- Nothing here is client-interactive, and the block is copy plus one image, so it renders identically on the server.
