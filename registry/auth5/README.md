# Auth5: Set New Password

Full-height reset-password screen: a centered icon badge, new-password and confirm-password fields (each with its own show/hide toggle), a live checklist that ticks each requirement off as the user types, and a submit button.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/auth5"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/auth5"
```

This installs the block to `components/beste/block/auth5.tsx` and the `button`, `input`, and `field` shadcn/ui primitives it's built on.

## Quick start

The installed file exports `auth5Demo` alongside the block: the exact props behind the preview above. Spread it to get a working reset screen in one line.

```tsx
import { Auth5, auth5Demo } from "@/components/beste/block/auth5";

export default function ResetPasswordPage() {
  return <Auth5 {...auth5Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Lock } from "lucide-react";
import { Auth5 } from "@/components/beste/block/auth5";

export default function ResetPasswordPage() {
  return (
    <Auth5
      icon={<Lock className="size-6" />}
      heading="Set a new password"
      description="Your new password must be different from previously used passwords."
      requirements={[
        { label: "At least 8 characters", regex: ".{8,}" },
        { label: "One uppercase letter", regex: "[A-Z]" },
        { label: "One number", regex: "[0-9]" },
      ]}
      labels={{ newPassword: "New password", confirmPassword: "Confirm password", submit: "Reset password" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | – | Icon shown inside the circular badge above the heading |
| `heading` | `string` | – | Screen title |
| `description` | `string` | – | Subtext below the heading |
| `requirements` | `PasswordRequirement[]` | `[]` | Rules checked live against the new-password value |
| `labels` | `object` | `{}` | Field, submit, and toggle copy, see below |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type PasswordRequirement = { label: string; regex: string };

type Auth5Labels = {
  newPassword?: string;
  newPasswordPlaceholder?: string;
  confirmPassword?: string;
  confirmPasswordPlaceholder?: string;
  submit?: string;
  passwordToggle?: string;
};
```

## Behavior notes

- Unlike the sign-in/sign-up screens in this family, the password fields here are fully controlled (`useState`), which is what makes the live requirements checklist possible: each `requirement.regex` string is compiled with `new RegExp(...)` and tested against the current password value on every render.
- A requirement's row switches from a muted circle to a filled emerald circle with a check icon once its regex matches; nothing is checked while the password field is empty.
- The two password fields have independent show/hide state (`showPassword` and `showConfirm`), so toggling one does not affect the other.
- There is no comparison between the new-password and confirm-password values anywhere in the component; a mismatch is never flagged or blocked, and the submit button is never disabled by unmet requirements or a mismatch, only the requirements list visually indicates progress.
- The `<form>` only calls `e.preventDefault()` on submit; there is no `onSubmit` prop, so the integrator must add the actual reset call and any mismatch validation themselves.

<Callout type="info" title="Wiring the form up">
This block ships the form markup only; state, validation, and submit are yours to add. Our guide wires the shadcn `Field` primitives to [React Hook Form, TanStack Form, and Formisch](/blog/shadcn-forms-react-hook-form-tanstack-formisch) on one field system.
</Callout>
