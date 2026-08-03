# About70: Company History Rows

A company story told as hairline rows keyed by a light year figure, set against a media column that sticks while they scroll and stacks an image tile floating a live growth metric over a captioned photograph.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/about70"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/about70"
```

This installs the block to `components/beste/block/about70.tsx`, the `stats16` growth piece it floats on the tile (installed to `components/beste/piece/stats16.tsx`), and the `badge23` component it uses for the eyebrow.

## Quick start

The installed file exports `about70Demo` alongside the block: the exact props behind the preview above. Spread it to get a working about section in one line.

```tsx
import { About70, about70Demo } from "@/components/beste/block/about70";

export default function AboutPage() {
  return <About70 {...about70Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { About70 } from "@/components/beste/block/about70";
import { Stats16 } from "@/components/beste/piece/stats16";

export default function AboutPage() {
  return (
    <About70
      badge={{ label: "How we got here" }}
      heading="Six years, one problem, and a lot of very long Tuesdays"
      description="We started by sitting behind a reception desk for a fortnight."
      milestones={[
        {
          year: "2020",
          title: "A fortnight behind the desk",
          description: "Ten working days doing the receptionist's job badly, and a list of forty problems.",
          marker: "The beginning",
        },
        {
          year: "2021",
          title: "The first booking anyone else made",
          description: "One clinic, one room, and a scheduler that only avoided double-bookings.",
        },
      ]}
      closing="We are eighteen people, and all of them take support shifts."
      media={
        <Stats16
          label="Appointments booked"
          value="1,284"
          delta="12.4%"
          direction="up"
          caption="every month, across eleven practices"
          bars={[12, 21, 30, 38, 47, 61, 72, 86]}
        />
      }
      image={{ src: "/backdrops/blue.jpg", alt: "Soft blue gradient backdrop" }}
      mediaCaption="One bar for each year on this page."
      photo={{
        image: { src: "/clinic/corridor.jpg", alt: "Two colleagues in a clinic corridor" },
        caption: "Bristol, the fortnight that started it",
      }}
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
| `milestones` | `Milestone[]` | `[]` | History rows, keyed by year |
| `closing` | `string` | – | Paragraph under the last row, outside the hairlines |
| `media` | `ReactNode` | – | Live asset on the sticky tile, `stats16` in the demo |
| `image` | `{ src: string; alt: string }` | – | Backdrop behind the media tile |
| `mediaCaption` | `string` | – | Caption under the media tile |
| `photo` | `Photo` | – | Captioned photograph under the media tile |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type TileImage = {
  src: string;
  alt: string;
};

type Milestone = {
  year: string;
  title: string;
  description: string;
  marker?: string;
};

type Photo = {
  image: TileImage;
  caption: string;
};
```

## Behavior notes

- The media column is `lg:sticky lg:top-24 lg:self-start`. The `self-start` is required: without it the column stretches to the full grid row height and sticky positioning has nothing to travel within.
- `top-24` assumes a fixed header of roughly six rem. Adjust it to match your own navbar, otherwise the tile slides under it.
- Sticky is `lg` and above only. On smaller screens the media column scrolls normally and lands after the milestones, since a sticky tile has nowhere to travel in a single-column layout.
- `marker` is optional per milestone and is meant for the two or three rows worth labelling, for example the first and the most recent. Marking every row removes the emphasis it exists to create.
- The year column is a fixed `7rem` track from `sm` up. Below `sm` the grid collapses and the year stacks above the title.
- Years use `tabular-nums`, so the column stays optically aligned even with different digits.
- The photograph is a real `figure` with a `figcaption`, unlike the media tile above it whose caption is a plain paragraph. The photo is content, the tile is illustration.
- Milestone rows use `border-t` with `last:border-b`, closing the timeline at the bottom, and `closing` sits outside those rules so it reads as an author's note.
