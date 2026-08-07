import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "gallery25",
  title: "Pick The Frames Taste Profile",
  description:
    "A gallery finder whose questions are photographs rather than sentences: three rows of frames are chosen by eye, and the result names the leading way of looking, shows the series that goes with it, and breaks the picks down as a share bar.",
  category: "Gallery",
  dependencies: ["clsx", "tailwind-merge", "lucide-react", "@radix-ui/react-slot"],
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge7", "button12"],
  tags: ["questionnaire"],
};
