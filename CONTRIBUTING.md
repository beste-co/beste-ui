# Contributing

Thanks for being here. One thing to know before you start, because it changes
how a change reaches users.

## This repository is generated

Everything here is built from a private source repository and synced on every
release. A commit pushed straight to `main` would be overwritten by the next
sync, so nothing is merged here directly.

That is not a closed door. It means an accepted change is applied upstream and
then flows back here, with your authorship preserved in the commit. From your
side the process looks like any other pull request.

## Reporting a bug

Open an issue with:

- the item's name (`hero7`, `code12`, `button12`)
- what you did, what happened, what you expected
- your Tailwind and React versions
- a screenshot, if it is visual

A minimal reproduction is worth more than a long description. If the section
renders correctly on [ui.beste.co](https://ui.beste.co) but not in your project,
say so: that points at a difference in theme tokens or Tailwind config rather
than at the section.

## Proposing a change to a section

Open a pull request against the file you would change. Keep it to one item per
pull request so it can be reviewed and applied on its own.

What gets merged easily:

- accessibility fixes (labels, roles, focus order, contrast)
- responsive bugs at a real breakpoint
- a prop that should have existed, added without breaking the ones that do
- typos, and copy that says something the section does not do

What needs discussion first, in an issue:

- renaming or removing a prop, which breaks everyone who installed the section
- restyling something that is working as designed
- new dependencies

## Proposing a new section

Open an issue describing it before writing it. Sections carry a house style,
and it is quicker to agree on the shape than to rework a finished one.

Useful in that issue: what it is for, where you have seen the pattern, and which
existing item is closest.

## House rules, in short

These are what a review checks for. They are the same rules the existing
sections follow, so the nearest neighbour to what you are writing is usually the
best reference.

- **Everything is a prop.** No figure, label or image is hardcoded where a
  consumer would want to change it. Demo data lives in the same file, exported
  separately.
- **Semantic tokens only.** `bg-background`, `text-muted-foreground`,
  `border`. Never a hex value, never a fixed palette colour: a section has to
  survive somebody else's theme.
- **Responsive by default.** Mobile first, and it has to hold up at 320px.
- **`text-sm` is the floor.** Nothing smaller.
- **Interactive elements get `cursor-pointer`.** Tailwind v4 does not add it.
- **Accessible.** Real labels, real roles, keyboard reachable, visible focus.
- **No `next/*` imports** in `registry-pieces/` or `registry-components/`.
  Those install into any React project, so a plain `<a>` and a plain `<img>`.
- **Declare what you import.** If a section uses another registry item, its
  metadata has to say so, or the CLI will not install it.

## Running it

```bash
bun install
bun dev
```

No environment variables, no database. After changing anything under
`registry*/`, run codegen so the indexes pick it up:

```bash
bun run codegen
bun run typecheck
```

## Code of conduct

Be decent. Assume the person on the other side is doing their best with
incomplete information, which is usually true. Anything that would make someone
not want to open the next issue is out of bounds.

## License

By contributing you agree that your contribution is licensed under the MIT
license, the same terms as the rest of this repository.
