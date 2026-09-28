import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "sketch-to-photo",
  title: "Sketch to Photo",
  description:
    "A live WebGL piece that turns any photo into an architect's ink drawing and back: contour lines traced from the photo itself sweep across warm fibrous paper like a moving pen, fine broken hatching follows in the shadows, then a watercolor wash of the real colors blooms outward along a feathered front with darker tide lines at its edge, and finally the drawing lets go as the photograph sharpens into place. Driven by a 0 to 1 progress (made for scroll) or looping on its own. Paper and ink colors, line weight, line detail, speed and grain are props. Adapts its resolution, stops drawing once it catches up, holds the finished photo for reduced motion and shows the plain photo without WebGL.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { SketchToPhoto } from "@/components/beste/component/sketch-to-photo";

<SketchToPhoto
  className="aspect-[4/3]"
  imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=80"
  imageAlt="A modern house with wide glass walls and a pool"
  paperColor="#f1ece2"   // any CSS color, tokens included
  inkColor="#2b2723"
  lineWeight={0.4}       // hairline to bold, 0 to 1
  lineDetail={0.5}       // main contours only to every detail, 0 to 1
  progress={0.5}         // 0 paper, 0.4 drawn, 0.75 washed, 1 photo; leave it out to loop
/>`,
};
