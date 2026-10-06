import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "auto-carousel",
  title: "Auto Carousel",
  description:
    "A carousel that plays on its own: slides crossfade slowly, and a ring in the bottom right corner fills with the time the current slide has left, then the next one fades in. The ring is the timer, so pausing it pauses the carousel: it holds under the pointer and on keyboard focus, and pressing it moves on at once. A slide can be a link. Only the active slide and the one fading out are mounted, so heavy slides stay cheap, and reduced motion turns the timer off.",
  category: "Carousel",
  usage: `import { AutoCarousel } from "@/components/beste/component/auto-carousel";

// Five slides, six seconds each, a slow crossfade between them
<AutoCarousel
  className="aspect-video w-full rounded-xl"
  duration={6000}
  transition={1200}
  slides={[
    { label: "Live at Town Hall", href: "/albums/town-hall", content: <img src="/covers/town-hall.jpg" alt="" className="size-full object-cover" /> },
    { label: "Kind of Blue", href: "/albums/kind-of-blue", content: <img src="/covers/kind-of-blue.jpg" alt="" className="size-full object-cover" /> },
  ]}
/>

// Controlled, with a bare ring over a plain slide
<AutoCarousel
  slides={slides}
  value={slide}
  onValueChange={(index) => console.log("showing", index)}
  tone="ghost"
  pauseOnHover={false}
/>`,
};
