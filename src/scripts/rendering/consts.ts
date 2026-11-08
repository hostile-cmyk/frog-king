import { Direction } from "../../types/basic";
import { TerrainType, TriggerType } from "../../types/grid";

export const CELL_SIZE = 16;
export const SCALE = 3;
export const PIXEL_SIZE = CELL_SIZE * SCALE;
export const SPRITE_SIZE = CELL_SIZE;

export const DIRECTIONS: Direction[] = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];

export const KEY_ANIMATION: Record<Direction, string> = {
  [Direction.Up]: "up",
  [Direction.Down]: "down",
  [Direction.Left]: "left",
  [Direction.Right]: "right",
};

export const INACTIVE_KEY_OPACITY = 0.5;

export const SHAKE_MAGNITUDE = 10;
export const SHAKE_DURATION_MS = 40;

export const EXTEND_MS_PER_CELL = 24;
export const MOVE_MS_PER_CELL = 48;

export const TONGUE_SEGMENT_LENGTH = PIXEL_SIZE / 4;
export const TONGUE_THICKNESS = PIXEL_SIZE / 6;

export const TERRAIN_COLORS: Record<TerrainType, string> = {
  [TerrainType.Floor]: "#3b4252",
  [TerrainType.Block]: "#4c566a",
  [TerrainType.TriggerableBlock]: "#5e81ac",
  [TerrainType.Exit]: "#a3be8c",
};

export const TRIGGER_COLORS: Record<TriggerType, string> = {
  [TriggerType.Button]: "#ebcb8b",
  [TriggerType.Hopper]: "#bf616a",
};

export const FLY_COLOR = "#2e2e2e";
