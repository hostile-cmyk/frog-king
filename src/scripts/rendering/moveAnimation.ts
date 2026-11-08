import find from 'lodash/fp/find';
import map from 'lodash/fp/map';
import type { Position } from '../../types/basic';
import type { Fly } from '../../types/entities';
import type { GameState } from '../../types/game';
import type { MovePlan } from '../movement/tongue';
import {
	EXTEND_MS_PER_CELL,
	MOVE_MS_PER_CELL,
	SHAKE_DURATION_MS,
	SHAKE_MAGNITUDE,
} from './consts';
import { clearCanvas, drawFlies, drawFrog, drawGrid, drawTongue } from './render';
import type { Sprites } from './sprites';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpPosition = (a: Position, b: Position, t: number): Position => ({
	x: lerp(a.x, b.x, t),
	y: lerp(a.y, b.y, t),
});

const cellDistance = (a: Position, b: Position) =>
	Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

interface Scene {
	flies: Fly[];
	frogPosition: Position;
	frogAnimation: 'idle' | 'tongue';
	tongue?: { base: Position; tip: Position };
}

interface Phase {
	duration: number;
	frame: (progress: number) => Scene;
	shakeOnEnd: boolean;
}

interface MoveAnimation {
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	sprites: Sprites;
	from: GameState;
	plan: MovePlan;
}

const buildPhases = (from: GameState, plan: MovePlan): Phase[] => {
	const frogStart = from.frog.position;
	const target = plan.target;

	if (target === undefined) {
		return [];
	}

	const extend: Phase = {
		duration: Math.max(1, cellDistance(frogStart, target)) * EXTEND_MS_PER_CELL,
		frame: (progress) => ({
			flies: from.flies,
			frogPosition: frogStart,
			frogAnimation: 'tongue',
			tongue: { base: frogStart, tip: lerpPosition(frogStart, target, progress) },
		}),
		shakeOnEnd: true,
	};

	const resolve: Phase =
		plan.kind === 'block' ?
			{
				duration: Math.max(1, cellDistance(frogStart, plan.to.frog.position)) * MOVE_MS_PER_CELL,
				frame: (progress) => {
					const frogPosition = lerpPosition(frogStart, plan.to.frog.position, progress);
					return {
						flies: from.flies,
						frogPosition,
						frogAnimation: 'tongue',
						tongue: { base: frogPosition, tip: target },
					};
				},
				shakeOnEnd: true,
			}
		:	buildReelPhase(from, plan, frogStart, target);

	return [extend, resolve];
};

const buildReelPhase = (
	from: GameState,
	plan: MovePlan,
	frogStart: Position,
	target: Position,
): Phase => {
	const flyDestination = find((fly: Fly) => fly.id === plan.flyId, plan.to.flies)?.position ?? target;

	return {
		duration: Math.max(1, cellDistance(target, flyDestination)) * MOVE_MS_PER_CELL,
		frame: (progress) => {
			const flyPosition = lerpPosition(target, flyDestination, progress);
			return {
				flies: map(
					(fly: Fly) => (fly.id === plan.flyId ? { ...fly, position: flyPosition } : fly),
					from.flies,
				),
				frogPosition: frogStart,
				frogAnimation: 'tongue',
				tongue: { base: frogStart, tip: flyPosition },
			};
		},
		shakeOnEnd: true,
	};
};

export const runMoveAnimation = ({
	ctx,
	canvas,
	sprites,
	from,
	plan,
}: MoveAnimation): Promise<void> => {
	const phases = buildPhases(from, plan);
	let shakeStart: number | undefined;

	const applyShake = (now: number): void => {
		const amplitude =
			shakeStart === undefined ?
				0
			:	SHAKE_MAGNITUDE * Math.max(0, 1 - (now - shakeStart) / SHAKE_DURATION_MS);
		canvas.style.transform =
			amplitude > 0 ?
				`translate(${(Math.random() * 2 - 1) * amplitude}px, ${(Math.random() * 2 - 1) * amplitude}px)`
			:	'';
	};

	const drawScene = (scene: Scene, now: number): void => {
		clearCanvas(ctx);
		drawGrid(ctx, from.grid);
		drawFlies(ctx, scene.flies);
		drawFrog(ctx, sprites, scene.frogPosition, scene.frogAnimation);
		scene.tongue && drawTongue(ctx, sprites, scene.tongue.base, scene.tongue.tip);
		applyShake(now);
	};

	// Trailing settle lets the final screenshake decay while the frog is back to idle.
	const settle: Phase = {
		duration: SHAKE_DURATION_MS,
		frame: () => ({
			flies: plan.to.flies,
			frogPosition: plan.to.frog.position,
			frogAnimation: 'idle',
		}),
		shakeOnEnd: false,
	};

	const allPhases = phases.length === 0 ? [] : [...phases, settle];

	return new Promise<void>((resolve) => {
		const runPhase = (index: number): void => {
			const phase = allPhases[index];

			if (phase === undefined) {
				canvas.style.transform = '';
				resolve();
				return;
			}

			let startTime: number | undefined;

			const step = (now: number): void => {
				startTime ??= now;
				const progress = phase.duration <= 0 ? 1 : Math.min((now - startTime) / phase.duration, 1);
				drawScene(phase.frame(progress), now);

				if (progress < 1) {
					requestAnimationFrame(step);
					return;
				}

				phase.shakeOnEnd && (shakeStart = now);
				runPhase(index + 1);
			};

			requestAnimationFrame(step);
		};

		runPhase(0);
	});
};
