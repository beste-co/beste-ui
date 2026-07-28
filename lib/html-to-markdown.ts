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
