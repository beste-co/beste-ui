"use client";

import dynamic from "next/dynamic";

// Live demos load only when a category has no captured image yet
const LiveBlock = dynamic(() => import("./related-live-preview").then((m) => m.LiveBlock), { ssr: false });
const LiveComponent = dynamic(() => import("./related-live-preview").then((m) => m.LiveComponent), {
  ssr: false,
});

/** A related category's picture: its captured image, or one of its items rendered live. */
export function RelatedCategoryPreview({
  kind,
  name,
  image,
}: {
  kind: "blocks" | "components";
  name: string;
  image?: string;
}) {
  if (image) {
    return (
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
      />
    );
  }
  return kind === "blocks" ? <LiveBlock name={name} /> : <LiveComponent name={name} />;
}
