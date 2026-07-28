# Auth2: Split-Screen Sign Up

Two-column registration screen: a form column (social providers, dynamic name/email/password fields with a show/hide toggle on the password, a terms checkbox) paired with a full-bleed image column that carries a testimonial quote and author over a dark overlay. The image column can sit on either side via `mediaPosition` and is hidden below the `lg` breakpoint.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/auth2"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/auth2"
```

This installs the block to `components/beste/block/auth2.tsx` and the `button`, `input`, `field`, `checkbox`, and `avatar` shadcn/ui primitives it's built on.

## Quick start

The installed file exports `auth2Demo` alongside the block: the exact props behind the preview above. Spread it to get a working sign-up screen in one line.

```tsx
import { Auth2, auth2Demo } from "@/components/beste/block/auth2";

export default function SignUpPage() {
  return <Auth2 {...auth2Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Auth2 } from "@/components/beste/block/auth2";

export default function SignUpPage() {
  return (
    <Auth2
      heading="Create your account"
      description="Start your 14-day free trial. No credit card required."
      fields={[
        { label: "Full name", placeholder: "Jane Cooper", type: "text" },
        { label: "Email", placeholder: "you@example.com", type: "email" },
        { label: "Password", placeholder: "Create a password", type: "password" },
      ]}
      signinPrompt={{ text: "Already have an account?", linkLabel: "Sign in", href: "/sign-in" }}
      labels={{ submit: "Create account" }}
      showcase={{
        image: { src: "https://images.unsplash.com/photo-1779243829348-85bf26cff23b?w=1200&h=1600&fit=crop", alt: "Team collaborating" },
        quote: "Onboarding took a single afternoon.",
        author: { name: "Maria Santos", title: "Head of Operations" },
      }}
      mediaPosition="right"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Form column title |
| `description` | `string` | – | Subtext below the heading |
| `socialProviders` | `SocialProvider[]` | `[]` | Buttons rendered above the divider |
| `fields` | `AuthField[]` | `[]` | Text inputs rendered in order, each with its own label/placeholder/type |
| `signinPrompt` | `{ text: string; linkLabel: string; href: string }` | – | Line below the form, hidden entirely when not set |
| `labels` | `object` | `{}` | Divider, terms, submit, and toggle copy, see below |
| `showcase` | `object` | – | Image, quote, and author for the right/left column; column omitted entirely when not set |
| `mediaPosition` | `"left" \| "right"` | `"right"` | Which side the showcase column sits on at `lg` and above |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type SocialProvider = { label: string; icon: React.ReactNode; href?: string };
type AuthField = { label: string; placeholder: string; type?: string };

type Auth2Labels = {
  divider?: string;
  terms?: string;
  submit?: string;
  passwordToggle?: string;
};

type Auth2Showcase = {
  image: { src: string; alt: string };
  quote?: string;
  author?: {
    name: string;
    title: string;
    avatar?: { src: string; alt: string };
  };
};
```

## Behavior notes

- Form fields are data-driven: each entry in `fields` renders a plain text `Input` unless its `type` is `"password"`, in which case it gets the relative-positioned show/hide toggle button and a controlled `type` switch between `password`/`text`.
- The `<form>` only calls `e.preventDefault()` on submit; there is no `onSubmit` prop and no network wiring, so nothing is actually submitted until the integrator adds a handler.
- `labels.terms` is injected as raw HTML into the checkbox's `FieldLabel` via `dangerouslySetInnerHTML`, so the terms/privacy links live inside that one string rather than as separate props.
- The showcase column is `hidden lg:block`, so it disappears completely below the `lg` breakpoint rather than stacking under the form; on small screens only the form column renders.
- `mediaPosition` swaps `lg:order-1`/`lg:order-2` on both columns, so the DOM order of the form and showcase stays fixed while only the visual order changes.

<Callout type="info" title="Wiring the form up">
This block ships the form markup only; state, validation, and submit are yours to add. Our guide wires the shadcn `Field` primitives to [React Hook Form, TanStack Form, and Formisch](/blog/shadcn-forms-react-hook-form-tanstack-formisch) on one field system.
</Callout>
