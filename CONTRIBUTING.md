# Contributing to Hex UI

Thanks for wanting to help. Hex UI is an AI-native component library — every component ships with a machine-readable schema. A good contribution keeps that contract clean.

## Prerequisites

- Node.js 20.9 or newer
- pnpm 9.15.0 (`corepack enable` or install manually)

## Development

```bash
pnpm install
pnpm --filter docs dev       # Docs app at http://localhost:3000
pnpm build                    # Build every package
pnpm run build:registry       # Regenerate registry/*.json from schemas
pnpm --filter docs test       # Playwright e2e (8 tests across 3 specs)
```

## Conventions (non-negotiable)

- **SOLID + DRY** — single source of truth. If you write the same list twice, extract it.
- **Types** — no `as Type` casts, no `as unknown as`, no `any`, no index signatures just to satisfy a generic. Use `unknown` + runtime narrowing or typed wrappers at library boundaries.
- **Headless** — logic lives in hooks; components stay pure and prop-driven. Keep `"use client"` at leaves.
- **Dogfood** — if the docs app needs a primitive we already ship in `@hex-core/components`, import it from the library.
- **Canonical transitions** — `transition-all duration-200 ease-out` for interactive surfaces. Focus ring: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

## Adding a component

1. Create `packages/components/src/{primitive|component}/<slug>/` with:
   - `<slug>.tsx` — React component (Radix + Tailwind + CVA where applicable)
   - `<slug>.schema.ts` — `ComponentSchemaDefinition` with required `ai` block (`whenToUse`, `whenNotToUse`, `commonMistakes`, `relatedComponents`, `accessibilityNotes`, `tokenBudget`)
2. Add a demo at `apps/docs/src/app/demos/<slug>-demo.tsx` and register it in `apps/docs/src/lib/demos.tsx`.
3. Run `pnpm run build:registry` — the registry JSON regenerates from your schema.
4. Run `pnpm build && pnpm --filter docs dev` and check `/docs/components/<slug>`.
5. Add a changeset: `pnpm changeset`. Pick the affected packages (usually `@hex-core/components`) and bump type.

## Submitting a PR

- Branch name: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`.
- One logical change per commit. Imperative mood, ≤ 65 chars subject, explain why not what.
- `pnpm run lint`, `pnpm build`, `pnpm --filter docs test` must pass.
- PR description follows the template.

## Code of conduct

Be respectful. No personal attacks, no harassment. Maintainers reserve the right to close PRs or ban users who don't comply.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
