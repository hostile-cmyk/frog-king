import type { Direction, Position } from "./basic";

export enum EntityKind {
	Frog = 'frog',
	Fly = 'fly',
}

interface BaseEntity {
  id: string;
  position: Position;
  kind: EntityKind;
}

export interface Frog extends BaseEntity {
  kind: EntityKind.Frog;
  facing: Direction;
}

export interface Fly extends BaseEntity {
  kind: EntityKind.Fly;
}

export type Entity = Frog | Fly;

