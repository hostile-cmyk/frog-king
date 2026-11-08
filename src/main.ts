import { NO_CANVAS_ERROR, NO_CONTEXT_ERROR, TWEEN_DURATION_MS } from './consts';
import { demoLevel } from './consts/levels';
import { directionFromDelta, directionFromKey } from './scripts/movement/input';
import { applyTongue } from './scripts/movement/tongue';
import { parseLevel } from './scripts/parser';
import { PIXEL_SIZE } from './scripts/rendering/consts';
import { drawKeys, renderGameState } from './scripts/rendering/render';
import { loadSprites, type Sprites } from './scripts/rendering/sprites';
import { interpolateGameState } from './scripts/rendering/tween';
import { resolveHoppers } from './scripts/triggers';
import { isOnExit } from './scripts/win';
import './style.css';
import type { Direction } from './types/basic';
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

const start = (sprites: Sprites): void => {
	let heldDirection: Direction | undefined;

	const renderIdle = (): void => {
		renderGameState(ctx, gameState, sprites);
		drawKeys(ctx, gameState, sprites, gameState.frog.position, heldDirection);
	};

	const animateTransition = (from: GameState, to: GameState, direction: Direction): void => {
		isAnimating = true;
		let startTime: number | undefined;

		const step = (now: number): void => {
			startTime ??= now;
			const tweenTime = Math.min((now - startTime) / TWEEN_DURATION_MS, 1);
			const frame = interpolateGameState(from, to, tweenTime);
			renderGameState(ctx, frame, sprites);
			drawKeys(ctx, to, sprites, frame.frog.position, direction);

			if (tweenTime < 1) {
				requestAnimationFrame(step);
				return;
			}

			gameState = to;
			isAnimating = false;
			renderIdle();

			if (isOnExit(gameState)) {
				alert('You win!');
			}
		};

		requestAnimationFrame(step);
	};

	const move = (direction: Direction): void =>
		animateTransition(gameState, resolveHoppers(applyTongue(gameState, direction)), direction);

	const directionFromClick = (event: MouseEvent): Direction | undefined => {
		const rect = canvas.getBoundingClientRect();
		const column = Math.floor(((event.clientX - rect.left) / rect.width) * gameState.grid[0].length);
		const row = Math.floor(((event.clientY - rect.top) / rect.height) * gameState.grid.length);

		return directionFromDelta({
			x: column - gameState.frog.position.x,
			y: row - gameState.frog.position.y,
		});
	};

	renderIdle();

	window.addEventListener('keydown', (event) => {
		const direction = directionFromKey(event.key);

		if (direction === undefined) {
			return;
		}

		heldDirection = direction;

		if (isAnimating || event.repeat) {
			return;
		}

		move(direction);
	});

	window.addEventListener('keyup', (event) => {
		if (directionFromKey(event.key) !== heldDirection) {
			return;
		}

		heldDirection = undefined;

		if (!isAnimating) {
			renderIdle();
		}
	});

	canvas.addEventListener('click', (event) => {
		if (isAnimating) {
			return;
		}

		const direction = directionFromClick(event);

		if (direction === undefined) {
			return;
		}

		move(direction);
	});
};

loadSprites().then(start);
