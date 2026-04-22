# @hex-ui/registry

Zod schemas + TypeScript types for the Hex UI component registry.

This package is the **shared contract** between `@hex-ui/components`, `@hex-ui/cli`, and `@hex-ui/mcp`. It doesn't ship runtime UI — it's schemas describing what a component is (props, variants, examples, AI hints).

## Install

```bash
pnpm add @hex-ui/registry
```

## Usage

```ts
import { RegistryItemSchema, type RegistryItem } from "@hex-ui/registry/schema";

const result = RegistryItemSchema.safeParse(json);
if (result.success) {
  const item: RegistryItem = result.data;
  // …
}
```

## Notes

Most users of Hex UI never touch this package directly. If you're building a custom tool that reads the registry JSON (`registry/registry.json` in the repo, or `/registry.json` on the docs site), this is your source of truth for the schema.

## Docs

[hex-ui.dev](https://hex-ui.dev)

## License

MIT
