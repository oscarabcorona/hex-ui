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

## Architecture Rules

### DRY — Don't Repeat Yourself
- **One template, many pages**: dynamic routes like `app/docs/[slug]/page.tsx` + `generateStaticParams()` instead of N identical page files
- **Data drives UI**: read metadata from `registry/items/*.json` or `.schema.ts` — never hardcode prop tables, examples, or install commands in JSX
- **Single source of truth**: component metadata lives in `.schema.ts`. Docs, MCP, CLI all consume it. If you write the same list twice, extract it
- **No copy-paste of component code**: the docs app imports from `@hex-ui/components` via a barrel. Never duplicate the Button source in `apps/docs/`

### SOLID
- **SRP** — one component = one concern. No god components with 30+ props
- **OCP** — compose with slots/children, not prop branching. `<Card><CardHeader /></Card>` beats `<Card headerText="..." />`
- **LSP** — same interface = swappable. TS contracts enforce this
- **ISP** — minimal prop surface. Use `Partial<T>`, never a kitchen-sink props type
- **DIP** — inject behavior via props/context, don't hardcode API calls in components

### React 19 Patterns
- **`ref` is a normal prop** — no `forwardRef` for new components (legacy OK during migration)
- **Server Components by default** — only add `"use client"` for hooks, event handlers, or browser APIs
- **Push `"use client"` as deep as possible** — a client `<Demo />` can be imported by a server page. The page should NOT be client just because it renders a client child
- **`useActionState` + `useFormStatus`** for forms instead of manual `useState` + loading flags
- **`use()` hook** for reading promises/context in client components
- **Suspense boundaries** around async Server Components

### Next.js 16 Patterns
- **Turbopack is default** — no webpack config
- **`params` and `searchParams` are async** — `const { slug } = await params`
- **`"use cache"` directive** for explicit caching; default is dynamic
- **`generateStaticParams` + `generateMetadata`** for dynamic routes that ship as static HTML
- **Node 20.9+ required**
- **Follow `apps/docs/AGENTS.md`** — Next.js 16 has breaking changes from training data

### Anti-patterns (blockers on review)
- Multiple page files that follow an identical template — use `[slug]/page.tsx` + data
- Hardcoded prop tables duplicating `.schema.ts` — read the schema instead
- `"use client"` at the page level when only a child needs it
- `forwardRef` in new React 19 code
- God components, prop drilling when context fits, tight coupling to external APIs

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
