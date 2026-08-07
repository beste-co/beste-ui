# Product12: Live Made To Order Configurator

A made-to-order configurator that answers as you go. Every option takes over the plate beside it, writes its own line into a running specification, and moves a total that is visible from the first question rather than revealed at the end.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/product12"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/product12"
```

That installs the block file, the `badge7` eyebrow and `button12` pill it is built from, and the `questionnaire` primitive.

## Quick start

```tsx
import { Product12, product12Demo } from "@/components/beste/block/product12";

export default function Page() {
  return <Product12 {...product12Demo} />;
}
```

```tsx
import { Product12 } from "@/components/beste/block/product12";

export default function Page() {
  return (
    <Product12
      badge={{ label: "Made to order" }}
      heading="Specify the chair while you look at it."
      description="Every answer changes the plate and the line it writes."
      shortcuts="numbers"
      basePrice={480}
      currency="£"
      image={{
        src: "https://images.unsplash.com/photo-1503602642458-232111445657",
        alt: "Wooden chair standing alone in a bright room",
      }}
      caption="The Aro chair, built in the workshop in batches of twelve."
      steps={[
        {
          name: "frame",
          title: "Which frame?",
          specLabel: "Frame",
          choices: [
            {
              value: "oak",
              label: "Oiled oak",
              spec: "Oiled European oak",
              price: 0,
              // takes over the plate while it is the selected option
              image: {
                src: "https://images.unsplash.com/photo-1503602642458-232111445657",
                alt: "Pale oak chair against a white wall",
              },
              caption: "Oak is the standing frame.",
            },
            {
              value: "steel",
              label: "Waxed steel",
              spec: "Waxed steel, 16mm section",
              price: 140,
            },
          ],
        },
        {
          name: "seat",
          title: "What sits on it?",
          specLabel: "Seat",
          choices: [
            { value: "canvas", label: "Cotton canvas", spec: "16oz cotton canvas", price: 0 },
            { value: "leather", label: "Leather", spec: "Vegetable-tanned, 3mm", price: 180 },
          ],
        },
      ]}
      closing={{
        title: "Specification sent",
        description: "The workshop replies inside three working days.",
      }}
      button={{ label: "Book a workshop visit", href: "https://beste.co" }}
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
| `steps` | `ConfigStep[]` | `[]` | The questions, each writing one row of the specification. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active step. |
| `basePrice` | `number` | `0` | Every chosen option's `price` is added to this. |
| `currency` | `string` | `"$"` | Prefix printed in front of the total. |
| `image` | `ConfigImage` | – | Plate shown before anything has been chosen. |
| `caption` | `string` | – | Line under the standing plate. |
| `closing` | `Closing` | – | Replaces the questions once the specification is sent. |
| `button` | `ActionButton` | – | `Button12` pill under the sent specification. |
| `labels` | `Product12Labels` | `{}` | Overrides for the navigation buttons and the ledger copy. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionButton = { label: string; href: string };
type ConfigImage = { src: string; alt: string };
type Closing = { title: string; description: string };

type ConfigStep = {
  name: string;
  title: string;
  description?: string;
  specLabel: string;
  choices?: ConfigChoice[];
};

type ConfigChoice = {
  value: string;
  label: string;
  description?: string;
  image?: ConfigImage;
  caption?: string;
  spec: string;
  price?: number;
};

type Product12Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  specTitle?: string;
  priceLabel?: string;
  pending?: string;
};
```

## Behavior notes

- The specification is not a summary shown after the fact. It sits under the questions the whole time, filling one row per answered step and printing `labels.pending` for the rows still open, so nothing about the price arrives as a surprise.
- The total is `basePrice` plus the `price` of every chosen option. A negative `price` is allowed, which is how a downgrade reads correctly rather than as a discount bolted on afterwards.
- Only some options need an `image`. The plate follows the last chosen option that carries one, so a frame can change the picture while a finish only changes the line it writes.
- Prices are formatted with a plain thousands separator rather than a locale API, because a locale that differs between server and client is a hydration mismatch waiting to happen.
- Sending swaps the questions for the closing panel while the specification and total stay exactly where they were, so the reader can check the numbers against what they just agreed to.
- Specify another clears both the answers and the plate, back to the standing photograph.
