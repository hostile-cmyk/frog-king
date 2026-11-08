import { NO_CANVAS_ERROR, NO_CONTEXT_ERROR, TWEEN_DURATION_MS } from './consts';
import { demoLevel } from './consts/levels';
import { directionFromKey } from './scripts/movement/input';
import { applyTongue } from './scripts/movement/tongue';
import { parseLevel } from './scripts/parser';
import { PIXEL_SIZE } from './scripts/rendering/consts';
import { renderGameState } from './scripts/rendering/render';
import { interpolateGameState } from './scripts/rendering/tween';
import { resolveHoppers } from './scripts/triggers';
import { isOnExit } from './scripts/win';
import './style.css';
import type { GameState } from './types/game';

const canvas = document.querySelector<HTMLCanvasElement>('#game');
if (!canvas) {
	throw new Error(NO_CANVAS_ERROR);
}

const ctx = canvas.getContext('2d');
if (!ctx) {
	throw new Error(NO_CONTEXT_ERROR);
}

let gameState = parseLevel(demoLevel);
let isAnimating = false;

canvas.width = gameState.grid[0].length * PIXEL_SIZE;
canvas.height = gameState.grid.length * PIXEL_SIZE;
ctx.imageSmoothingEnabled = false;

renderGameState(ctx, gameState);

const animateTransition = (from: GameState, to: GameState): void => {
	isAnimating = true;
	let start: number | undefined;

	const step = (now: number): void => {
		start ??= now;
		const tweenTime = Math.min((now - start) / TWEEN_DURATION_MS, 1);
		renderGameState(ctx, interpolateGameState(from, to, tweenTime));

		if (tweenTime < 1) {
			requestAnimationFrame(step);
			return;
		}

		gameState = to;
		isAnimating = false;

		if (isOnExit(gameState)) {
			alert('You win!');
		}
	};

	requestAnimationFrame(step);
};

window.addEventListener('keydown', (event) => {
	if (isAnimating) {
		return;
	}

	const direction = directionFromKey(event.key);

	if (direction === undefined) {
		return;
	}

	animateTransition(gameState, resolveHoppers(applyTongue(gameState, direction)));
});
