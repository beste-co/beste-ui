import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "toolbar",
  title: "Toolbar",
  description:
    "A floating pill toolbar built from compound parts: buttons, toggles, one-of-many and any-of-many toggle groups, and separators. One highlight slides under whichever item the pointer or keyboard is on, and one tooltip rides along with it showing the label and the shortcut as key caps, drawn for the platform (⌘ on a Mac, Ctrl elsewhere). Arrow keys, Home and End move through the bar as a single tab stop, in a row or a column.",
  category: "Toolbar",
  usage: `import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggle,
  ToolbarToggleGroup,
} from "@/components/beste/component/toolbar";

// A tool picker, a formatting set and a plain action
<Toolbar aria-label="Canvas tools" floating>
  <ToolbarToggleGroup type="single" value={tool} onValueChange={setTool} aria-label="Tool">
    <ToolbarToggle value="select" icon={MousePointer2} label="Move" shortcut="V" />
    <ToolbarToggle value="pen" icon={PenTool} label="Pen" shortcut="P" />
  </ToolbarToggleGroup>
  <ToolbarSeparator />
  <ToolbarToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text style">
    <ToolbarToggle value="bold" icon={Bold} label="Bold" shortcut="Mod+B" />
    <ToolbarToggle value="italic" icon={Italic} label="Italic" shortcut="Mod+I" />
  </ToolbarToggleGroup>
  <ToolbarSeparator />
  <ToolbarButton icon={Undo2} label="Undo" shortcut="Mod+Z" onClick={() => console.log("undo")} />
</Toolbar>

// A column down the side of a canvas, tooltips to the right
<Toolbar orientation="vertical" tone="outline" size="lg" aria-label="Layers">
  <ToolbarButton icon={Plus} label="Add layer" shortcut="Mod+Shift+N" />
  <ToolbarToggle icon={Eye} label="Show hidden" defaultPressed />
</Toolbar>

// A word on the button instead of a tooltip
<ToolbarButton icon={Share} label="Share" showLabel />`,
};
