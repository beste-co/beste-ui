import path from "node:path";
import { fileURLToPath } from "node:url";

// Pin the workspace root to this directory. Without it Next infers the root
// from the nearest lockfile above, and if this tree is unpacked inside another
// repository, Tailwind's source detection walks that whole tree instead —
// binary files included, which it then tries to read class names out of.
const projectDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Applied to every response. Deliberately not a full CSP: script-src would have
 * to allow Next's inline bootstrap, and a policy written loosely enough to do
 * that buys little. Framing is handled separately, since the embed routes exist
 * to be framed.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: projectDir },
  outputFileTracingRoot: projectDir,
  devIndicators: false,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "oud.pics" },
      { protocol: "https", hostname: "beste.pics" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.pexels.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        // Everything except the embed routes, which exist to be framed.
        source: "/((?!embed/).*)",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'self'" }],
      },
      {
        source: "/.well-known/api-catalog",
        headers: [
          { key: "Content-Type", value: "application/linkset+json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
