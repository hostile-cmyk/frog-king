import type { LevelDefinition } from '../types/game';

export const demoLevel: LevelDefinition = {
	rows: ['###########', '#..FO..B#.#', '#.......#.#', '#.......GE#', '###########'],
	links: [{ gate: { x: 8, y: 3 }, triggers: [{ x: 4, y: 1 }] }],
};
