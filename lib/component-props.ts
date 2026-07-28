import ts from "typescript";

/**
 * One row of a component's props table, read out of the component's own source.
 *
 * The point of parsing rather than hand-writing these: a props table maintained
 * beside the code is a props table that goes stale, and the one thing worse than no
 * documentation is documentation that disagrees with the component.
 */
export interface ComponentPropRow {
  name: string;
  /** The type as written, with local aliases resolved to what they stand for. */
  type: string;
  required: boolean;
  /** The prose above the property, minus the tags. */
  description: string;
  /** From `@defaultValue`, which the family already writes in its doc comments. */
  defaultValue?: string;
}

/** Collapse the whitespace a multi-line union or object type arrives with. */
function tidy(type: string): string {
  return type.replace(/\s+/g, " ").trim();
}

/**
 * Local `type X = "a" | "b"` aliases, so a table can say what a prop actually
 * accepts. `tone?: Tone` tells a reader nothing they can act on; `"muted" |
 * "outline" | "ghost"` tells them everything.
 */
function localAliases(source: ts.SourceFile): Map<string, string> {
  const aliases = new Map<string, string>();
  source.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      aliases.set(node.name.text, tidy(node.type.getText(source)));
    }
  });
  return aliases;
}

/** The JSDoc text above a member, and its `@defaultValue` if it has one. */
function readDoc(member: ts.PropertySignature, source: ts.SourceFile) {
  const full = member
    .getFullText(source)
    .slice(0, member.getStart(source) - member.getFullStart());

  const block = /\/\*\*([\s\S]*?)\*\//.exec(full);
  if (!block) {
    const line = /\/\/\s*(.*)/.exec(full);
    return { description: line?.[1]?.trim() ?? "", defaultValue: undefined };
  }

  const lines = (block[1] ?? "")
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trimEnd());

  let defaultValue: string | undefined;
  const prose: string[] = [];
  for (const line of lines) {
    const tag = /^@defaultValue\s+(.*)$/.exec(line.trim());
    if (tag) {
      defaultValue = tag[1]?.trim();
      continue;
    }
    // Any other tag ends the prose; the family only uses @defaultValue.
    if (line.trim().startsWith("@")) continue;
    prose.push(line.trim());
  }

  return { description: prose.join(" ").replace(/\s+/g, " ").trim(), defaultValue };
}

/**
 * Reads `interface {Pascal}Props` out of a component's source.
 *
 * Deliberately a text-level parse of one file rather than a type-checked program:
 * this runs while a page renders, the interfaces in this family are flat, and
 * standing up a full program per component would cost more than the table is worth.
 */
export function readComponentProps(source: string, registryName: string): ComponentPropRow[] {
  const componentName = registryName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const file = ts.createSourceFile(
    `${componentName}.tsx`,
    source,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TSX,
  );

  const aliases = localAliases(file);
  const wanted = `${componentName}Props`;
  const rows: ComponentPropRow[] = [];

  file.forEachChild((node) => {
    if (!ts.isInterfaceDeclaration(node) || node.name.text !== wanted) return;

    for (const member of node.members) {
      if (!ts.isPropertySignature(member) || !member.name) continue;

      const name = member.name.getText(file).replace(/^"|"$/g, "");
      const written = member.type ? tidy(member.type.getText(file)) : "unknown";
      const { description, defaultValue } = readDoc(member, file);

      rows.push({
        name,
        // One level of resolution only: an alias of an alias is not a thing here,
        // and expanding React's own types would fill the table with noise.
        type: aliases.get(written) ?? written,
        required: !member.questionToken,
        description,
        defaultValue,
      });
    }
  });

  return rows;
}
