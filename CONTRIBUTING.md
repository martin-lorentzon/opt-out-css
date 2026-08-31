# Contributing to Opt-Out CSS

Opt-Out CSS exists for people who don't want to learn CSS. They write plain HTML — headings, paragraphs, lists, buttons, images, forms — and it renders beautifully with zero setup: no classes to memorize, no utility framework to learn, no build step. That promise is the product. Every contribution is judged against it.

This document explains the system's architecture, the rules for changing it, and what to check before opening a PR.

## The promise, precisely

"Zero classes" applies to **content and semantics**: an author who drops a bare `<h2>`, `<p>`, `<a>`, `<button>`, `<table>`, or `<form>` into the page gets good typography, spacing, contrast, and dark-mode support for free. That part is non-negotiable.

It does not extend to **page composition**. There is no HTML attribute that means "this is a 900px content column with a full-bleed image breakout," so patterns like `.content-grid`, `.flow`, `.breakout`, and `.full-width` legitimately need a class — there's no bare-element alternative CSS could offer. Don't read the zero-classes promise as "no class ever appears in the example markup." Read it as "no one should ever be _forced_ to write a class just to get a heading to look like a heading."

## Token architecture (mandatory)

Every design decision lives in a custom property, layered in three tiers. New tokens must slot into one of these — don't skip a layer, and don't hardcode a value that belongs in one.

1. **Primitives** — raw, context-free values. `--gray-500`, `--font-size-lg`, `--space-m`. No component or semantic meaning; just the palette/scale itself.
2. **Semantic** — what a primitive _means_ in the theme. `--text-primary: light-dark(var(--gray-900), var(--gray-50))`, `--section-bg-color`. This is the only layer allowed to reference `light-dark()` for color, and the only place theme decisions get made.
3. **Component** — a single consumer's tunable default, named after the component and typically pointing at a semantic or primitive token. `--card-padding-inline: var(--space-m)`, `--hamburger-menu-gap: var(--space-s)`.

Naming follows `--{scope}-{property}[-{modifier}]`, all kebab-case (`--navbar-padding-inline`, `--hamburger-line-thickness`). Keep primitives in the Primitives block, semantics in the Semantic block, and component tokens in Component Defaults — mirror the existing structure in [style.css](style.css) rather than inventing a new location.

## When a class is allowed

Add a class only when at least one is true:

1. **It helps the semantics or readability of the HTML document itself** — e.g. `section.alternate` says something about the section that no bare element can.
2. **It provides necessary flexibility** that bare elements structurally cannot — layout composition (`.content-grid`, `.flow`, `.breakout`), or a component with more than one valid presentation (`.subtle-link` vs. a default `a`).
3. **It significantly improves performance, accessibility, or responsiveness** in a way the bare-element default can't.

If none of those apply, style the element selector instead. When in doubt, ask: "would someone who has never opened a CSS file still get a good result without adding this class?" If the answer is no and none of the three conditions above justify it, the class shouldn't exist.

## Browser / CSS baseline: "Newly available"

This project already leans on `oklch()`, `light-dark()`, `:has()`, `container-type: scroll-state`, and `clamp()`-based fluid scales. Target [Baseline "Newly available"](https://web.dev/baseline) — features that are Baseline-tracked even if only ~1 year in, not just the safe multi-year-old set. That means:

- New CSS features are fine once Baseline lists them as newly available, without waiting for "widely available."
- Anything not Baseline-tracked at all (behind a flag, single-browser, or Baseline "limited availability") needs a fallback or shouldn't ship yet.
- Note any relevant support caveat in the PR description rather than gating on it silently.

## Code conventions

- Group related rules under the existing `MARK:` section comments (Design Tokens, Typography, Reset, Component Defaults, etc.) instead of appending to the bottom of the file.
- When you borrow a technique from someone else's writeup, keep the attribution comment style already in use (`/* Credit: Name https://... */`).
- Respect the system-level defaults already in place: `prefers-reduced-motion`, `:focus-visible` outlines, `color-scheme`, `scrollbar-gutter`. Don't reintroduce motion, focus removal, or scroll-shift regressions a new rule would otherwise cause.
- Prefer `light-dark()` for any new color token instead of a `[data-theme]` override, unless the value needs logic more complex than two states.

## Verifying a change before opening a PR

There's no build/lint step that catches "does this still look good with zero classes," so verification is manual:

- **Light and dark**: toggle both (`prefers-color-scheme` and the explicit `data-theme` override) and confirm contrast and hierarchy hold up in each.
- **Across viewports**: check mobile, tablet, and desktop widths — the type and space scales are `clamp()`-based and fluid, so a fix that looks right at one width can break at another.
- **Against plain HTML, not just the demo page**: render your change against bare, un-classed fixtures of the elements it touches (headings, paragraphs, lists, a form, a table, buttons, images) — not only [index.html](index.html)'s styled example markup. The demo page already has classes on everything; it won't catch a regression in the bare-element defaults.

## PR checklist

- [ ] Bare, un-classed HTML for the affected elements still renders correctly (checked against plain fixtures, not just index.html)
- [ ] Checked in both light and dark mode
- [ ] Checked at mobile, tablet, and desktop widths
- [ ] Any new class is justified by one of the three conditions above (semantics, necessary flexibility, or perf/a11y/responsiveness) — note which one in the PR description
- [ ] Any new token is placed in the correct layer (primitive / semantic / component) and named `--{scope}-{property}[-{modifier}]`
- [ ] Any new CSS feature is at least Baseline "newly available"; support caveats are called out in the PR
- [ ] `prefers-reduced-motion`, focus-visible outlines, and `color-scheme` handling are unaffected or intentionally updated
