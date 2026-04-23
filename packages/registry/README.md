# @hex-core/registry

Zod schemas + TypeScript types for the Hex UI component registry.

This package is the **shared contract** between `@hex-core/components`, `@hex-core/cli`, and `@hex-core/mcp`. It doesn't ship runtime UI — it's schemas describing what a component is (props, variants, examples, AI hints).

## Install

```bash
pnpm add @hex-core/registry
```

## Usage

```ts
import { RegistryItemSchema, type RegistryItem } from "@hex-core/registry/schema";

const result = RegistryItemSchema.safeParse(json);
if (result.success) {
  const item: RegistryItem = result.data;
  // …
}
```

## Notes

Most users of Hex UI never touch this package directly. If you're building a custom tool that reads the registry JSON (`registry/registry.json` in the repo, or `/registry.json` on the docs site), this is your source of truth for the schema.

## Docs

[hex-core.dev](https://hex-core.dev)

## License

MIT
