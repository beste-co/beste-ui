import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "counter-columns",
  title: "Counter Columns",
  description:
    "A wall of photographic prints tipped back in perspective, with tall columns drifting endlessly in opposite directions at slightly different paces. Scrolling the page pushes the columns and the push eases away, hovering slows the wall almost to a stop, and the whole plane leans gently toward the cursor. The loop is seamless at any size, and column count, pace, tilt, spacing and the top and bottom fade are all props. Reduced motion shows a still, staggered wall.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { CounterColumns } from "@/components/beste/component/counter-columns";

<CounterColumns
  className="h-[40rem]"
  images={[
    { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80", alt: "A model leaning on a teal wall" },
    { src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80", alt: "Orange poppies against a blue sky" },
    { src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&q=80", alt: "A woman walking down a city street" },
  ]}
  columns={3}
  tilt={0.6}
  speed={1}
/>`,
};
