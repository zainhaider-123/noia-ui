# noia-ui

TypeScript UI component library built with Vite library mode. Distributed as a single CDN IIFE file.

## Commands

- `pnpm dev` — Vite on port 3000, opens `/playground/`
- `pnpm build` — `tsc && vite build` (typecheck must pass before build)
- `pnpm preview` — preview production build

The playground also works with a static server from the repo root (for example `npx serve` on port 3000) at `/playground/`, after `pnpm build`.

No test, lint, or format commands are configured yet.

## Build & Output

- **Entry**: `src/index.ts` (library exports only — no playground side effects)
- **Format**: IIFE (`dist/noia-ui.js`)
- **Global name**: `NoiaUI` (for example `new NoiaUI.Carousel(...)`)
- **CSS**: compiled from Sass and inlined into `noia-ui.js` at build time (no separate CSS file)
- **Types**: not emitted; `tsc` is type-check only (`noEmit: true`)
- Root `index.html` is not used and must not be added back — lib build ignores it

## TypeScript Constraints

- TypeScript is only for `src/`. Playground and Vite config are JavaScript.
- `tsconfig.json` `include` is `src` only
- **`verbatimModuleSyntax`** — use `import type` for type-only imports
- **`erasableSyntaxOnly`** — no enums, no parameter properties, no namespace merging
- **`strict: true`** — full strict mode
- **Path alias**: `@` → `src` (tsconfig and Vite; for `src` imports only)

## Architecture

- Each component lives in `src/<component>/` and is re-exported from `src/index.ts`
- Styles go in `src/styles/` as `.scss` files (Sass is a dev dependency)
- Playground is `playground/` (HTML + JS). It loads `../dist/noia-ui.js`, not `src/`
- Planned CDN workflow (not in repo yet): `docs/cdn-build-workflow.md`

## Known Issues

- None currently
