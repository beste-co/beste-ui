"use client";

import { FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { markdownHref } from "@/lib/markdown-url";

/**
 * The last line of every page: a link to the same page rendered as Markdown.
 *
 * The site answers `Accept: text/markdown` on any address, which agents can
 * use but a person cannot. The `.md` suffix makes the same rendition an
 * ordinary link — one you can click, copy, or paste into a tool that only
 * takes URLs.
 *
 * A plain `<a>`, not `next/link`: `.md` is not a route in the app router, and
 * a client-side navigation to one would ask for an RSC payload that does not
 * exist. `data-md-omit` keeps this out of the Markdown itself, which would
 * otherwise end with a link to the page you are already reading — the marker
 * is matched on the closing `</section>`, so nothing here may nest one.
 */
export function MarkdownVersionLink() {
  const pathname = usePathname();

  return (
    <section data-md-omit="" className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-6 md:px-6">
        <a
          href={markdownHref(pathname)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <FileText className="size-4" aria-hidden="true" />
          Markdown version
        </a>
      </div>
    </section>
  );
}
