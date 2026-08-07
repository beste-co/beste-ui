# Education102: Lesson Check Quiz

An end-of-lesson knowledge check: a two-column header, a three-figure strip for questions, pass mark and attempts, a graded quiz, and a list of readings for whatever went wrong.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/education102"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/education102"
```

That installs the block file, the `badge23` eyebrow and `button21` action button it is built from, and the `questionnaire` primitive. The quiz, the grading, and the review all live in the block file itself, so there is nothing else to wire up.

## Quick start

```tsx
import { Education102, education102Demo } from "@/components/beste/block/education102";

export default function Page() {
  return <Education102 {...education102Demo} />;
}
```

```tsx
import { Education102 } from "@/components/beste/block/education102";

export default function Page() {
  return (
    <Education102
      badge={{ label: "Module 3" }}
      heading="Check what stuck before you move on"
      description="You see the right answer and the reason for it as soon as you finish."
      stats={[
        { title: "Questions", value: "5" },
        { title: "To pass", value: "60%" },
        { title: "Attempts", value: "No limit" },
      ]}
      quizHeading="Lesson 3 check"
      shortcuts="letters"
      passingScore={60}
      labels={{ submit: "Finish quiz", passed: "Passed. Lesson 4 is unlocked." }}
      questions={[
        {
          name: "label",
          title: "What gives a text input its accessible name?",
          answer: "label",
          explanation: "Only a label element is exposed as the field's name.",
          choices: [
            { value: "label", label: "A label pointing at the input's id" },
            { value: "placeholder", label: "The placeholder attribute" },
          ],
        },
        {
          name: "grouping",
          title: "Which of these belong around a set of radio buttons?",
          answer: ["fieldset", "legend"],
          choices: [
            { value: "fieldset", label: "A fieldset element" },
            { value: "legend", label: "A legend element" },
            { value: "table", label: "A table element" },
          ],
        },
      ]}
      resourcesTitle="If a question caught you out"
      resources={[
        {
          title: "Naming form controls",
          description: "Labels, legends, and the three things that are not a name.",
          href: "https://beste.co",
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `badge` | `Badge` | – | Eyebrow above the rule, rendered with `Badge23`. |
| `heading` | `string` | – | Section heading. |
| `description` | `string` | – | Section description under the heading. |
| `stats` | `StatItem[]` | `[]` | The three-figure strip between the header and the quiz, each figure under its own hairline. |
| `quizHeading` | `string` | – | Heading above the quiz. |
| `quizDescription` | `string` | – | Description under that heading. |
| `questions` | `QuizQuestion[]` | `[]` | The questions and their answer keys. |
| `shortcuts` | `"letters" \| "numbers"` | – | Prints a shortcut on every choice of the active question. |
| `passingScore` | `number` | – | Percent needed to pass. Omit to grade without a pass or fail line. |
| `showAnswerKey` | `boolean` | `true` | Prints the right answer and the explanation in the review. |
| `labels` | `QuizLabels` | `{}` | Overrides for the navigation, score, and review copy. |
| `resourcesTitle` | `string` | – | Heading above the readings list. |
| `resources` | `ResourceLink[]` | `[]` | Hairline rows of follow-up reading below the quiz. |
| `className` | `string` | – | Merged onto the section element. |

```ts
type Badge = { label: string };

type StatItem = { title: string; value: string };
type ResourceLink = { title: string; description: string; href: string };

type QuizQuestion = {
  name: string;
  title: string;
  description?: string;
  choices?: QuizChoice[];
  answer: string | string[];
  explanation?: string;
};

type QuizChoice = { value: string; label: string; description?: string };

type QuizLabels = {
  previous?: string;
  next?: string;
  submit?: string;
  retry?: string;
  scoreTitle?: string;
  passed?: string;
  failed?: string;
  yourAnswer?: string;
  correctAnswer?: string;
  noAnswer?: string;
};
```

## Behavior notes

- The shape of `answer` decides the shape of the question. A string renders radios and one of them has to match; an array renders checkboxes and the whole set has to match, in any order.
- Every question is required, so there is no Skip and Next stays blocked until the question on screen has an answer.
- Submitting replaces the quiz with the score, a progress bar, and a per-question review that marks each answer, prints the correct one when it was wrong, and shows the question's `explanation` underneath.
- The pass or fail line only appears when `passingScore` is set. Without it the quiz still scores, it just does not judge.
- Try again clears the score and remounts the flow from the first question with nothing filled in, so the attempt count in the stats strip is a claim the block makes, not a limit it enforces.
- The quiz sits directly on the page rather than inside a bordered panel. One question is on screen at a time, so a box around it is mostly empty; the bordered choices, the hairline figures above, and the ruled review below carry the structure instead.
- The readings list is plain links, so the section is still useful to somebody who reaches it with JavaScript disabled and cannot take the quiz.
