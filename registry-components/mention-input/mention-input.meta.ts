import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "mention-input",
  title: "Mention Input",
  description:
    "A growing textarea with @mentions and any other trigger you give it, such as #tags: typing a trigger opens a suggestion list anchored at the caret, filtered as you type with accent-insensitive matching and the matched letters in bold, picked with the arrows and Enter or Tab. Picked mentions are drawn as tinted chips exactly in line with the text, stepped over by the arrow keys and removed whole by Backspace. The textarea stays the source of truth, the value is plain markup (@[Name](id)) with parse and serialize helpers, suggestions can come from a list or an async function, and the browser's undo history, IME input, forms and combobox semantics all keep working.",
  category: "Composer",
  cardScale: 0.7,
  usage: `import { MentionInput } from "@/components/beste/component/mention-input";

<MentionInput
  placeholder="Write a comment"
  triggers={[
    { char: "@", items: people },                                      // { id, label, description?, avatar? }[]
    { char: "#", items: (query) => fetch(\`/api/tags?q=\${query}\`).then((r) => r.json()) },
  ]}
  onValueChange={(markup, { text, mentions }) => console.log(markup, mentions)}
  onSubmit={(markup) => console.log("Send", markup)}   // Mod+Enter by default
  submitKey="mod+enter"                                // or "enter", with Shift+Enter for a new line
  rows={2}
  maxRows={8}
  name="comment"                                       // submits the markup with a form
/>`,
};
