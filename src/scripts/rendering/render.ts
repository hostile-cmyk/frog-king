import { forEach } from 'lodash/fp';
import type { Direction, Position } from '../../types/basic';
import type { Fly, Frog } from '../../types/entities';
import type { GameState } from '../../types/game';
import type { Cell } from '../../types/grid';
import { DIRECTION_DELTAS } from '../consts';
import { getCell, isInBounds, isPassable } from '../grid';
import { forEachWithIndex } from '../utils';
import {
	DIRECTIONS,
	FLY_COLOR,
	INACTIVE_KEY_OPACITY,
	KEY_ANIMATION,
	PIXEL_SIZE,
	TERRAIN_COLORS,
	TRIGGER_COLORS,
} from './consts';
import type { Sprites } from './sprites';

type SpriteAnimation = Sprites['frog']['animations'][string];

const fillCell = (ctx: CanvasRenderingContext2D, position: Position, color: string) => {
	ctx.fillStyle = color;
	ctx.fillRect(position.x * PIXEL_SIZE, position.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
};

const drawCell = (ctx: CanvasRenderingContext2D, cell: Cell, position: Position) => {
	fillCell(
		ctx,
		position,
		cell.trigger ? TRIGGER_COLORS[cell.trigger.type] : TERRAIN_COLORS[cell.terrain],
	);
};

const drawAnimation = (
	ctx: CanvasRenderingContext2D,
	animation: SpriteAnimation,
	position: Position,
	alpha: number,
) => {
	ctx.globalAlpha = alpha;
	animation.render({
		x: position.x * PIXEL_SIZE,
		y: position.y * PIXEL_SIZE,
		width: PIXEL_SIZE,
		height: PIXEL_SIZE,
		context: ctx,
	});
	ctx.globalAlpha = 1;
};

const drawFrog = (ctx: CanvasRenderingContext2D, sprites: Sprites, frog: Frog) =>
	drawAnimation(ctx, sprites.frog.animations.idle, frog.position, 1);

const drawFly = (ctx: CanvasRenderingContext2D, fly: Fly) => fillCell(ctx, fly.position, FLY_COLOR);

const drawKey = (
	ctx: CanvasRenderingContext2D,
	state: GameState,
	sprites: Sprites,
	anchor: Position,
	direction: Direction,
	pressedDirection?: Direction,
) => {
	const delta = DIRECTION_DELTAS[direction];
	const position = { x: anchor.x + delta.x, y: anchor.y + delta.y };
	const tile = { x: Math.round(position.x), y: Math.round(position.y) };
	const inBounds = isInBounds(state.grid, tile);
	const passable = inBounds && isPassable(state.grid, state.flies, getCell(state.grid, tile));
	const animation =
		direction === pressedDirection ?
			`${KEY_ANIMATION[direction]}Pressed`
		:	KEY_ANIMATION[direction];

	return (
		inBounds &&
		drawAnimation(
			ctx,
			sprites.keys.animations[animation],
			position,
			passable ? 1 : INACTIVE_KEY_OPACITY,
		)
	);
};

export const drawKeys = (
	ctx: CanvasRenderingContext2D,
	state: GameState,
	sprites: Sprites,
	anchor: Position,
	pressedDirection?: Direction,
) =>
	forEach(
		(direction: Direction) => drawKey(ctx, state, sprites, anchor, direction, pressedDirection),
		DIRECTIONS,
	);

export const renderGameState = (
	ctx: CanvasRenderingContext2D,
	state: GameState,
	sprites: Sprites,
) => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	forEachWithIndex(
		(row: Cell[], y: number) =>
			forEachWithIndex((cell: Cell, x: number) => drawCell(ctx, cell, { x, y }), row),
		state.grid,
	);

	forEach((fly: Fly) => drawFly(ctx, fly), state.flies);

	drawFrog(ctx, sprites, state.frog);
};
