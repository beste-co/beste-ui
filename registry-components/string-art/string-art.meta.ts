import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "string-art",
  title: "String Art",
  description:
    "A round board ringed with nails where a single thread is woven pin to pin in real time until a photograph appears, chosen pass by pass by the classic greedy string art method on a grayscale copy of the image. The thread being pulled is highlighted, finished portraits rest, fade and give way to the next photo, hovering speeds the weaving and leans the board, and a click moves on. Pins, passes, thread weight, colors, speed, hold, rim and tilt are props; the work is time sliced so it never blocks the page, and reduced motion weaves the finished portrait without the needle or tilt.",
  category: "Media",
  isAnimated: true,
  demoContentTone: "theme",
  dependencies: [],
  usage: `import { StringArt } from "@/components/beste/component/string-art";

<StringArt
  className="aspect-square w-full max-w-[560px]"
  images={[
    { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80", alt: "Portrait of a man", focus: 0.32 },
  ]}
  pins={240}                   // nails around the board
  lines={3500}                 // most passes per portrait; it stops sooner once the picture is done
  threadColor="var(--foreground)"
  needleColor="var(--primary)" // the pass being pulled right now
  speed={320}                  // passes per second
  hold={6}                     // seconds a finished portrait rests
/>`,
};
