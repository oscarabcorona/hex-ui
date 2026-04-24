# @hex-core/tokens

[![npm](https://img.shields.io/npm/v/@hex-core/tokens.svg)](https://www.npmjs.com/package/@hex-core/tokens)
[![downloads](https://img.shields.io/npm/dm/@hex-core/tokens.svg)](https://www.npmjs.com/package/@hex-core/tokens)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/oscarabcorona/hex-core/blob/main/LICENSE)

Design token engine for Hex UI — HSL color tokens + typography scale + shadow/radius tokens shared between components and themes.

## Install

```bash
pnpm add @hex-core/tokens
```

Or, more commonly, copy the CSS block from the [Theming guide](https://hex-core.dev/docs/theming) directly into your app's `globals.css`.

## Contents

- Light + dark HSL palette (zinc neutral base, WCAG-safe pairs)
- Typography scale (`--text-2xs` → `--text-5xl`)
- Radii (`--radius-sm/md/lg`)
- Shadows (`--shadow-glow`)
- Container widths

## Overriding

Every token is a CSS custom property. Override on `:root` or inside `.dark` for per-theme overrides. See the [Theming guide](https://hex-core.dev/docs/theming) for examples (accent hue swap, custom palette, typography scale).

## Docs

[hex-core.dev/docs/theming](https://hex-core.dev/docs/theming)

## License

MIT
