import { MainProviders } from "@/components/main-providers";
import { NotFoundContent } from "@/components/not-found-content";

/**
 * The site's 404, for both ways of reaching one.
 *
 * An address that matched no route arrives here with only the root layout
 * rendered, so the chrome has to come from this page. A `notFound()` thrown
 * from inside the site arrives with the layout already around it, chrome
 * included — MainProviders detects that it is nested and renders nothing of its
 * own, which is why one boundary is enough for both.
 */
export default function NotFound() {
  return (
    <MainProviders>
      <NotFoundContent />
    </MainProviders>
  );
}
