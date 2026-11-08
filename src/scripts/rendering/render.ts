import { forEach } from 'lodash/fp';
import type { Position } from '../../types/basic';
import type { Fly, Frog } from '../../types/entities';
import type { GameState } from '../../types/game';
import type { Cell } from '../../types/grid';
import { forEachWithIndex } from '../utils';
import { FLY_COLOR, FROG_COLOR, PIXEL_SIZE, TERRAIN_COLORS, TRIGGER_COLORS } from './consts';

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

const drawFrog = (ctx: CanvasRenderingContext2D, frog: Frog) =>
	fillCell(ctx, frog.position, FROG_COLOR);

const drawFly = (ctx: CanvasRenderingContext2D, fly: Fly) => fillCell(ctx, fly.position, FLY_COLOR);

export const renderGameState = (ctx: CanvasRenderingContext2D, state: GameState) => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	forEachWithIndex(
		(row: Cell[], y: number) =>
			forEachWithIndex((cell: Cell, x: number) => drawCell(ctx, cell, { x, y }), row),
		state.grid,
	);

	forEach((fly: Fly) => drawFly(ctx, fly), state.flies);

	drawFrog(ctx, state.frog);
};
