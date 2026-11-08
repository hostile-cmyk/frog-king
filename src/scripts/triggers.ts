import { filter, reduce, reject } from 'lodash/fp';
import type { Fly } from '../types/entities';
import type { GameState } from '../types/game';
import { TriggerType, type Cell } from '../types/grid';
import { getCell, updateCell } from './grid';

const activateHopper = (cell: Cell): Cell =>
	cell.trigger?.type === TriggerType.Hopper ?
		{ ...cell, trigger: { ...cell.trigger, activated: true } }
	:	cell;

const isOnHopper = (state: GameState, fly: Fly): boolean =>
	getCell(state.grid, fly.position).trigger?.type === TriggerType.Hopper;

export const resolveHoppers = (state: GameState): GameState => {
	const eatenFlies = filter((fly: Fly) => isOnHopper(state, fly), state.flies);

	return {
		...state,
		grid: reduce(
			(grid, fly: Fly) => updateCell(grid, fly.position, activateHopper),
			state.grid,
			eatenFlies,
		),
		flies: reject((fly: Fly) => isOnHopper(state, fly), state.flies),
	};
};
