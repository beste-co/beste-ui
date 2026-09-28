import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "code-share",
  title: "Code Share",
  description:
    "A share card built around the qr-code component: the link as a QR on a white plate that every phone camera reads in either theme, a title and a line of text, the URL in a read-only field that selects itself on focus, and a copy button whose icon turns into a check and is announced to screen readers. Where the browser has a share sheet a Share button opens it, and Download QR saves the code as a PNG with the same module and finder style. Every QR setting passes through the qr prop.",
  category: "Code",
  registryComponents: ["qr-code"],
  usage: `import { CodeShare } from "@/components/beste/component/code-share";

<CodeShare
  url="https://beste.co/tours/nils-frahm-autumn"
  title="Share the tour"
  description="Scan to see every date, or send the link."
  qr={{ moduleStyle: "dots", finderStyle: "circle", ecc: "Q" }}
  fileName="autumn-tour"
  onCopy={(url) => console.log("Copied", url)}
/>`,
};
