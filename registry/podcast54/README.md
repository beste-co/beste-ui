# Podcast54: Listening Path Builder

An entry point for a back catalogue. Three questions score the listening paths, and the winner is handed over as an ordered run of three episodes with cover art, numbers, and a total runtime added up from the episodes themselves.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/podcast54"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/podcast54"
```

That installs the block file, the `badge6` eyebrow and `button1` seal CTA it is built from, and the `questionnaire` primitive.

## Quick start

```tsx
import { Podcast54, podcast54Demo } from "@/components/beste/block/podcast54";

export default function Page() {
  return <Podcast54 {...podcast54Demo} />;
}
```

```tsx
import { Podcast54 } from "@/components/beste/block/podcast54";

export default function Page() {
  return (
    <Podcast54
      badge={{ label: "Start here" }}
      meta="142 episodes"
      heading="Nobody starts a show at episode one"
      description="Three questions and we hand you an order to listen in."
      shortcuts="numbers"
      image={{
        src: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
        alt: "A condenser microphone in a shock mount with a pop filter",
      }}
      caption="Recorded in one room and published on Tuesdays."
      stats={[
        { title: "Median length", value: "38 min" },
        { title: "Published since", value: "2019" },
      ]}
      questions={[
        {
          name: "reason",
          title: "Why are you here?",
          choices: [
            // what this answer asks a path for
            { value: "craft", label: "I want to get better at the work", traits: ["craft"] },
            { value: "people", label: "I like hearing how people think", traits: ["people"] },
          ],
        },
        {
          name: "time",
          title: "How long is your commute?",
          choices: [
            { value: "short", label: "Under half an hour", traits: ["short"] },
            { value: "long", label: "Long enough for a proper one", traits: ["long"] },
          ],
        },
      ]}
      paths={[
        {
          title: "The one about doing the work",
          summary: "Three episodes on process, in the order that makes the third one land.",
          traits: ["craft", "short"],
          episodes: [
            {
              number: "31",
              title: "The brief nobody reads",
              minutes: 34,
              note: "Why the document everyone signs is never opened again.",
              image: {
                src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc",
                alt: "A dynamic microphone on a boom arm against a dark backdrop",
              },
            },
          ],
          button: { label: "Start with episode 31", href: "https://beste.co" },
        },
      ]}
      labels={{ submit: "Build my path", totalLabel: "Three episodes" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `badge` | `Badge` | – | Eyebrow above the rule, rendered with `Badge6`. |
| `meta` | `string` | – | Short line beside the eyebrow, across the hairline divider. |
| `heading` | `string` | – | Section heading. |
| `description` | `string` | – | Section description under the heading. |
| `questions` | `PathQuestion[]` | `[]` | The questions, in the order they are asked. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active question. |
| `paths` | `Path[]` | `[]` | Scored against the answers; the highest score wins. |
| `image` | `CoverImage` | – | Standing photograph beside the questions. |
| `caption` | `string` | – | Line under the standing photograph. |
| `stats` | `{ title: string; value: string }[]` | `[]` | Two bordered cells under the photograph. |
| `labels` | `Podcast54Labels` | `{}` | Overrides for the buttons, the path heading, and the time units. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionButton = { label: string; href: string };
type CoverImage = { src: string; alt: string };

type PathQuestion = {
  name: string;
  title: string;
  description?: string;
  choices?: PathChoice[];
  multiple?: boolean;
};

type PathChoice = {
  value: string;
  label: string;
  description?: string;
  traits?: string[];
};

type Episode = {
  number: string;
  title: string;
  minutes: number;
  note: string;
  image: CoverImage;
};

type Path = {
  title: string;
  summary: string;
  traits?: string[];
  episodes?: Episode[];
  button?: ActionButton;
};

type Podcast54Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  pathTitle?: string;
  totalLabel?: string;
  episodeLabel?: string;
  hour?: string;
  minute?: string;
};
```

## Behavior notes

- Scoring is one point per trait. Every picked answer contributes its `traits`, and each path scores the number of them it carries, so a path can win on two of three answers rather than having to match all of them.
- Ties go to the first path in the array, which makes the order of `paths` your tie-breaker: put the safest starting point first.
- The result is an order, not a single recommendation. The index chip is the position in the path, while `number` is the episode's own number in the catalogue, so the two never have to agree.
- The runtime is summed from the episodes rather than written by hand, so editing an episode's `minutes` keeps the total honest. It is formatted without a locale API, which would risk a server and client mismatch.
- The whole section swaps: the questions and the standing photograph give way to the rail. Answer again brings both back with nothing filled in.
- The questions sit directly on the page rather than inside a bordered panel. One question is on screen at a time, so a box around it is mostly empty; the bordered choices and the photograph beside them carry the structure instead.
- Three episodes is a layout decision, not a limit. A path with four renders four cards, though the grid reads best at three.
