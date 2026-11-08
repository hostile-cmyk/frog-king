# Project Guidelines

## Code Style

- Functional style throughout: pure functions that take state and return new state, no mutation of existing objects/arrays.
- Use `lodash/fp` instead of native `Array.prototype` methods (`map`, `filter`, `reduce`, `find`, etc.) and instead of default `lodash`. Import per-function: `import map from 'lodash/fp/map';` or `import { map, filter } from 'lodash/fp';`.
- Avoid `for`/`while` loops and `let`-based accumulation in game logic — prefer `lodash/fp` pipelines (`flow`, `map`, `filter`, `reduce`) or `Array` methods used immutably (never `.push`/`.splice`/direct index assignment on existing arrays).
- Prefer `const` everywhere; treat `GameState`, `Grid`, and entities as immutable — producing a new state object rather than editing fields in place.
- Avoid `if` statements, prefer ternaries and or `lodash/fp` `cond`, `flow`, `pipe` or anything that
  allows us to avoid `if`s.

## Architecture

- `src/types/` — data shape only (`basic.ts`, `entities.ts`, `grid.ts`, `game.ts`). No logic.
- `src/consts/` — static level data.
- Game logic (level parsing, tongue raycast, trigger resolution) should be pure functions operating on `GameState`, not classes.

## Build and Test

- `npm run dev` — Vite dev server
- `npm run build` — production build
