import { Direction, type Position } from '../types/basic';

export const NO_FROG_ERROR = 'Level is missing a frog start position ("F")';

export const DIRECTION_DELTAS: Record<Direction, Position> = {
	[Direction.Left]: { x: -1, y: 0 },
	[Direction.Right]: { x: 1, y: 0 },
	[Direction.Up]: { x: 0, y: -1 },
	[Direction.Down]: { x: 0, y: 1 },
};
