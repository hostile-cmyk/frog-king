import type { Position } from './basic';

export enum TerrainType {
	Floor = 'floor',
	Block = 'block',
	TriggerableBlock = 'triggerable-block',
	Exit = 'exit',
}

export enum TriggerType {
	Button = 'button',
	Hopper = 'hopper',
}

interface BaseTrigger {
	id: string;
	type: TriggerType;
}

export interface ButtonTrigger extends BaseTrigger {
	type: TriggerType.Button;
}
export interface HopperTrigger extends BaseTrigger {
	type: TriggerType.Hopper;
	activated: boolean;
}

export type Trigger = ButtonTrigger | HopperTrigger;

export interface Cell {
	terrain: TerrainType;
	trigger?: Trigger;
	linkedTriggers?: Position[];
}

export type Grid = Cell[][];
