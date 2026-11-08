import { flatMap, forEach, map } from 'lodash';
import convert from 'lodash/fp/convert';
import type { Position } from '../types/basic';

type IndexedMap = {
	<T, TResult>(iteratee: (value: T, index: number) => TResult): (collection: T[]) => TResult[];
	<T, TResult>(iteratee: (value: T, index: number) => TResult, collection: T[]): TResult[];
};

type IndexedFlatMap = {
	<T, TResult>(iteratee: (value: T, index: number) => TResult[]): (collection: T[]) => TResult[];
	<T, TResult>(iteratee: (value: T, index: number) => TResult[], collection: T[]): TResult[];
};

type IndexedForEach = {
	<T>(iteratee: (value: T, index: number) => void): (collection: T[]) => T[];
	<T>(iteratee: (value: T, index: number) => void, collection: T[]): T[];
};

export const mapWithIndex = convert('map', map, { cap: false }) as IndexedMap;
export const flatMapWithIndex = convert('flatMap', flatMap, { cap: false }) as IndexedFlatMap;
export const forEachWithIndex = convert('forEach', forEach, { cap: false }) as IndexedForEach;

export type FlatChar = { char: string; position: Position };

export const flattenRows = (rows: string[]): FlatChar[] =>
	flatMapWithIndex(
		(row: string, y: number) =>
			mapWithIndex((char: string, x: number): FlatChar => ({ char, position: { x, y } }), [...row]),
		rows,
	);
