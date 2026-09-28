import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "file-drop",
  title: "File Drop",
  description:
    "A dropzone with its file list: drag files over and the zone lifts while its dashed edge starts to march, or click to browse. Each file becomes a row with a type icon, a name that truncates in the middle so the extension stays in view, its size and a thin progress line, moving through waiting, uploading, uploaded and failed with retry and remove. Accepted types, size and count limits reject files with a clear inline message; progress comes from your own upload function or from a progress map, uploads run three at a time and removing a row aborts its upload. Pasting files is optional.",
  category: "File",
  dependencies: ["lucide-react"],
  usage: `import { FileDrop, type FileDropUpload } from "@/components/beste/component/file-drop";

// Your uploader: report progress, honor the signal, reject to mark the row as failed
const upload: FileDropUpload = async (item, { onProgress, signal }) => {
  onProgress(0.5);
  console.log("uploading", item.name, signal.aborted);
  onProgress(1);
};

<FileDrop
  upload={upload}
  accept="image/*,.pdf"
  maxSize={10 * 1024 * 1024}   // 10 MB
  maxFiles={5}
  onFilesChange={(files) => console.log(files.length, "files")}
/>

// Progress you drive yourself, keyed by item id
<FileDrop
  files={files}
  onFilesChange={setFiles}
  progress={{ [files[0].id]: 0.4 }}
  tone="outline"               // "muted" (default) | "outline" | "ghost"
  size="sm"                    // "sm" | "default" | "lg"
/>`,
};
