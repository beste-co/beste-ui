import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "impasto",
  title: "Impasto",
  description:
    "A live oil painting that paints itself from any photo: thick brushstrokes follow the picture's contours from broad blocking-in to fine detail, each with bristle grooves and ridges of paint, lit by a raking light that glints on the wet surface while linen shows through the thin passages. The light follows the cursor, dragging with a mouse lays fresh strokes, and the finished canvas is slowly painted over again. Stroke size, count, pace, thickness, flow, sheen, canvas texture and primer are all props. Adapts its resolution, pauses offscreen, paints the finished canvas at once for reduced motion and falls back to the plain photo without WebGL.",
  category: "Media",
  isAnimated: true,
  fullBleed: true,
  dependencies: [],
  usage: `import { Impasto } from "@/components/beste/component/impasto";

<Impasto
  className="aspect-[4/3]"
  src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1600&q=80"
  alt="Sunrise over a misty valley"
  strokeSize={0.7}     // broader brushwork, 0 to 1
  thickness={0.8}      // taller ridges of paint
  flow={0.4}           // looser, swirling strokes
  sheen={0.6}          // wet shine under the light
  repaint={0}          // keep the finished painting
/>`,
};
