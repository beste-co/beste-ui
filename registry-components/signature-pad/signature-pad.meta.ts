import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "signature-pad",
  title: "Signature Pad",
  description:
    "A canvas for capturing a signature: strokes are smoothed into curves through their midpoints and run thick on slow movement and thin on fast, like ink, or follow real pen pressure on a stylus. Points are stored as fractions of the pad's width, so the signature survives any resize on a crisp, pixel-ratio-correct canvas. A dashed baseline and a faint placeholder guide the signer; undo (also Cmd or Ctrl + Z) and clear sit below. Export helpers return an SVG string or a PNG data URL, and a ref exposes clear, undo, isEmpty and both exports.",
  category: "Draw",
  cardScale: 0.5,
  usage: `import { SignaturePad, toSvg, type SignatureData, type SignaturePadHandle } from "@/components/beste/component/signature-pad";

// Uncontrolled, read it back through the ref
const pad = useRef<SignaturePadHandle>(null);
<SignaturePad ref={pad} label="Signature of Nina Simone" />
console.log(pad.current?.toDataURL());

// Controlled
const [signature, setSignature] = useState<SignatureData>([]);
<SignaturePad
  value={signature}
  onChange={setSignature}
  color="#1e3a8a"       // any CSS color; defaults to the foreground token
  minWidth={0.6}        // px on fast strokes
  maxWidth={3.6}        // px on slow strokes or full pressure
  tone="outline"        // "muted" (default) | "outline" | "ghost"
  size="lg"             // "sm" | "default" | "lg"
/>
console.log(toSvg(signature, { width: 600, height: 200 }));`,
};
