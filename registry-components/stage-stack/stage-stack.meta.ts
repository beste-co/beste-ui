import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "stage-stack",
  title: "Stage Stack",
  description:
    "One piece in the middle with smaller ones resting on its corners, half outside it. The small ones drift on their own beat, and the whole group can lean toward the pointer. On phones the corners tuck in.",
  category: "Layout",
  registryComponents: [],
  dependencies: [],
  usage: `import { StageStack } from "@/components/beste/component/stage-stack";

<StageStack
  main={<div />}                                  // e.g. a device frame holding a piece
  satellites={[
    { node: <div />, position: "top-right" },    // top-left, top-right, bottom-left, bottom-right
    { node: <div />, position: "bottom-left", width: "32%" },
  ]}
  float
  tilt
  className="mx-auto w-full max-w-3xl"
/>`,
};
