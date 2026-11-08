import type { GameState } from '../types/game';
import { TerrainType } from '../types/grid';
import { getCell } from './grid';

export const isOnExit = (state: GameState): boolean =>
	getCell(state.grid, state.frog.position).terrain === TerrainType.Exit;
