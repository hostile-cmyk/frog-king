import type { Position } from './basic';
import type { Fly, Frog } from './entities';
import type { Grid } from './grid';

export interface GameState {
	grid: Grid;
	frog: Frog;
	flies: Fly[];
}

export interface LevelLink {
	gate: Position;
	triggers: Position[];
}

export interface LevelDefinition {
	rows: string[];
	links: LevelLink[];
}
