# Gallery25: Pick The Frames Taste Profile

A gallery finder whose questions are photographs rather than sentences. Three rows of frames are chosen by eye, and the result names the leading way of looking, shows the series that goes with it, and breaks the picks down as a share bar.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/gallery25"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/gallery25"
```

That installs the block file, the `badge7` eyebrow and `button12` pill it is built from, and the `questionnaire` primitive.

## Quick start

```tsx
import { Gallery25, gallery25Demo } from "@/components/beste/block/gallery25";

export default function Page() {
  return <Gallery25 {...gallery25Demo} />;
}
```

```tsx
import { Gallery25 } from "@/components/beste/block/gallery25";

export default function Page() {
  return (
    <Gallery25
      badge={{ label: "What do you actually like" }}
      heading="Choose pictures, not adjectives."
      description="Pick the frames you would hang and we will tell you what you have been choosing."
      questions={[
        {
          name: "one",
          title: "Which of these would you hang?",
          choices: [
            {
              value: "a",
              label: "Empty foreground, long light",
              // which style this frame counts towards
              style: "quiet",
              image: {
                src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
                alt: "Frame from the quiet selection",
              },
            },
            {
              value: "b",
              label: "Somebody caught mid-sentence",
              style: "documentary",
              image: {
                src: "https://images.unsplash.com/photo-1519741497674-611481863552",
                alt: "Frame from the documentary selection",
              },
            },
          ],
        },
      ]}
      styles={[
        {
          key: "quiet",
          title: "The quiet eye",
          description: "You keep choosing frames where very little is happening.",
          strip: [
            {
              src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
              alt: "Print from the quiet series",
            },
          ],
          button: { label: "See the quiet series", href: "https://beste.co" },
        },
        {
          key: "documentary",
          title: "The documentary eye",
          description: "You pick the frames with somebody in them.",
          button: { label: "See the documentary series", href: "https://beste.co" },
        },
      ]}
      labels={{ submit: "Read my picks", leadLabel: "of your picks" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `badge` | `Badge` | – | Parenthetical eyebrow above the heading, rendered with `Badge7`. |
| `heading` | `string` | – | Section heading. |
| `description` | `string` | – | Lead paragraph, set opposite the heading. |
| `questions` | `PhotoQuestion[]` | `[]` | Rows of frames, in the order they are shown. One pick each. |
| `styles` | `Style[]` | `[]` | Counted from the frames that were picked; the largest share leads. |
| `labels` | `Gallery25Labels` | `{}` | Overrides for the navigation buttons and the result copy. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionButton = { label: string; href: string };
type Frame = { src: string; alt: string };

type PhotoQuestion = {
  name: string;
  title: string;
  description?: string;
  choices?: PhotoChoice[];
};

type PhotoChoice = {
  value: string;
  label: string;
  image: Frame;
  style: string;
};

type Style = {
  key: string;
  title: string;
  description: string;
  strip?: Frame[];
  button?: ActionButton;
};

type Gallery25Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  leadLabel?: string;
  breakdownTitle?: string;
};
```

## Behavior notes

- The choices are the photographs. Each one sits as a print inside a soft `bg-muted` card with the caption underneath, and the card carries no border, so the mount around the picture is the only frame in play.
- Selection is shown by inverting the card rather than by drawing a line around it: the mount goes dark, the caption goes light, and a mark appears in the corner of the frame. That leaves the photograph itself untouched at every stage.
- The whole tile is the target. The choice input covers it, which means a click anywhere on the frame selects it and keyboard focus still lands where it should.
- The result is a distribution, not a winner. Three picks across three styles produce a share bar and a percentage per style, so a split eye reads as split rather than being rounded to one label.
- The leading style supplies the strip of prints shown beside the breakdown, which is why every style worth leading needs a `strip`. Those sit in the same soft mounts as the choices, so the answer is presented the way the question was asked.
- `style` on a frame refers to a `Style.key`. A frame pointing at a key that does not exist is simply never counted, so keep the two in step.
- Shortcuts are left off by default here. A shortcut chip on a photograph reads as a caption, and the tiles are large enough to click without one.
