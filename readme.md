# Frog King

A grid-based puzzle game. You control a frog that moves not by walking, but by shooting its tongue in one of four directions.

## Core mechanic: the tongue

Press a direction and the tongue shoots that way across the grid until it hits something:

- **Hits a block** → the tongue sticks to it, and the frog is pulled to the cell adjacent to the block (the frog never passes through blocks).
- **Hits a fly** → the fly is pulled toward the frog, landing in the cell closest to the frog in the direction the tongue was fired.

## Triggers

Two kinds of pressure-sensitive floor tiles:

- **Button** — active only while a fly is sitting on it. Moves the fly off, and it deactivates.
- **Hopper** — eats the fly on contact (the fly is removed from the board) and stays active for the rest of the round. Unlike a button, the frog can move freely over an active hopper.

Triggers can be wired to **gates** (`TriggerableBlock` cells): normally-solid blocks that become passable once their linked trigger(s) are active. A gate can require multiple triggers at once (AND logic).

## Tech stack

- TypeScript, no framework — game state is plain data (`GameState`: grid + frog + flies), rendered imperatively to a single `<canvas>` via `requestAnimationFrame`.
- React was considered and intentionally skipped: the game loop is better served by direct canvas drawing than DOM diffing.

## Status

Early development — core types (`src/types/`) and level representation are in place; rendering, input, and the tongue/trigger logic are in progress.
