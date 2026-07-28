import { ImageResponse } from "next/og";

async function loadAssets(): Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import("./geist-regular-otf.json").then((mod) => mod.default || mod),
    import("./geistmono-regular-otf.json").then((mod) => mod.default || mod),
    import("./geist-semibold-otf.json").then((mod) => mod.default || mod),
  ]);

  return [
    {
      name: "Geist",
      data: Buffer.from(normal, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist Mono",
      data: Buffer.from(mono, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: Buffer.from(semibold, "base64"),
      weight: 600 as const,
      style: "normal" as const,
    },
  ];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log(searchParams);
  const rawTitle = searchParams.get("title");
  const title =
    rawTitle?.replace(" - production-ready shadcn/tailwind blocks", "") ?? "";
  const description =
    searchParams.get("description") || searchParams.get("amp;description");

  const [fonts] = await Promise.all([loadAssets()]);

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full bg-white flex-col p-16"
        style={{ fontFamily: "Geist Sans" }}
      >
        {/* Gray circular background */}
        <div
          tw="absolute flex bg-stone-100"
          style={{
            width: 1200,
            height: 1200,
            borderRadius: 9999,
            top: -300,
            left: -400,
          }}
        />

        {/* Bottom section with logo, title, description */}
        <div tw="flex flex-col absolute top-24 left-24 right-16">
          {/* Logo */}
          <div tw="flex mb-6">
            <svg
              width="56"
              height="56"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.4305 15.2342C22.8754 15.4857 23.1632 15.8605 23.2938 16.3586C23.4244 16.8567 23.3639 17.3283 23.1124 17.7732L22.1839 19.3692C21.9324 19.8142 21.5575 20.1019 21.0594 20.2325C20.5613 20.3631 20.0897 20.3026 19.6448 20.0511L15.7854 17.8313V22.2855C15.7854 22.7885 15.6016 23.2237 15.2341 23.5913C14.8665 23.9589 14.4312 24.1426 13.9283 24.1426H12.0711C11.5682 24.1426 11.1329 23.9589 10.7653 23.5913C10.3978 23.2237 10.214 22.7885 10.214 22.2855V17.8313L6.35461 20.0511C5.90967 20.3026 5.43813 20.3631 4.93999 20.2325C4.44185 20.1019 4.06704 19.8142 3.81555 19.3692L2.88698 17.7732C2.63549 17.3283 2.57503 16.8567 2.70561 16.3586C2.8362 15.8605 3.12396 15.4857 3.5689 15.2342L7.42827 12.9998L3.5689 10.7654C3.12396 10.5139 2.8362 10.1391 2.70561 9.64097C2.57503 9.14283 2.63549 8.67129 2.88698 8.22635L3.81555 6.63037C4.06704 6.18543 4.44185 5.89767 4.93999 5.76709C5.43813 5.63651 5.90967 5.69696 6.35461 5.94845L10.214 8.16832V3.71408C10.214 3.2111 10.3978 2.77583 10.7653 2.40827C11.1329 2.04071 11.5682 1.85693 12.0711 1.85693H13.9283C14.4312 1.85693 14.8665 2.04071 15.2341 2.40827C15.6016 2.77583 15.7854 3.2111 15.7854 3.71408V8.16832L19.6448 5.94845C20.0897 5.69696 20.5613 5.63651 21.0594 5.76709C21.5575 5.89767 21.9324 6.18543 22.1839 6.63037L23.1124 8.22635C23.3639 8.67129 23.4244 9.14283 23.2938 9.64097C23.1632 10.1391 22.8754 10.5139 22.4305 10.7654L18.5711 12.9998L22.4305 15.2342Z"
                fill="#FF7322"
              />
            </svg>
          </div>

          {/* Title */}
          <div
            tw="flex text-stone-900 tracking-tight leading-[1.1]"
            style={{
              fontWeight: 600,
              fontSize: title && title.length > 20 ? 48 : 56,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              tw="flex max-w-4xl text-stone-500 mt-3 text-[28px] leading-[1.4]"
              style={{ fontWeight: 400 }}
            >
              {description}
            </div>
          )}

          {/* URL */}
          <div
            tw="flex text-stone-400 mt-6 text-[24px]"
            style={{ fontWeight: 400 }}
          >
            ui.beste.co
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 628,
      fonts,
    }
  );
}
