import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "device-frame",
  title: "Device Frame",
  description:
    "Puts any piece on a screen: a laptop with a slim base, a phone with an island, a tablet, or a browser window with an address pill. The screen follows the theme and the frame carries a soft layered shadow.",
  category: "Device",
  registryComponents: [],
  dependencies: [],
  usage: `import { DeviceFrame } from "@/components/beste/component/device-frame";

<DeviceFrame device="browser" address="pratabakery.com">
  <div />                               // any piece, it fills the screen
</DeviceFrame>

<DeviceFrame device="laptop" className="max-w-3xl"><div /></DeviceFrame>
<DeviceFrame device="phone" className="w-56"><div /></DeviceFrame>`,
};
