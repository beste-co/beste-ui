import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "hold-confirm",
  title: "Hold Confirm",
  description:
    "A hold-to-confirm button for actions that deserve a second of thought: pressing and holding fills it from the left, the label flipping color as the fill passes under it, and letting go early rewinds the fill smoothly. When the hold completes a check draws itself in, the label changes, a short vibration marks it where supported, and the button resets on its own or stays confirmed. Works with the pointer and by holding Space or Enter; screen readers, which cannot hold, confirm with a single activation unless that is turned off. Duration, labels, icon, destructive or default tone, three sizes, and controlled or uncontrolled confirmed state.",
  category: "Confirm",
  usage: `import { HoldConfirm } from "@/components/beste/component/hold-confirm";
import { Trash2 } from "lucide-react";

<HoldConfirm
  label="Delete the album"
  holdingLabel="Keep holding"
  confirmedLabel="Album deleted"
  icon={Trash2}
  tone="destructive"
  onConfirm={() => console.log("Deleted")}
/>

<HoldConfirm
  label="Publish to every store"
  duration={2000}           // a longer hold for a bigger commitment
  resetAfter={null}         // stay confirmed
  size="lg"
/>`,
};
