# Onboarding43: Guided Workspace Setup

A two-column setup section. The left column explains what each answer changes, and the right column is a one-question-at-a-time wizard that replaces itself with a review of everything it is about to create.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/onboarding43"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/onboarding43"
```

That installs the block file, the `badge7` eyebrow and `button12` pill it is built from, and the `questionnaire` primitive. The flow, the progress bar, and the review panel all live in the block file itself, so there is nothing else to wire up.

## Quick start

```tsx
import { Onboarding43, onboarding43Demo } from "@/components/beste/block/onboarding43";

export default function Page() {
  return <Onboarding43 {...onboarding43Demo} />;
}
```

```tsx
import { Onboarding43 } from "@/components/beste/block/onboarding43";

export default function Page() {
  return (
    <Onboarding43
      badge={{ label: "Setup" }}
      heading="Four questions, then your workspace is ready"
      description="Every answer maps to a setting you can change later."
      points={[
        {
          title: "One question at a time",
          description: "The whole form is one field wide.",
        },
        {
          title: "Answers become settings",
          description: "Your role picks the home screen you land on.",
        },
      ]}
      note="Takes about a minute."
      button={{ label: "See what each answer changes", href: "https://beste.co" }}
      wizardHeading="Set up your workspace"
      shortcuts="numbers"
      labels={{ submit: "Create workspace" }}
      summary={{ title: "Workspace ready", emptyLabel: "Skipped" }}
      steps={[
        {
          name: "role",
          title: "What do you do most days?",
          required: true,
          choices: [
            { value: "engineering", label: "Engineering", description: "Ship, review, and deploy." },
            { value: "design", label: "Design" },
          ],
        },
        {
          name: "tools",
          title: "What should we connect first?",
          multiple: true,
          choices: [
            { value: "github", label: "GitHub" },
            { value: "slack", label: "Slack" },
          ],
        },
      ]}
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
| `points` | `SetupPoint[]` | `[]` | Ruled three-up row under both columns. |
| `note` | `string` | – | Muted line below the rule at the foot of the left column. |
| `button` | `ActionButton` | – | `Button12` pill under the note. |
| `wizardHeading` | `string` | – | Heading above the wizard, in the right column. |
| `wizardDescription` | `string` | – | Description under that heading. |
| `steps` | `WizardStep[]` | `[]` | The questions, in the order they are asked. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active step. |
| `showProgress` | `boolean` | `true` | The bar and the "Question n of m" line above the active step. |
| `labels` | `WizardLabels` | `{}` | Overrides for the navigation and review buttons. |
| `summary` | `WizardSummary` | `{}` | Copy for the panel that replaces the flow on submit. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };
type ActionButton = { label: string; href: string };

type SetupPoint = { title: string; description: string };

type WizardStep = {
  name: string;
  title: string;
  description?: string;
  choices?: WizardChoice[];
  input?: { label: string; placeholder?: string };
  required?: boolean;
  multiple?: boolean;
};

type WizardChoice = { value: string; label: string; description?: string };

type WizardLabels = {
  previous?: string;
  skip?: string;
  next?: string;
  submit?: string;
  restart?: string;
};

type WizardSummary = {
  title?: string;
  description?: string;
  emptyLabel?: string;
};
```

## Behavior notes

- Only one step is on screen at a time. The others stay in the form but are hidden and inert, so the answers already given are still submitted with the rest.
- `required: true` blocks Next and hides Skip until the step is answered. A step without it can be passed over, and the review panel prints `summary.emptyLabel` in its place.
- A step with `multiple: true` renders checkboxes instead of radios, and a step with `input` renders a text field under the fixed choices that writes to the same field name.
- Submitting swaps the whole wizard for a review list of question and answer pairs plus a Start over button, which remounts the flow from the first step with nothing filled in.
- Setting `shortcuts` prints a key on each choice and binds it while that step is active, so the same key means something else one question later.
- The left column and the wizard sit side by side from the `lg` breakpoint and stack below it, with the wizard second in source order so it lands under the copy on a phone.
- The points are a row under both columns rather than a stack beside the wizard. Only one question is on screen at a time, so stacking them in the copy column made that side run to roughly twice the height of the form.
