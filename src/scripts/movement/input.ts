import invert from 'lodash/fp/invert';
import mapValues from 'lodash/fp/mapValues';
import { Direction, type Position } from '../../types/basic';
import { DIRECTION_DELTAS } from '../consts';

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

const deltaKey = (delta: Position): string => `${delta.x},${delta.y}`;

const DIRECTION_BY_DELTA = invert(mapValues(deltaKey, DIRECTION_DELTAS)) as Record<string, Direction>;

export const directionFromKey = (key: string): Direction | undefined => KEY_TO_DIRECTION[key];

export const directionFromDelta = (delta: Position): Direction | undefined =>
	DIRECTION_BY_DELTA[deltaKey(delta)];
