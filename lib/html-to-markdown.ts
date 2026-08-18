// Raw-text elements (`<script>`, `<style>`, `<noscript>`) must be removed
// before handing HTML to node-html-markdown.
//
// node-html-parser — the parser underneath node-html-markdown — finds the end
// of a raw-text element with `data.toLocaleLowerCase().indexOf("</script>")`
// and then applies that index to the *original* string. Characters that grow
// when lowercased break the mapping: Turkish `İ` (U+0130) becomes two code
// units (`i` + combining dot), so every `İ` earlier in the document shifts the
// lowercased index by one. Past the first one the parser resumes in the middle
// of the script body and emits the rest of it as a text node, which is how
// Next.js' RSC flight payload ends up in the markdown output. `ignore:
// ["script"]` cannot help at that point — the content is no longer inside a
// script element.
//
// Stripping the elements up front sidesteps the bug entirely and makes the
// parse considerably cheaper. Their content never contributes to markdown
// anyway (node-html-markdown ignores all three by default).
//
// The non-greedy body match is safe: Next escapes the `<` of any `</script`
// inside inline script payloads, so it cannot terminate the match early.
const RAW_TEXT_ELEMENT =
  /<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

export const stripRawTextElements = (html: string): string =>
  html.replace(RAW_TEXT_ELEMENT, "");

// Page chrome that only means something in a browser is marked `data-md-omit`
// and dropped before conversion: the header bar, whose search field converts
// to a stray "Search…⌘K" line, and the link to the page's own Markdown, which
// would leave every document ending in a link to itself.
//
// Depth-aware rather than a pair of regexes: marked elements are containers
// with elements of their own tag inside them, and a non-greedy match would cut
// at the first nested close.
const OMIT_MARKER = /<([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*\sdata-md-omit\b[^>]*>/;

export function stripMarkdownOmitted(html: string): string {
  let out = html;

  for (;;) {
    const open = OMIT_MARKER.exec(out);
    if (!open) return out;

    const [openTag, tagName] = open;
    const start = open.index;
    let end = start + openTag.length;

    if (!openTag.endsWith("/>")) {
      // Walk the element's own tag forward, counting depth, to find the close
      // that belongs to this one.
      const boundary = new RegExp(`</?${tagName}(?=[\\s/>])`, "gi");
      boundary.lastIndex = end;
      let depth = 1;
      for (let m = boundary.exec(out); m; m = boundary.exec(out)) {
        depth += m[0][1] === "/" ? -1 : 1;
        if (depth === 0) {
          const close = out.indexOf(">", m.index);
          end = close === -1 ? out.length : close + 1;
          break;
        }
      }
      // Unclosed: drop the opening tag alone rather than the rest of the
      // document, and let the loop move on.
      if (depth !== 0) end = start + openTag.length;
    }

    out = out.slice(0, start) + out.slice(end);
  }
}
