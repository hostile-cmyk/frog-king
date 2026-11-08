import { cond, every, isEqual, isNil, some, stubFalse, stubTrue } from 'lodash/fp';
import type { Position } from '../types/basic';
import type { Fly } from '../types/entities';
import { TerrainType, TriggerType, type Cell, type Grid } from '../types/grid';
import { mapWithIndex } from './utils';

export const isInBounds = (grid: Grid, position: Position) =>
	position.y >= 0
	&& position.y < grid.length
	&& position.x >= 0
	&& position.x < grid[position.y].length;

export const getCell = (grid: Grid, position: Position) => grid[position.y][position.x];

export const isTriggerActiveAt = (grid: Grid, flies: Fly[], position: Position) => {
	const trigger = getCell(grid, position).trigger;

	return (
		!isNil(trigger)
		&& (trigger.type === TriggerType.Button ?
			some((fly: Fly) => isEqual(fly.position, position), flies)
		:	trigger.activated)
	);
};

export const isPassable = (grid: Grid, flies: Fly[], cell: Cell) =>
	cond([
		[(cell: Cell) => cell.terrain === TerrainType.Floor, stubTrue],
		[(cell: Cell) => cell.terrain === TerrainType.Exit, stubTrue],
		[(cell: Cell) => cell.terrain === TerrainType.Block, stubFalse],
		[
			stubTrue,
			(cell: Cell) =>
				every(
					(position: Position) => isTriggerActiveAt(grid, flies, position),
					cell.linkedTriggers ?? [],
				),
		],
	])(cell);

export const updateCell = (grid: Grid, position: Position, updater: (cell: Cell) => Cell): Grid =>
	mapWithIndex(
		(row: Cell[], y: number) =>
			y === position.y ?
				mapWithIndex((cell: Cell, x: number) => (x === position.x ? updater(cell) : cell), row)
			:	row,
		grid,
	);
