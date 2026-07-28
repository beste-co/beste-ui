import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "devtools3",
  title: "Multi-Language Code Tabs",
  description:
    "Code block with language tabs (JavaScript, Python, cURL, Go) and Shiki syntax highlighting. Dark theme with copy-to-clipboard and active tab indicator.",
  category: "DevTools",
  dependencies: ["clsx", "tailwind-merge", "lucide-react", "shiki"],
  registryDependencies: ["button"],
};
