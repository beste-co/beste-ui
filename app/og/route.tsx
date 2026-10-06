import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Static cuts, since the image renderer cannot read a variable font: the text
// cut for body copy and the display cut for the title
const FONT_DIR = join(process.cwd(), "public/fonts/bestesans/static/ttf");
const BACKGROUND = join(process.cwd(), "public/assets/images/beste-ui-og-bg.jpg");

const WIDTH = 1200;
const HEIGHT = 628;
const INK = "#0a0a0a";

const DEFAULT_TITLE = "Your agent’s favorite component library.";
const DEFAULT_DESCRIPTION =
  "Blocks, pieces and components for shadcn/ui and Tailwind. Install one with a command, or let your agent pull it in over MCP.";

async function loadAssets() {
  const [regular, display, background] = await Promise.all([
    readFile(join(FONT_DIR, "BesteSans-Regular.ttf")),
    readFile(join(FONT_DIR, "BesteSansDisplay-Medium.ttf")),
    readFile(BACKGROUND),
  ]);

  return {
    fonts: [
      { name: "Beste Sans", data: regular, weight: 400 as const, style: "normal" as const },
      { name: "Beste Sans", data: display, weight: 500 as const, style: "normal" as const },
    ],
    background: `data:image/jpeg;base64,${background.toString("base64")}`,
  };
}

const clip = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

// The renderer cannot fit text, so a longer title steps down a size.
const titleSize = (title: string) => (title.length <= 44 ? 62 : title.length <= 72 ? 52 : 44);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams
    .get("title")
    ?.replace(" - production-ready shadcn/tailwind blocks", "")
    .trim();
  const rawDescription = (
    searchParams.get("description") || searchParams.get("amp;description")
  )?.trim();

  // The home page asks with the bare brand name; it gets the hero's own claim.
  const isHome = !rawTitle || rawTitle === "Beste UI";
  const title = isHome ? DEFAULT_TITLE : clip(rawTitle, 96);
  const description = isHome ? DEFAULT_DESCRIPTION : rawDescription ? clip(rawDescription, 150) : "";
  const size = titleSize(title);

  const { fonts, background } = await loadAssets();

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full"
        style={{ fontFamily: "Beste Sans", color: INK, backgroundColor: "#eef6ff" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={background} alt="" width={WIDTH} height={HEIGHT} tw="absolute inset-0" />

        <div tw="absolute flex flex-col items-start" style={{ left: 72, bottom: 64, width: 600 }}>
          <div
            tw="flex"
            style={{
              maxWidth: 580,
              fontSize: size,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: size * -0.04,
            }}
          >
            {title}
          </div>

          {description && (
            <div
              tw="flex"
              style={{
                marginTop: 28,
                maxWidth: 540,
                fontSize: 20,
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: -0.2,
                color: "rgba(10, 10, 10, 0.6)",
              }}
            >
              {description}
            </div>
          )}

          <div
            tw="flex items-center"
            style={{
              marginTop: 30,
              height: 42,
              padding: "0 20px",
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              border: "1px solid rgba(10, 10, 10, 0.1)",
              fontSize: 16,
              fontWeight: 400,
            }}
          >
            beste.dev/mcp
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT, fonts }
  );
}
