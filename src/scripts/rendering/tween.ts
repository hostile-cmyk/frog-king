import { find, map } from 'lodash/fp';
import type { Fly } from '../../types/entities';
import type { GameState } from '../../types/game';
import type { Position } from '../../types/basic';

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

const lerpPosition = (from: Position, to: Position, t: number): Position => ({
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
});

export const interpolateGameState = (from: GameState, to: GameState, t: number): GameState => ({
    ...to,
    frog: { ...to.frog, position: lerpPosition(from.frog.position, to.frog.position, t) },
    flies: map((fly: Fly) => {
        const previous = find((f: Fly) => f.id === fly.id, from.flies);
        return previous ? { ...fly, position: lerpPosition(previous.position, fly.position, t) } : fly;
    }, to.flies),
});