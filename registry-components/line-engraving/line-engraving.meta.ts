import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "line-engraving",
  title: "Line Engraving",
  description:
    "A live WebGL piece that recuts any photo as a banknote-style intaglio engraving: fine parallel lines swell with the shadows and bend around the form, a second set crosses only in the deepest darks, and the whole plate sits pressed into warm, fibrous paper with a soft bevel. The lines are cut in one by one along their direction on arrival, then drift very slowly, and a soft loupe follows the cursor to reveal finer line work. Ink and paper colors, density, angle, contour, cross hatching, loupe, grain and speed are props. Adapts its resolution, idles at 30fps, shows a still print for reduced motion and a toned photo without WebGL.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { LineEngraving } from "@/components/beste/component/line-engraving";

<LineEngraving
  className="aspect-[4/5] w-full max-w-md"
  imageSrc="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=1500&fit=crop&q=80"
  imageAlt="Portrait of a bearded man in a dark shirt"
  inkColor="#18222f"     // any CSS color, tokens included
  paperColor="#f3eee3"
  density={0.55}         // open to very fine, 0 to 1
  angle={28}             // direction of the lines, in degrees
  contour={0.5}          // how far the lines bend around the form
  crossHatch={0.6}       // crossing lines in the deepest shadows
  loupe={0.6}            // finer lines under the cursor, 0 turns it off
/>`,
};
