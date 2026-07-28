import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "color-picker",
  title: "Color Picker",
  description:
    "OKLCH-native colour picker: a gamut-aware lightness and chroma plane, RGB and OKLCH tabs whose rows show their own colour ramp on hover, a field that accepts hex, rgb() or oklch(), screen eyedropper and preset swatches.",
  category: "Dashboard",
  registryDependencies: ["button", "input", "tabs"],
  registryComponents: ["inspector-slider"],
  usage: `import { ColorPicker } from "@/components/beste/component/color-picker";

// Hex in, hex out — the drop-in case
<ColorPicker color={color} onChange={setColor} />

// Emit oklch() and keep the expensive work off the drag path. The OKLCH tab
// opens selected, since that is the notation being written back.
<ColorPicker
  color={brand}
  format="oklch"                                  // "hex" (default) | "oklch" | "rgb"
  onChange={setBrand}                             // every adjustment
  onChangeComplete={(value) => console.log("persist", value)} // once per gesture
/>

<ColorPicker
  color={overlay}
  onChange={setOverlay}
  alpha                                           // adds the alpha row, emits 8-digit hex
  // Presets are opt-in; without this prop the picker shows no swatch row at all.
  swatches={["#171717", "#64748b", "#6366f1", "#0ea5e9", "#14b8a6", "#22c55e", "#f59e0b", "#ef4444"]}
/>

// Compact: no tabs, so plane and hue only, and no text field either
<ColorPicker color={color} onChange={setColor} oklch={false} hideInput />`,
};
