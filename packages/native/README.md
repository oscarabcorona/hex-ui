# @hex-core/native

[![npm](https://img.shields.io/npm/v/@hex-core/native.svg)](https://www.npmjs.com/package/@hex-core/native)
[![downloads](https://img.shields.io/npm/dm/@hex-core/native.svg)](https://www.npmjs.com/package/@hex-core/native)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/oscarabcorona/hex-core/blob/main/LICENSE)

React Native components for Hex Core — the web catalog's schemas, tokens and AI guidance, rendered with NativeWind and `@rn-primitives`.

- **26 components** — primitives, overlays, form controls, a native-only BottomSheet, and the AI Kit.
- **One catalog, two renderers** — every item carries the same machine-readable `ai` block as its web counterpart, so an agent gets the same guidance on either platform.
- **Copy-in, not locked-in** — `hex add` writes the source into your project. This package is what the registry is built from.
- **Real native Markdown** — shares the micromark parser the web component uses and replaces only the render step. Partial markup parses as literal text, so a streaming reply re-renders safely on every token.

## Install

Most people never install this package directly. Point the CLI at a native project instead:

```bash
npx @hex-core/cli init --platform native
npx @hex-core/cli add button
```

`init` writes the NativeWind config chain and the token stylesheet. On a native project `add button` installs `native-button` — the platform comes from the project, not the slug. Installing a component built for the other renderer is refused rather than silently copied.

To consume the components as a library instead:

```bash
pnpm add @hex-core/native
pnpm add nativewind react-native-safe-area-context
```

## Quick start

Mount `PortalHost` once at the root. Dialog, AlertDialog, Popover, Tooltip and Select render through it, and without it they never appear.

```tsx
import { PortalHost } from "@rn-primitives/portal";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout({ children }) {
  return (
    <SafeAreaProvider>
      {children}
      <PortalHost />
    </SafeAreaProvider>
  );
}
```

```tsx
import { Button, Card, CardHeader, CardTitle, Text } from "@hex-core/native";

<Card>
  <CardHeader>
    <CardTitle>Storage</CardTitle>
  </CardHeader>
  <Button onPress={upgrade}>
    <Text>Upgrade</Text>
  </Button>
</Card>;
```

Labels are `Text` children rather than a `title` prop. Import `Text` from this package, not from `react-native`: the Hex one reads the colour its parent publishes, so a label on a coloured button is legible without any prop of its own.

## What's in it

| Group | Components |
| --- | --- |
| Primitives | Text, Button, Card, Badge, Avatar, Separator, Label, Input, Checkbox, Switch, Progress, Skeleton |
| Overlays and form controls | Tabs, RadioGroup, Textarea, Dialog, AlertDialog, Popover, Tooltip, Select |
| Native-only | BottomSheet |
| AI Kit | Message, MessageList, Composer, ToolCall, Markdown |

## Differences from the web catalog

These are the ones that change how you write the code, not just how it looks.

- **No `asChild` on most components** — the DOM slot pattern does not carry over uniformly. Where it exists it comes from `@rn-primitives/slot`.
- **`onPress`, not `onClick`.**
- **Labels associate in reverse** — React Native has no `htmlFor`. Put `nativeID` on the `Label` and point the control's `aria-labelledby` at it. That carries the accessible name only: pass `onPress` to the `Label` to make the caption a second touch target.
- **Tooltip toggles on tap and consumes that tap** — a phone has no pointer, so a working `Button` inside a `TooltipTrigger` stops running its own handler. Treat a tooltip as a secondary affordance, never the only place a label lives.
- **Select values are `{ value, label }` objects** — there is no `option` element for the trigger to read a label back from, so the label travels with the value.
- **No focus ring** — React Native draws none, so no ring classes are needed.
- **Tokens resolve to literal HSL triplets** — there is no cascade for a `var()` chain to resolve through. `@hex-core/tokens` exports `generateGlobalsCssNative()` and `themeToNativeTheme()` for this.

## Requirements

| | |
| --- | --- |
| React | ^19.0.0 |
| React Native | >=0.78.0 |
| NativeWind | ^4.0.0 |

## Links

- [React Native catalog](https://hex-core.dev/native) — every component, its props, and its AI guidance
- [Installation](https://hex-core.dev/docs/installation)
- [CLI](https://hex-core.dev/docs/cli)

## License

MIT
