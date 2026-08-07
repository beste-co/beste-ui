# Ecommerce46: Product Finder Quiz

A finder that replaces a filter sidebar. Three questions score every product against the traits the answers ask for, and the winner takes over the plate beside them with its photograph, its price, and the reasons it came out on top.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/ecommerce46"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/ecommerce46"
```

That installs the block file, the `badge7` eyebrow and `button12` pill it is built from, and the `questionnaire` primitive.

## Quick start

```tsx
import { Ecommerce46, ecommerce46Demo } from "@/components/beste/block/ecommerce46";

export default function Page() {
  return <Ecommerce46 {...ecommerce46Demo} />;
}
```

```tsx
import { Ecommerce46 } from "@/components/beste/block/ecommerce46";

export default function Page() {
  return (
    <Ecommerce46
      badge={{ label: "Find your bag" }}
      heading="Three questions, one bag"
      description="Tell us how you travel and we will name one bag."
      shortcuts="numbers"
      labels={{ submit: "See my match", resultTitle: "Your match" }}
      questions={[
        {
          name: "trip",
          title: "How long are you usually away?",
          choices: [
            {
              value: "day",
              label: "Out and back in a day",
              // what this answer asks a product for
              traits: ["compact", "laptop"],
              // printed in the reasons list when the winner has one of them
              reason: "Sized for a day out rather than a week away",
            },
            {
              value: "week",
              label: "A week or more",
              traits: ["large", "expandable"],
              reason: "Deep main compartment for a week of packing",
            },
          ],
        },
        {
          name: "needs",
          title: "Anything it has to survive?",
          multiple: true,
          choices: [
            {
              value: "rain",
              label: "Rain, regularly",
              traits: ["waterproof"],
              reason: "Coated shell and covered zips for wet platforms",
            },
          ],
        },
      ]}
      products={[
        {
          name: "Halden 18 Daypack",
          price: "$180",
          summary: "Eighteen litres that keep their shape empty.",
          image: {
            src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=900&fit=crop",
            alt: "Charcoal daypack standing upright against a plain wall",
          },
          traits: ["compact", "laptop", "waterproof"],
          button: { label: "See the Halden 18", href: "https://beste.co" },
        },
      ]}
      image={{
        src: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa",
        alt: "A black backpack held up by its handle against a plain background",
      }}
      caption="Twelve bags in the range. Only one of them is the answer."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `badge` | `Badge` | – | Parenthetical eyebrow above the heading, rendered with `Badge7`. |
| `heading` | `string` | – | Section heading. |
| `description` | `string` | – | Section description under the heading. |
| `questions` | `FinderQuestion[]` | `[]` | The questions, in the order they are asked. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active question. |
| `products` | `Product[]` | `[]` | Scored against the answers; the highest score wins. |
| `labels` | `Ecommerce46Labels` | `{}` | Overrides for the navigation buttons and the result copy. |
| `image` | `ProductImage` | – | Plate shown beside the questions until a product wins. |
| `caption` | `string` | – | Line under the standing plate. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionButton = { label: string; href: string };
type ProductImage = { src: string; alt: string };

type FinderQuestion = {
  name: string;
  title: string;
  description?: string;
  choices?: FinderChoice[];
  multiple?: boolean;
};

type FinderChoice = {
  value: string;
  label: string;
  description?: string;
  traits?: string[];
  reason?: string;
};

type Product = {
  name: string;
  price: string;
  summary: string;
  image: ProductImage;
  traits?: string[];
  button: ActionButton;
};

type Ecommerce46Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  resultTitle?: string;
  reasonsTitle?: string;
};
```

## Behavior notes

- Scoring is one point per trait. Every picked answer contributes its `traits`, and each product scores the number of them it carries, so a product does not have to satisfy everything to win.
- Ties go to the first product in the array, which makes the order of `products` your tie-breaker: put the safest recommendation first.
- The reasons list is not written by hand. It collects the `reason` of every answer the winning product actually satisfies, so the same product explains itself differently depending on how it was reached.
- A question with `multiple: true` renders checkboxes and is optional, so it can be passed with Next. The single-answer questions are required.
- Submitting swaps the standing plate for the winning product's own photograph and the questions for the result, so the picture and the answer change together. Answer again clears both.
- Give every product a full set of `traits` even when it overlaps heavily with another, otherwise a bag that is genuinely fine for a trip scores zero and never surfaces.
- Keep the standing `image` off the products. Showing one of them before a question is answered reads as the recommendation already being made.
