---
"@hex-core/native": minor
"@hex-core/registry": minor
"@hex-core/tokens": minor
"@hex-core/cli": minor
"@hex-core/mcp": minor
"@hex-core/payload": minor
---

React Native target (Theme K): a new `@hex-core/native` package, plus the substrate that lets one catalog serve two renderers.

**`@hex-core/native`** — 26 components for Expo and React Native, built on NativeWind and `@rn-primitives`. Twelve primitives (Text, Button, Card, Badge, Avatar, Separator, Label, Input, Checkbox, Switch, Progress, Skeleton), eight overlays and form controls (Tabs, RadioGroup, Textarea, Dialog, AlertDialog, Popover, Tooltip, Select), a native-only BottomSheet, and five AI Kit components (Message, MessageList, Composer, ToolCall, Markdown). Every one carries the same machine-readable `ai` block as its web counterpart, so an agent gets the same guidance on either platform.

The Markdown component is a real native renderer, not a wrapper: it shares the micromark parser the web component uses and replaces only the render step, walking an mdast tree into `Text` and `View`. Partial markup — an unterminated `**`, a half-typed fence, a dangling `[link](` — parses as literal text, so a streaming reply can be re-rendered on every token.

**`@hex-core/registry`** — new `platform` field (`"web" | "native"`) on the component, item and index schemas, and `deriveNativeSchema()`, which builds a native schema from a web one plus an explicit diff. `accessibilityNotes`, `commonMistakes`, `examples` and `dependencies` are mandatory overrides rather than inherited, because that is where DOM assumptions hide. The field is optional on the authoring type and omitted from emitted JSON when it is `"web"`, so the existing catalog is byte-identical.

**`@hex-core/tokens`** — `generateGlobalsCssNative()` and `themeToNativeTheme()`. Both resolve palette references to literal HSL triplets: React Native has no cascade for a `var()` chain to resolve through.

**`@hex-core/cli`** — `hex init` and `hex add` learn `--platform`, and detect Expo, Expo Router and bare React Native projects on their own. On a native project `hex add button` installs `native-button`, and installing a component built for the other renderer is refused rather than silently copied. `hex init --platform native` writes the NativeWind config chain and the token stylesheet.

**`@hex-core/mcp`** — `search_components` takes an optional `platform` filter and reports each item's platform. The enumeration ceiling rises from 200 to 500, because the catalog passed 200 items and a ceiling below the item count turns full enumeration into a silently partial one.

**`@hex-core/payload`** — re-exports `resolveInternalDepForPlatform`, and `buildAppContext` now uses it. Internal dependencies name a source path (`primitives/text/text`) that is identical in a native item and a web one, so resolving it without the declaring item's platform sent a reader of a native Card to the React DOM `Text`. `AppContextInput` gains an optional `itemExists` predicate for the catalog to resolve against; it defaults to accepting every name, which leaves web payloads byte-identical. `KNOWN_NPM_VERSIONS` also gains pins for the native dependency set so `hex poc` stays off `latest` on that path too.
