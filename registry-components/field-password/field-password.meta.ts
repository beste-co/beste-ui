import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "field-password",
  title: "Field Password",
  description:
    "A password field for sign-up and change forms: a show and hide eye that keeps the caret where it was, a four-segment strength meter scored in the browser with penalties for repeats, runs like abc or qwerty, common passwords (leetspeak included), years and the reader's own name or email, and a live checklist of rules whose circles fill and draw a check as each one is met. Caps Lock is flagged while the field has focus, the strength is announced once typing settles, and Safari's password generator is told the rules. `onValidChange` reports when every rule and the minimum score pass; `current-password` turns it into a plain sign-in field.",
  category: "Field",
  registryDependencies: ["input"],
  usage: `import { FieldPassword } from "@/components/beste/component/field-password";

<FieldPassword
  label="Create a password"
  userInputs={["hello@beste.co", "Nina Simone"]}   // penalized if they appear in the password
  onValidChange={(valid) => console.log("Can submit:", valid)}
/>

// Custom rules instead of the default five
<FieldPassword
  minScore={3}             // 0 to 4
  rules={[
    { id: "length", label: "At least 16 characters", test: (v) => v.length >= 16 },
    { id: "space", label: "At least two words", test: (v) => /\\S\\s+\\S/.test(v) },
  ]}
/>

// Sign-in: no meter, no checklist
<FieldPassword name="password" autoComplete="current-password" tone="muted" size="lg" />

// The scorer on its own
import { scorePassword } from "@/components/beste/component/field-password";
console.log(scorePassword("correct horse battery staple").label);`,
};
