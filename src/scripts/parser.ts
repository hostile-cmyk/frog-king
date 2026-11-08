import { cond, constant, equals, filter, find, keyBy, mapValues, pipe, stubTrue } from 'lodash/fp';
import { Direction, type Position } from '../types/basic';
import { EntityKind, type Fly, type Frog } from '../types/entities';
import type { GameState, LevelDefinition, LevelLink } from '../types/game';
import { TerrainType, TriggerType, type Cell, type Grid } from '../types/grid';
import { NO_FROG_ERROR } from './consts';
import { flattenRows, mapWithIndex, type FlatChar } from './utils';

const posToKey = (position: Position) => `${position.x},${position.y}`;

export const charToCell = (
	char: string,
	position: Position,
	linkedTriggersByGate: Record<string, Position[]>,
) => {
	const key = posToKey(position);

	return cond([
		[equals('#'), constant<Cell>({ terrain: TerrainType.Block })],
		[equals('E'), constant<Cell>({ terrain: TerrainType.Exit })],
		[
			equals('G'),
			constant<Cell>({
				terrain: TerrainType.TriggerableBlock,
				linkedTriggers: linkedTriggersByGate[key],
			}),
		],
		[
			equals('O'),
			constant<Cell>({
				terrain: TerrainType.Floor,
				trigger: { id: `button-${key}`, type: TriggerType.Button },
			}),
		],
		[
			equals('H'),
			constant<Cell>({
				terrain: TerrainType.Floor,
				trigger: {
					id: `hopper-${key}`,
					type: TriggerType.Hopper,
					activated: false,
				},
			}),
		],
		[stubTrue, constant<Cell>({ terrain: TerrainType.Floor })],
	])(char);
};

export const parseLevel = (definition: LevelDefinition): GameState => {
	const linkedTriggersByGate = pipe(
		keyBy((link: LevelLink) => posToKey(link.gate)),
		mapValues((link: LevelLink) => link.triggers),
	)(definition.links);

	const grid: Grid = mapWithIndex(
		(row: string, y: number) =>
			mapWithIndex(
				(char: string, x: number) => charToCell(char, { x, y }, linkedTriggersByGate),
				[...row],
			),
		definition.rows,
	);

	const flatCells = flattenRows(definition.rows);

	const frogCell = find((char: FlatChar) => char.char === 'F', flatCells);

	if (!frogCell) {
		throw new Error(NO_FROG_ERROR);
	}

	const frog: Frog = {
		id: 'frog',
		kind: EntityKind.Frog,
		position: frogCell.position,
		facing: Direction.Down,
	};

	const flies: Fly[] = pipe(
		filter((char: FlatChar) => char.char === 'B'),
		mapWithIndex(
			(char: FlatChar, index: number): Fly => ({
				id: `fly-${index + 1}`,
				kind: EntityKind.Fly,
				position: char.position,
			}),
		),
	)(flatCells);

	return { grid, frog, flies };
};
