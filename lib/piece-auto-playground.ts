import {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  type PlaygroundConfig,
  type PlaygroundControl,
} from "@/lib/playground-types";

const SURFACE_PROPS = new Set(["surface", "bordered", "inverted"]);
// Tone gets its row from the stage; links and pictures are not worth a text field
const SKIPPED = /^(tone|className)$|image|avatar|photo|src|href|url|icon|logo/i;

function labelFor(prop: string) {
  const words = prop.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function numberControl(prop: string, value: number): PlaygroundControl {
  const label = labelFor(prop);
  if (/ms$/i.test(prop)) return { prop, label, kind: "slider", min: 100, max: Math.max(4000, value * 2), step: 50, unit: "ms" };
  if (!Number.isInteger(value)) return { prop, label, kind: "slider", min: 0, max: value <= 1 ? 1 : Math.ceil(value * 2), step: value <= 1 ? 0.05 : 0.1 };
  if (value <= 100) return { prop, label, kind: "slider", min: 0, max: 100, step: 1 };
  return { prop, label, kind: "stepper", min: 0, step: 1 };
}

/**
 * A Customize config for a piece that ships none, read off its demo props:
 * text for strings, a slider for numbers, a switch for flags, and the shared
 * surface rows when the piece carries them.
 */
export function autoPiecePlayground(demoProps: Record<string, unknown> | undefined): PlaygroundConfig | undefined {
  if (!demoProps) return undefined;
  const controls: PlaygroundControl[] = [];
  for (const [prop, value] of Object.entries(demoProps)) {
    if (SURFACE_PROPS.has(prop) || SKIPPED.test(prop)) continue;
    if (typeof value === "string") controls.push({ prop, label: labelFor(prop), kind: "text" });
    else if (typeof value === "number") controls.push(numberControl(prop, value));
    else if (typeof value === "boolean") controls.push({ prop, label: labelFor(prop), kind: "switch" });
  }
  const surface = PIECE_SURFACE_CONTROLS.filter((control) => control.prop in demoProps);
  if (controls.length + surface.length === 0) return undefined;
  return {
    controls: [...controls, ...surface],
    stage: "surface" in demoProps ? PIECE_GLASS_STAGE : undefined,
  };
}
