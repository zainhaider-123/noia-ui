# noia-ui

TypeScript UI component library published as a single-file browser bundle for CDN hosting.

## Commands

- `pnpm build` — bundle JS, types, and CSS into `dist/`
- `pnpm dev` — rebuild JS and CSS on change

No test, lint, or format commands are configured yet.

## Build & Output

- **Entry**: `src/index.ts`
- **JS**: esbuild IIFE → `dist/index.js` (global `NoiaUI`, minified)
- **Types**: `dts-bundle-generator` → `dist/index.d.ts`
- **CSS**: sass → `dist/style.css` (compressed)
- Consumers on a CDN:

```html
<link rel="stylesheet" href="https://cdn.example.com/noia-ui/style.css" />
<script src="https://cdn.example.com/noia-ui/index.js"></script>
<script>
  new NoiaUI.Carousel("carousel", { slides: 3, speed: 300 });
</script>
```

## TypeScript Constraints

- **`verbatimModuleSyntax`** — use `import type` for type-only imports
- **`erasableSyntaxOnly`** — no enums, no parameter properties, no namespace merging
- **`strict: true`** — full strict mode
- **`module` / `moduleResolution`: `nodenext`** — relative imports must use `.js` extensions
- **Path alias**: `@` → `src` (source-only; the bundle inlines relative imports)
- `tsconfig.json` has `noEmit: true` — `tsc` is type-check only; esbuild handles compilation

## Architecture

- Each component lives in `src/<component>/` and is re-exported from `src/index.ts`
- Styles go in `src/styles/` as `.scss` files (Sass is a dev dependency)
- Styles are not imported from TypeScript; compile them with the build script

## Known Issues

- None currently
