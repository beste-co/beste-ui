import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "confirm-type",
  title: "Confirm Type",
  description:
    "Type-to-confirm for destructive actions: a short warning, the exact name to type with a copy button beside it, and a field that shows letter by letter how close the typing is, tinting every matching character and underlining the first one that departs. The button only arms on an exact match; pressing it or Enter before that shakes the field instead. The action may return a promise, which shows a spinner and then draws a check. Case-sensitive or not, destructive or default tone, three sizes, controlled or uncontrolled text.",
  category: "Confirm",
  dependencies: ["lucide-react"],
  usage: `import { ConfirmType } from "@/components/beste/component/confirm-type";

<ConfirmType
  name="Blue Lines"
  warning="Deleting the album removes its tracks and artwork. This cannot be undone."
  confirmLabel="Delete this album"
  doneLabel="Album deleted"
  onConfirm={async () => {
    await fetch("/api/albums/blue-lines", { method: "DELETE" });
  }}
/>

<ConfirmType
  name="autumn-tour"
  caseSensitive={false}     // letter case does not matter
  tone="default"
  size="sm"
/>`,
};
