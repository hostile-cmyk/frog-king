import { find, isEqual, map } from 'lodash/fp';
import { type Direction, type Position } from '../../types/basic';
import type { Fly } from '../../types/entities';
import type { GameState } from '../../types/game';
import { DIRECTION_DELTAS } from '../consts';
import { getCell, isInBounds, isPassable } from '../grid';

const addPositions = (a: Position, b: Position) => ({ x: a.x + b.x, y: a.y + b.y });
const subtractPositions = (a: Position, b: Position) => ({ x: a.x - b.x, y: a.y - b.y });

type TongueHit =
	| { kind: 'none' }
	| { kind: 'block'; position: Position }
	| { kind: 'fly'; fly: Fly };

const findFlyHit = (flies: Fly[], position: Position): TongueHit | undefined => {
	const fly = find((fly: Fly) => isEqual(fly.position, position), flies);

	return fly && { kind: 'fly', fly };
};

const raycastTongue = (state: GameState, position: Position, delta: Position): TongueHit =>
	!isInBounds(state.grid, position) ?
		{ kind: 'none' }
	:	(findFlyHit(state.flies, position)
		?? (isPassable(state.grid, state.flies, getCell(state.grid, position)) ?
			raycastTongue(state, addPositions(position, delta), delta)
		:	{ kind: 'block', position }));

const resolveBlockHit = (
	state: GameState,
	direction: Direction,
	delta: Position,
	position: Position,
): GameState => ({
	...state,
	frog: { ...state.frog, facing: direction, position: subtractPositions(position, delta) },
});

const resolveFlyHit = (
	state: GameState,
	direction: Direction,
	delta: Position,
	fly: Fly,
): GameState => ({
	...state,
	frog: { ...state.frog, facing: direction },
	flies: map(
		(f: Fly) =>
			f.id === fly.id ? { ...f, position: addPositions(state.frog.position, delta) } : f,
		state.flies,
	),
});

export const applyTongue = (state: GameState, direction: Direction): GameState => {
	const delta = DIRECTION_DELTAS[direction];
	const hit = raycastTongue(state, addPositions(state.frog.position, delta), delta);

	return (
		hit.kind === 'block' ? resolveBlockHit(state, direction, delta, hit.position)
		: hit.kind === 'fly' ? resolveFlyHit(state, direction, delta, hit.fly)
		: { ...state, frog: { ...state.frog, facing: direction } }
	);
};
