import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "photo-ring",
  title: "Photo Ring",
  description:
    "Portrait photographs mounted on a slowly turning 3D ring seen slightly from above. Each panel is gently curved, catches the light and a soft gloss as it turns toward the front, and fades into the surface as it passes behind, while a quiet reflection lies on the floor below. Drag or scroll to give the ring momentum; it eases back to its idle turn. Radius, panel size, tilt, pace, fog, shading and reflection are all props. Reduced motion holds a still ring.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { PhotoRing } from "@/components/beste/component/photo-ring";

<PhotoRing
  className="h-[32rem]"
  images={[
    { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop", alt: "Portrait of a woman" },
    { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop", alt: "Portrait of a man" },
    // ...ten to fourteen photographs read best
  ]}
  gap={0.2}
  tilt={10}
  reflection={0.5}
/>`,
};
