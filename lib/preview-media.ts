// The captured previews live on the hosted CDN; the open-source build renders demos live.
export type PreviewKind = "block" | "piece" | "component";

export interface PreviewMedia {
  image: string;
  og: string;
  video?: string;
}

export function getPreviewMedia(_kind: PreviewKind, _name: string): PreviewMedia | undefined {
  return undefined;
}
