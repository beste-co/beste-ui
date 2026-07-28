# Auth13: Centered Sign Up Card

Single-column registration screen centered in the viewport: a two-up row of social provider buttons above a divider, then dynamic name/email/password fields (with a show/hide toggle on the password), a terms checkbox, and a submit button, all inside one bordered card with a sign-in prompt underneath.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/auth13"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/auth13"
```

This installs the block to `components/beste/block/auth13.tsx` and the `button`, `input`, `field`, and `checkbox` shadcn/ui primitives it's built on.

## Quick start

The installed file exports `auth13Demo` alongside the block: the exact props behind the preview above. Spread it to get a working sign-up screen in one line.

```tsx
import { Auth13, auth13Demo } from "@/components/beste/block/auth13";

export default function SignUpPage() {
  return <Auth13 {...auth13Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Auth13 } from "@/components/beste/block/auth13";

export default function SignUpPage() {
  return (
    <Auth13
      heading="Create your account"
      description="Start building for free. No credit card required."
      fields={[
        { label: "Full name", placeholder: "Jane Cooper", type: "text" },
        { label: "Email", placeholder: "you@example.com", type: "email" },
        { label: "Password", placeholder: "Create a password", type: "password" },
      ]}
      signinPrompt={{ text: "Already have an account?", linkLabel: "Sign in", href: "/sign-in" }}
      labels={{ submit: "Create account" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Card title |
| `description` | `string` | – | Subtext below the heading |
| `socialProviders` | `SocialProvider[]` | `[]` | Two-column button row above the divider |
| `fields` | `AuthField[]` | `[]` | Text inputs rendered in order, each with its own label/placeholder/type |
| `labels` | `object` | `{}` | Divider, terms, submit, and toggle copy, see below |
| `signinPrompt` | `{ text: string; linkLabel: string; href: string }` | – | Line below the card, hidden entirely when not set |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type SocialProvider = { label: string; icon: React.ReactNode; href?: string };
type AuthField = { label: string; placeholder: string; type?: string };

type Auth13Labels = {
  divider?: string;
  terms?: string;
  submit?: string;
  passwordToggle?: string;
};
```

## Behavior notes

- This is the single-column counterpart to `Auth2`: same field-driven form and terms checkbox, but without the showcase image column or `mediaPosition` prop, so it works as a standalone centered card.
- Form fields are data-driven: each entry in `fields` renders a plain text `Input` unless its `type` is `"password"`, in which case it gets the relative-positioned show/hide toggle button and a controlled `type` switch between `password`/`text`.
- The `<form>` only calls `e.preventDefault()` on submit; there is no `onSubmit` prop and no network wiring, so nothing is actually submitted until the integrator adds a handler.
- `labels.terms` is injected as raw HTML into the checkbox's `FieldLabel` via `dangerouslySetInnerHTML`, so the terms/privacy links live inside that one string rather than as separate props.
- Social provider buttons render in a `grid-cols-2` row as `asChild` links (`next/link`), not real OAuth triggers; each is just a styled anchor to `provider.href`.

<Callout type="info" title="Wiring the form up">
This block ships the form markup only; state, validation, and submit are yours to add. Our guide wires the shadcn `Field` primitives to [React Hook Form, TanStack Form, and Formisch](/blog/shadcn-forms-react-hook-form-tanstack-formisch) on one field system.
</Callout>
