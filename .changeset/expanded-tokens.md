---
"@hex-core/tokens": minor
"@hex-core/components": minor
---

Expand token surface beyond color + radius.

`@hex-core/tokens` now ships spacing scale (`--space-1` through `--space-16`), gap
presets (`--gap-sm/md/lg`), control heights (`--control-height-sm/md/lg`),
typography scale (`--text-xs` through `--text-3xl`), and motion duration tokens
(`--duration-fast/normal/slow`). Shared across the 3 theme presets via
`themes/shared.ts`.

`themeToTailwindConfig` now emits `spacing`, `fontSize`, `transitionDuration`,
and `height` maps in addition to `colors` and `borderRadius`, so consumers can
wire the whole token set into Tailwind's `theme.extend`.

`@hex-core/components` — Button and Card are migrated to read these tokens via
CSS-variable references (with defaults that match prior Tailwind values, so
consumers without a theme loaded see no visual change). This is the first step
of a piecewise migration across all 47 components so overriding
`--space-*` / `--control-height-*` in `globals.css` reflows the entire library.
