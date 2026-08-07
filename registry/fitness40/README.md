# Fitness40: Honest Programme Match

A programme finder that argues with you. Three questions land on one training block, and the card overlapping the photographic band answers in two columns, who it is for beside who should not take it, before the practical facts.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/fitness40"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/fitness40"
```

That installs the block file, the `badge23` eyebrow and `button21` action button it is built from, and the `questionnaire` primitive.

## Quick start

```tsx
import { Fitness40, fitness40Demo } from "@/components/beste/block/fitness40";

export default function Page() {
  return <Fitness40 {...fitness40Demo} />;
}
```

```tsx
import { Fitness40 } from "@/components/beste/block/fitness40";

export default function Page() {
  return (
    <Fitness40
      badge={{ label: "Find your programme" }}
      heading="Three questions, and one of them we will talk you out of"
      description="Every programme here says who it is not for."
      shortcuts="numbers"
      image={{
        src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        alt: "Empty gym floor in morning light",
      }}
      caption="One room, four coaches, and nobody filming themselves."
      questions={[
        {
          name: "now",
          title: "Where are you starting from?",
          choices: [
            { value: "none", label: "Nothing for a year or more" },
            { value: "regular", label: "Already training weekly" },
          ],
        },
        {
          name: "goal",
          title: "What would make this worth doing?",
          choices: [
            { value: "strength", label: "Being stronger than I am" },
            { value: "stamina", label: "Not being out of breath" },
          ],
        },
      ]}
      programmes={[
        {
          // checked before the looser ones below it
          match: { now: "none" },
          title: "Return, eight weeks",
          summary: "Two supervised sessions a week, deliberately easier than you want them to be.",
          image: {
            src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
            alt: "Coach setting up equipment in a quiet gym",
          },
          caption: "Return groups are capped at six.",
          suits: ["You have not trained in a year", "Two mornings is what you can protect"],
          avoid: ["You are chasing a number by a fixed date", "You already train weekly"],
          facts: [
            { label: "Sessions", value: "Two a week, 50 minutes" },
            { label: "Group size", value: "Six people" },
          ],
          button: { label: "See the eight week plan", href: "https://beste.co" },
        },
        {
          // no match: the catch-all, and it has to be last
          title: "General, two mornings",
          summary: "Mixed sessions, no target, and the only measure is whether you keep coming.",
          suits: ["You want to train without signing up to a goal"],
          avoid: ["You have a date and a number in mind"],
          button: { label: "See what a week looks like", href: "https://beste.co" },
        },
      ]}
      labels={{ suitsTitle: "Take this if", avoidTitle: "Do not take this if" }}
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
| `image` | `BandImage` | – | Standing band behind the card, shown until a programme is matched. |
| `caption` | `string` | – | Centred line under the card. |
| `questions` | `IntakeQuestion[]` | `[]` | The questions, in the order they are asked. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active question. |
| `programmes` | `Programme[]` | `[]` | Checked in order; the first one whose `match` fits wins. |
| `labels` | `Fitness40Labels` | `{}` | Overrides for the buttons and the three panel headings. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionLink = { label: string; href: string };
type BandImage = { src: string; alt: string };
type Fact = { label: string; value: string };

type IntakeQuestion = {
  name: string;
  title: string;
  description?: string;
  choices?: IntakeChoice[];
};

type IntakeChoice = { value: string; label: string; description?: string };

type Programme = {
  match?: Record<string, string>;
  title: string;
  summary: string;
  image?: BandImage;
  caption?: string;
  suits?: string[];
  avoid?: string[];
  facts?: Fact[];
  button?: ActionLink;
};

type Fitness40Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  matchTitle?: string;
  suitsTitle?: string;
  avoidTitle?: string;
};
```

## Behavior notes

- The result is deliberately two-sided. `suits` and `avoid` are given equal width, and the block reads as a recommendation only when both are written honestly. A programme with an empty `avoid` list looks like a sales page.
- A programme's `match` maps a question's `name` to the value it needs, and every pair has to fit. A starting-point rule belongs above a goal rule, because where somebody is starting from overrules what they want.
- The last programme stands in when nothing fits, so a submit never dead-ends. The unglamorous option is the right catch-all here.
- The card overlaps the band by design. The band is the only full-width element, and the card sits on it so the section reads as one object rather than a photograph with a form under it.
- A programme without its own `image` keeps the standing band, which suits the catch-all and anything without a picture worth showing.
- Every question is required, so the recommendation is never made from a partial answer.
