import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-media",
  title: "Inspector Media",
  description:
    "Settings row for an image or a video: the asset itself as a thumbnail on the right, and pressing the row opens a width-matched editor with the URL, a preview and a remove. Given a picker of your own, it hands the choosing to your media library instead.",
  category: "Inspector",
  registryDependencies: ["popover"],
  usage: `import { InspectorMedia } from "@/components/beste/component/inspector-media";

// The built-in editor: URL field, preview, and a "Remove Background" at its foot
<InspectorMedia label="Background" value={src} onValueChange={setSrc} clearable />

// Hand the choosing to an asset manager: the row calls this instead of opening
// the built-in editor, and removal belongs to that library too.
<InspectorMedia
  label="Poster"
  value={poster}
  onValueChange={setPoster}
  onPick={() => openMediaLibrary({ onSelect: setPoster })}
/>

<InspectorMedia
  label="Clip"
  kind="video"           // the thumbnail falls back to a film icon
  value={clip}
  onValueChange={setClip}
  placeholder="https://cdn.example.com/loop.mp4"
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
/>`,
};
