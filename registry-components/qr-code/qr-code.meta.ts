import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "qr-code",
  title: "QR Code",
  description:
    "A QR code generator with no dependencies: text is encoded as UTF-8 bytes into the smallest version from 1 to 40 that fits, with Reed-Solomon error correction at L, M, Q or H and the mask the standard's penalty rules pick. Drawn as one crisp SVG path in square, flowing rounded or dotted modules, with square, rounded or circular corner eyes, any colors (tokens included) and a configurable quiet zone. A centered logo sits on a cleared plate and raises the error correction to H on its own. Exports the encoder, an SVG string builder and a PNG download helper.",
  category: "Code",
  usage: `import { QrCode, downloadQrPng } from "@/components/beste/component/qr-code";

<QrCode value="https://beste.co" />

<QrCode
  value="https://beste.co/tickets/4F7Q"
  moduleStyle="rounded"      // "square" | "rounded" | "dots"
  finderStyle="circle"       // "square" | "rounded" | "circle"
  ecc="Q"                    // "L" | "M" | "Q" | "H"
  color="var(--primary)"
  size="lg"                  // "sm" | "default" | "lg" | pixels
  logo={{ src: "/logo.svg", size: 0.22 }}
/>

// Save it as a PNG, tokens resolved against the page
<button onClick={() => downloadQrPng("https://beste.co", { fileName: "beste" })}>Download</button>`,
};
