# Accessibility (WCAG 2.2 AA)

## Baseline

This boilerplate targets **WCAG 2.2 Level AA** (not formal certification).

## How to test

```bash
pnpm test:a11y          # Playwright + axe on auth pages
pnpm storybook          # Per-story axe via addon-a11y
make check              # Includes test-a11y + storybook-build
```

## Key implementations

- Skip link: `src/components/layout/skip-link.tsx`
- Focus tokens: `--ring` with `ring-[3px]`
- Reduced motion: `src/styles/a11y.css`
- eslint-plugin-jsx-a11y in CI

## Known exceptions

None for v1 baseline components.
