import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "file-avatar",
  title: "File Avatar",
  description:
    "An avatar uploader: a round or rounded-square avatar with the current photo or the person's initials, and a camera overlay on hover. Click, drop or paste an image and a crop step opens in place: the picture under a circular mask, dragged to frame it, zoomed with the wheel, a slider or a pinch, and moved with the arrow keys, always covering the whole avatar. Save renders the crop to a square canvas and returns a Blob and a data URL; Cancel puts the old avatar back. A ring around the avatar shows upload progress, a remove button clears it, and accepted types and a size limit reject files with an inline message.",
  category: "File",
  dependencies: ["lucide-react"],
  usage: `import { FileAvatar } from "@/components/beste/component/file-avatar";

<FileAvatar
  name="Björk"
  defaultValue="/avatars/bjork.jpg"
  onChange={async (result) => {
    if (!result) return console.log("removed");
    const body = new FormData();
    body.append("avatar", result.blob, "avatar.png");
    console.log("upload", result.blob.size, "bytes");
  }}
/>

// A rounded square, a smaller JPEG, and progress you drive yourself
<FileAvatar
  name="Nina Simone"
  shape="rounded"           // "circle" (default) | "rounded"
  outputSize={512}          // px of the saved square
  outputType="image/jpeg"
  quality={0.85}
  maxSize={2 * 1024 * 1024} // 2 MB
  progress={0.4}            // 0 to 1, null hides the ring
  size="lg"                 // "sm" | "default" | "lg"
/>`,
};
