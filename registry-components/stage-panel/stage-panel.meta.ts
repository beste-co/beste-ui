import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "stage-panel",
  title: "Stage Panel",
  description:
    "A large rounded panel for showing a product piece off: a soft stone tint with a hairline, a soft sky drawn in code from one of ten looks, or any photograph filling it edge to edge. It sizes from its classes and centers nothing on its own, so the caller decides the layout.",
  category: "Card",
  registryComponents: ["sky-gradient"],
  dependencies: [],
  usage: `import { StagePanel } from "@/components/beste/component/stage-panel";

<StagePanel
  surface="sky"
  sky="dawn"   // dawn, haze, azure, dusk, mist, apricot, lilac, sage, stone, night
  className="flex h-110 items-center justify-center p-7"
>
  {/* a piece */}
</StagePanel>

<StagePanel surface="image" image={{ src: "https://images.unsplash.com/photo-1781708897820-e1cda3d96180?q=80&w=2400&auto=format&fit=crop" }} className="p-7">
  {/* a piece */}
</StagePanel>

<StagePanel className="p-7">{/* surface "muted" is the default */}</StagePanel>`,
};
