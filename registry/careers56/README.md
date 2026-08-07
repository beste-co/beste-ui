# Careers56: Role Fit Finder

A hiring section that asks three questions instead of listing a job board. The answers land on one open role with its team, its location, and its published pay band, and the photograph beside it changes to the part of the studio that role sits in.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/careers56"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/careers56"
```

That installs the block file, the `badge6` eyebrow and `button1` seal CTA it is built from, and the `questionnaire` primitive.

## Quick start

```tsx
import { Careers56, careers56Demo } from "@/components/beste/block/careers56";

export default function Page() {
  return <Careers56 {...careers56Demo} />;
}
```

```tsx
import { Careers56 } from "@/components/beste/block/careers56";

export default function Page() {
  return (
    <Careers56
      badge={{ label: "Careers" }}
      meta="Six open roles"
      heading="Skip the job board and answer three questions"
      description="Every open role here wants a different kind of week."
      shortcuts="numbers"
      image={{
        src: "https://images.unsplash.com/photo-1594100165806-939c3fbb5b6a",
        alt: "Studio wall covered in pinned work in progress",
      }}
      caption="Twenty-two people, one floor, and a wall that is never empty."
      stats={[
        { title: "Median reply", value: "3 days" },
        { title: "Interview rounds", value: "Two" },
      ]}
      questions={[
        {
          name: "craft",
          title: "What do you want to spend the day doing?",
          choices: [
            { value: "build", label: "Building the thing" },
            { value: "design", label: "Deciding how it looks" },
          ],
        },
        {
          name: "experience",
          title: "How long have you been at it?",
          choices: [
            { value: "mid", label: "Three to six years" },
            { value: "senior", label: "Seven or more" },
          ],
        },
      ]}
      roles={[
        {
          // both answers have to fit, so this sits above the looser role
          match: { craft: "build", experience: "senior" },
          title: "Engineering lead",
          summary: "You set how the work is built and you still write a good share of it.",
          facts: [
            { title: "Team", value: "Engineering, 4 people" },
            { title: "Band", value: "£82,000 to £95,000" },
          ],
          image: {
            src: "https://images.unsplash.com/photo-1754390754756-16ee0e29cf36",
            alt: "Desk with a laptop, notes, and printed schedules",
          },
          caption: "The engineering corner.",
          button: { label: "Read the full role", href: "https://beste.co" },
        },
        {
          // no match: the catch-all, and it has to be last
          title: "Open application",
          summary: "Nothing on the list matched, which happens.",
          button: { label: "Write to us", href: "https://beste.co" },
        },
      ]}
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
| `questions` | `FitQuestion[]` | `[]` | The questions, in the order they are asked. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active question. |
| `roles` | `Role[]` | `[]` | Checked in order; the first one whose `match` fits wins. |
| `image` | `RoleImage` | – | Standing photograph, shown until a role is matched. |
| `caption` | `string` | – | Line under the standing photograph. |
| `stats` | `Fact[]` | `[]` | Two bordered cells under the photograph. |
| `labels` | `Careers56Labels` | `{}` | Overrides for the navigation buttons and the match heading. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionButton = { label: string; href: string };
type RoleImage = { src: string; alt: string };
type Fact = { title: string; value: string };

type FitQuestion = {
  name: string;
  title: string;
  description?: string;
  choices?: FitChoice[];
};

type FitChoice = { value: string; label: string; description?: string };

type Role = {
  match?: Record<string, string>;
  title: string;
  summary: string;
  facts?: Fact[];
  image?: RoleImage;
  caption?: string;
  button?: ActionButton;
};

type Careers56Labels = {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  matchTitle?: string;
};
```

## Behavior notes

- A role's `match` maps a question's `name` to the value it needs, and every pair has to fit. That is what lets a senior variant of the same craft sit above the general one, as long as it comes first in the array.
- The last role stands in when nothing matches, so a submit never dead-ends. An open application is the honest catch-all here.
- A role without its own `image` keeps the standing photograph, which is the right behaviour for the catch-all and for any role that has no separate picture worth showing.
- Every question is required, so Find my role stays out of reach until all three have an answer.
- The questions sit directly on the page rather than inside a bordered panel. One question is on screen at a time, so a box around it is mostly empty; the bordered choices and the filled fact cells carry the structure instead.
- The pay band lives in `facts` alongside the team and the location, so the block reads as a published band rather than a range you have to ask for.
- Answer again clears the match and remounts the questions, and the column falls back to the standing photograph and its caption.
