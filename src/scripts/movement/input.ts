import { Direction } from '../../types/basic';

const KEY_TO_DIRECTION: Record<string, Direction> = {
	ArrowLeft: Direction.Left,
	ArrowRight: Direction.Right,
	ArrowUp: Direction.Up,
	ArrowDown: Direction.Down,
	a: Direction.Left,
	d: Direction.Right,
	w: Direction.Up,
	s: Direction.Down,
};

export const directionFromKey = (key: string): Direction | undefined => KEY_TO_DIRECTION[key];
