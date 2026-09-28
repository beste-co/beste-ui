import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "image-loupe",
  title: "Image Loupe",
  description:
    "A magnifier for product and detail photos. In lens mode a round or rounded loupe follows the pointer and shows the picture under it at the chosen zoom; in side mode a pane opens beside the image and a box marks the area it shows, falling back to the lens when there is no room. The large file loads only on the first zoom, under the regular picture with a small spinner, then fades in. Scrolling changes the zoom while magnified. On touch, press and hold opens the lens above the finger so it is never covered, while a quick swipe still scrolls the page. The frame is a button: Enter magnifies, the arrow keys move, plus and minus zoom and Escape closes. Position and zoom reach the DOM as CSS variables, so moving costs no renders.",
  category: "Loupe",
  usage: `import { ImageLoupe } from "@/components/beste/component/image-loupe";

<ImageLoupe
  src="https://images.unsplash.com/photo-1783676167814-13057079dd43?q=80&w=1200&auto=format&fit=crop"
  zoomSrc="https://images.unsplash.com/photo-1783676167814-13057079dd43?q=80&w=2400&auto=format&fit=crop"
  alt="Van Gogh, a wheat field with cypresses under swirling clouds"
  aspectRatio="4 / 3"
/>

<ImageLoupe
  src={product.image}
  zoomSrc={product.largeImage}   // fetched on the first zoom
  alt={product.name}
  mode="side"                    // "lens" (default) | "side"
  side="right"                   // pane on the right; the lens takes over without room
  defaultZoom={3}
  minZoom={1.5}
  maxZoom={6}
  wheelZoom={false}              // keep the wheel for scrolling
  lensShape="rounded"            // "circle" (default) | "rounded"
  lensSize={220}
  tone="outline"                 // "muted" (default) | "outline" | "ghost"
  size="lg"                      // "sm" | "default" | "lg"
  onZoomChange={(zoom) => console.log(zoom)}
/>`,
};
