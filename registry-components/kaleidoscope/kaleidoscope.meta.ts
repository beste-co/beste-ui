import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "kaleidoscope",
  title: "Kaleidoscope",
  description:
    "A live WebGL kaleidoscope that folds any photo into a crisp mandala of mirrored segments, turning slowly while its view drifts and zooms over the photo so the pattern keeps blooming into new symmetric forms. Seen as a circle with a soft vignette and a thin glass rim that bends color only at its edge, or as a full rectangle of pattern. The cursor turns the tube and zooms the view. Segments, speed, zoom, drift, rim and vignette are all props. Adapts its resolution, pauses offscreen, holds a still pattern for reduced motion and falls back to the plain photo without WebGL.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { Kaleidoscope } from "@/components/beste/component/kaleidoscope";

<Kaleidoscope
  className="aspect-square w-full max-w-xl"
  src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=2400&q=80"
  alt="Orange poppies against a clear blue sky"
  segments={10}     // mirrored segments, 6 to 12
  zoom={0.7}        // look closer into the photo, 0 to 1
  drift={0.3}       // how far the view wanders, 0 to 1
/>

// As a full rectangle of pattern instead of a round tube
<Kaleidoscope src="/petals.jpg" round={false} rim={false} className="h-[32rem]" />`,
};
