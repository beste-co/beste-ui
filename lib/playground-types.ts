/**
 * The shape of a playground, and the pieces every playground shares.
 *
 * A leaf module on purpose: the generated registry imports this type and the
 * playground files import these constants, so anything with an import of its own
 * here would put a cycle between them.
 *
 * The configs themselves live beside the components they document, in
 * `registry-components/{name}/{name}.playground.ts`, and are wired into
 * `lib/registry-components.ts` by `scripts/generate-components.ts` — the same
 * path the metas take. One file per component rather than one file for all of
 * them: adding a component is then adding a folder, and thirty configs in one
 * module is a merge conflict waiting for the next contributor.
 *
 * Controls are described rather than written, which is what keeps these pages
 * from becoming a hundred hand-built forms that each drift on their own. Every
 * control renders as a row of the inspector family, which is the other half of
 * the point: the documentation for these components is built out of them.
 */

/** Which row of the family a control becomes. */
export type PlaygroundControlKind =
  | "slider"
  | "stepper"
  | "switch"
  | "select"
  | "segmented"
  | "toggles"
  | "text"
  | "color";

export interface PlaygroundControl {
  /** The prop this turns. Must exist on the component. */
  prop: string;
  /** How it reads in the panel. */
  label: string;
  kind: PlaygroundControlKind;

  /** Numeric kinds. */
  min?: number;
  max?: number;
  step?: number;
  /** Printed after a number, e.g. `px`. */
  unit?: string;

  /** Choice kinds. A plain string is its own label. */
  options?: (string | { value: string; label?: string })[];

  /** Ghost text, for `text`. */
  placeholder?: string;

  /**
   * The component's own default. A control sitting on it is left out of the snippet,
   * so the code a reader copies is the code they would actually write.
   */
  default?: unknown;

  /** Which group the control sits in. Everything else lands in "Props". */
  group?: string;
}

/** One line of the keyboard and gesture table. */
export interface PlaygroundKey {
  /** What is pressed or done, e.g. `Shift + Arrow` or `Double-click`. */
  keys: string;
  /** What it does. */
  does: string;
}

export interface PlaygroundConfig {
  /**
   * What the playground opens with. Left out, the component's demo props are used —
   * which is usually right, since a demo is already the tidiest example of a
   * component there is.
   */
  props?: Record<string, unknown>;
  /** Props the reader can turn. */
  controls: PlaygroundControl[];
  /**
   * Every gesture the component answers. This family is unusually gesture-heavy —
   * double-click to type, Shift for a coarse step, a wheel over a focused row — and
   * a prop table cannot say any of it, so none of it was written down anywhere until
   * this table existed. Each line is taken from the component's own key handler.
   */
  keys?: PlaygroundKey[];
}

/** Shared by every row in the inspector family, so it is described once. */
export const SURFACE_CONTROLS: PlaygroundControl[] = [
  {
    prop: "tone",
    label: "Tone",
    kind: "select",
    options: ["muted", "outline", "ghost"],
    default: "muted",
    group: "Surface",
  },
  {
    prop: "size",
    label: "Size",
    kind: "select",
    options: ["sm", "default", "lg"],
    default: "default",
    group: "Surface",
  },
  // A flag, so a switch: a menu of two states would be a menu asking a question the
  // reader can answer by looking at it.
  { prop: "disabled", label: "Disabled", kind: "switch", default: false, group: "Surface" },
];
