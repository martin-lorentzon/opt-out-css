# Opt-Out CSS

Zero-class CSS: plain HTML (`<h2>`, `<p>`, `<button>`, `<table>`, `<form>`, etc.) renders beautifully with no classes, no build step, no utility framework. That promise is the product — see [CONTRIBUTING.md](CONTRIBUTING.md) for full detail and always follow it when implementing features. Key rules to apply without being asked:

## Token architecture (mandatory)

Every design decision lives in a custom property, in exactly one of three tiers — don't skip a layer or hardcode a value that belongs in one:

1. **Primitives** — raw, context-free values (`--gray-500`, `--space-m`).
2. **Semantic** — what a primitive means in the theme (`--text-primary`). Only layer allowed to use `light-dark()` for color.
3. **Component** — one consumer's tunable default (`--card-padding-inline`).

Name as `--{scope}-{property}[-{modifier}]`, kebab-case. Keep each tier in its matching block in [style.css](style.css), mirroring existing structure — don't append new rules to the bottom of the file; group under the existing `MARK:` section comments.

## When a class is allowed

Only when at least one is true: (1) it helps the HTML's own semantics/readability, (2) it provides flexibility bare elements structurally can't (layout composition, multiple valid presentations), (3) it meaningfully improves perf/a11y/responsiveness. Otherwise style the element selector. Justify any new class in the PR description against one of these three.

## Other conventions

- Target Baseline "newly available" CSS (not just "widely available"); note support caveats rather than gating silently.
- Prefer `light-dark()` for new color tokens over `[data-theme]` overrides, unless logic needs more than two states.
- Preserve `prefers-reduced-motion`, `:focus-visible` outlines, `color-scheme`, `scrollbar-gutter` behavior.
- Keep the attribution comment style (`/* Credit: Name https://... */`) when borrowing a technique.

## Verifying before calling a change done

No build/lint step catches visual regressions, so actually render the page and look — don't just read the CSS and assert it's fine. Load pages through the `static` server (`preview_start` with name `static`, defined in `.claude/launch.json`) rather than `file://` — a bare file open renders as a static snapshot and won't fetch `style.css`/`theme.js`. Use `resize_window` (mobile/tablet/desktop presets or a custom width) and `colorScheme` (light/dark) to cover the matrix below, then screenshot or `read_page`.

- **Light and dark** — both, for every width checked.
- **Mobile / tablet / desktop** — the type and space scales are `clamp()`-based and fluid, so a fix correct at one width can break at another.
- **Bare, un-classed HTML for the elements touched** — check [fixtures.html](fixtures.html), not just index.html (which is fully classed and won't catch a bare-element regression). If a change touches an element fixtures.html doesn't cover, add it there rather than building a one-off throwaway page.

If a change can't actually be checked in the browser this way, say so explicitly rather than reporting the task done.
