import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button14",
  title: "Hold to Confirm Button",
  description:
    "A hold to confirm button that fills while held and fires only when the hold completes.",
  category: "Button",
  usage: `import { Button14 } from "@/components/beste/component/button14";
import { LogOut } from "lucide-react";

// onConfirm fires only after the button is held for holdDuration ms.
// Releasing early cancels and snaps the fill back.
<Button14
  label="Hold to delete"
  confirmLabel="Deleted"   // shown once the hold completes
  onConfirm={() => console.log("deleted")}
/>

<Button14
  label="Hold to sign out"
  confirmLabel="Signed out"
  icon={LogOut}        // idle icon (default: Trash2)
  tone="dark"          // "destructive" (default) | "dark" | "primary"
  rounded="md"         // "full" (default) | "lg" | "md" | "none"
  holdDuration={800}   // ms the button must be held
  resetDelay={0}       // 0 keeps the confirmed state (no auto-reset)
  onConfirm={() => console.log("signed out")}
/>`,
};
