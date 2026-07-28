import Image from "next/image";
import { GlobeLogo } from "@/components/icons/globe-logo";
import { LinkedInLogo } from "@/components/icons/linkedin-logo";
import { XLogo } from "@/components/icons/x-logo";

/**
 * Author byline rendered once per post, between the header tags and the start
 * of the article body. Reusable and content-agnostic: the post template drops
 * it in, so all current and future posts carry the same signature.
 */
export function PostSignature() {
  return (
    <div className="mt-6 flex items-center gap-4">
      <Image
        src="/assets/images/zieg.jpg"
        alt="zieg"
        width={48}
        height={48}
        className="size-12 rounded-full object-cover"
      />
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-foreground">zieg</span>
        <span className="text-sm text-muted-foreground">building beste.co</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <a
          href="https://zieg.beste.co"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <GlobeLogo className="size-4" />
          <span className="sr-only">zieg's website</span>
        </a>
        <a
          href="https://x.com/forwardset"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <XLogo className="size-4" />
          <span className="sr-only">zieg on X</span>
        </a>
        <a
          href="https://linkedin.com/in/ziegfiroyt"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <LinkedInLogo className="size-4" />
          <span className="sr-only">zieg on LinkedIn</span>
        </a>
      </div>
    </div>
  );
}
