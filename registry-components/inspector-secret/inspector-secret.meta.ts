import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-secret",
  title: "Inspector Secret",
  description:
    "A value shown without being readable over a shoulder: an API key, a token, a signing secret. Hidden, it keeps its last few characters legible, since that tail is how one key is told from another; copy works whether or not it is revealed, and revealing fires a callback for panels that keep a log of it.",
  category: "Inspector",
  usage: `import { InspectorSecret } from "@/components/beste/component/inspector-secret";

// Issued elsewhere: shown and copied, not typed
<InspectorSecret label="API key" value={key} />

<InspectorSecret
  label="Webhook secret"
  value={secret}
  visibleSuffix={6}                            // characters left legible while hidden
  onReveal={() => console.log("secret revealed")}
  onCopy={() => console.log("secret copied")}
  revealable                                    // on by default
  copyable                                      // on by default
  tone="outline"                                // "muted" (default) | "outline" | "ghost"
  size="sm"                                     // "sm" | "default" | "lg"
/>

// Typed by the reader: the field is a real password input while it is hidden
<InspectorSecret
  label="SMTP password"
  editable
  value={password}
  onValueChange={setPassword}
  onValueCommit={(next) => console.log("saved", next.length, "characters")}
  placeholder="Not set"
  name="smtp-password"
/>`,
};
