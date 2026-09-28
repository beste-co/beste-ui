import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "chat-bubble",
  title: "Chat Bubble",
  description:
    "A conversation drawn as message groups: consecutive messages from one person within a few minutes gather under one avatar and name, their corners tightening where the bubbles meet so a run reads as one voice. The reader's messages sit on the right in the primary color, everyone else's on the left in one of three tones. Times slide out beside a bubble on hover or focus, the reader's latest message carries its delivery state (sending, sent, delivered, read), reactions sit under a bubble as chips, bare links become links, and a typing bubble of three dots joins the person's group. The whole log is one tab stop with arrow keys between messages.",
  category: "Chat",
  usage: `import { ChatBubble } from "@/components/beste/component/chat-bubble";

<ChatBubble
  me="joni"
  people={[
    { id: "joni", name: "Joni Mitchell" },
    { id: "miles", name: "Miles Davis", avatar: "/avatars/miles.jpg" },
  ]}
  messages={[
    { id: "1", from: "miles", text: "Rehearsal moved to Thursday.", time: "2026-09-27T17:02:00Z" },
    { id: "2", from: "joni", text: "Works for me.", time: "2026-09-27T17:05:00Z", status: "read" },
  ]}
  typing={["miles"]}                                   // a three-dot bubble joins their group
  onReact={(id, emoji) => console.log("React", id, emoji)} // makes reaction chips pressable
  groupWithin={5}                                      // minutes between messages in one group
  tone="outline"                                       // "muted" (default) | "outline" | "ghost"
  size="sm"                                            // "sm" | "default" | "lg"
/>`,
};
