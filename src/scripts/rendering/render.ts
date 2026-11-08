import { forEach, range } from 'lodash/fp';
import type { Direction, Position } from '../../types/basic';
import type { Fly } from '../../types/entities';
import type { GameState } from '../../types/game';
import type { Cell, Grid } from '../../types/grid';
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
	TONGUE_SEGMENT_LENGTH,
	TONGUE_THICKNESS,
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

export const drawFrog = (
	ctx: CanvasRenderingContext2D,
	sprites: Sprites,
	position: Position,
	animation: 'idle' | 'tongue' = 'idle',
) => drawAnimation(ctx, sprites.frog.animations[animation], position, 1);

const drawFly = (ctx: CanvasRenderingContext2D, fly: Fly) => fillCell(ctx, fly.position, FLY_COLOR);

// base/tip are cell-space positions; the tongue is tiled from the frog centre to the tip.
export const drawTongue = (
	ctx: CanvasRenderingContext2D,
	sprites: Sprites,
	base: Position,
	tip: Position,
) => {
	const baseX = (base.x + 0.5) * PIXEL_SIZE;
	const baseY = (base.y + 0.5) * PIXEL_SIZE;
	const length = Math.hypot((tip.x - base.x) * PIXEL_SIZE, (tip.y - base.y) * PIXEL_SIZE);
	const angle = Math.atan2(tip.y - base.y, tip.x - base.x);
	const tipLength = Math.min(length, TONGUE_SEGMENT_LENGTH);
	const bodyLength = length - tipLength;
	const bodySlots = Math.ceil(bodyLength / TONGUE_SEGMENT_LENGTH);

	ctx.save();
	ctx.translate(baseX, baseY);
	ctx.rotate(angle);

	// Body tiles are clipped to the remaining body length so the root never overshoots the tip.
	forEach(
		(index: number) =>
			sprites.tongue.animations.body.render({
				x: index * TONGUE_SEGMENT_LENGTH,
				y: -TONGUE_THICKNESS / 2,
				width: Math.min(TONGUE_SEGMENT_LENGTH, bodyLength - index * TONGUE_SEGMENT_LENGTH),
				height: TONGUE_THICKNESS,
				context: ctx,
			}),
		range(0, bodySlots),
	);

	// Tip is anchored to the exact end so it stays glued to the target while the base shrinks.
	sprites.tongue.animations.tip.render({
		x: bodyLength,
		y: -TONGUE_THICKNESS / 2,
		width: tipLength,
		height: TONGUE_THICKNESS,
		context: ctx,
	});

	ctx.restore();
};

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

export const clearCanvas = (ctx: CanvasRenderingContext2D) =>
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

export const drawGrid = (ctx: CanvasRenderingContext2D, grid: Grid) =>
	forEachWithIndex(
		(row: Cell[], y: number) =>
			forEachWithIndex((cell: Cell, x: number) => drawCell(ctx, cell, { x, y }), row),
		grid,
	);

export const drawFlies = (ctx: CanvasRenderingContext2D, flies: Fly[]) =>
	forEach((fly: Fly) => drawFly(ctx, fly), flies);

export const renderGameState = (
	ctx: CanvasRenderingContext2D,
	state: GameState,
	sprites: Sprites,
) => {
	clearCanvas(ctx);
	drawGrid(ctx, state.grid);
	drawFlies(ctx, state.flies);
	drawFrog(ctx, sprites, state.frog.position);
};
