# Travel42: Narrowing Destination Shortlist

A destination finder that eliminates in the open. A grid of six photographs sits beside the questions and dims the places each answer rules out, with a live count under it, before the survivors are listed with their notes and links.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/travel42"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/travel42"
```

That installs the block file, the `badge23` eyebrow and `button21` action button it is built from, and the `questionnaire` primitive.

## Quick start

```tsx
import { Travel42, travel42Demo } from "@/components/beste/block/travel42";

export default function Page() {
  return <Travel42 {...travel42Demo} />;
}
```

```tsx
import { Travel42 } from "@/components/beste/block/travel42";

export default function Page() {
  return (
    <Travel42
      badge={{ label: "Where to" }}
      heading="Watch the list get shorter as you answer"
      description="Every answer strikes the ones that no longer apply."
      shortcuts="numbers"
      questions={[
        {
          name: "pace",
          title: "What is the trip for?",
          choices: [
            // a destination survives this answer when it carries one of these tags
            { value: "quiet", label: "Doing very little", keeps: ["quiet"] },
            { value: "outdoors", label: "Being outside all day", keeps: ["outdoors"] },
          ],
        },
        {
          name: "length",
          title: "How long have you got?",
          choices: [
            { value: "short", label: "A long weekend", keeps: ["short"] },
            { value: "long", label: "A week or more", keeps: ["long"] },
          ],
        },
      ]}
      destinations={[
        {
          name: "Yosemite Valley",
          note: "Granite walls, a river underneath them, and more trail than a week can cover.",
          tags: ["outdoors", "long", "winter"],
          image: {
            src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            alt: "A river running through a valley between granite cliffs at dawn",
          },
          link: { label: "See the Yosemite week", href: "https://beste.co" },
        },
        {
          name: "Lago di Braies",
          note: "A rowing boat, a shoreline path, and nothing else asked of you.",
          tags: ["quiet", "short", "summer"],
          image: {
            src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            alt: "Rowing boats on a green lake below limestone peaks",
          },
          link: { label: "See the Braies weekend", href: "https://beste.co" },
        },
      ]}
      labels={{ submit: "Keep what is left", countSuffix: "still fit" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `badge` | `Badge` | – | Eyebrow above the rule, rendered with `Badge23`. |
| `heading` | `string` | – | Section heading. |
| `description` | `string` | – | Lead paragraph, set opposite the heading. |
| `questions` | `FilterQuestion[]` | `[]` | The questions, in the order they are asked. Single answer each. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active question. |
| `destinations` | `Destination[]` | `[]` | The grid that narrows as the questions are answered. |
| `labels` | `Travel42Labels` | `{}` | Overrides for the navigation buttons, the count, and the empty state. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionLink = { label: string; href: string };
type DestinationImage = { src: string; alt: string };

type FilterQuestion = {
  name: string;
  title: string;
  description?: string;
  choices?: FilterChoice[];
};

type FilterChoice = {
  value: string;
  label: string;
  description?: string;
  keeps?: string[];
};

type Destination = {
  name: string;
  note: string;
  image: DestinationImage;
  tags?: string[];
  link?: ActionLink;
};

type Travel42Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  countSuffix?: string;
  shortlistTitle?: string;
  emptyTitle?: string;
  emptyBody?: string;
};
```

## Behavior notes

- Filtering happens on the answer, not on the submit. Picking an option immediately dims the destinations it rules out and moves the count, so the cost of each answer is visible while it is still being made.
- A destination survives a question when it carries at least one of the tags in the chosen answer's `keeps`. Questions that have not been answered yet rule nothing out, which is what makes the grid narrow one step at a time instead of all at once.
- Eliminated tiles are dimmed rather than removed. The grid keeps its shape, and the elimination reads as a decision rather than as content disappearing.
- Submitting lists the survivors in full, with their notes and links. It is possible to answer your way down to nothing, so the empty state is written copy rather than a blank panel.
- Give every destination a tag from every dimension. A destination missing a season tag is struck out by the season question no matter which season is picked.
- The questions sit directly on the page rather than inside a bordered panel. One question is on screen at a time, so a box around it is mostly empty; the grid beside it is the surface that matters.
- Start the list again clears the answers and brings the whole grid back to full opacity.
