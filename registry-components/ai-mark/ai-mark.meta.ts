import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "ai-mark",
  title: "AI Brand Mark",
  description:
    "The marks of the assistants people build with, Claude, ChatGPT, Cursor, Grok and Gemini, plus the Beste and WordPress marks, drawn as one inline SVG that follows the text color. Each carries its name for screen readers unless a label sits beside it.",
  category: "Logo",
  dependencies: [],
  usage: `import { AiMark } from "@/components/beste/component/ai-mark";

<AiMark brand="claude" className="size-5 text-foreground/75" />
<AiMark brand="beste" />            // orange by default
<AiMark brand="openai" label="" />  // decorative, a label sits beside it`,
};
