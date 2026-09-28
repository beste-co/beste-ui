import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "field-otp",
  title: "Field OTP",
  description:
    "A one-time code field for sign-in and verification: one real input with `autocomplete=\"one-time-code\"` sits under a row of slots, so paste, SMS autofill, password managers and IME all work as they do in any field. Typing fills the slot under the caret and moves on, Backspace steps back, the arrow keys move between slots, and a pasted code fills them all. The active slot shows a blinking caret, each character pops in, and an optional dash splits the row. A `validate` function checks the finished code: a wrong one shakes the row, tints it red and clears it for another try; a right one settles each slot in green and brings in a check. Numeric or alphanumeric, masked or plain, controlled or uncontrolled.",
  category: "Field",
  usage: `import { FieldOtp } from "@/components/beste/component/field-otp";

<FieldOtp
  label="Verification code"
  description="We sent a code to hello@beste.co."
  separator={3}               // 123-456
  validate={async (code) => {
    const response = await fetch("/api/verify", { method: "POST", body: JSON.stringify({ code }) });
    return response.ok;       // false shakes and clears, true locks it in green
  }}
  onComplete={(code) => console.log("Entered", code)}
/>

// Letters and digits, four slots, shown as dots
<FieldOtp length={4} pattern="alphanumeric" mask tone="muted" size="lg" />

// Status from your own logic
<FieldOtp value={code} onValueChange={setCode} status={verifying ? "checking" : failed ? "error" : "idle"} />`,
};
