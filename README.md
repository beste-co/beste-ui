# Beste UI

Production-ready shadcn/ui blocks for your next project. Beautiful, accessible Tailwind CSS components you can copy and paste into your apps.

**[Browse All Blocks](https://ui.beste.co)**

## Installation

Install any block directly into your project using the shadcn CLI:

```bash
npx shadcn@latest add https://ui.beste.co/r/{block-name}
```

For example, to install the `hero7` block:

```bash
npx shadcn@latest add https://ui.beste.co/r/hero7
```

## Available Blocks

![Beste UI Blocks](https://raw.githubusercontent.com/beste-co/beste-ui/refs/heads/main/public/beste-ui.webp)

Browse all blocks at [ui.beste.co](https://ui.beste.co)

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Carousel:** [Embla Carousel](https://www.embla-carousel.com/)
- **Syntax Highlighting:** [Shiki](https://shiki.style/)

## Development

### Prerequisites

- Node.js 18+
- [Bun](https://bun.sh/) (recommended) or npm/yarn/pnpm

### Setup

1. Clone the repository:

```bash
git clone https://github.com/beste/beste-ui.git
cd beste-ui
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command              | Description              |
| -------------------- | ------------------------ |
| `bun dev`            | Start development server |
| `bun build`          | Build for production     |
| `bun start`          | Start production server  |
| `bun lint`           | Run ESLint               |
| `bun registry:build` | Build shadcn registry    |

## Project Structure

```
beste-ui/
├── app/                    # Next.js application
│   ├── api/code/[name]/   # API route for component code
│   ├── blocks/[name]/     # Dynamic block pages
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # Base shadcn/ui components
│   ├── beste/             # Beste UI bLocks
│   └── svgs/              # Logos
├── lib/
│   ├── blocks.ts          # Block registry and metadata
│   └── utils.ts           # Utility functions
├── registry.json          # shadcn registry configuration
└── components.json        # shadcn configuration
```

## Creating Custom Blocks

Each block follows a consistent pattern:

```tsx
// components/beste/my-block.tsx

interface MyBlockProps {
  title: string;
  description?: string;
  className?: string;
}

// Demo props for preview
export const myBlockDemo: MyBlockProps = {
  title: "Welcome",
  description: "This is a demo block",
};

// Component implementation
export function MyBlock({ title, description, className }: MyBlockProps) {
  return (
    <section className={cn("py-16", className)}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </section>
  );
}
```

## Configuration

### shadcn Configuration (`components.json`)

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "baseColor": "stone",
    "cssVariables": true
  },
  "iconLibrary": "lucide"
}
```

### Theme Customization

The project uses CSS custom properties for theming. Modify `app/globals.css` to customize colors:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 20 14.3% 4.1%;
  --primary: 24 9.8% 10%;
  /* ... */
}

.dark {
  --background: 20 14.3% 4.1%;
  --foreground: 60 9.1% 97.8%;
  /* ... */
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-block`)
3. Commit your changes (`git commit -m 'Add amazing block'`)
4. Push to the branch (`git push origin feature/amazing-block`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with [shadcn/ui](https://ui.shadcn.com/) and [Next.js](https://nextjs.org/)

[beste.co](https://beste.co), 2026
