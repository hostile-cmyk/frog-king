import { TerrainType, TriggerType } from '../../types/grid';

export const CELL_SIZE = 16;
export const SCALE = 3;
export const PIXEL_SIZE = CELL_SIZE * SCALE;

export const TERRAIN_COLORS: Record<TerrainType, string> = {
	[TerrainType.Floor]: '#3b4252',
	[TerrainType.Block]: '#4c566a',
	[TerrainType.TriggerableBlock]: '#5e81ac',
	[TerrainType.Exit]: '#a3be8c',
};

export const TRIGGER_COLORS: Record<TriggerType, string> = {
	[TriggerType.Button]: '#ebcb8b',
	[TriggerType.Hopper]: '#bf616a',
};

export const FROG_COLOR = '#a3be8c';
export const FLY_COLOR = '#2e2e2e';
