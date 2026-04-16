# Hex UI — Project Rules

## Project Overview

Hex UI is an AI-native component library competing with shadcn/ui. MCP-first distribution, Radix UI + Tailwind CSS, refined modern aesthetic.

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Language**: TypeScript (strict)
- **Packages**: `@hex-ui/registry`, `@hex-ui/tokens`, `@hex-ui/components`, `@hex-ui/mcp`, `@hex-ui/cli`
- **Styling**: Tailwind CSS + CVA (class-variance-authority)
- **Primitives**: Radix UI
- **Build**: tsup
- **Lint/Format**: ESLint + Prettier
- **MCP SDK**: @modelcontextprotocol/sdk

## Commands

```bash
pnpm build                    # Build all packages (Turborepo)
pnpm run build:registry       # Compile components → registry JSON
pnpm run lint                 # ESLint check
pnpm run lint:fix             # ESLint auto-fix
pnpm run format               # Prettier format
```

## Code Conventions

### Component Authoring

Every component lives in `packages/components/src/{category}/{name}/` with two files:
- `{name}.tsx` — React component using Radix UI + Tailwind + CVA
- `{name}.schema.ts` — Machine-readable spec (props, variants, slots, AI hints)

Schema files export a `ComponentSchemaDefinition` object. The `ai` field is mandatory — every component MUST have `whenToUse`, `whenNotToUse`, `commonMistakes`, `relatedComponents`, `accessibilityNotes`, and `tokenBudget`.

### Documentation & Typing Rules

- Every exported function, component, type, and interface MUST have a JSDoc comment
- Use `@param` and `@returns` tags for function documentation
- Use `@example` for non-obvious usage patterns
- No `any` types — use specific types, generics, or `unknown` with type guards
- Component props must be explicitly typed interfaces (not inline)
- Schema files must document every prop with a clear `description` field

### Import Conventions

- Use `.js` extension in all imports (ESM)
- Use `cn()` from `../../lib/utils.js` for class merging
- Prefer `cva` for variant definitions

### Styling Rules

- Refined modern aesthetic: subtle shadows, smooth transitions, micro-animations
- All interactive elements need `transition-all duration-200 ease-out`
- Focus rings: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- Hover states should include shadow enhancement
- Active states: `active:scale-[0.98]`
- Use HSL CSS variables: `hsl(var(--primary))`

### Registry

- After changing any component, run `pnpm run build:registry` to regenerate JSON
- Registry items at `registry/items/{name}.json`
- Registry index at `registry/registry.json`

## Git Workflow

- Branch naming: `feat/<scope>`, `fix/<scope>`, `refactor/<scope>`, `chore/<scope>`
- Commit messages: imperative mood, <=65 chars subject, explain why not what
- One logical change per commit
- No `--no-verify`, no force push to main

## Quality Gates (enforced by hooks)

Before any commit or PR:
1. `pnpm run lint` must pass
2. `pnpm build` must succeed (type checking via tsup/tsc)
3. `pnpm run build:registry` must produce valid JSON
4. No secrets in staged files (.env, credentials, tokens)
5. No `console.log` in production code (components, MCP server)
